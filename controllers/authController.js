import User from '../models/User.js';
import Category from '../models/Category.js';

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
  try {
    const { name, email, password, currency } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, error: 'User already exists' });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      currency: currency || 'INR'
    });

    // Create default categories for the new user
    await createDefaultCategories(user._id);

    sendTokenResponse(user, 201, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Please provide an email and password' });
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user / clear cookie
// @route   GET /api/auth/logout
// @access  Private
export const logout = async (req, res, next) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });

  res.status(200).json({
    success: true,
    data: {}
  });
};

// Helper function to get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production'
  };

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture,
        currency: user.currency
      }
    });
};

// Helper function to create default categories
const createDefaultCategories = async (userId) => {
  const defaultCategories = [
    // Expense categories
    { name: 'Food & Dining', type: 'expense', icon: '🍔', color: '#EF4444', isDefault: true, user: userId },
    { name: 'Shopping', type: 'expense', icon: '🛍️', color: '#F59E0B', isDefault: true, user: userId },
    { name: 'Transportation', type: 'expense', icon: '🚗', color: '#10B981', isDefault: true, user: userId },
    { name: 'Entertainment', type: 'expense', icon: '🎬', color: '#8B5CF6', isDefault: true, user: userId },
    { name: 'Healthcare', type: 'expense', icon: '🏥', color: '#EC4899', isDefault: true, user: userId },
    { name: 'Bills & Utilities', type: 'expense', icon: '💡', color: '#6366F1', isDefault: true, user: userId },
    { name: 'Education', type: 'expense', icon: '📚', color: '#3B82F6', isDefault: true, user: userId },
    { name: 'Travel', type: 'expense', icon: '✈️', color: '#06B6D4', isDefault: true, user: userId },
    { name: 'Other Expenses', type: 'expense', icon: '📦', color: '#64748B', isDefault: true, user: userId },
    
    // Income categories
    { name: 'Salary', type: 'income', icon: '💼', color: '#10B981', isDefault: true, user: userId },
    { name: 'Freelance', type: 'income', icon: '💻', color: '#3B82F6', isDefault: true, user: userId },
    { name: 'Investment', type: 'income', icon: '📈', color: '#8B5CF6', isDefault: true, user: userId },
    { name: 'Business', type: 'income', icon: '🏢', color: '#F59E0B', isDefault: true, user: userId },
    { name: 'Other Income', type: 'income', icon: '💰', color: '#14B8A6', isDefault: true, user: userId }
  ];

  await Category.insertMany(defaultCategories);
};
