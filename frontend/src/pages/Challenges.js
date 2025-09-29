import React, { useState } from 'react';
import { Trophy, Calendar, Users, Target, Plus, Timer } from 'lucide-react';

const Challenges = () => {
  const [activeTab, setActiveTab] = useState('available');
  const [challenges] = useState([
    {
      id: 1,
      title: 'Save ₹20,000 in 30 Days',
      description: 'Challenge yourself to save ₹667 daily for a month. Track your progress and share your journey!',
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
      id: 2,
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
      isJoined: true,
      isPopular: false,
      requirements: ['Invest minimum ₹100/day', 'Share weekly portfolio updates', 'Complete quiz modules']
    },
    {
      id: 3,
      title: 'No Unnecessary Spending Week',
      description: 'Avoid all non-essential purchases for 7 days. Focus only on needs, not wants!',
      type: 'budgeting',
      duration: '7 days',
      participants: 2156,
      prize: 'Budget Boss badge + ₹1,000 cashback',
      difficulty: 'Hard',
      startDate: '2024-01-20',
      endDate: '2024-01-27',
      progress: 85,
      isJoined: true,
      isPopular: true,
      requirements: ['Track all expenses', 'Get approval for purchases >₹500', 'Daily check-ins required']
    },
    {
      id: 4,
      title: 'Learn & Earn: Financial Literacy',
      description: 'Complete 10 financial learning modules and earn certificates while learning with peers.',
      type: 'education',
      duration: '14 days',
      participants: 756,
      prize: 'Finance Guru badge + Course completion certificate',
      difficulty: 'Easy',
      startDate: '2024-02-01',
      endDate: '2024-02-15',
      progress: 0,
      isJoined: false,
      isPopular: false,
      requirements: ['Complete daily lessons', 'Pass weekly quizzes', 'Share learning insights']
    },
    {
      id: 5,
      title: 'Gold Investment Marathon',
      description: 'Invest in gold (digital or physical) consistently for 60 days. Perfect for beginners!',
      type: 'investment',
      duration: '60 days',
      participants: 634,
      prize: 'Gold Investor badge + ₹2,000 investment bonus',
      difficulty: 'Medium',
      startDate: '2024-01-10',
      endDate: '2024-03-10',
      progress: 25,
      isJoined: false,
      isPopular: false,
      requirements: ['Minimum ₹200/week investment', 'Track gold prices daily', 'Weekly strategy posts']
    }
  ]);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'savings': return <Target className="h-5 w-5 text-blue-500" />;
      case 'investment': return <Trophy className="h-5 w-5 text-green-500" />;
      case 'budgeting': return <Calendar className="h-5 w-5 text-purple-500" />;
      case 'education': return <Users className="h-5 w-5 text-orange-500" />;
      default: return <Target className="h-5 w-5 text-blue-500" />;
    }
  };

  const filteredChallenges = activeTab === 'available' 
    ? challenges.filter(c => !c.isJoined)
    : challenges.filter(c => c.isJoined);

  const handleJoinChallenge = (challengeId) => {
    console.log('Join challenge:', challengeId);
  };

  return (
    <div className="p-6 pt-24 min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Financial Challenges 🎯
            </h1>
            <p className="text-gray-600 mt-2">
              Challenge yourself, collaborate with friends, and achieve your financial goals
            </p>
          </div>
          <button className="btn-primary flex items-center">
            <Plus className="h-5 w-5 mr-2" />
            Create Challenge
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card text-center">
            <div className="p-3 bg-primary-100 rounded-full w-fit mx-auto mb-3">
              <Trophy className="h-6 w-6 text-primary-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">12</p>
            <p className="text-sm text-gray-600">Challenges Completed</p>
          </div>
          
          <div className="card text-center">
            <div className="p-3 bg-success-100 rounded-full w-fit mx-auto mb-3">
              <Target className="h-6 w-6 text-success-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">₹45,200</p>
            <p className="text-sm text-gray-600">Total Saved</p>
          </div>
          

          
          <div className="card text-center">
            <div className="p-3 bg-purple-100 rounded-full w-fit mx-auto mb-3">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">15</p>
            <p className="text-sm text-gray-600">Days Streak</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-1">
            <button
              onClick={() => setActiveTab('available')}
              className={`px-6 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'available'
                  ? 'bg-primary-500 text-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Available Challenges
            </button>
            <button
              onClick={() => setActiveTab('my')}
              className={`px-6 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'my'
                  ? 'bg-primary-500 text-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              My Challenges ({challenges.filter(c => c.isJoined).length})
            </button>
          </div>
        </div>

        {/* Challenges Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredChallenges.map((challenge) => (
            <div key={challenge.id} className="card">
              {/* Challenge Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {getTypeIcon(challenge.type)}
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-gray-900">{challenge.title}</h3>
                      {challenge.isPopular && (
                        <Crown className="h-4 w-4 text-warning-500" />
                      )}
                    </div>
                    <div className="flex items-center space-x-3 mt-1">
                      <span className={`px-2 py-1 text-xs rounded-full ${getDifficultyColor(challenge.difficulty)}`}>
                        {challenge.difficulty}
                      </span>
                      <span className="text-sm text-gray-500 flex items-center">
                        <Timer className="h-4 w-4 mr-1" />
                        {challenge.duration}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Challenge Description */}
              <p className="text-gray-600 text-sm mb-4">
                {challenge.description}
              </p>

              {/* Challenge Details */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Participants</span>
                  <span className="font-medium text-gray-900">{challenge.participants.toLocaleString()}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Prize</span>
                  <span className="font-medium text-gray-900">{challenge.prize}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Duration</span>
                  <span className="font-medium text-gray-900">{challenge.startDate} - {challenge.endDate}</span>
                </div>
              </div>

              {/* Progress Bar (for joined challenges) */}
              {challenge.isJoined && (
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium text-gray-900">{challenge.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${challenge.progress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Requirements */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Requirements:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  {challenge.requirements.map((req, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-primary-500 mr-2">•</span>
                      {req}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                {challenge.isJoined ? (
                  <>
                    <button className="flex-1 btn-primary">
                      View Progress
                    </button>
                    <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                      Share
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleJoinChallenge(challenge.id)}
                      className="flex-1 btn-primary"
                    >
                      Join Challenge
                    </button>
                    <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                      Details
                    </button>
                  </>
                )}
              </div>

              {/* Popular Badge */}
              {challenge.isPopular && (
                <div className="mt-3 text-center">
                  <span className="inline-flex items-center px-2 py-1 bg-warning-100 text-warning-700 text-xs rounded-full">
                    🔥 Popular Challenge
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>


      </div>
    </div>
  );
};

export default Challenges;