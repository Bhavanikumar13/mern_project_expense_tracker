import { useState, useEffect, useMemo } from 'react';
import { transactionAPI, categoryAPI } from '../services/api';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiFilter, FiX, FiTrendingUp, FiTrendingDown, FiDollarSign } from 'react-icons/fi';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import toast from 'react-hot-toast';
import TransactionModal from '../components/TransactionModal';
import { useTransaction } from '../context/TransactionContext';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
    categoryBreakdown: [],
    monthlyTrend: []
  });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const { transactionUpdate } = useTransaction();
  
  // Filters
  const [filters, setFilters] = useState({
    search: '',
    type: '',
    category: '',
    startDate: '',
    endDate: ''
  });

  // Colors for charts
  const COLORS = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316'];

  useEffect(() => {
    fetchCategories();
    fetchTransactions();
    fetchStats(); // Fetch stats when component loads
  }, [filters, transactionUpdate]); // Add transactionUpdate as dependency

  const fetchCategories = async () => {
    try {
      const res = await categoryAPI.getAll();
      setCategories(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.type) params.type = filters.type;
      if (filters.category) params.category = filters.category;
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;

      const res = await transactionAPI.getAll(params);
      setTransactions(res.data.data);
    } catch (error) {
      toast.error('Failed to load transactions');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      // Get stats based on current filters
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.type) params.type = filters.type;
      if (filters.category) params.category = filters.category;
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;

      const res = await transactionAPI.getStats(params);
      setStats(res.data.data || {
        totalIncome: 0,
        totalExpense: 0,
        balance: 0,
        categoryBreakdown: [],
        monthlyTrend: []
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const handleAddTransaction = () => {
    setEditingTransaction(null);
    setShowModal(true);
  };

  const handleEditTransaction = (transaction) => {
    setEditingTransaction(transaction);
    setShowModal(true);
  };

  const handleDeleteTransaction = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await transactionAPI.delete(id);
        toast.success('Transaction deleted successfully');
        fetchTransactions();
        fetchStats(); // Refresh stats after deletion
      } catch (error) {
        toast.error('Failed to delete transaction');
        console.error(error);
      }
    }
  };

  const handleModalClose = (refresh) => {
    setShowModal(false);
    setEditingTransaction(null);
    if (refresh) {
      fetchTransactions();
      fetchStats(); // Refresh stats after adding/editing
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      type: '',
      category: '',
      startDate: '',
      endDate: ''
    });
  };

  // Calculate stats based on current transactions
  const calculatedStats = useMemo(() => {
    let totalIncome = 0;
    let totalExpense = 0;
    
    transactions.forEach(transaction => {
      if (transaction.type === 'income') {
        totalIncome += transaction.amount;
      } else if (transaction.type === 'expense') {
        totalExpense += transaction.amount;
      }
    });
    
    return {
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense
    };
  }, [transactions]);

  // Prepare data for pie chart
  const prepareChartData = () => {
    const expenseData = stats?.categoryBreakdown?.filter(item => item.type === 'expense') || [];
    const incomeData = stats?.categoryBreakdown?.filter(item => item.type === 'income') || [];
    
    return { expenseData, incomeData };
  };

  // Prepare data for line chart
  const prepareLineChartData = () => {
    const months = {};
    
    stats?.monthlyTrend?.forEach(item => {
      const monthKey = `${item._id.year}-${String(item._id.month).padStart(2, '0')}`;
      if (!months[monthKey]) {
        months[monthKey] = { 
          month: `${item._id.month}/${item._id.year}`, 
          income: 0, 
          expense: 0 
        };
      }
      months[monthKey][item._id.type] = item.total;
    });

    return Object.values(months).sort((a, b) => {
      const [aMonth, aYear] = a.month.split('/');
      const [bMonth, bYear] = b.month.split('/');
      return new Date(`${aYear}-${aMonth}-01`) - new Date(`${bYear}-${bMonth}-01`);
    });
  };

  const { expenseData, incomeData } = prepareChartData();
  const lineChartData = prepareLineChartData();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Transactions</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your income and expenses</p>
        </div>
        <button onClick={handleAddTransaction} className="btn-primary flex items-center space-x-2">
          <FiPlus /> <span>Add Transaction</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Income */}
        <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Total Income</p>
              <h3 className="text-2xl font-bold mt-2">₹{calculatedStats.totalIncome.toFixed(2)}</h3>
            </div>
            <div className="p-3 bg-white/20 rounded-lg">
              <FiTrendingUp size={24} />
            </div>
          </div>
        </div>

        {/* Total Expense */}
        <div className="card bg-gradient-to-br from-red-500 to-red-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm font-medium">Total Expense</p>
              <h3 className="text-2xl font-bold mt-2">₹{calculatedStats.totalExpense.toFixed(2)}</h3>
            </div>
            <div className="p-3 bg-white/20 rounded-lg">
              <FiTrendingDown size={24} />
            </div>
          </div>
        </div>

        {/* Balance */}
        <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Balance</p>
              <h3 className="text-2xl font-bold mt-2">₹{calculatedStats.balance.toFixed(2)}</h3>
            </div>
            <div className="p-3 bg-white/20 rounded-lg">
              <FiDollarSign size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-6">
        {/* Line Chart for Income vs Expense Trend */}
        {lineChartData.length > 0 && (
          <div className="card">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Income vs Expense Trend</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`₹${value.toFixed(2)}`, 'Amount']} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="income" 
                    stroke="#10B981" 
                    strokeWidth={2} 
                    name="Income" 
                    dot={{ r: 4 }} 
                    activeDot={{ r: 6 }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="expense" 
                    stroke="#EF4444" 
                    strokeWidth={2} 
                    name="Expense" 
                    dot={{ r: 4 }} 
                    activeDot={{ r: 6 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Pie Charts */}
        {(expenseData.length > 0 || incomeData.length > 0) && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Expense Pie Chart */}
            {expenseData.length > 0 && (
              <div className="card">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Expense Breakdown</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={expenseData}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="total"
                        nameKey="category"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {expenseData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`₹${value.toFixed(2)}`, 'Amount']} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Income Pie Chart */}
            {incomeData.length > 0 && (
              <div className="card">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Income Breakdown</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={incomeData}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="total"
                        nameKey="category"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {incomeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`₹${value.toFixed(2)}`, 'Amount']} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <FiFilter /> Filters
          </h3>
          <button onClick={clearFilters} className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
            Clear All
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="Search..."
              className="input-field pl-10"
            />
          </div>

          {/* Type */}
          <select name="type" value={filters.type} onChange={handleFilterChange} className="input-field">
            <option value="">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>

          {/* Category */}
          <select name="category" value={filters.category} onChange={handleFilterChange} className="input-field">
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat._id} value={cat._id}>{cat.icon} {cat.name}</option>
            ))}
          </select>

          {/* Start Date */}
          <input
            type="date"
            name="startDate"
            value={filters.startDate}
            onChange={handleFilterChange}
            className="input-field"
          />

          {/* End Date */}
          <input
            type="date"
            name="endDate"
            value={filters.endDate}
            onChange={handleFilterChange}
            className="input-field"
          />
        </div>
      </div>

      {/* Transactions List */}
      <div className="card">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : transactions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Date</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Title</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Category</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Type</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900 dark:text-white">Amount</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900 dark:text-white">Actions</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction._id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                      {new Date(transaction.date).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{transaction.title}</p>
                        {transaction.notes && (
                          <p className="text-sm text-gray-500 dark:text-gray-400">{transaction.notes}</p>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span>{transaction.category?.icon}</span>
                        <span className="text-gray-900 dark:text-white">{transaction.category?.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        transaction.type === 'income'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {transaction.type}
                      </span>
                    </td>
                    <td className={`py-3 px-4 text-right font-semibold ${
                      transaction.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount.toFixed(2)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEditTransaction(transaction)}
                          className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        >
                          <FiEdit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteTransaction(transaction._id)}
                          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No transactions found</p>
          </div>
        )}
      </div>

      {/* Transaction Modal */}
      {showModal && (
        <TransactionModal
          transaction={editingTransaction}
          categories={categories}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
};

export default Transactions;