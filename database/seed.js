const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../src/models/User');
const Post = require('../src/models/Post');
const Challenge = require('../src/models/Challenge');

// Sample users data
const sampleUsers = [
  {
    username: 'rahul_investor',
    email: 'rahul@example.com',
    password: 'password123',
    profile: {
      firstName: 'Rahul',
      lastName: 'Sharma',
      bio: 'Passionate about stock market investing and financial literacy',
      location: 'Mumbai, India',
      dateOfBirth: '1995-06-15',
      occupation: 'Software Engineer',
      annualIncome: 800000
    },
    preferences: {
      riskTolerance: 'moderate',
      investmentGoals: ['long-term-wealth', 'retirement'],
      categories: ['stocks', 'mutual-funds']
    },
    stats: {
      totalSavings: 250000,
      monthlyIncome: 65000,
      monthlyExpenses: 35000,
      investmentValue: 150000
    }
  },
  {
    username: 'priya_saver',
    email: 'priya@example.com',
    password: 'password123',
    profile: {
      firstName: 'Priya',
      lastName: 'Patel',
      bio: 'Budgeting expert and savings enthusiast. Love helping others achieve financial goals!',
      location: 'Pune, India',
      dateOfBirth: '1992-03-22',
      occupation: 'Marketing Manager',
      annualIncome: 1200000
    },
    preferences: {
      riskTolerance: 'conservative',
      investmentGoals: ['emergency-fund', 'house-purchase'],
      categories: ['savings', 'budgeting']
    },
    stats: {
      totalSavings: 400000,
      monthlyIncome: 95000,
      monthlyExpenses: 45000,
      investmentValue: 80000
    }
  },
  {
    username: 'arjun_trader',
    email: 'arjun@example.com',
    password: 'password123',
    profile: {
      firstName: 'Arjun',
      lastName: 'Kumar',
      bio: 'Day trader and crypto enthusiast. Always sharing market insights!',
      location: 'Bangalore, India',
      dateOfBirth: '1988-11-10',
      occupation: 'Financial Analyst',
      annualIncome: 1500000
    },
    preferences: {
      riskTolerance: 'aggressive',
      investmentGoals: ['short-term-gains', 'portfolio-diversification'],
      categories: ['stocks', 'crypto', 'trading']
    },
    stats: {
      totalSavings: 300000,
      monthlyIncome: 120000,
      monthlyExpenses: 60000,
      investmentValue: 500000
    }
  }
];

// Sample posts data
const samplePosts = [
  {
    content: "Just hit my savings goal of ₹2 lakhs! 🎉 The key was automating my savings - every month ₹15k goes directly to a separate account. Small steps, big results! #SavingsGoal #FinancialFreedom",
    type: 'text',
    financialData: {
      amount: 200000,
      category: 'savings',
      period: 'yearly'
    },
    tags: ['savings', 'goals', 'automation']
  },
  {
    content: "Market analysis: HDFC Bank showing strong support at ₹1580 levels. Good buying opportunity for long-term investors. What do you think? 📈 #StockMarket #HDFCBANK",
    type: 'text',
    financialData: {
      symbol: 'HDFCBANK',
      price: 1580,
      recommendation: 'BUY'
    },
    tags: ['stocks', 'analysis', 'banking']
  },
  {
    content: "My monthly budget breakdown that actually works:\n• Food: 40% (₹12k)\n• Transport: 20% (₹6k)\n• Entertainment: 15% (₹4.5k)\n• Savings: 25% (₹7.5k)\n\nWhat's your ideal budget split? 💰",
    type: 'text',
    financialData: {
      amount: 30000,
      category: 'budget',
      period: 'monthly'
    },
    tags: ['budgeting', 'expenses', 'planning']
  }
];

// Sample challenges data
const sampleChallenges = [
  {
    title: "30-Day No Dining Out Challenge",
    description: "Save money by cooking at home for 30 days straight. Share your homemade meals and track your savings!",
    type: "savings",
    category: "food",
    targetAmount: 10000,
    duration: 30,
    rules: [
      "Cook all meals at home",
      "No restaurant or takeout orders", 
      "Share photos of your homemade meals",
      "Track daily savings"
    ],
    rewards: {
      points: 500,
      badges: ["Home Chef", "Money Saver"],
      prizes: ["Cooking equipment voucher worth ₹2000"]
    },
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  },
  {
    title: "₹50K Investment Challenge",
    description: "Invest ₹50,000 across different asset classes and learn about portfolio diversification",
    type: "investment",
    category: "portfolio",
    targetAmount: 50000,
    duration: 60,
    rules: [
      "Invest minimum ₹50,000",
      "Diversify across at least 3 asset classes",
      "Share your investment strategy",
      "Track portfolio performance weekly"
    ],
    rewards: {
      points: 1000,
      badges: ["Diversified Investor", "Portfolio Builder"],
      prizes: ["Free financial consultation worth ₹5000"]
    },
    startDate: new Date(),
    endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/finfluence');
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Post.deleteMany({});
    await Challenge.deleteMany({});
    console.log('🗑️ Cleared existing data');

    // Create users
    const createdUsers = [];
    for (let userData of sampleUsers) {
      // Hash password
      const salt = await bcrypt.genSalt(10);
      userData.password = await bcrypt.hash(userData.password, salt);
      
      const user = new User(userData);
      await user.save();
      createdUsers.push(user);
      console.log(`👤 Created user: ${user.username}`);
    }

    // Create posts
    for (let i = 0; i < samplePosts.length; i++) {
      const postData = {
        ...samplePosts[i],
        author: createdUsers[i % createdUsers.length]._id
      };
      
      const post = new Post(postData);
      await post.save();
      console.log(`📝 Created post: ${post.content.substring(0, 50)}...`);
    }

    // Create challenges
    for (let challengeData of sampleChallenges) {
      challengeData.createdBy = createdUsers[0]._id; // Created by first user
      const challenge = new Challenge(challengeData);
      await challenge.save();
      console.log(`🏆 Created challenge: ${challenge.title}`);
    }

    console.log('🎉 Database seeded successfully!');
    console.log('\n📊 Summary:');
    console.log(`   Users: ${createdUsers.length}`);
    console.log(`   Posts: ${samplePosts.length}`);
    console.log(`   Challenges: ${sampleChallenges.length}`);
    
    console.log('\n🔐 Test Credentials:');
    sampleUsers.forEach(user => {
      console.log(`   ${user.email} / password123`);
    });

  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('📛 Disconnected from MongoDB');
  }
}

// Run seeding if called directly
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };