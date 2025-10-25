import { useState, useEffect } from 'react';
import { categoryAPI } from '../services/api';
import { FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';

const CategoryModal = ({ category, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'expense',
    icon: '💰',
    color: '#3B82F6'
  });
  const [loading, setLoading] = useState(false);

  const iconOptions = [
    '💰', '💵', '💳', '🏦', '💼', '📊', '📈', '💸',
    '🍔', '🛍️', '🚗', '🎬', '🏥', '💡', '📚', '✈️',
    '🏠', '📱', '⚡', '🎮', '🎵', '🏋️', '🍕', '☕',
    '🎁', '🛒', '🚕', '🏨', '🎓', '💊', '🔧', '👔'
  ];

  const colorOptions = [
    '#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6',
    '#EC4899', '#14B8A6', '#F97316', '#6366F1', '#06B6D4'
  ];

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        type: category.type,
        icon: category.icon,
        color: category.color
      });
    }
  }, [category]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (category) {
        await categoryAPI.update(category._id, formData);
        toast.success('Category updated successfully');
      } else {
        await categoryAPI.create(formData);
        toast.success('Category created successfully');
      }
      onClose(true);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to save category');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {category ? 'Edit Category' : 'Add Category'}
            </h2>
            <button onClick={() => onClose(false)} className="text-gray-400 hover:text-gray-600">
              <FiX size={24} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Type
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: 'income' })}
                  className={`py-2 px-4 rounded-lg font-medium transition-colors ${
                    formData.type === 'income'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                >
                  Income
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: 'expense' })}
                  className={`py-2 px-4 rounded-lg font-medium transition-colors ${
                    formData.type === 'expense'
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                >
                  Expense
                </button>
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="e.g., Entertainment"
              />
            </div>

            {/* Icon */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Icon
              </label>
              <div className="grid grid-cols-8 gap-2">
                {iconOptions.map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => setFormData({ ...formData, icon })}
                    className={`text-2xl p-2 rounded-lg transition-colors ${
                      formData.icon === icon
                        ? 'bg-primary-100 dark:bg-primary-900 ring-2 ring-primary-500'
                        : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            {/* Color */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Color
              </label>
              <div className="grid grid-cols-5 gap-2">
                {colorOptions.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setFormData({ ...formData, color })}
                    className={`h-10 rounded-lg transition-transform ${
                      formData.color === color ? 'ring-2 ring-offset-2 ring-gray-900 dark:ring-gray-100 scale-110' : ''
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={() => onClose(false)}
                className="flex-1 btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 btn-primary disabled:opacity-50"
              >
                {loading ? 'Saving...' : category ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CategoryModal;
