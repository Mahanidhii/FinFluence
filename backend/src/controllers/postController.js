const { validationResult } = require('express-validator');
const Post = require('../models/Post');
const User = require('../models/User');

// @desc    Get feed posts
// @route   GET /api/posts/feed
// @access  Private
const getFeedPosts = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const userId = req.user.id;

    // Get user's following list
    const user = await User.findById(userId).select('following');
    const following = user.following || [];

    // Get posts from followed users and public posts
    const posts = await Post.getFeedPosts(userId, following, parseInt(page), parseInt(limit));

    res.json({
      success: true,
      posts,
      pagination: {
        currentPage: parseInt(page),
        limit: parseInt(limit),
        hasMore: posts.length === parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Get feed posts error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Create new post
// @route   POST /api/posts
// @access  Private
const createPost = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { type, content, tags, financialData, visibility, group, challenge } = req.body;

    const post = new Post({
      author: req.user.id,
      type,
      content,
      tags: tags || [],
      financialData,
      visibility: visibility || 'public',
      group,
      challenge
    });

    await post.save();
    await post.populate('author', 'firstName lastName avatar isVerified badges');

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      post
    });

  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get single post
// @route   GET /api/posts/:id
// @access  Public
const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'firstName lastName avatar isVerified badges')
      .populate('engagement.likes.user', 'firstName lastName avatar')
      .populate('engagement.comments.user', 'firstName lastName avatar')
      .populate('group', 'name')
      .populate('challenge', 'title');

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    res.json({
      success: true,
      post
    });

  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update post
// @route   PUT /api/posts/:id
// @access  Private
const updatePost = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Check if user owns the post
    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this post'
      });
    }

    const { content, tags, financialData, visibility } = req.body;

    // Update fields
    if (content) post.content = content;
    if (tags) post.tags = tags;
    if (financialData) post.financialData = financialData;
    if (visibility) post.visibility = visibility;

    post.isEdited = true;
    post.editedAt = new Date();

    await post.save();
    await post.populate('author', 'firstName lastName avatar isVerified badges');

    res.json({
      success: true,
      message: 'Post updated successfully',
      post
    });

  } catch (error) {
    console.error('Update post error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Delete post
// @route   DELETE /api/posts/:id
// @access  Private
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Check if user owns the post
    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this post'
      });
    }

    await Post.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Post deleted successfully'
    });

  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Like/Unlike post
// @route   POST /api/posts/:id/like
// @access  Private
const toggleLike = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    await post.likePost(req.user.id);
    
    const isLiked = post.engagement.likes.some(like => like.user.equals(req.user.id));

    res.json({
      success: true,
      message: isLiked ? 'Post liked' : 'Post unliked',
      isLiked,
      likeCount: post.engagement.likes.length
    });

  } catch (error) {
    console.error('Toggle like error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Add comment to post
// @route   POST /api/posts/:id/comment
// @access  Private
const addComment = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { content } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    await post.addComment(req.user.id, content);
    await post.populate('engagement.comments.user', 'firstName lastName avatar');

    const newComment = post.engagement.comments[post.engagement.comments.length - 1];

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      comment: newComment,
      commentCount: post.engagement.comments.length
    });

  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Share post
// @route   POST /api/posts/:id/share
// @access  Private
const sharePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    await post.sharePost(req.user.id);

    res.json({
      success: true,
      message: 'Post shared successfully',
      shareCount: post.engagement.shares.length
    });

  } catch (error) {
    console.error('Share post error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Save/Unsave post
// @route   POST /api/posts/:id/save
// @access  Private
const toggleSave = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    await post.savePost(req.user.id);
    
    const isSaved = post.engagement.saves.some(save => save.user.equals(req.user.id));

    res.json({
      success: true,
      message: isSaved ? 'Post saved' : 'Post unsaved',
      isSaved,
      saveCount: post.engagement.saves.length
    });

  } catch (error) {
    console.error('Toggle save error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get trending posts
// @route   GET /api/posts/trending
// @access  Public
const getTrendingPosts = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const posts = await Post.getTrendingPosts(parseInt(limit));

    res.json({
      success: true,
      posts
    });

  } catch (error) {
    console.error('Get trending posts error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get user's posts
// @route   GET /api/posts/user/:userId
// @access  Public
const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const posts = await Post.find({ author: userId })
      .populate('author', 'firstName lastName avatar isVerified badges')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({
      success: true,
      posts,
      pagination: {
        currentPage: parseInt(page),
        limit: parseInt(limit),
        hasMore: posts.length === parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Get user posts error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

module.exports = {
  getFeedPosts,
  createPost,
  getPost,
  updatePost,
  deletePost,
  toggleLike,
  addComment,
  sharePost,
  toggleSave,
  getTrendingPosts,
  getUserPosts
};