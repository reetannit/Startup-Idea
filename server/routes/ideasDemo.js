const express = require('express');
const router = express.Router();
const { analyzeIdeaMock } = require('../services/mockAiService');

// In-memory store for demo mode
let ideas = [];
let nextId = 1;

function generateId() {
  return (nextId++).toString().padStart(24, '0');
}

// Try real AI if configured, otherwise use mock
let analyzeIdea;
const isAIConfigured = process.env.OPENAI_API_KEY && !process.env.OPENAI_API_KEY.includes('your-openai');
if (isAIConfigured) {
  analyzeIdea = require('../services/aiService').analyzeIdea;
  console.log('🤖 Using OpenAI for analysis');
} else {
  analyzeIdea = analyzeIdeaMock;
  console.log('🎭 Using mock AI for analysis (demo mode)');
}

// POST /api/ideas
router.post('/', async (req, res) => {
  try {
    const { title, description } = req.body;

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

    const idea = {
      _id: generateId(),
      title: title.trim(),
      description: description.trim(),
      status: 'analyzing',
      report: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    ideas.unshift(idea);
    res.status(201).json(idea);

    // Background analysis
    try {
      const report = await analyzeIdea(idea.title, idea.description);
      idea.report = report;
      idea.status = 'completed';
      idea.updatedAt = new Date().toISOString();
    } catch (err) {
      console.error('AI Analysis failed:', err.message);
      idea.status = 'failed';
      idea.updatedAt = new Date().toISOString();
    }
  } catch (error) {
    console.error('POST /api/ideas error:', error.message);
    res.status(500).json({ error: 'Failed to create idea' });
  }
});

// GET /api/ideas
router.get('/', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const paginatedIdeas = ideas.slice(skip, skip + limit);

  res.json({
    ideas: paginatedIdeas,
    pagination: {
      page,
      limit,
      total: ideas.length,
      pages: Math.ceil(ideas.length / limit)
    }
  });
});

// GET /api/ideas/:id
router.get('/:id', (req, res) => {
  const idea = ideas.find(i => i._id === req.params.id);
  if (!idea) {
    return res.status(404).json({ error: 'Idea not found' });
  }
  res.json(idea);
});

// DELETE /api/ideas/:id
router.delete('/:id', (req, res) => {
  const index = ideas.findIndex(i => i._id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Idea not found' });
  }
  ideas.splice(index, 1);
  res.json({ message: 'Idea deleted successfully' });
});

module.exports = router;
