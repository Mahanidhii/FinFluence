const express = require('express');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/groups
// @desc    Get all groups
// @access  Public
router.get('/', (req, res) => {
  // Mock groups data
  const groups = [
    {
      id: '1',
      name: 'Mumbai Investment Club',
      description: 'Discussing stock market trends and investment strategies for Mumbai-based investors',
      members: 1247,
      category: 'Investment',
      image: 'https://ui-avatars.com/api/?name=Mumbai+Investment&background=0ea5e9&color=fff',
      isJoined: false,
      isPopular: true,
      recentActivity: '2 new posts today'
    },
    {
      id: '2',
      name: 'Budget Masterminds',
      description: 'Share budgeting tips, expense tracking methods, and financial discipline strategies',
      members: 892,
      category: 'Budgeting',
      image: 'https://ui-avatars.com/api/?name=Budget+Masters&background=22c55e&color=fff',
      isJoined: false,
      isPopular: false,
      recentActivity: 'Active discussion on meal planning'
    }
  ];

  res.json({
    success: true,
    groups
  });
});

// @route   POST /api/groups/:id/join
// @desc    Join/Leave group
// @access  Private
router.post('/:id/join', auth, (req, res) => {
  res.json({
    success: true,
    message: 'Group join/leave endpoint - to be implemented'
  });
});

module.exports = router;