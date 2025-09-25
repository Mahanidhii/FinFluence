const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['milestone', 'tip', 'challenge', 'reel', 'question', 'achievement'],
    required: true,
  },
  content: {
    type: String,
    required: true,
    maxlength: 2000,
  },
  media: [{
    type: {
      type: String,
      enum: ['image', 'video'],
    },
    url: String,
    thumbnail: String, // for videos
  }],
  tags: [String],
  financialData: {
    amount: Number,
    category: String,
    currency: { type: String, default: 'INR' },
    relatedGoal: String,
  },
  engagement: {
    likes: [{ 
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      createdAt: { type: Date, default: Date.now }
    }],
    comments: [{ 
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      content: String,
      createdAt: { type: Date, default: Date.now },
      likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
    }],
    shares: [{
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      createdAt: { type: Date, default: Date.now }
    }],
    saves: [{
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      createdAt: { type: Date, default: Date.now }
    }]
  },
  visibility: {
    type: String,
    enum: ['public', 'followers', 'friends', 'private'],
    default: 'public',
  },
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
    default: null,
  },
  challenge: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Challenge',
    default: null,
  },
  isEdited: {
    type: Boolean,
    default: false,
  },
  editedAt: Date,
  isReported: {
    type: Boolean,
    default: false,
  },
  reports: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reason: String,
    createdAt: { type: Date, default: Date.now }
  }],
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for like count
postSchema.virtual('likeCount').get(function() {
  return this.engagement.likes.length;
});

// Virtual for comment count
postSchema.virtual('commentCount').get(function() {
  return this.engagement.comments.length;
});

// Virtual for share count
postSchema.virtual('shareCount').get(function() {
  return this.engagement.shares.length;
});

// Virtual for save count
postSchema.virtual('saveCount').get(function() {
  return this.engagement.saves.length;
});

// Index for better query performance
postSchema.index({ author: 1, createdAt: -1 });
postSchema.index({ type: 1, createdAt: -1 });
postSchema.index({ tags: 1 });
postSchema.index({ 'engagement.likes.user': 1 });
postSchema.index({ group: 1, createdAt: -1 });
postSchema.index({ challenge: 1, createdAt: -1 });

// Instance method to like post
postSchema.methods.likePost = function(userId) {
  const existingLike = this.engagement.likes.find(like => like.user.equals(userId));
  if (existingLike) {
    // Unlike
    this.engagement.likes = this.engagement.likes.filter(like => !like.user.equals(userId));
  } else {
    // Like
    this.engagement.likes.push({ user: userId });
  }
  return this.save();
};

// Instance method to add comment
postSchema.methods.addComment = function(userId, content) {
  this.engagement.comments.push({ user: userId, content });
  return this.save();
};

// Instance method to share post
postSchema.methods.sharePost = function(userId) {
  const existingShare = this.engagement.shares.find(share => share.user.equals(userId));
  if (!existingShare) {
    this.engagement.shares.push({ user: userId });
    return this.save();
  }
  return Promise.resolve(this);
};

// Instance method to save post
postSchema.methods.savePost = function(userId) {
  const existingSave = this.engagement.saves.find(save => save.user.equals(userId));
  if (existingSave) {
    // Unsave
    this.engagement.saves = this.engagement.saves.filter(save => !save.user.equals(userId));
  } else {
    // Save
    this.engagement.saves.push({ user: userId });
  }
  return this.save();
};

// Static method to get trending posts
postSchema.statics.getTrendingPosts = function(limit = 10) {
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  
  return this.aggregate([
    { $match: { createdAt: { $gte: oneDayAgo } } },
    {
      $addFields: {
        engagementScore: {
          $add: [
            { $multiply: [{ $size: '$engagement.likes' }, 1] },
            { $multiply: [{ $size: '$engagement.comments' }, 2] },
            { $multiply: [{ $size: '$engagement.shares' }, 3] }
          ]
        }
      }
    },
    { $sort: { engagementScore: -1 } },
    { $limit: limit },
    {
      $lookup: {
        from: 'users',
        localField: 'author',
        foreignField: '_id',
        as: 'author'
      }
    },
    { $unwind: '$author' }
  ]);
};

// Static method to get feed posts for user
postSchema.statics.getFeedPosts = function(userId, following, page = 1, limit = 10) {
  const skip = (page - 1) * limit;
  
  return this.find({
    $or: [
      { author: { $in: following } },
      { author: userId },
      { visibility: 'public', type: { $in: ['tip', 'reel'] } }
    ]
  })
  .populate('author', 'firstName lastName avatar isVerified badges')
  .populate('group', 'name')
  .populate('challenge', 'title')
  .sort({ createdAt: -1 })
  .skip(skip)
  .limit(limit);
};

module.exports = mongoose.model('Post', postSchema);