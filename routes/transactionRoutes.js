import express from 'express';
import {
  getTransactions,
  getTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getStats
} from '../controllers/transactionController.js';
import { protect } from '../middleware/auth.js';
import { validateTransaction } from '../middleware/validators.js';

const router = express.Router();

router.use(protect); // All routes are protected

router.route('/')
  .get(getTransactions)
  .post(validateTransaction, createTransaction);

router.route('/stats/summary')
  .get(getStats);

router.route('/:id')
  .get(getTransaction)
  .put(validateTransaction, updateTransaction)
  .delete(deleteTransaction);

export default router;
