import React, { useState } from 'react';
import { Users, Search, Plus, TrendingUp, MessageCircle, Crown } from 'lucide-react';

const Groups = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [groups] = useState([
    {
      id: 1,
      name: 'Mumbai Investment Club',
      description: 'Discussing stock market trends and investment strategies for Mumbai-based investors',
      members: 1247,
      category: 'Investment',
      image: 'https://ui-avatars.com/api/?name=Mumbai+Investment&background=0ea5e9&color=fff',
      isJoined: true,
      isPopular: true,
      recentActivity: '2 new posts today'
    },
    {
      id: 2,
      name: 'Budget Masterminds',
      description: 'Share budgeting tips, expense tracking methods, and financial discipline strategies',
      members: 892,
      category: 'Budgeting',
      image: 'https://ui-avatars.com/api/?name=Budget+Masters&background=22c55e&color=fff',
      isJoined: true,
      isPopular: false,
      recentActivity: 'Active discussion on meal planning'
    },
    {
      id: 3,
      name: 'Crypto Enthusiasts India',
      description: 'Everything about cryptocurrency trading, DeFi, and blockchain technology in India',
      members: 2156,
      category: 'Cryptocurrency',
      image: 'https://ui-avatars.com/api/?name=Crypto+India&background=f59e0b&color=fff',
      isJoined: false,
      isPopular: true,
      recentActivity: '15 new members this week'
    },
    {
      id: 4,
      name: 'Women in Finance',
      description: 'Empowering women through financial literacy, investment guidance, and career growth',
      members: 756,
      category: 'Community',
      image: 'https://ui-avatars.com/api/?name=Women+Finance&background=8b5cf6&color=fff',
      isJoined: false,
      isPopular: false,
      recentActivity: 'Weekly mentor session tomorrow'
    },
    {
      id: 5,
      name: 'Real Estate Investors',
      description: 'Property investment strategies, market analysis, and REIT discussions',
      members: 634,
      category: 'Investment',
      image: 'https://ui-avatars.com/api/?name=Real+Estate&background=ef4444&color=fff',
      isJoined: true,
      isPopular: false,
      recentActivity: 'Property law updates shared'
    },
    {
      id: 6,
      name: 'Student Finance Hub',
      description: 'Financial guidance for students - scholarships, loans, part-time income, and budgeting',
      members: 1543,
      category: 'Education',
      image: 'https://ui-avatars.com/api/?name=Student+Finance&background=06b6d4&color=fff',
      isJoined: false,
      isPopular: true,
      recentActivity: 'Scholarship opportunities posted'
    }
  ]);

  const categories = ['all', 'Investment', 'Budgeting', 'Cryptocurrency', 'Community', 'Education'];

  const filteredGroups = activeTab === 'all' 
    ? groups 
    : groups.filter(group => group.category === activeTab);

  const handleJoinGroup = (groupId) => {
    // Handle join/leave group logic
    console.log('Toggle membership for group:', groupId);
  };

  return (
    <div className="p-6 pt-24 min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Investment Groups 👥
            </h1>
            <p className="text-gray-600 mt-2">
              Connect with like-minded investors and learn together
            </p>
          </div>
          <button className="btn-primary flex items-center">
            <Plus className="h-5 w-5 mr-2" />
            Create Group
          </button>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search groups by name or topic..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            
            {/* Category Tabs */}
            <div className="flex bg-white rounded-lg border border-gray-200 p-1">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveTab(category)}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === category
                      ? 'bg-primary-500 text-white'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  {category === 'all' ? 'All Groups' : category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Groups Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGroups.map((group) => (
            <div key={group.id} className="card">
              {/* Group Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <img
                    src={group.image}
                    alt={group.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-gray-900">{group.name}</h3>
                      {group.isPopular && (
                        <Crown className="h-4 w-4 text-warning-500" />
                      )}
                    </div>
                    <p className="text-sm text-gray-500">{group.members.toLocaleString()} members</p>
                  </div>
                </div>
                <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full">
                  {group.category}
                </span>
              </div>

              {/* Group Description */}
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {group.description}
              </p>

              {/* Recent Activity */}
              <div className="flex items-center text-sm text-gray-500 mb-4">
                <MessageCircle className="h-4 w-4 mr-1" />
                {group.recentActivity}
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2">
                <button
                  onClick={() => handleJoinGroup(group.id)}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                    group.isJoined
                      ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      : 'bg-primary-500 text-white hover:bg-primary-600'
                  }`}
                >
                  {group.isJoined ? 'Joined' : 'Join Group'}
                </button>
                <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                  View
                </button>
              </div>

              {/* Popular Badge */}
              {group.isPopular && (
                <div className="mt-2 text-center">
                  <span className="inline-flex items-center px-2 py-1 bg-warning-100 text-warning-700 text-xs rounded-full">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Trending
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* My Groups Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">My Groups</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {groups.filter(group => group.isJoined).map((group) => (
              <div key={group.id} className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-3 mb-3">
                  <img
                    src={group.image}
                    alt={group.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <h3 className="font-medium text-gray-900 text-sm">{group.name}</h3>
                    <p className="text-xs text-gray-500">{group.members.toLocaleString()} members</p>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                    Active
                  </span>
                  <button className="text-xs text-primary-600 hover:text-primary-500">
                    View Posts
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Group Suggestions */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Suggested for You</h2>
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {groups.filter(group => !group.isJoined).slice(0, 2).map((group) => (
                <div key={group.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <img
                    src={group.image}
                    alt={group.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{group.name}</h3>
                    <p className="text-sm text-gray-600">{group.members.toLocaleString()} members</p>
                  </div>
                  <button
                    onClick={() => handleJoinGroup(group.id)}
                    className="btn-primary text-sm"
                  >
                    Join
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Groups;