import express from 'express';
import upload from '../middleware/upload.js';
import { analyzeResume } from '../controllers/analysisController.js';
import {
  getHistory,
  getHistoryById,
  deleteHistoryById
} from '../controllers/historyController.js';

const router = express.Router();

/**
 * Routes definitions for Resume Analysis API endpoints.
 */

// Route to upload a PDF resume and run Gemini evaluation
router.post('/analyze', upload.single('resume'), analyzeResume);

// Route to get all past evaluation summaries
router.get('/history', getHistory);

// Route to get details of a specific evaluation
router.get('/history/:id', getHistoryById);

// Route to delete a specific evaluation record
router.delete('/history/:id', deleteHistoryById);

export default router;
