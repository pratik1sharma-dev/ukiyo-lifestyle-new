const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Question = require('../models/Question');
const { authenticateToken } = require('./auth');

// GET /api/questions/:productSlug - list questions for a product
router.get('/:productSlug', async (req, res) => {
  try {
    const { productSlug } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const product = await Product.findOne({ slug: productSlug, isActive: true }).select('_id');
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    const [items, total] = await Promise.all([
      Question.find({ product: product._id, isApproved: true })
        .sort({ createdAt: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum),
      Question.countDocuments({ product: product._id, isApproved: true })
    ]);

    res.json({
      success: true,
      data: {
        questions: items,
        pagination: {
          current: pageNum,
          total: Math.ceil(total / limitNum),
          count: total,
          hasNext: pageNum * limitNum < total,
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching questions', error: error.message });
  }
});

// POST /api/questions/:productSlug - submit a question (auth optional)
router.post('/:productSlug', async (req, res) => {
  try {
    const { productSlug } = req.params;
    const product = await Product.findOne({ slug: productSlug, isActive: true }).select('_id');
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const { question, name } = req.body;
    if (!question || String(question).trim().length === 0) {
      return res.status(400).json({ success: false, message: 'Question is required' });
    }

    const doc = await Question.create({
      product: product._id,
      user: req.user?._id,
      name: name || (req.user?.firstName ? `${req.user.firstName} ${req.user.lastName || ''}`.trim() : 'Anonymous'),
      question,
      isApproved: true,
      isAnswered: false,
    });

    res.status(201).json({ success: true, data: doc });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error submitting question', error: error.message });
  }
});

// POST /api/questions/:productSlug/:id/answer - answer a question (auth required)
router.post('/:productSlug/:id/answer', authenticateToken, async (req, res) => {
  try {
    const { productSlug, id } = req.params;
    const product = await Product.findOne({ slug: productSlug, isActive: true }).select('_id');
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const { answer } = req.body;
    if (!answer || String(answer).trim().length === 0) {
      return res.status(400).json({ success: false, message: 'Answer is required' });
    }

    const question = await Question.findOne({ _id: id, product: product._id });
    if (!question) {
      return res.status(404).json({ success: false, message: 'Question not found' });
    }

    question.answers.push({
      user: req.user?._id,
      name: req.user?.firstName ? `${req.user.firstName} ${req.user.lastName || ''}`.trim() : 'Anonymous',
      answer,
      isAdmin: req.user?.role === 'admin',
      createdAt: new Date(),
    });
    question.isAnswered = true;
    await question.save();

    res.status(201).json({ success: true, data: question });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error submitting answer', error: error.message });
  }
});

module.exports = router;