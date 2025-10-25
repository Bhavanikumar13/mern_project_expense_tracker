import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../services/api';
import { FiUser, FiMail, FiDollarSign, FiSave, FiCamera } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currency: 'USD',
    monthlyBudget: 0,
    budgetAlertThreshold: 80,
    emailNotifications: true
  });
  const [loading, setLoading] = useState(false);
  const [profilePic, setProfilePic] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        currency: user.currency || 'USD',
        monthlyBudget: user.monthlyBudget || 0,
        budgetAlertThreshold: user.budgetAlertThreshold || 80,
        emailNotifications: user.emailNotifications !== false
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await userAPI.updateProfile(formData);
      updateUser(res.data.data);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update profile');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfilePictureChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('profilePicture', file);

    try {
      const res = await userAPI.updateProfilePicture(formData);
      updateUser(res.data.data);
      toast.success('Profile picture updated');
    } catch (error) {
      toast.error('Failed to upload profile picture');
      console.error(error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Profile Settings</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage your account settings</p>
      </div>

      {/* Profile Picture */}
      <div className="card">
        <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Profile Picture</h3>
        <div className="flex items-center space-x-6">
          <div className="relative">
            {user?.profilePicture ? (
              <img
                src={user.profilePicture}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-primary-600 flex items-center justify-center text-white text-3xl font-bold">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            )}
            <label className="absolute bottom-0 right-0 p-2 bg-primary-600 rounded-full cursor-pointer hover:bg-primary-700 transition-colors">
              <FiCamera className="text-white" />
              <input
                type="file"
                accept="image/*"
                onChange={handleProfilePictureChange}
                className="hidden"
              />
            </label>
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-white">{user?.name}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Profile Information */}
      <form onSubmit={handleSubmit} className="card space-y-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Personal Information</h3>

        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <FiUser className="inline mr-2" /> Full Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="input-field"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <FiMail className="inline mr-2" /> Email Address
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="input-field"
          />
        </div>

        {/* Currency */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <FiDollarSign className="inline mr-2" /> Preferred Currency
          </label>
          <select
            name="currency"
            value={formData.currency}
            onChange={handleChange}
            className="input-field"
          >
            <option value="USD">USD - US Dollar ($)</option>
            <option value="EUR">EUR - Euro (€)</option>
            <option value="GBP">GBP - British Pound (£)</option>
            <option value="INR">INR - Indian Rupee (₹)</option>
            <option value="JPY">JPY - Japanese Yen (¥)</option>
            <option value="CNY">CNY - Chinese Yuan (¥)</option>
            <option value="AUD">AUD - Australian Dollar ($)</option>
            <option value="CAD">CAD - Canadian Dollar ($)</option>
          </select>
        </div>

        {/* Monthly Budget */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Monthly Budget
          </label>
          <input
            type="number"
            name="monthlyBudget"
            value={formData.monthlyBudget}
            onChange={handleChange}
            min="0"
            step="0.01"
            className="input-field"
          />
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Set your monthly expense limit
          </p>
        </div>

        {/* Budget Alert Threshold */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Budget Alert Threshold ({formData.budgetAlertThreshold}%)
          </label>
          <input
            type="range"
            name="budgetAlertThreshold"
            value={formData.budgetAlertThreshold}
            onChange={handleChange}
            min="0"
            max="100"
            className="w-full"
          />
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Get notified when you reach this percentage of your budget
          </p>
        </div>

        {/* Email Notifications */}
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            name="emailNotifications"
            checked={formData.emailNotifications}
            onChange={handleChange}
            className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
          />
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Enable email notifications
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="btn-primary flex items-center space-x-2 disabled:opacity-50"
        >
          <FiSave /> <span>{loading ? 'Saving...' : 'Save Changes'}</span>
        </button>
      </form>
    </div>
  );
};

export default Profile;
