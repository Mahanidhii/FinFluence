// Test Authentication Script
// This script tests if the demo user can authenticate properly

const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../backend/.env') });

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = 'finfluence';

async function testAuth() {
    const client = new MongoClient(MONGODB_URI);
    
    try {
        console.log('🔌 Connecting to MongoDB...');
        await client.connect();
        console.log('✅ Connected to MongoDB successfully!');
        
        const db = client.db(DB_NAME);
        const usersCollection = db.collection('users');
        
        // Find the demo user
        const user = await usersCollection.findOne({ email: 'demo@finfluence.com' });
        
        if (!user) {
            console.log('❌ Demo user not found!');
            return;
        }
        
        console.log('✅ Demo user found:');
        console.log('📧 Email:', user.email);
        console.log('👤 Username:', user.username);
        console.log('🔐 Password Hash:', user.password.substring(0, 20) + '...');
        
        // Test password comparison
        const testPassword = 'demo123';
        const isMatch = await bcrypt.compare(testPassword, user.password);
        
        if (isMatch) {
            console.log('✅ Password verification: SUCCESS');
            console.log('🎉 Authentication should work!');
        } else {
            console.log('❌ Password verification: FAILED');
            console.log('🔧 Password needs to be fixed');
        }
        
    } catch (error) {
        console.error('❌ Test failed:', error);
    } finally {
        await client.close();
        console.log('🔌 Database connection closed.');
    }
}

// Run the test
if (require.main === module) {
    testAuth();
}

module.exports = { testAuth };