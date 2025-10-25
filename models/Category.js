import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a category name'],
    trim: true
  },
  type: {
    type: String,
    enum: ['income', 'expense'],
    required: [true, 'Please specify category type']
  },
  icon: {
    type: String,
    default: '💰'
  },
  color: {
    type: String,
    default: '#3B82F6'
  },
  isDefault: {
    type: Boolean,
    default: false
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // null for default categories
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Create index for faster queries
categorySchema.index({ user: 1, type: 1 });

export default mongoose.model('Category', categorySchema);
