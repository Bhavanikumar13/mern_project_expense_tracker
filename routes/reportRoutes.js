import express from 'express';
import { generatePDFReport, generateCSVReport, sendEmailReport } from '../controllers/reportController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect); // All routes are protected

router.get('/pdf', generatePDFReport);
router.get('/csv', generateCSVReport);
router.post('/email', sendEmailReport);

export default router;
