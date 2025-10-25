import express from 'express';
import {
  getProfile,
  updateProfile,
  updateProfilePicture,
  deleteAccount
} from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect); // All routes are protected

router.route('/profile')
  .get(getProfile)
  .put(updateProfile)
  .delete(deleteAccount);

router.put('/profile/picture', updateProfilePicture);

export default router;
