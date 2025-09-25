const express = require('express');
const { body } = require('express-validator');
const {
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
} = require('../controllers/postController');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/posts/feed
// @desc    Get feed posts
// @access  Private
router.get('/feed', auth, getFeedPosts);

// @route   GET /api/posts/trending
// @desc    Get trending posts
// @access  Public
router.get('/trending', getTrendingPosts);

// @route   GET /api/posts/user/:userId
// @desc    Get user's posts
// @access  Public
router.get('/user/:userId', getUserPosts);

// @route   POST /api/posts
// @desc    Create new post
// @access  Private
router.post('/', [
  auth,
  body('type')
    .isIn(['milestone', 'tip', 'challenge', 'reel', 'question', 'achievement'])
    .withMessage('Invalid post type'),
  
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Content is required')
    .isLength({ max: 2000 })
    .withMessage('Content must not exceed 2000 characters'),
  
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  
  body('visibility')
    .optional()
    .isIn(['public', 'followers', 'friends', 'private'])
    .withMessage('Invalid visibility option')
], createPost);

// @route   GET /api/posts/:id
// @desc    Get single post
// @access  Public
router.get('/:id', getPost);

// @route   PUT /api/posts/:id
// @desc    Update post
// @access  Private
router.put('/:id', [
  auth,
  body('content')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Content cannot be empty')
    .isLength({ max: 2000 })
    .withMessage('Content must not exceed 2000 characters'),
  
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  
  body('visibility')
    .optional()
    .isIn(['public', 'followers', 'friends', 'private'])
    .withMessage('Invalid visibility option')
], updatePost);

// @route   DELETE /api/posts/:id
// @desc    Delete post
// @access  Private
router.delete('/:id', auth, deletePost);

// @route   POST /api/posts/:id/like
// @desc    Like/Unlike post
// @access  Private
router.post('/:id/like', auth, toggleLike);

// @route   POST /api/posts/:id/comment
// @desc    Add comment to post
// @access  Private
router.post('/:id/comment', [
  auth,
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Comment content is required')
    .isLength({ max: 500 })
    .withMessage('Comment must not exceed 500 characters')
], addComment);

// @route   POST /api/posts/:id/share
// @desc    Share post
// @access  Private
router.post('/:id/share', auth, sharePost);

// @route   POST /api/posts/:id/save
// @desc    Save/Unsave post
// @access  Private
router.post('/:id/save', auth, toggleSave);

module.exports = router;