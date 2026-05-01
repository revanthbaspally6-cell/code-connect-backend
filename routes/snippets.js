const express = require('express');
const Snippet = require('../models/Snippet');
const User = require('../models/User');
const { auth, optionalAuth } = require('../middleware/auth');
const router = express.Router();

// @route   GET /api/snippets
// @desc    Get all public snippets with pagination and filtering
router.get('/', optionalAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const { language, search, tags, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    
    // Build query
    const query = { isPublic: true, isDeleted: false };
    
    if (language && language !== 'all') {
      query.language = language;
    }
    
    if (search) {
      query.$text = { $search: search };
    }
    
    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim());
      query.tags = { $in: tagArray };
    }
    
    // Sort options
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
    
    const snippets = await Snippet.find(query)
      .populate('author', 'username avatar')
      .populate('likes', 'username')
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);
    
    const total = await Snippet.countDocuments(query);
    
    res.json({
      snippets,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get snippets error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/snippets/:id
// @desc    Get single snippet by ID
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const snippet = await Snippet.findById(req.params.id)
      .populate('author', 'username avatar bio')
      .populate('likes', 'username avatar')
      .populate({
        path: 'comments',
        populate: {
          path: 'author',
          select: 'username avatar'
        }
      });
    
    if (!snippet || snippet.isDeleted) {
      return res.status(404).json({ message: 'Snippet not found' });
    }
    
    // Check if snippet is private and user is not the author
    if (!snippet.isPublic && (!req.user || req.user.id !== snippet.author._id.toString())) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    // Increment views
    await snippet.incrementViews();
    
    res.json(snippet);
  } catch (error) {
    console.error('Get snippet error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/snippets
// @desc    Create a new snippet
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, code, language, tags, isPublic = true } = req.body;
    
    if (!title || !description || !code || !language) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }
    
    const snippet = new Snippet({
      title,
      description,
      code,
      language,
      tags: tags ? tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
      author: req.user.id,
      isPublic
    });
    
    await snippet.save();
    
    // Add snippet to user's snippets
    await User.findByIdAndUpdate(req.user.id, {
      $push: { snippets: snippet._id }
    });
    
    const populatedSnippet = await Snippet.findById(snippet._id)
      .populate('author', 'username avatar');
    
    res.status(201).json({
      message: 'Snippet created successfully',
      snippet: populatedSnippet
    });
  } catch (error) {
    console.error('Create snippet error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/snippets/:id
// @desc    Update a snippet
router.put('/:id', auth, async (req, res) => {
  try {
    const snippet = await Snippet.findById(req.params.id);
    
    if (!snippet || snippet.isDeleted) {
      return res.status(404).json({ message: 'Snippet not found' });
    }
    
    // Check if user is the author
    if (snippet.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const { title, description, code, language, tags, isPublic } = req.body;
    
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (code !== undefined) updateData.code = code;
    if (language !== undefined) updateData.language = language;
    if (tags !== undefined) updateData.tags = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
    if (isPublic !== undefined) updateData.isPublic = isPublic;
    
    const updatedSnippet = await Snippet.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('author', 'username avatar');
    
    res.json({
      message: 'Snippet updated successfully',
      snippet: updatedSnippet
    });
  } catch (error) {
    console.error('Update snippet error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/snippets/:id
// @desc    Delete a snippet (soft delete)
router.delete('/:id', auth, async (req, res) => {
  try {
    const snippet = await Snippet.findById(req.params.id);
    
    if (!snippet || snippet.isDeleted) {
      return res.status(404).json({ message: 'Snippet not found' });
    }
    
    // Check if user is the author
    if (snippet.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    snippet.isDeleted = true;
    await snippet.save();
    
    // Remove snippet from user's snippets
    await User.findByIdAndUpdate(req.user.id, {
      $pull: { snippets: snippet._id }
    });
    
    res.json({ message: 'Snippet deleted successfully' });
  } catch (error) {
    console.error('Delete snippet error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/snippets/:id/like
// @desc    Like/unlike a snippet
router.post('/:id/like', auth, async (req, res) => {
  try {
    const snippet = await Snippet.findById(req.params.id);
    
    if (!snippet || snippet.isDeleted) {
      return res.status(404).json({ message: 'Snippet not found' });
    }
    
    const userId = req.user.id;
    const isLiked = snippet.likes.includes(userId);
    
    if (isLiked) {
      // Unlike
      snippet.likes.pull(userId);
      await User.findByIdAndUpdate(userId, {
        $pull: { likedSnippets: snippet._id }
      });
    } else {
      // Like
      snippet.likes.push(userId);
      await User.findByIdAndUpdate(userId, {
        $push: { likedSnippets: snippet._id }
      });
    }
    
    await snippet.save();
    
    res.json({
      message: isLiked ? 'Snippet unliked' : 'Snippet liked',
      likesCount: snippet.getLikesCount(),
      isLiked: !isLiked
    });
  } catch (error) {
    console.error('Like snippet error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/snippets/user/:userId
// @desc    Get snippets by user
router.get('/user/:userId', optionalAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const { userId } = req.params;
    
    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Build query - show public snippets or all if it's the user's own profile
    const query = { 
      author: userId, 
      isDeleted: false 
    };
    
    if (!req.user || req.user.id !== userId) {
      query.isPublic = true;
    }
    
    const snippets = await Snippet.find(query)
      .populate('author', 'username avatar')
      .populate('likes', 'username')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Snippet.countDocuments(query);
    
    res.json({
      snippets,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      user: {
        id: user._id,
        username: user.username,
        avatar: user.avatar,
        bio: user.bio
      }
    });
  } catch (error) {
    console.error('Get user snippets error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
