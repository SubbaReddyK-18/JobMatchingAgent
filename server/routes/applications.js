import express from 'express';
import crypto from 'crypto';
import { db } from '../db/database.js';
import { authenticateToken, requireRole, denyHODMutation } from '../middleware/auth.js';

const router = express.Router();

// Get applications for current student
router.get('/my-applications', authenticateToken, async (req, res) => {
    try {
        let studentId = req.query.student_id;
        if (!studentId && req.user.role_name === 'STUDENT') {
            const student = await db.get('SELECT id FROM people_students WHERE user_id = ?', [req.user.id]);
            if (student) studentId = student.id;
        }
        if (!studentId) studentId = 'std_subbu';

        const applications = await db.query(`
            SELECT a.*, j.title as job_title, j.location as job_location, j.role_type, j.ctc_display,
                   c.name as company_name, c.logo_url as company_logo,
                   i.id as interview_id, i.round_name, i.scheduled_time, i.mode as interview_mode, i.meeting_link,
                   o.id as offer_id, o.offered_ctc, o.student_decision
            FROM placement_drive_applications a
            JOIN placement_job_openings j ON a.job_opening_id = j.id
            JOIN placement_companies c ON j.company_id = c.id
            LEFT JOIN placement_interviews i ON a.id = i.application_id
            LEFT JOIN placement_offers o ON a.id = o.application_id
            WHERE a.student_id = ?
            ORDER BY a.applied_at DESC
        `, [studentId]);

        let underReviewCount = 0;
        let interviewCount = 0;
        let offerCount = 0;
        let notSelectedCount = 0;

        for (const app of applications) {
            if (app.status === 'UNDER_REVIEW' || app.status === 'APPLIED' || app.status === 'SHORTLISTED') underReviewCount++;
            else if (app.status === 'INTERVIEW_SCHEDULED') interviewCount++;
            else if (app.status === 'OFFER_RECEIVED' || app.status === 'SELECTED') offerCount++;
            else if (app.status === 'NOT_SELECTED' || app.status === 'REJECTED') notSelectedCount++;
        }

        res.json({
            total_applications: applications.length,
            counts: {
                total: applications.length,
                under_review: underReviewCount,
                interviews: interviewCount,
                offers: offerCount,
                not_selected: notSelectedCount
            },
            status_overview: [
                { label: 'Offer Received', count: offerCount, color: '#10B981' },
                { label: 'Under Review', count: underReviewCount, color: '#3B82F6' },
                { label: 'Interviews', count: interviewCount, color: '#8B5CF6' },
                { label: 'Not Selected', count: notSelectedCount, color: '#EF4444' }
            ],
            applications
        });
    } catch (err) {
        console.error('Error fetching applications:', err);
        res.status(500).json({ error: 'Server error fetching applications' });
    }
});

// Get all applications for T&P / HOD
router.get('/all', authenticateToken, async (req, res) => {
    try {
        const applications = await db.query(`
            SELECT a.*, s.full_name as student_name, s.usn as student_usn, s.branch as student_branch, s.cgpa as student_cgpa,
                   j.title as job_title, j.location as job_location, j.ctc_display,
                   c.name as company_name, c.tier as company_tier,
                   i.round_name, i.scheduled_time, i.mode as interview_mode, i.status as interview_status,
                   o.offered_ctc, o.student_decision
            FROM placement_drive_applications a
            JOIN people_students s ON a.student_id = s.id
            JOIN placement_job_openings j ON a.job_opening_id = j.id
            JOIN placement_companies c ON j.company_id = c.id
            LEFT JOIN placement_interviews i ON a.id = i.application_id
            LEFT JOIN placement_offers o ON a.id = o.application_id
            ORDER BY a.applied_at DESC
        `);

        res.json({ applications });
    } catch (err) {
        console.error('Error fetching all applications:', err);
        res.status(500).json({ error: 'Server error fetching all applications' });
    }
});

// Apply to a job opening (Student)
router.post('/apply', authenticateToken, async (req, res) => {
    try {
        const { job_opening_id, student_id } = req.body;
        let targetStudentId = student_id;

        if (!targetStudentId && req.user.role_name === 'STUDENT') {
            const student = await db.get('SELECT id FROM people_students WHERE user_id = ?', [req.user.id]);
            if (student) targetStudentId = student.id;
        }
        if (!targetStudentId) targetStudentId = 'std_subbu';

        // Check if already applied
        const existing = await db.get('SELECT id FROM placement_drive_applications WHERE student_id = ? AND job_opening_id = ?', [targetStudentId, job_opening_id]);
        if (existing) {
            return res.status(400).json({ error: 'You have already submitted an application for this opportunity.' });
        }

        const appId = 'app_' + crypto.randomBytes(6).toString('hex');
        const stageHistory = [
            { stage: 'APPLIED', title: 'Application Submitted', timestamp: new Date().toISOString(), status: 'COMPLETED', notes: 'Application recorded via JobMatch AI portal.' },
            { stage: 'SCREENING', title: 'Eligibility & Resume Screening', timestamp: new Date().toISOString(), status: 'IN_PROGRESS', notes: 'Profile queued for recruiter evaluation.' }
        ];

        const roundsConfig = [
            { id: 'APPLIED', label: 'Application Submitted' },
            { id: 'SCREENING', label: 'Eligibility Screening' },
            { id: 'SHORTLISTED', label: 'Profile Shortlist' },
            { id: 'CODING', label: 'Coding Assessment' },
            { id: 'TECHNICAL_1', label: 'Technical Round 1' },
            { id: 'TECHNICAL_2', label: 'Technical Round 2' },
            { id: 'HR', label: 'HR Interview' },
            { id: 'OFFER', label: 'Offer Received' }
        ];

        await db.run(`
            INSERT INTO placement_drive_applications (id, student_id, job_opening_id, status, current_stage, stage_progress, stage_history, rounds_config, applied_at, notes)
            VALUES (?, ?, ?, 'UNDER_REVIEW', 'APPLIED', 1, ?, ?, CURRENT_TIMESTAMP, 'Application submitted successfully.')
        `, [appId, targetStudentId, job_opening_id, JSON.stringify(stageHistory), JSON.stringify(roundsConfig)]);

        res.json({
            message: 'Application submitted successfully! Your profile has been sent to the recruiter.',
            application_id: appId
        });
    } catch (err) {
        console.error('Error submitting application:', err);
        res.status(500).json({ error: 'Server error submitting application' });
    }
});

// Update Placement Lifecycle Stage (T&P Authorized)
router.put('/:id/stage', authenticateToken, requireRole(['T_AND_P']), denyHODMutation, async (req, res) => {
    try {
        const { stage, status, progress, notes, interview, offer } = req.body;
        const appId = req.params.id;

        const app = await db.get(`
            SELECT a.*, s.user_id as student_user_id, s.full_name as student_name, j.title as job_title, c.name as company_name
            FROM placement_drive_applications a
            JOIN people_students s ON a.student_id = s.id
            JOIN placement_job_openings j ON a.job_opening_id = j.id
            JOIN placement_companies c ON j.company_id = c.id
            WHERE a.id = ?
        `, [appId]);

        if (!app) {
            return res.status(404).json({ error: 'Application record not found' });
        }

        let stageHistory = [];
        try {
            stageHistory = typeof app.stage_history === 'string' ? JSON.parse(app.stage_history) : (app.stage_history || []);
        } catch {
            stageHistory = [];
        }

        const newStageTitle = stage === 'SHORTLISTED' ? 'Shortlisting & Profile Review' :
                              stage === 'CODING' ? 'Online Coding Assessment' :
                              stage === 'TECHNICAL_1' ? 'Technical Interview 1' :
                              stage === 'TECHNICAL_2' ? 'Technical Interview 2' :
                              stage === 'HR' ? 'HR & Cultural Alignment Round' :
                              stage === 'SELECTED' ? 'Final Selection Approved' :
                              stage === 'OFFER' ? 'Official Offer Issued' :
                              stage === 'REJECTED' ? 'Application Closed / Not Selected' :
                              stage;

        stageHistory.push({
            stage,
            title: newStageTitle,
            timestamp: new Date().toISOString(),
            status: status === 'NOT_SELECTED' || status === 'REJECTED' ? 'REJECTED' : 'COMPLETED',
            notes: notes || `Candidate moved to ${newStageTitle} by T&P Cell.`
        });

        await db.run(`
            UPDATE placement_drive_applications 
            SET current_stage = ?, status = ?, stage_progress = ?, stage_history = ?, notes = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `, [stage, status || 'UNDER_REVIEW', progress || 2, JSON.stringify(stageHistory), notes || '', appId]);

        // If interview scheduled, insert or update placement_interviews
        if (interview && interview.round_name) {
            const intId = 'int_' + crypto.randomBytes(6).toString('hex');
            await db.run(`
                INSERT INTO placement_interviews (id, application_id, round_name, scheduled_time, mode, meeting_link, interviewer_name, status, feedback)
                VALUES (?, ?, ?, ?, ?, ?, ?, 'SCHEDULED', ?)
            `, [intId, appId, interview.round_name, interview.scheduled_time || 'TBD', interview.mode || 'Google Meet', interview.meeting_link || '', interview.interviewer_name || 'T&P Panel', notes || '']);
        }

        // If offer issued, insert or update placement_offers
        if (offer && offer.ctc) {
            const offId = 'off_' + crypto.randomBytes(6).toString('hex');
            await db.run(`
                INSERT INTO placement_offers (id, application_id, offered_ctc, role_title, joining_date, student_decision)
                VALUES (?, ?, ?, ?, ?, 'ACCEPTED')
            `, [offId, appId, parseFloat(offer.ctc), app.job_title, offer.joining_date || '2027-07-01']);
        }

        // Notify Student
        const notifId = 'notif_' + crypto.randomBytes(6).toString('hex');
        await db.run(`
            INSERT INTO system_notifications (id, user_id, role_target, title, message, type, is_read, link_view)
            VALUES (?, ?, 'STUDENT', ?, ?, 'DRIVE', 0, 'student-applications')
        `, [notifId, app.student_user_id, `Application Update: ${app.company_name}`, `Your application for ${app.job_title} has advanced to: ${newStageTitle}.`]);

        res.json({
            message: `Candidate application successfully advanced to ${newStageTitle}.`,
            application_id: appId,
            current_stage: stage,
            status: status
        });
    } catch (err) {
        console.error('Error updating application stage:', err);
        res.status(500).json({ error: 'Failed to update candidate application stage' });
    }
});

// Dynamic Application Status Timeline
router.get('/timeline/:appId', authenticateToken, async (req, res) => {
    try {
        const app = await db.get(`
            SELECT a.*, j.title as job_title, j.location as job_location, c.name as company_name, c.logo_url as company_logo,
                   i.round_name, i.scheduled_time, i.mode, i.meeting_link, i.interviewer_name
            FROM placement_drive_applications a
            JOIN placement_job_openings j ON a.job_opening_id = j.id
            JOIN placement_companies c ON j.company_id = c.id
            LEFT JOIN placement_interviews i ON a.id = i.application_id
            WHERE a.id = ?
        `, [req.params.appId]);

        if (!app) {
            return res.status(404).json({ error: 'Application not found' });
        }

        let stageHistory = [];
        try {
            stageHistory = typeof app.stage_history === 'string' ? JSON.parse(app.stage_history) : (app.stage_history || []);
        } catch {
            stageHistory = [];
        }

        res.json({
            application: app,
            stage_history: stageHistory
        });
    } catch (err) {
        console.error('Error fetching timeline:', err);
        res.status(500).json({ error: 'Error fetching application timeline' });
    }
});

// Detailed Interview Preparation & Schedule Info
router.get('/interview-details/:appId', authenticateToken, async (req, res) => {
    try {
        const app = await db.get(`
            SELECT a.*, j.title as job_title, j.location as job_location, c.name as company_name, c.logo_url as company_logo,
                   i.round_name, i.scheduled_time, i.mode, i.meeting_link, i.interviewer_name, i.feedback
            FROM placement_drive_applications a
            JOIN placement_job_openings j ON a.job_opening_id = j.id
            JOIN placement_companies c ON j.company_id = c.id
            LEFT JOIN placement_interviews i ON a.id = i.application_id
            WHERE a.id = ?
        `, [req.params.appId]);

        if (!app) {
            return res.status(404).json({ error: 'Application not found' });
        }

        res.json({
            interview: {
                application_id: app.id,
                company_name: app.company_name,
                company_logo: app.company_logo,
                role: app.job_title,
                round_name: app.round_name || 'Technical Round 1',
                scheduled_date: '18 Sep 2026',
                scheduled_time: app.scheduled_time || '10:00 AM – 11:30 AM (IST)',
                mode: app.mode || 'Google Meet (Virtual)',
                meeting_link: app.meeting_link || 'https://meet.google.com/rvc-job-match',
                interviewer: app.interviewer_name || 'Senior Technical Evaluation Panel',
                feedback: app.feedback || 'Review core system design, data structures, and multithreading.'
            },
            preparation_checklist: [
                { task: 'Revise Data Structures & Algorithms', completed: true },
                { task: 'Practice system design basics and scaling bottlenecks', completed: true },
                { task: "Go through company's engineering core principles", completed: true },
                { task: 'Solve mock interview questions with timer', completed: true },
                { task: 'Prepare for behavioral questions (STAR method)', completed: false },
                { task: 'Test technical setup (internet, camera, mic)', completed: false }
            ],
            practice_questions: [
                'Given an array, find the longest subarray with sum K.',
                'Design a data structure to support LRU cache in O(1) time complexity.',
                'Given a binary tree, find the lowest common ancestor of two nodes.',
                'Implement a function to detect and remove a cycle in a singly linked list.',
                'Solve two sum problem in a sorted rotated array.'
            ],
            interview_tips: [
                { title: 'Be Clear', text: 'Think aloud and explain your approach step-by-step before writing code.' },
                { title: 'Be Structured', text: 'Break down complex problems into modular helper functions.' },
                { title: 'Be Honest', text: "It's okay to ask clarifying questions about constraints and edge cases." },
                { title: 'Be Confident', text: 'Demonstrate genuine enthusiasm for scalable software engineering.' }
            ]
        });
    } catch (err) {
        res.status(500).json({ error: 'Error fetching interview details' });
    }
});

export default router;
