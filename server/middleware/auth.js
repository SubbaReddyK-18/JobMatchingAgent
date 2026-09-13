import jwt from 'jsonwebtoken';
import { db } from '../db/database.js';

export const JWT_SECRET = process.env.JWT_SECRET || 'jobmatch_agent50_super_secret_jwt_key_2026';

export async function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Authentication token required' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await db.get(
            `SELECT u.id, u.email, u.full_name, u.role_id, u.avatar_url, r.name as role_name 
             FROM identity_users u 
             JOIN identity_roles r ON u.role_id = r.id 
             WHERE u.id = ?`,
            [decoded.userId]
        );

        if (!user) {
            return res.status(401).json({ error: 'User session invalid or expired' });
        }

        req.user = user;
        next();
    } catch (err) {
        return res.status(403).json({ error: 'Invalid or expired token' });
    }
}

export function requireRole(allowedRoles = []) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        const role = req.user.role_name;
        if (!allowedRoles.includes(role)) {
            return res.status(403).json({ 
                error: `Access denied. Role ${role} is not authorized to access this resource.`,
                requiredRoles: allowedRoles
            });
        }
        next();
    };
}

/**
 * Enforces HOD read-only rule.
 * If user is HOD and performs any mutation (POST, PUT, DELETE, PATCH), rejects with HTTP 403.
 */
export function denyHODMutation(req, res, next) {
    if (req.user && req.user.role_name === 'HOD') {
        return res.status(403).json({
            error: 'HOD Role is strictly READ-ONLY. Institutional administrative mutations (creating/editing jobs, students, shortlisting, communications) are reserved for Training & Placement (T&P) Cell.'
        });
    }
    next();
}
