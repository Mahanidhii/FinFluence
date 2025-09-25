import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  TrendingUp, 
  Award,
  Video,
  Play,
  Camera,
  Image
} from 'lucide-react';

const Feed = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [showCreatePost, setShowCreatePost] = useState(false);

  // Mock posts data
  useEffect(() => {
    setPosts([
      {
        id: 1,
        user: {
          name: 'Priya Sharma',
          avatar: 'https://ui-avatars.com/api/?name=Priya+Sharma&background=0ea5e9&color=fff',
          verified: false,
          badges: ['Smart Saver']
        },
        type: 'milestone',
        content: 'Just hit my first ₹1,00,000 savings milestone! 🎉 Started with just ₹500 per month. Consistency is key! #SavingsGoal #FinancialFreedom',
        image: null,
        timestamp: '2 hours ago',
        likes: 24,
        comments: 8,
        shares: 3,
        liked: false
      },
      {
        id: 2,
        user: {
          name: 'Rajesh Kumar',
          avatar: 'https://ui-avatars.com/api/?name=Rajesh+Kumar&background=22c55e&color=fff',
          verified: true,
          badges: ['Investment Pro', 'Finance Mentor']
        },
        type: 'tip',
        content: '💡 Pro Tip: Dollar-cost averaging in mutual funds can reduce your investment risk significantly. Don\'t try to time the market - time IN the market is what matters! 📈',
        image: null,
        timestamp: '4 hours ago',
        likes: 156,
        comments: 32,
        shares: 45,
        liked: true
      },
      {
        id: 3,
        user: {
          name: 'Anita Desai',
          avatar: 'https://ui-avatars.com/api/?name=Anita+Desai&background=f59e0b&color=fff',
          verified: false,
          badges: ['Budget Boss']
        },
        type: 'challenge',
        content: 'Week 2 of the "No Unnecessary Spending" challenge! Saved ₹2,400 so far by cooking at home and avoiding impulse purchases. Who else is taking this challenge? 💪',
        image: '/api/placeholder/400/200',
        timestamp: '6 hours ago',
        likes: 89,
        comments: 23,
        shares: 12,
        liked: false
      },
      {
        id: 4,
        user: {
          name: 'FinFluence Tips',
          avatar: 'https://ui-avatars.com/api/?name=FinFluence&background=8b5cf6&color=fff',
          verified: true,
          badges: ['Official']
        },
        type: 'reel',
        content: '📹 Financial Reel: "Compound Interest Explained in 30 Seconds" - Watch how ₹10,000 becomes ₹1,61,051 in 20 years at 15% annual return! 🤯',
        video: true,
        timestamp: '1 day ago',
        likes: 342,
        comments: 67,
        shares: 89,
        liked: true
      }
    ]);
  }, []);

  const handleLike = (postId) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 }
        : post
    ));
  };

  const handleCreatePost = () => {
    if (newPost.trim()) {
      const post = {
        id: Date.now(),
        user: {
          name: `${user.firstName} ${user.lastName}`,
          avatar: user.avatar || `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=0ea5e9&color=fff`,
          verified: false,
          badges: ['Smart Saver']
        },
        type: 'milestone',
        content: newPost,
        image: null,
        timestamp: 'Just now',
        likes: 0,
        comments: 0,
        shares: 0,
        liked: false
      };
      setPosts([post, ...posts]);
      setNewPost('');
      setShowCreatePost(false);
    }
  };

  const getPostIcon = (type) => {
    switch (type) {
      case 'milestone': return <Award className="h-5 w-5 text-warning-500" />;
      case 'tip': return <TrendingUp className="h-5 w-5 text-primary-500" />;
      case 'challenge': return <Award className="h-5 w-5 text-success-500" />;
      case 'reel': return <Video className="h-5 w-5 text-purple-500" />;
      default: return <TrendingUp className="h-5 w-5 text-primary-500" />;
    }
  };

  return (
    <div className="p-6 pt-24 min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Financial Feed 📈
          </h1>
          <p className="text-gray-600 mt-2">
            Share your journey, learn from others
          </p>
        </div>

        {/* Create Post */}
        <div className="card mb-6">
          <div className="flex items-center space-x-3">
            <img
              className="h-10 w-10 rounded-full"
              src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.firstName}+${user?.lastName}&background=0ea5e9&color=fff`}
              alt={user?.firstName}
            />
            <button
              onClick={() => setShowCreatePost(true)}
              className="flex-1 text-left px-4 py-2 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200 transition-colors"
            >
              Share a financial milestone...
            </button>
          </div>

          {showCreatePost && (
            <div className="mt-4">
              <textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="Share your financial journey, milestone, or tip..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                rows="3"
              />
              <div className="flex items-center justify-between mt-3">
                <div className="flex space-x-2">
                  <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
                    <Image className="h-5 w-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
                    <Camera className="h-5 w-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
                    <Video className="h-5 w-5" />
                  </button>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setShowCreatePost(false)}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreatePost}
                    disabled={!newPost.trim()}
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Share
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Posts */}
        <div className="space-y-6">
          {posts.map((post) => (
            <div key={post.id} className="card">
              {/* Post Header */}
              <div className="flex items-center space-x-3 mb-4">
                <img
                  className="h-10 w-10 rounded-full"
                  src={post.user.avatar}
                  alt={post.user.name}
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold text-gray-900">{post.user.name}</h3>
                    {post.user.verified && (
                      <div className="w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                    {getPostIcon(post.type)}
                  </div>
                  <div className="flex items-center space-x-2 mt-1">
                    <p className="text-sm text-gray-500">{post.timestamp}</p>
                    <div className="flex space-x-1">
                      {post.user.badges.map((badge, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full"
                        >
                          {badge}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Post Content */}
              <div className="mb-4">
                <p className="text-gray-900 leading-relaxed">{post.content}</p>
              </div>

              {/* Post Media */}
              {post.image && (
                <div className="mb-4">
                  <img
                    src={post.image}
                    alt="Post content"
                    className="w-full rounded-lg"
                  />
                </div>
              )}

              {post.video && (
                <div className="mb-4 bg-gray-100 rounded-lg p-8 flex items-center justify-center">
                  <button className="flex items-center space-x-2 bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600">
                    <Play className="h-5 w-5" />
                    <span>Play Reel</span>
                  </button>
                </div>
              )}

              {/* Post Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex space-x-6">
                  <button
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center space-x-2 ${
                      post.liked ? 'text-red-500' : 'text-gray-500'
                    } hover:text-red-500`}
                  >
                    <Heart className={`h-5 w-5 ${post.liked ? 'fill-current' : ''}`} />
                    <span className="text-sm">{post.likes}</span>
                  </button>
                  
                  <button className="flex items-center space-x-2 text-gray-500 hover:text-primary-500">
                    <MessageCircle className="h-5 w-5" />
                    <span className="text-sm">{post.comments}</span>
                  </button>
                  
                  <button className="flex items-center space-x-2 text-gray-500 hover:text-green-500">
                    <Share2 className="h-5 w-5" />
                    <span className="text-sm">{post.shares}</span>
                  </button>
                </div>

                <button className="text-sm text-primary-600 hover:text-primary-500 font-medium">
                  Save Post
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-8">
          <button className="btn-secondary">
            Load More Posts
          </button>
        </div>
      </div>
    </div>
  );
};

export default Feed;