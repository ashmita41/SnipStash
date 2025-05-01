const express = require('express');
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth.middleware');
const Snippet = require('../models/snippet.model');

const router = express.Router();

// Validation middleware
const validateSnippet = [
  body('title').trim().notEmpty(),
  body('code').notEmpty(),
  body('language').isIn(['JavaScript', 'Python', 'Bash', 'Java', 'C++', 'HTML', 'CSS', 'TypeScript', 'Other'])
];

// Create snippet
router.post('/', auth, validateSnippet, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const snippet = new Snippet({
      ...req.body,
      userId: req.user._id
    });

    await snippet.save();
    res.status(201).json(snippet);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all snippets with filters
router.get('/', auth, async (req, res) => {
  try {
    const { tag, language, search } = req.query;
    const query = { userId: req.user._id };

    if (tag) {
      query.tags = tag;
    }

    if (language) {
      query.language = language;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { code: { $regex: search, $options: 'i' } }
      ];
    }

    const snippets = await Snippet.find(query).sort({ createdAt: -1 });
    res.json(snippets);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update snippet
router.put('/:id', auth, validateSnippet, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const snippet = await Snippet.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!snippet) {
      return res.status(404).json({ message: 'Snippet not found' });
    }

    Object.assign(snippet, req.body);
    await snippet.save();
    res.json(snippet);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete snippet
router.delete('/:id', auth, async (req, res) => {
  try {
    const snippet = await Snippet.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!snippet) {
      return res.status(404).json({ message: 'Snippet not found' });
    }

    res.json({ message: 'Snippet deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 