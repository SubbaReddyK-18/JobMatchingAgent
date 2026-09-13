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

        // Status counts
        let underReviewCount = 0;
        let interviewCount = 0;
        let offerCount = 0;
        let notSelectedCount = 0;

        for (const app of applications) {
            if (app.status === 'UNDER_REVIEW' || app.status === 'APPLIED') underReviewCount++;
            else if (app.status === 'INTERVIEW_SCHEDULED') interviewCount++;
            else if (app.status === 'OFFER_RECEIVED') offerCount++;
            else if (app.status === 'NOT_SELECTED') notSelectedCount++;
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

// Apply to a job opening
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
        await db.run(`
            INSERT INTO placement_drive_applications (id, student_id, job_opening_id, status, stage_progress, applied_at)
            VALUES (?, ?, ?, 'UNDER_REVIEW', 1, CURRENT_TIMESTAMP)
        `, [appId, targetStudentId, job_opening_id]);

        res.json({
            message: 'Application submitted successfully! Your profile has been sent to the recruiter.',
            application_id: appId
        });
    } catch (err) {
        console.error('Error submitting application:', err);
        res.status(500).json({ error: 'Server error submitting application' });
    }
});

// Detailed Interview Preparation & Schedule Info
router.get('/interview-details/:appId', authenticateToken, async (req, res) => {
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

        res.json({
            interview: {
                application_id: app.id,
                company_name: app.company_name,
                company_logo: app.company_logo,
                role: app.job_title,
                round_name: app.round_name || 'Technical Round 1',
                scheduled_date: '10 Sep 2026',
                scheduled_time: app.scheduled_time || '2:00 PM – 3:00 PM (IST)',
                mode: app.mode || 'Google Meet (Virtual)',
                meeting_link: app.meeting_link || 'https://meet.google.com/rvc-job-match',
                interviewer: app.interviewer_name || 'To be announced'
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

// Update Application Status (T&P Only, HOD blocked)
router.post('/update-status', authenticateToken, requireRole(['T_AND_P']), denyHODMutation, async (req, res) => {
    try {
        const { application_id, status, stage_progress } = req.body;
        await db.run(
            `UPDATE placement_drive_applications SET status = ?, stage_progress = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
            [status, stage_progress || 2, application_id]
        );
        res.json({ message: 'Application status updated successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update application status' });
    }
});

export default router;
