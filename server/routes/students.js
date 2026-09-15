import express from 'express';
import { db } from '../db/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get full student profile (academics, skills, projects, certs, preferences, readiness)
router.get('/profile', authenticateToken, async (req, res) => {
    try {
        let studentId = req.query.student_id;

        if (!studentId && req.user.role_name === 'STUDENT') {
            const student = await db.get('SELECT id FROM people_students WHERE user_id = ?', [req.user.id]);
            if (student) studentId = student.id;
        }

        if (!studentId) {
            studentId = 'std_subbu'; // default fallback demo persona
        }

        const student = await db.get('SELECT * FROM people_students WHERE id = ?', [studentId]);
        if (!student) {
            return res.status(404).json({ error: 'Student record not found' });
        }

        const skills = await db.query('SELECT * FROM student_skills WHERE student_id = ? ORDER BY score DESC', [studentId]);
        const projects = await db.query('SELECT * FROM student_projects WHERE student_id = ?', [studentId]);
        const parsedProjects = projects.map(p => ({
            ...p,
            tech_stack: typeof p.tech_stack === 'string' ? JSON.parse(p.tech_stack) : p.tech_stack
        }));

        const certs = await db.query('SELECT * FROM student_certifications WHERE student_id = ?', [studentId]);
        const preferences = await db.get('SELECT * FROM student_preferences WHERE student_id = ?', [studentId]);
        const readiness = await db.get('SELECT * FROM placement_readiness_summary WHERE student_id = ?', [studentId]);

        const parsedPrefs = preferences ? {
            ...preferences,
            preferred_roles: typeof preferences.preferred_roles === 'string' ? JSON.parse(preferences.preferred_roles) : preferences.preferred_roles,
            preferred_locations: typeof preferences.preferred_locations === 'string' ? JSON.parse(preferences.preferred_locations) : preferences.preferred_locations,
            preferred_job_types: typeof preferences.preferred_job_types === 'string' ? JSON.parse(preferences.preferred_job_types) : preferences.preferred_job_types
        } : null;

        // Quick Stats for student
        const appStats = await db.get('SELECT COUNT(*) as total_apps FROM placement_drive_applications WHERE student_id = ?', [studentId]);
        const interviewStats = await db.get(`
            SELECT COUNT(*) as interview_count 
            FROM placement_interviews i 
            JOIN placement_drive_applications a ON i.application_id = a.id 
            WHERE a.student_id = ?`, [studentId]);

        res.json({
            student,
            skills,
            projects: parsedProjects,
            certifications: certs,
            preferences: parsedPrefs,
            readiness: readiness || {
                overall_readiness_score: 82,
                technical_score: 88,
                aptitude_score: 85,
                communication_score: 78,
                interview_readiness_score: 76,
                status: 'Placement Ready'
            },
            stats: {
                total_applications: appStats ? appStats.total_apps : 6,
                interviews_scheduled: interviewStats ? interviewStats.interview_count : 2,
                learning_hours: 36,
                skills_improved: 4,
                profile_completeness: 92
            }
        });
    } catch (err) {
        console.error('Error fetching student profile:', err);
        res.status(500).json({ error: 'Server error fetching student profile' });
    }
});

// Update student profile
router.put('/profile', authenticateToken, async (req, res) => {
    try {
        let studentId = req.body.student_id;
        let userId = req.user?.id;

        if (req.user?.role_name === 'STUDENT') {
            const student = await db.get('SELECT id, user_id FROM people_students WHERE user_id = ?', [req.user.id]);
            if (student) {
                studentId = student.id;
                userId = student.user_id;
            }
        }
        if (!studentId) studentId = 'std_subbu';

        const { full_name, bio, linkedin_url, github_url, phone, location, avatar_url } = req.body;

        await db.run(
            `UPDATE people_students 
             SET full_name = COALESCE(?, full_name),
                 bio = COALESCE(?, bio), 
                 linkedin_url = COALESCE(?, linkedin_url), 
                 github_url = COALESCE(?, github_url), 
                 phone = COALESCE(?, phone),
                 avatar_url = COALESCE(?, avatar_url)
             WHERE id = ?`,
            [full_name, bio, linkedin_url, github_url, phone, avatar_url, studentId]
        );

        if (userId) {
            await db.run(
                `UPDATE users 
                 SET full_name = COALESCE(?, full_name),
                     avatar_url = COALESCE(?, avatar_url)
                 WHERE id = ?`,
                [full_name, avatar_url, userId]
            );
        }

        res.json({ 
            message: 'Profile updated successfully',
            updated: { full_name, bio, linkedin_url, github_url, phone, location, avatar_url }
        });
    } catch (err) {
        console.error('Error updating profile:', err);
        res.status(500).json({ error: 'Error updating profile' });
    }
});

export default router;
