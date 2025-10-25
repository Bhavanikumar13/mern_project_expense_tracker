import { useState, useEffect, useMemo } from 'react';
import { transactionAPI } from '../services/api';
import { FiTrendingUp, FiTrendingDown, FiDollarSign, FiCreditCard } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useTransaction } from '../context/TransactionContext';

const Dashboard = () => {
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { transactionUpdate } = useTransaction();

  useEffect(() => {
    fetchDashboardData();
  }, [transactionUpdate]); // Add transactionUpdate as dependency

  const fetchDashboardData = async () => {
    try {
      const transactionsRes = await transactionAPI.getAll({ limit: 5, sortBy: 'date' });
      console.log('Recent transactions API response:', transactionsRes);
      setRecentTransactions(transactionsRes.data?.data || []);
    } catch (error) {
      console.error('Dashboard error:', error);
      toast.error('Failed to load dashboard data: ' + (error.response?.data?.error || error.message));
      setRecentTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  // Calculate stats based on recent transactions
  const calculatedStats = useMemo(() => {
    let totalIncome = 0;
    let totalExpense = 0;
    
    recentTransactions.forEach(transaction => {
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
  }, [recentTransactions]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">Overview of your financial status</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Income */}
        <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white transform hover:scale-105 transition-transform duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Total Income</p>
              <h3 className="text-3xl font-bold mt-2">₹{calculatedStats.totalIncome.toFixed(2)}</h3>
            </div>
            <div className="p-3 bg-white/20 rounded-lg">
              <FiTrendingUp size={32} />
            </div>
          </div>
        </div>

        {/* Total Expense */}
        <div className="card bg-gradient-to-br from-red-500 to-red-600 text-white transform hover:scale-105 transition-transform duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm font-medium">Total Expense</p>
              <h3 className="text-3xl font-bold mt-2">₹{calculatedStats.totalExpense.toFixed(2)}</h3>
            </div>
            <div className="p-3 bg-white/20 rounded-lg">
              <FiTrendingDown size={32} />
            </div>
          </div>
        </div>

        {/* Balance */}
        <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white transform hover:scale-105 transition-transform duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Balance</p>
              <h3 className="text-3xl font-bold mt-2">₹{calculatedStats.balance.toFixed(2)}</h3>
            </div>
            <div className="p-3 bg-white/20 rounded-lg">
              <FiDollarSign size={32} />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Transactions</h3>
          <a href="/transactions" className="text-primary-600 hover:text-primary-700 font-medium">
            View All
          </a>
        </div>

        {recentTransactions.length > 0 ? (
          <div className="space-y-3">
            {recentTransactions.map((transaction) => (
              <div
                key={transaction._id}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-lg ${
                    transaction.type === 'income' ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'
                  }`}>
                    <span className="text-2xl">{transaction.category?.icon || '💰'}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{transaction.title}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {transaction.category?.name} • {new Date(transaction.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className={`text-lg font-semibold ${
                  transaction.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                }`}>
                  {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400 py-8">No recent transactions</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;