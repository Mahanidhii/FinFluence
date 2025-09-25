import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Award, TrendingUp, Target, Users, Edit, Camera, Calendar } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();

  const achievements = [
    { id: 1, name: 'Smart Saver', description: 'Saved for 15 days straight', icon: '💰', earned: true },
    { id: 2, name: 'Investment Rookie', description: 'Made your first investment', icon: '📈', earned: true },
    { id: 3, name: 'Budget Boss', description: 'Stayed within budget for a month', icon: '📊', earned: false },
    { id: 4, name: 'Finance Guru', description: 'Completed 10 learning modules', icon: '🎓', earned: false },
  ];

  const stats = [
    { label: 'Total Savings', value: '₹1,24,500', change: '+12%', color: 'text-green-600' },
    { label: 'Investments', value: '₹85,600', change: '+5.2%', color: 'text-blue-600' },
    { label: 'Challenges Won', value: '12', change: '+3', color: 'text-purple-600' },
    { label: 'Savings Streak', value: '15 days', change: 'Current', color: 'text-orange-600' },
  ];

  const recentActivity = [
    { type: 'milestone', message: 'Completed "Save ₹20,000" challenge', time: '2 days ago' },
    { type: 'investment', message: 'Invested ₹5,000 in mutual funds', time: '5 days ago' },
    { type: 'social', message: 'Shared expense prediction on feed', time: '1 week ago' },
    { type: 'achievement', message: 'Earned "Smart Saver" badge', time: '2 weeks ago' },
  ];

  return (
    <div className="p-6 pt-24 min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="card mb-8">
          <div className="relative">
            {/* Cover Photo */}
            <div className="h-32 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg mb-4 relative">
              <button className="absolute top-4 right-4 p-2 bg-black bg-opacity-20 rounded-full text-white hover:bg-opacity-40">
                <Camera className="h-4 w-4" />
              </button>
            </div>
            
            {/* Profile Info */}
            <div className="flex items-start space-x-6">
              <div className="relative -mt-16">
                <img
                  className="h-24 w-24 rounded-full border-4 border-white"
                  src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.firstName}+${user?.lastName}&background=0ea5e9&color=fff&size=128`}
                  alt={user?.firstName}
                />
                <button className="absolute bottom-0 right-0 p-1 bg-primary-500 rounded-full text-white hover:bg-primary-600">
                  <Camera className="h-3 w-3" />
                </button>
              </div>
              
              <div className="flex-1 pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                      {user?.firstName} {user?.lastName}
                    </h1>
                    <p className="text-gray-600">@{user?.firstName?.toLowerCase()}{user?.lastName?.toLowerCase()}</p>
                    <div className="flex items-center mt-2 text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      Joined December 2023
                    </div>
                  </div>
                  <button className="btn-secondary flex items-center">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </button>
                </div>
                
                <div className="flex items-center space-x-6 mt-4">
                  <div className="text-center">
                    <p className="text-xl font-bold text-gray-900">156</p>
                    <p className="text-sm text-gray-600">Following</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold text-gray-900">892</p>
                    <p className="text-sm text-gray-600">Followers</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold text-gray-900">247</p>
                    <p className="text-sm text-gray-600">Rank</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Bio */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-gray-700">
              📈 Passionate about personal finance and investing | 💰 Building wealth one rupee at a time | 
              🎯 Current goal: Save ₹5,00,000 by 2024 | 📚 Learning about mutual funds and SIPs
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Financial Stats */}
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Financial Overview</h2>
              <div className="grid grid-cols-2 gap-4">
                {stats.map((stat, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                    <p className={`text-sm mt-1 ${stat.color}`}>{stat.change}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Activity</h2>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="p-2 bg-primary-100 rounded-full">
                      {activity.type === 'milestone' && <Target className="h-4 w-4 text-primary-600" />}
                      {activity.type === 'investment' && <TrendingUp className="h-4 w-4 text-primary-600" />}
                      {activity.type === 'social' && <Users className="h-4 w-4 text-primary-600" />}
                      {activity.type === 'achievement' && <Award className="h-4 w-4 text-primary-600" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-900">{activity.message}</p>
                      <p className="text-sm text-gray-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Posts */}
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">My Posts</h2>
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <p className="text-gray-900 mb-3">
                    Just completed my first month of systematic investing! 📈 Invested ₹10,000 in diversified mutual funds. 
                    The power of compounding is real! 💪 #InvestmentJourney #MutualFunds
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>3 days ago</span>
                    <div className="flex space-x-4">
                      <span>24 likes</span>
                      <span>8 comments</span>
                      <span>3 shares</span>
                    </div>
                  </div>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4">
                  <p className="text-gray-900 mb-3">
                    Sharing my budget breakdown for last month 📊 Managed to save 30% of my income! 
                    Key was meal planning and avoiding impulse purchases. #BudgetingTips #SavingsGoal
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>1 week ago</span>
                    <div className="flex space-x-4">
                      <span>42 likes</span>
                      <span>15 comments</span>
                      <span>7 shares</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Achievements */}
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Achievements</h2>
              <div className="space-y-3">
                {achievements.map((achievement) => (
                  <div 
                    key={achievement.id} 
                    className={`flex items-center space-x-3 p-3 rounded-lg ${
                      achievement.earned ? 'bg-success-50 border border-success-200' : 'bg-gray-50 border border-gray-200'
                    }`}
                  >
                    <div className={`text-2xl ${achievement.earned ? '' : 'grayscale'}`}>
                      {achievement.icon}
                    </div>
                    <div className="flex-1">
                      <p className={`font-medium ${achievement.earned ? 'text-success-800' : 'text-gray-600'}`}>
                        {achievement.name}
                      </p>
                      <p className={`text-sm ${achievement.earned ? 'text-success-600' : 'text-gray-500'}`}>
                        {achievement.description}
                      </p>
                    </div>
                    {achievement.earned && (
                      <Award className="h-5 w-5 text-success-600" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Current Challenges */}
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Active Challenges</h2>
              <div className="space-y-4">
                <div className="border border-primary-200 rounded-lg p-4 bg-primary-50">
                  <h3 className="font-medium text-primary-800">Investment Challenge</h3>
                  <p className="text-sm text-primary-600 mt-1">₹100/day for 30 days</p>
                  <div className="mt-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-primary-700">Progress</span>
                      <span className="font-medium text-primary-800">45%</span>
                    </div>
                    <div className="w-full bg-primary-200 rounded-full h-2">
                      <div className="bg-primary-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                    </div>
                  </div>
                </div>

                <div className="border border-purple-200 rounded-lg p-4 bg-purple-50">
                  <h3 className="font-medium text-purple-800">No Unnecessary Spending</h3>
                  <p className="text-sm text-purple-600 mt-1">7 days challenge</p>
                  <div className="mt-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-purple-700">Progress</span>
                      <span className="font-medium text-purple-800">85%</span>
                    </div>
                    <div className="w-full bg-purple-200 rounded-full h-2">
                      <div className="bg-purple-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
              <div className="space-y-3">
                <button className="w-full btn-primary text-left">
                  Share a Milestone
                </button>
                <button className="w-full btn-secondary text-left">
                  Join New Challenge
                </button>
                <button className="w-full btn-secondary text-left">
                  Update Goals
                </button>
                <button className="w-full btn-secondary text-left">
                  Export Data
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;