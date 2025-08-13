const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  name: { type: String, trim: true },
  answer: { type: String, required: true, trim: true, maxlength: 2000 },
  isAdmin: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const questionSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
    index: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  name: { type: String, trim: true },
  question: { type: String, required: true, trim: true, maxlength: 2000 },
  answers: [answerSchema],
  isAnswered: { type: Boolean, default: false },
  isApproved: { type: Boolean, default: true },
}, {
  timestamps: true,
});

questionSchema.index({ product: 1, createdAt: -1 });

module.exports = mongoose.model('Question', questionSchema);