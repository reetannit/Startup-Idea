const express = require('express');
const router = express.Router();
const Idea = require('../models/Idea');
const { analyzeIdea } = require('../services/aiService');

// POST /api/ideas — Create a new idea and trigger AI analysis
router.post('/', async (req, res) => {
  try {
    const { title, description } = req.body;

    // Validation
    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Title is required' });
    }
    if (!description || !description.trim()) {
      return res.status(400).json({ error: 'Description is required' });
    }
    if (title.trim().length > 200) {
      return res.status(400).json({ error: 'Title cannot exceed 200 characters' });
    }
    if (description.trim().length > 5000) {
      return res.status(400).json({ error: 'Description cannot exceed 5000 characters' });
    }

    // Create idea with pending status
    const idea = new Idea({
      title: title.trim(),
      description: description.trim(),
      status: 'analyzing'
    });
    await idea.save();

    // Return immediately with analyzing status
    res.status(201).json(idea);

    // Trigger AI analysis in background
    try {
      const report = await analyzeIdea(idea.title, idea.description);
      idea.report = report;
      idea.status = 'completed';
      await idea.save();
    } catch (aiError) {
      console.error('AI Analysis failed for idea:', idea._id, aiError.message);
      idea.status = 'failed';
      await idea.save();
    }

  } catch (error) {
    console.error('POST /api/ideas error:', error.message);
    res.status(500).json({ error: 'Failed to create idea' });
  }
});

// GET /api/ideas — Return all ideas (sorted by newest first)
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const [ideas, total] = await Promise.all([
      Idea.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('-__v'),
      Idea.countDocuments()
    ]);

    res.json({
      ideas,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('GET /api/ideas error:', error.message);
    res.status(500).json({ error: 'Failed to fetch ideas' });
  }
});

// GET /api/ideas/:id — Return a single idea with full report
router.get('/:id', async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id).select('-__v');
    if (!idea) {
      return res.status(404).json({ error: 'Idea not found' });
    }
    res.json(idea);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ error: 'Invalid idea ID' });
    }
    console.error('GET /api/ideas/:id error:', error.message);
    res.status(500).json({ error: 'Failed to fetch idea' });
  }
});

// DELETE /api/ideas/:id — Delete an idea
router.delete('/:id', async (req, res) => {
  try {
    const idea = await Idea.findByIdAndDelete(req.params.id);
    if (!idea) {
      return res.status(404).json({ error: 'Idea not found' });
    }
    res.json({ message: 'Idea deleted successfully' });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ error: 'Invalid idea ID' });
    }
    console.error('DELETE /api/ideas/:id error:', error.message);
    res.status(500).json({ error: 'Failed to delete idea' });
  }
});

module.exports = router;
