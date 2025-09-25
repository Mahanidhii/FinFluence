// Fix Demo User Password
// This script updates the demo user password to be properly hashed

const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../backend/.env') });

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = 'finfluence';

async function fixDemoUser() {
    const client = new MongoClient(MONGODB_URI);
    
    try {
        console.log('🔌 Connecting to MongoDB...');
        await client.connect();
        console.log('✅ Connected to MongoDB successfully!');
        
        const db = client.db(DB_NAME);
        const usersCollection = db.collection('users');
        
        // Hash the password properly
        const hashedPassword = await bcrypt.hash('demo123', 10);
        
        // Update or create the demo user
        const result = await usersCollection.updateOne(
            { email: 'demo@finfluence.com' },
            {
                $set: {
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
                }
            },
            { upsert: true }
        );
        
        if (result.upsertedCount > 0) {
            console.log('✅ Demo user created successfully!');
        } else if (result.modifiedCount > 0) {
            console.log('✅ Demo user updated successfully!');
        }
        
        console.log('🎉 Demo user is ready for login!');
        console.log('📧 Email: demo@finfluence.com');
        console.log('🔑 Password: demo123');
        
    } catch (error) {
        console.error('❌ Failed to fix demo user:', error);
        process.exit(1);
    } finally {
        await client.close();
        console.log('🔌 Database connection closed.');
    }
}

// Run the fix
if (require.main === module) {
    fixDemoUser();
}

module.exports = { fixDemoUser };