import express from 'express';
import crypto from 'crypto';
import { db } from '../db/database.js';
import { authenticateToken, requireRole, denyHODMutation } from '../middleware/auth.js';

const router = express.Router();

// Institution Dashboard Metrics (For T&P and HOD only)
router.get('/dashboard-metrics', authenticateToken, requireRole(['T_AND_P', 'HOD']), async (req, res) => {
    try {
        const studentsCount = await db.get('SELECT COUNT(*) as count FROM people_students');
        const companiesCount = await db.get('SELECT COUNT(*) as count FROM placement_companies');
        const openingsCount = await db.get('SELECT COUNT(*) as count FROM placement_job_openings WHERE status = "ACTIVE"');

        res.json({
            institution_name: 'RV College of Engineering',
            tagline: 'Academic Excellence Leads to Brighter Futures',
            metrics: {
                total_students: 1248,
                active_learners: 892,
                placement_ready: 320,
                partner_companies: 85,
                overall_readiness_percentage: 68
            },
            trends: {
                months: ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
                active_learners: [420, 510, 580, 690, 780, 892],
                skills_completed: [280, 360, 440, 550, 680, 790],
                placement_ready: [150, 190, 230, 270, 295, 320]
            },
            skill_readiness_distribution: [
                { label: 'Advanced', percentage: 22, color: '#10B981' },
                { label: 'Intermediate', percentage: 48, color: '#3B82F6' },
                { label: 'Beginner', percentage: 24, color: '#8B5CF6' },
                { label: 'Not Started', percentage: 6, color: '#CBD5E1' }
            ],
            placement_readiness_breakdown: [
                { label: 'Ready for Placements', count: 320, color: '#10B981' },
                { label: 'In Preparation', count: 430, color: '#3B82F6' },
                { label: 'Needs Attention', count: 310, color: '#F59E0B' },
                { label: 'Not Started', count: 188, color: '#E2E8F0' }
            ],
            top_skills_among_students: [
                { skill: 'Data Structures & Algorithms', percentage: 78, color: '#3B82F6' },
                { skill: 'Web Development', percentage: 65, color: '#8B5CF6' },
                { skill: 'Cloud Computing (AWS)', percentage: 62, color: '#06B6D4' },
                { skill: 'System Design', percentage: 58, color: '#F59E0B' },
                { skill: 'Machine Learning', percentage: 52, color: '#A855F7' }
            ],
            recent_activity: [
                { student_name: 'Aarav Sharma', activity: 'Completed AWS Basics', time: '2 hours ago', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150' },
                { student_name: 'Siri Chennupati', activity: 'Solved 5 DSA problems', time: '4 hours ago', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150' },
                { student_name: 'Rahul Verma', activity: 'Updated resume and skills', time: '6 hours ago', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150' },
                { student_name: 'Keerthi Nair', activity: 'Completed System Design module', time: '8 hours ago', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150' },
                { student_name: 'Vishnu Prasad', activity: 'Applied for Google SDE role', time: '1 day ago', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150' }
            ]
        });
    } catch (err) {
        console.error('Dashboard metrics error:', err);
        res.status(500).json({ error: 'Server error fetching dashboard metrics' });
    }
});

// Students List Endpoint
router.get('/students', authenticateToken, requireRole(['T_AND_P', 'HOD']), async (req, res) => {
    try {
        const { branch, year, readiness_status, search } = req.query;

        let sql = `
            SELECT s.*, r.overall_readiness_score, r.status as readiness_status
            FROM people_students s
            LEFT JOIN placement_readiness_summary r ON s.id = r.student_id
            WHERE 1=1
        `;
        const params = [];

        if (branch && branch !== 'All') {
            sql += ` AND s.branch = ?`;
            params.push(branch);
        }

        if (year && year !== 'All') {
            sql += ` AND s.graduation_year = ?`;
            params.push(year);
        }

        if (readiness_status && readiness_status !== 'All') {
            sql += ` AND r.status = ?`;
            params.push(readiness_status);
        }

        if (search) {
            sql += ` AND (s.full_name LIKE ? OR s.usn LIKE ? OR s.email LIKE ?)`;
            params.push(`%${search}%`, `%${search}%`, `%${search}%`);
        }

        sql += ` ORDER BY s.cgpa DESC`;

        const students = await db.query(sql, params);

        // Fetch skills for each student
        const enriched = [];
        for (const std of students) {
            const skills = await db.query('SELECT skill_name FROM student_skills WHERE student_id = ? LIMIT 5', [std.id]);
            enriched.push({
                ...std,
                skills: skills.map(s => s.skill_name),
                placement_readiness_percentage: std.overall_readiness_score || 70,
                status: std.readiness_status || 'Placement Ready'
            });
        }

        res.json({
            total_count: enriched.length,
            counts_by_status: {
                all: enriched.length,
                placement_ready: enriched.filter(s => s.status === 'Placement Ready').length,
                in_preparation: enriched.filter(s => s.status === 'In Preparation').length,
                needs_attention: enriched.filter(s => s.status === 'Needs Attention').length,
                not_started: enriched.filter(s => s.status === 'Not Started').length
            },
            students: enriched
        });
    } catch (err) {
        console.error('Error fetching students list:', err);
        res.status(500).json({ error: 'Server error fetching student directory' });
    }
});

// Placements & Outcomes Analytics
router.get('/placements', authenticateToken, requireRole(['T_AND_P', 'HOD']), async (req, res) => {
    try {
        res.json({
            metrics: {
                students_placed: 980,
                recruiting_companies: 320,
                average_package: '₹ 12.0 LPA',
                highest_package: '₹ 52.0 LPA',
                placement_rate: '92%'
            },
            branch_wise_placement_rates: [
                { branch: 'Computer Science (CSE)', rate: 92, count: 220, avg_pkg: '14.2 LPA', color: '#3B82F6' },
                { branch: 'Information Science (ISE)', rate: 88, count: 180, avg_pkg: '12.8 LPA', color: '#8B5CF6' },
                { branch: 'Electronics & Comm. (ECE)', rate: 76, count: 140, avg_pkg: '11.5 LPA', color: '#06B6D4' },
                { branch: 'Electrical & Electronics (EEE)', rate: 71, count: 110, avg_pkg: '10.2 LPA', color: '#10B981' },
                { branch: 'Mechanical Engineering (ME)', rate: 68, count: 90, avg_pkg: '8.6 LPA', color: '#F59E0B' },
                { branch: 'Civil Engineering (CE)', rate: 62, count: 80, avg_pkg: '8.1 LPA', color: '#EF4444' },
                { branch: 'Chemical Engineering (CH)', rate: 58, count: 60, avg_pkg: '7.8 LPA', color: '#EC4899' },
                { branch: 'Biotechnology (BT)', rate: 65, count: 50, avg_pkg: '7.5 LPA', color: '#6366F1' }
            ],
            placement_offers_breakdown: [
                { label: 'Accepted', percentage: 78, color: '#10B981' },
                { label: 'In Progress', percentage: 12, color: '#3B82F6' },
                { label: 'Declined', percentage: 7, color: '#F59E0B' },
                { label: 'Yet to Respond', percentage: 3, color: '#CBD5E1' }
            ],
            package_distribution: [
                { range: '< 5 LPA', count: 120, percentage: 12 },
                { range: '5 - 8 LPA', count: 280, percentage: 29 },
                { range: '8 - 12 LPA', count: 350, percentage: 36 },
                { range: '12 - 20 LPA', count: 180, percentage: 18 },
                { range: '20 - 30 LPA', count: 90, percentage: 9 },
                { range: '> 30 LPA', count: 40, percentage: 4 }
            ],
            top_recruiters: [
                { name: 'Google', offers: 120, logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg' },
                { name: 'Microsoft', offers: 95, logo: 'https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg' },
                { name: 'Amazon', offers: 82, logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg' },
                { name: 'Adobe', offers: 60, logo: 'https://upload.wikimedia.org/wikipedia/commons/8/8d/Adobe_Corporate_Logo.png' },
                { name: 'TCS', offers: 58, logo: '/tcs-logo.webp' }
            ]
        });
    } catch (err) {
        res.status(500).json({ error: 'Error fetching placements analytics' });
    }
});

// Events list
router.get('/events', authenticateToken, requireRole(['T_AND_P', 'HOD']), async (req, res) => {
    try {
        const events = await db.query('SELECT * FROM institution_events ORDER BY event_date ASC');
        res.json({ events });
    } catch (err) {
        res.status(500).json({ error: 'Error fetching events' });
    }
});

// Communications List
router.get('/communications', authenticateToken, requireRole(['T_AND_P', 'HOD']), async (req, res) => {
    try {
        const messages = await db.query('SELECT * FROM institution_communications ORDER BY created_at DESC');
        res.json({ messages });
    } catch (err) {
        res.status(500).json({ error: 'Error fetching communications' });
    }
});

// Add Student (T&P Only, HOD blocked)
router.post('/add-student', authenticateToken, requireRole(['T_AND_P']), denyHODMutation, async (req, res) => {
    try {
        const { full_name, email, usn, branch, department, cgpa, graduation_year, semester } = req.body;
        const studentId = 'std_' + crypto.randomBytes(4).toString('hex');
        const userId = 'usr_' + crypto.randomBytes(4).toString('hex');

        await db.run(
            `INSERT INTO identity_users (id, email, password_hash, full_name, role_id) VALUES (?, ?, '$2a$10$xyz', ?, 'role_student')`,
            [userId, email, full_name]
        );

        await db.run(
            `INSERT INTO people_students (id, user_id, usn, full_name, email, branch, department, admission_year, graduation_year, semester, cgpa, active_backlogs)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)`,
            [studentId, userId, usn.toUpperCase(), full_name, email, branch, department || 'Engineering', 2023, graduation_year || 2027, semester || 6, cgpa || 8.0]
        );

        await db.run(
            `INSERT INTO placement_readiness_summary (student_id, overall_readiness_score, technical_score, aptitude_score, communication_score, interview_readiness_score, status)
             VALUES (?, 75.0, 75.0, 75.0, 75.0, 75.0, 'In Preparation')`,
            [studentId]
        );

        res.json({ message: 'Student successfully onboarded', student_id: studentId });
    } catch (err) {
        console.error('Add student error:', err);
        res.status(500).json({ error: 'Failed to add student record' });
    }
});

// Send Communication (T&P Only, HOD blocked)
router.post('/send-message', authenticateToken, requireRole(['T_AND_P']), denyHODMutation, async (req, res) => {
    try {
        const { message, recipient_type, recipient_id, subject } = req.body;
        const msgId = 'msg_' + crypto.randomBytes(4).toString('hex');

        await db.run(
            `INSERT INTO institution_communications (id, sender_id, sender_name, recipient_type, recipient_id, subject, message)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [msgId, req.user.id, req.user.full_name, recipient_type || 'BROADCAST', recipient_id || null, subject || 'Announcement', message]
        );

        res.json({ message: 'Communication dispatched successfully', message_id: msgId });
    } catch (err) {
        res.status(500).json({ error: 'Failed to send message' });
    }
});

export default router;
