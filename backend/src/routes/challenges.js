const express = require('express');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/challenges
// @desc    Get all challenges
// @access  Public
router.get('/', (req, res) => {
  // Mock challenges data
  const challenges = [
    {
      id: '1',
      title: 'Save ₹20,000 in 30 Days',
      description: 'Challenge yourself to save ₹667 daily for a month. Track your progress and compete with friends!',
      type: 'savings',
      duration: '30 days',
      participants: 1247,
      prize: '₹5,000 bonus + Smart Saver badge',
      difficulty: 'Medium',
      startDate: '2024-01-01',
      endDate: '2024-01-31',
      progress: 0,
      isJoined: false,
      isPopular: true,
      requirements: ['Save minimum ₹500/day', 'Upload proof daily', 'No withdrawals during challenge']
    },
    {
      id: '2',
      title: 'Investment Challenge: ₹100/Day for 30 Days',
      description: 'Invest ₹100 daily in mutual funds or stocks. Learn about systematic investing!',
      type: 'investment',
      duration: '30 days',
      participants: 892,
      prize: 'Investment Pro badge + Portfolio review',
      difficulty: 'Easy',
      startDate: '2024-01-15',
      endDate: '2024-02-14',
      progress: 45,
      isJoined: false,
      isPopular: false,
      requirements: ['Invest minimum ₹100/day', 'Share weekly portfolio updates', 'Complete quiz modules']
    }
  ];

  res.json({
    success: true,
    challenges
  });
});

// @route   POST /api/challenges/:id/join
// @desc    Join challenge
// @access  Private
router.post('/:id/join', auth, (req, res) => {
  res.json({
    success: true,
    message: 'Challenge join endpoint - to be implemented'
  });
});

// @route   GET /api/challenges/leaderboard
// @desc    Get leaderboard
// @access  Public
router.get('/leaderboard', (req, res) => {
  const leaderboard = [
    { rank: 1, name: 'Priya Sharma', points: 2450, badge: '👑' },
    { rank: 2, name: 'Rajesh Kumar', points: 2380, badge: '🥈' },
    { rank: 3, name: 'Anita Desai', points: 2290, badge: '🥉' },
    { rank: 4, name: 'Demo User', points: 1920, badge: '' },
    { rank: 5, name: 'Suresh Patel', points: 1850, badge: '' },
  ];

  res.json({
    success: true,
    leaderboard
  });
});

module.exports = router;