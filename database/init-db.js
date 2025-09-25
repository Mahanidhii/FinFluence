// MongoDB Database Initialization Script for FinFluence
// This script sets up the initial database structure and sample data

const { MongoClient } = require('mongodb');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../backend/.env') });

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = 'finfluence';

async function initializeDatabase() {
    const client = new MongoClient(MONGODB_URI);
    
    try {
        console.log('🔌 Connecting to MongoDB...');
        await client.connect();
        console.log('✅ Connected to MongoDB successfully!');
        
        const db = client.db(DB_NAME);
        
        // Create collections
        console.log('📁 Creating collections...');
        
        // Users collection
        const usersCollection = db.collection('users');
        await usersCollection.createIndex({ email: 1 }, { unique: true });
        await usersCollection.createIndex({ username: 1 }, { unique: true });
        
        // Posts collection
        const postsCollection = db.collection('posts');
        await postsCollection.createIndex({ userId: 1 });
        await postsCollection.createIndex({ createdAt: -1 });
        
        // Financial data collection
        const financialDataCollection = db.collection('financialdata');
        await financialDataCollection.createIndex({ userId: 1 });
        await financialDataCollection.createIndex({ category: 1 });
        await financialDataCollection.createIndex({ date: -1 });
        
        // Chatbot conversations collection
        const conversationsCollection = db.collection('conversations');
        await conversationsCollection.createIndex({ userId: 1 });
        await conversationsCollection.createIndex({ createdAt: -1 });
        
        // Investment tracking collection
        const investmentsCollection = db.collection('investments');
        await investmentsCollection.createIndex({ userId: 1 });
        await investmentsCollection.createIndex({ symbol: 1 });
        
        console.log('✅ Collections created successfully!');
        
        // Insert sample data
        console.log('📊 Inserting sample data...');
        
        // Sample user with properly hashed password
        const bcrypt = require('bcryptjs');
        const hashedPassword = await bcrypt.hash('demo123', 10);
        
        await usersCollection.insertOne({
            firstName: 'Demo',
            lastName: 'User',
            username: 'demo_user',
            email: 'demo@finfluence.com',
            password: hashedPassword,
            profile: {
                name: 'Demo User',
                bio: 'Welcome to FinFluence!',
                joinedDate: new Date()
            },
            preferences: {
                riskTolerance: 'moderate',
                investmentGoals: ['retirement', 'wealth-building'],
                notifications: true
            }
        });
        
        // Sample financial categories
        const categories = [
            { name: 'Income', type: 'income', color: '#4CAF50' },
            { name: 'Expenses', type: 'expense', color: '#F44336' },
            { name: 'Investments', type: 'investment', color: '#2196F3' },
            { name: 'Savings', type: 'savings', color: '#FF9800' },
            { name: 'Debt', type: 'debt', color: '#9C27B0' }
        ];
        
        await db.collection('categories').insertMany(categories);
        
        // Sample investment instruments
        const instruments = [
            { symbol: 'AAPL', name: 'Apple Inc.', type: 'stock', sector: 'Technology' },
            { symbol: 'GOOGL', name: 'Alphabet Inc.', type: 'stock', sector: 'Technology' },
            { symbol: 'SPY', name: 'SPDR S&P 500 ETF', type: 'etf', sector: 'Diversified' },
            { symbol: 'GLD', name: 'SPDR Gold Trust', type: 'etf', sector: 'Commodities' },
            { symbol: 'BTC', name: 'Bitcoin', type: 'crypto', sector: 'Cryptocurrency' }
        ];
        
        await db.collection('instruments').insertMany(instruments);
        
        console.log('✅ Sample data inserted successfully!');
        console.log('🎉 Database initialization completed!');
        
        // Display connection info
        console.log('\n📋 Database Information:');
        console.log(`Database Name: ${DB_NAME}`);
        console.log(`Connection URI: ${MONGODB_URI}`);
        console.log('\n📁 Collections created:');
        console.log('- users (with indexes on email, username)');
        console.log('- posts (with indexes on userId, createdAt)');
        console.log('- financialdata (with indexes on userId, category, date)');
        console.log('- conversations (with indexes on userId, createdAt)');
        console.log('- investments (with indexes on userId, symbol)');
        console.log('- categories (financial categories)');
        console.log('- instruments (investment instruments)');
        
    } catch (error) {
        console.error('❌ Database initialization failed:', error);
        process.exit(1);
    } finally {
        await client.close();
        console.log('🔌 Database connection closed.');
    }
}

// Run the initialization
if (require.main === module) {
    initializeDatabase();
}

module.exports = { initializeDatabase };