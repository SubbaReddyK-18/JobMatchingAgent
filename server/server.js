import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { db } from './db/database.js';
import { seedDatabase } from './db/seed.js';

// Import route modules
import authRoutes from './routes/auth.js';
import studentsRoutes from './routes/students.js';
import jobsRoutes from './routes/jobs.js';
import matchingRoutes from './routes/matching.js';
import applicationsRoutes from './routes/applications.js';
import preparationRoutes from './routes/preparation.js';
import institutionRoutes from './routes/institution.js';
import agentopsRoutes from './routes/agentops.js';
import santraAiRoutes from './routes/santraAi.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CLIENT_DIST = path.join(__dirname, '../client/dist');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like same-origin in production, mobile apps, or curl)
    if (!origin) return callback(null, true);
    if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
      return callback(null, true);
    }
    // In production, allow all origins or same-origin
    return callback(null, true);
  },
  credentials: true
}));
app.use(express.json());

// Request logging
app.use((req, res, next) => {
  if (!req.url.startsWith('/assets') && !req.url.endsWith('.ico') && !req.url.endsWith('.png') && !req.url.endsWith('.webp')) {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  }
  next();
});

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'JobMatch AI — Agent 50 & SantraAI Platform API',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentsRoutes);
app.use('/api/jobs', jobsRoutes);
app.use('/api/matches', matchingRoutes);
app.use('/api/matching', matchingRoutes);
app.use('/api/applications', applicationsRoutes);
app.use('/api/preparation', preparationRoutes);
app.use('/api/institution', institutionRoutes);
app.use('/api/agentops', agentopsRoutes);
app.use('/api/santra-ai', santraAiRoutes);

// Static assets from built frontend (client/dist)
app.use(express.static(CLIENT_DIST));

// SPA Fallback for all other requests (excluding /api)
app.use((req, res, next) => {
  if (req.method === 'GET' && !req.url.startsWith('/api')) {
    return res.sendFile(path.join(CLIENT_DIST, 'index.html'));
  }
  if (req.url.startsWith('/api')) {
    return res.status(404).json({ error: 'API endpoint not found' });
  }
  next();
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({
    error: 'Internal server error occurred',
    message: err.message
  });
});

// Initialize database schema and start server
async function startServer() {
  try {
    await db.init();
    await seedDatabase();
    app.listen(PORT, () => {
      console.log(`====================================================`);
      console.log(`🚀 JobMatch AI Backend API running on port ${PORT}`);
      console.log(`🌐 Serving Frontend from: ${CLIENT_DIST}`);
      console.log(`🤖 SantraAI Engine active & bound to JobMatch DB`);
      console.log(`====================================================`);
    });
  } catch (error) {
    console.error('Failed to initialize server:', error);
    process.exit(1);
  }
}

startServer();

