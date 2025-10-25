import Category from '../models/Category.js';

// @desc    Get all categories for logged in user
// @route   GET /api/categories
// @access  Private
export const getCategories = async (req, res, next) => {
  try {
    const { type } = req.query;

    let query = { user: req.user.id };
    if (type && (type === 'income' || type === 'expense')) {
      query.type = type;
    }

    const categories = await Category.find(query).sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single category
// @route   GET /api/categories/:id
// @access  Private
export const getCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ success: false, error: 'Category not found' });
    }

    // Make sure user owns category
    if (category.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, error: 'Not authorized' });
    }

    res.status(200).json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new category
// @route   POST /api/categories
// @access  Private
export const createCategory = async (req, res, next) => {
  try {
    // Add user to req.body
    req.body.user = req.user.id;
    req.body.isDefault = false; // Custom categories are never default

    const category = await Category.create(req.body);

    res.status(201).json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
};

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private
export const updateCategory = async (req, res, next) => {
  try {
    let category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ success: false, error: 'Category not found' });
    }

    // Make sure user owns category
    if (category.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, error: 'Not authorized' });
    }

    // Prevent updating default categories
    if (category.isDefault) {
      return res.status(400).json({ success: false, error: 'Cannot update default categories' });
    }

    category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private
export const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ success: false, error: 'Category not found' });
    }

    // Make sure user owns category
    if (category.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, error: 'Not authorized' });
    }

    // Prevent deleting default categories
    if (category.isDefault) {
      return res.status(400).json({ success: false, error: 'Cannot delete default categories' });
    }

    await category.deleteOne();

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};
