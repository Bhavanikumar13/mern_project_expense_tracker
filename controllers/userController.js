import User from '../models/User.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/profiles';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, `user-${req.user.id}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5000000 }, // 5MB
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateProfile = async (req, res, next) => {
  try {
    const fieldsToUpdate = {
      name: req.body.name,
      email: req.body.email,
      currency: req.body.currency,
      monthlyBudget: req.body.monthlyBudget,
      budgetAlertThreshold: req.body.budgetAlertThreshold,
      emailNotifications: req.body.emailNotifications
    };

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

// @desc    Update profile picture
// @route   PUT /api/users/profile/picture
// @access  Private
export const updateProfilePicture = [
  upload.single('profilePicture'),
  async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, error: 'Please upload a file' });
      }

      const user = await User.findById(req.user.id);

      // Delete old profile picture if exists
      if (user.profilePicture) {
        const oldPath = user.profilePicture.replace('/uploads/', 'uploads/');
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }

      // Update user with new profile picture path
      user.profilePicture = `/uploads/profiles/${req.file.filename}`;
      await user.save();

      res.status(200).json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  }
];

// @desc    Delete user account
// @route   DELETE /api/users/profile
// @access  Private
export const deleteAccount = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.user.id);
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};
