import express from 'express';
import jwt from 'jsonwebtoken';
import { santraAiService } from '../services/santraAiService.js';
import { db } from '../db/database.js';
import { JWT_SECRET } from '../middleware/auth.js';

const router = express.Router();

// Optional auth resolver for chat requests
async function resolveUserFromAuthHeader(req) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded?.userId || decoded?.id;
    if (!userId) return null;

    const user = await db.get(
      `SELECT u.id, u.email, u.full_name, r.name as role 
       FROM identity_users u 
       JOIN identity_roles r ON u.role_id = r.id 
       WHERE u.id = ?`,
      [userId]
    );
    return user || null;
  } catch (err) {
    return null;
  }
}

/**
 * POST /api/santra-ai/chat
 * Primary grounded conversational interface for SantraAI
 */
router.post('/chat', async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ error: 'Message is required.' });
    }

    const user = await resolveUserFromAuthHeader(req);
    const reply = await santraAiService.generateChatResponse(message.trim(), history || [], user);

    return res.json({
      success: true,
      reply,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error('Error in /api/santra-ai/chat route:', err);
    return res.status(500).json({
      success: false,
      reply: "SantraAI is currently unable to process your request. Please try again in a moment."
    });
  }
});

export default router;
