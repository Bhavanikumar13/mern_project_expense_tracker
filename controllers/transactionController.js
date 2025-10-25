import Transaction from '../models/Transaction.js';
import Category from '../models/Category.js';

// @desc    Get all transactions for logged in user
// @route   GET /api/transactions
// @access  Private
export const getTransactions = async (req, res, next) => {
  try {
    const { type, category, startDate, endDate, search, sortBy, limit, page } = req.query;

    // Build query
    let query = { user: req.user.id };

    // Filter by type
    if (type && (type === 'income' || type === 'expense')) {
      query.type = type;
    }

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Filter by date range
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    // Search in title and notes
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { notes: { $regex: search, $options: 'i' } }
      ];
    }

    // Pagination
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 50;
    const skip = (pageNum - 1) * limitNum;

    // Sort
    let sort = {};
    if (sortBy === 'amount') {
      sort = { amount: -1 };
    } else if (sortBy === 'amount_asc') {
      sort = { amount: 1 };
    } else {
      sort = { date: -1 }; // Default: newest first
    }

    const transactions = await Transaction.find(query)
      .populate('category', 'name icon color type')
      .sort(sort)
      .limit(limitNum)
      .skip(skip);

    const total = await Transaction.countDocuments(query);

    res.status(200).json({
      success: true,
      count: transactions.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      data: transactions
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single transaction
// @route   GET /api/transactions/:id
// @access  Private
export const getTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findById(req.params.id).populate('category');

    if (!transaction) {
      return res.status(404).json({ success: false, error: 'Transaction not found' });
    }

    // Make sure user owns transaction
    if (transaction.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, error: 'Not authorized' });
    }

    res.status(200).json({ success: true, data: transaction });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new transaction
// @route   POST /api/transactions
// @access  Private
export const createTransaction = async (req, res, next) => {
  try {
    // Add user to req.body
    req.body.user = req.user.id;

    const transaction = await Transaction.create(req.body);
    const populatedTransaction = await Transaction.findById(transaction._id).populate('category');

    res.status(201).json({ success: true, data: populatedTransaction });
  } catch (error) {
    next(error);
  }
};

// @desc    Update transaction
// @route   PUT /api/transactions/:id
// @access  Private
export const updateTransaction = async (req, res, next) => {
  try {
    let transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ success: false, error: 'Transaction not found' });
    }

    // Make sure user owns transaction
    if (transaction.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, error: 'Not authorized' });
    }

    transaction = await Transaction.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('category');

    res.status(200).json({ success: true, data: transaction });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete transaction
// @route   DELETE /api/transactions/:id
// @access  Private
export const deleteTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ success: false, error: 'Transaction not found' });
    }

    // Make sure user owns transaction
    if (transaction.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, error: 'Not authorized' });
    }

    await transaction.deleteOne();

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};

// @desc    Get transaction statistics
// @route   GET /api/transactions/stats/summary
// @access  Private
export const getStats = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    let dateFilter = { user: req.user.id };
    if (startDate || endDate) {
      dateFilter.date = {};
      if (startDate) dateFilter.date.$gte = new Date(startDate);
      if (endDate) dateFilter.date.$lte = new Date(endDate);
    }

    // Get total income
    const incomeResult = await Transaction.aggregate([
      { $match: { ...dateFilter, type: 'income' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const totalIncome = incomeResult.length > 0 ? incomeResult[0].total : 0;

    // Get total expense
    const expenseResult = await Transaction.aggregate([
      { $match: { ...dateFilter, type: 'expense' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const totalExpense = expenseResult.length > 0 ? expenseResult[0].total : 0;

    // Get category-wise breakdown
    const categoryBreakdown = await Transaction.aggregate([
      { $match: dateFilter },
      { $group: { _id: { category: '$category', type: '$type' }, total: { $sum: '$amount' } } },
      { $lookup: { from: 'categories', localField: '_id.category', foreignField: '_id', as: 'categoryInfo' } },
      { $unwind: '$categoryInfo' },
      { $project: { type: '$_id.type', category: '$categoryInfo.name', icon: '$categoryInfo.icon', color: '$categoryInfo.color', total: 1 } },
      { $sort: { total: -1 } }
    ]);

    // Get monthly trend (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyTrend = await Transaction.aggregate([
      { $match: { user: req.user.id, date: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
            type: '$type'
          },
          total: { $sum: '$amount' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalIncome,
        totalExpense,
        balance: totalIncome - totalExpense,
        categoryBreakdown,
        monthlyTrend
      }
    });
  } catch (error) {
    next(error);
  }
};
