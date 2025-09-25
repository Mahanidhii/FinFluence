const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
    select: false // Don't include password in queries by default
  },
  phoneNumber: {
    type: String,
    trim: true,
  },
  dateOfBirth: {
    type: Date,
  },
  avatar: {
    type: String,
    default: null,
  },
  bio: {
    type: String,
    maxlength: 500,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isExpert: {
    type: Boolean,
    default: false,
  },
  badges: [{
    name: String,
    earnedAt: { type: Date, default: Date.now },
    description: String,
  }],
  stats: {
    totalSavings: { type: Number, default: 0 },
    totalInvestments: { type: Number, default: 0 },
    savingsStreak: { type: Number, default: 0 },
    challengesCompleted: { type: Number, default: 0 },
    rank: { type: Number, default: 0 },
  },
  preferences: {
    currency: { type: String, default: 'INR' },
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      challenges: { type: Boolean, default: true },
      social: { type: Boolean, default: true },
    },
    privacy: {
      profilePublic: { type: Boolean, default: true },
      showStats: { type: Boolean, default: true },
      allowMessages: { type: Boolean, default: true },
    }
  },
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  groups: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Group' }],
  challenges: [{
    challenge: { type: mongoose.Schema.Types.ObjectId, ref: 'Challenge' },
    joinedAt: { type: Date, default: Date.now },
    progress: { type: Number, default: 0 },
    completed: { type: Boolean, default: false },
  }],
  lastActive: {
    type: Date,
    default: Date.now,
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  emailVerificationToken: String,
  emailVerificationExpires: Date,
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for follower count
userSchema.virtual('followerCount').get(function() {
  return this.followers.length;
});

// Virtual for following count
userSchema.virtual('followingCount').get(function() {
  return this.following.length;
});

// Index for better query performance
userSchema.index({ email: 1 });
userSchema.index({ firstName: 1, lastName: 1 });
userSchema.index({ 'stats.rank': -1 });

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();

  try {
    // Hash password with cost of 12
    const hashedPassword = await bcrypt.hash(this.password, 12);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

// Instance method to check password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Instance method to add badge
userSchema.methods.addBadge = function(name, description) {
  const existingBadge = this.badges.find(badge => badge.name === name);
  if (!existingBadge) {
    this.badges.push({ name, description });
    return this.save();
  }
  return Promise.resolve(this);
};

// Instance method to follow user
userSchema.methods.followUser = function(userId) {
  if (!this.following.includes(userId)) {
    this.following.push(userId);
    return this.save();
  }
  return Promise.resolve(this);
};

// Instance method to unfollow user
userSchema.methods.unfollowUser = function(userId) {
  this.following = this.following.filter(id => !id.equals(userId));
  return this.save();
};

// Static method to find users by name
userSchema.statics.findByName = function(name) {
  const regex = new RegExp(name, 'i');
  return this.find({
    $or: [
      { firstName: regex },
      { lastName: regex },
      { $expr: { $regexMatch: { input: { $concat: ['$firstName', ' ', '$lastName'] }, regex: name, options: 'i' } } }
    ]
  });
};

module.exports = mongoose.model('User', userSchema);