const mongoose = require('mongoose');

const challengeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    maxlength: 1000,
  },
  type: {
    type: String,
    enum: ['savings', 'investment', 'budgeting', 'education', 'custom'],
    required: true,
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    required: true,
  },
  duration: {
    value: { type: Number, required: true }, // in days
    unit: { type: String, default: 'days' },
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  requirements: [{
    type: String,
    required: true,
  }],
  goals: {
    targetAmount: Number,
    dailyAmount: Number,
    currency: { type: String, default: 'INR' },
    category: String,
  },
  rewards: {
    badge: {
      name: String,
      description: String,
      icon: String,
    },
    cashReward: Number,
    points: Number,
    other: String,
  },
  participants: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    joinedAt: { type: Date, default: Date.now },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    completed: { type: Boolean, default: false },
    completedAt: Date,
    dailyLogs: [{
      date: Date,
      amount: Number,
      proof: String, // URL to proof image/document
      verified: { type: Boolean, default: false }
    }],
    rank: Number,
  }],
  leaderboard: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    score: Number,
    rank: Number,
  }],
  rules: [{
    type: String,
    required: true,
  }],
  isActive: {
    type: Boolean,
    default: true,
  },
  isPublic: {
    type: Boolean,
    default: true,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  category: {
    type: String,
    enum: ['personal-finance', 'investment', 'savings', 'budgeting', 'debt-management', 'side-hustle'],
  },
  tags: [String],
  media: {
    banner: String,
    gallery: [String],
  },
  stats: {
    totalParticipants: { type: Number, default: 0 },
    completionRate: { type: Number, default: 0 },
    averageProgress: { type: Number, default: 0 },
    totalAmountSaved: { type: Number, default: 0 },
  },
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
    default: null,
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for participant count
challengeSchema.virtual('participantCount').get(function() {
  return this.participants.length;
});

// Virtual for days remaining
challengeSchema.virtual('daysRemaining').get(function() {
  const now = new Date();
  const end = new Date(this.endDate);
  const diffTime = end - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
});

// Virtual for status
challengeSchema.virtual('status').get(function() {
  const now = new Date();
  const start = new Date(this.startDate);
  const end = new Date(this.endDate);
  
  if (now < start) return 'upcoming';
  if (now > end) return 'completed';
  return 'active';
});

// Index for better query performance
challengeSchema.index({ type: 1, isActive: 1 });
challengeSchema.index({ startDate: 1, endDate: 1 });
challengeSchema.index({ 'participants.user': 1 });
challengeSchema.index({ creator: 1 });
challengeSchema.index({ isFeatured: 1, isActive: 1 });

// Pre-save middleware to update stats
challengeSchema.pre('save', function(next) {
  if (this.isModified('participants')) {
    this.stats.totalParticipants = this.participants.length;
    
    const completedParticipants = this.participants.filter(p => p.completed).length;
    this.stats.completionRate = this.participants.length > 0 
      ? (completedParticipants / this.participants.length) * 100 
      : 0;
    
    const totalProgress = this.participants.reduce((sum, p) => sum + p.progress, 0);
    this.stats.averageProgress = this.participants.length > 0 
      ? totalProgress / this.participants.length 
      : 0;
  }
  next();
});

// Instance method to join challenge
challengeSchema.methods.joinChallenge = function(userId) {
  const existingParticipant = this.participants.find(p => p.user.equals(userId));
  if (!existingParticipant) {
    this.participants.push({ user: userId });
    return this.save();
  }
  return Promise.resolve(this);
};

// Instance method to leave challenge
challengeSchema.methods.leaveChallenge = function(userId) {
  this.participants = this.participants.filter(p => !p.user.equals(userId));
  return this.save();
};

// Instance method to update progress
challengeSchema.methods.updateProgress = function(userId, progress, dailyLog) {
  const participant = this.participants.find(p => p.user.equals(userId));
  if (participant) {
    participant.progress = Math.min(Math.max(progress, 0), 100);
    
    if (dailyLog) {
      participant.dailyLogs.push(dailyLog);
    }
    
    if (progress >= 100 && !participant.completed) {
      participant.completed = true;
      participant.completedAt = new Date();
    }
    
    return this.save();
  }
  return Promise.resolve(this);
};

// Instance method to update leaderboard
challengeSchema.methods.updateLeaderboard = function() {
  const rankedParticipants = this.participants
    .map(p => ({
      user: p.user,
      score: p.progress,
      completedAt: p.completedAt
    }))
    .sort((a, b) => {
      if (a.score !== b.score) return b.score - a.score;
      if (a.completedAt && b.completedAt) return a.completedAt - b.completedAt;
      return 0;
    })
    .map((p, index) => ({
      user: p.user,
      score: p.score,
      rank: index + 1
    }));
  
  this.leaderboard = rankedParticipants;
  return this.save();
};

// Static method to get active challenges
challengeSchema.statics.getActiveChallenges = function() {
  const now = new Date();
  return this.find({
    isActive: true,
    startDate: { $lte: now },
    endDate: { $gte: now }
  }).populate('creator', 'firstName lastName avatar');
};

// Static method to get featured challenges
challengeSchema.statics.getFeaturedChallenges = function() {
  return this.find({
    isFeatured: true,
    isActive: true
  }).populate('creator', 'firstName lastName avatar');
};

// Static method to get user's challenges
challengeSchema.statics.getUserChallenges = function(userId) {
  return this.find({
    'participants.user': userId
  }).populate('creator', 'firstName lastName avatar');
};

module.exports = mongoose.model('Challenge', challengeSchema);