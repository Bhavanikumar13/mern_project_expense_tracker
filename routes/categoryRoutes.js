import express from 'express';
import {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory
} from '../controllers/categoryController.js';
import { protect } from '../middleware/auth.js';
import { validateCategory } from '../middleware/validators.js';

const router = express.Router();

router.use(protect); // All routes are protected

router.route('/')
  .get(getCategories)
  .post(validateCategory, createCategory);

router.route('/:id')
  .get(getCategory)
  .put(validateCategory, updateCategory)
  .delete(deleteCategory);

export default router;
