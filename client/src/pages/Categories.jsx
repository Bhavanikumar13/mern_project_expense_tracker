import { useState, useEffect } from 'react';
import { categoryAPI } from '../services/api';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import toast from 'react-hot-toast';
import CategoryModal from '../components/CategoryModal';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await categoryAPI.getAll();
      setCategories(res.data.data);
    } catch (error) {
      toast.error('Failed to load categories');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = () => {
    setEditingCategory(null);
    setShowModal(true);
  };

  const handleEditCategory = (category) => {
    if (category.isDefault) {
      toast.error('Cannot edit default categories');
      return;
    }
    setEditingCategory(category);
    setShowModal(true);
  };

  const handleDeleteCategory = async (id, isDefault) => {
    if (isDefault) {
      toast.error('Cannot delete default categories');
      return;
    }

    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await categoryAPI.delete(id);
        toast.success('Category deleted successfully');
        fetchCategories();
      } catch (error) {
        toast.error('Failed to delete category');
        console.error(error);
      }
    }
  };

  const handleModalClose = (refresh) => {
    setShowModal(false);
    setEditingCategory(null);
    if (refresh) {
      fetchCategories();
    }
  };

  const filteredCategories = categories.filter(cat => {
    if (filter === 'all') return true;
    return cat.type === filter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Categories</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your transaction categories</p>
        </div>
        <button onClick={handleAddCategory} className="btn-primary flex items-center space-x-2">
          <FiPlus /> <span>Add Category</span>
        </button>
      </div>

      {/* Filter */}
      <div className="flex gap-4">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'all' ? 'bg-primary-600 text-white' : 'bg-gray-200 dark:bg-gray-700'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('income')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'income' ? 'bg-green-600 text-white' : 'bg-gray-200 dark:bg-gray-700'
          }`}
        >
          Income
        </button>
        <button
          onClick={() => setFilter('expense')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'expense' ? 'bg-red-600 text-white' : 'bg-gray-200 dark:bg-gray-700'
          }`}
        >
          Expense
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {loading ? (
          <div className="col-span-full flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : filteredCategories.length > 0 ? (
          filteredCategories.map((category) => (
            <div
              key={category._id}
              className="card hover:shadow-lg transition-shadow"
              style={{ borderLeft: `4px solid ${category.color}` }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <span className="text-4xl">{category.icon}</span>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{category.name}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      category.type === 'income'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {category.type}
                    </span>
                  </div>
                </div>
              </div>

              {category.isDefault && (
                <span className="text-xs text-gray-500 dark:text-gray-400">Default Category</span>
              )}

              {!category.isDefault && (
                <div className="flex items-center gap-2 mt-3">
                  <button
                    onClick={() => handleEditCategory(category)}
                    className="flex-1 p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors text-sm font-medium"
                  >
                    <FiEdit2 className="inline mr-1" size={16} /> Edit
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(category._id, category.isDefault)}
                    className="flex-1 p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors text-sm font-medium"
                  >
                    <FiTrash2 className="inline mr-1" size={16} /> Delete
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No categories found</p>
          </div>
        )}
      </div>

      {/* Category Modal */}
      {showModal && (
        <CategoryModal
          category={editingCategory}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
};

export default Categories;
