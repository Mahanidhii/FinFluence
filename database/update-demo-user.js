// Script to update existing demo user with proper firstName and lastName
const { MongoClient } = require('mongodb');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../backend/.env') });

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = 'finfluence';

async function updateDemoUser() {
    const client = new MongoClient(MONGODB_URI);
    
    try {
        console.log('🔌 Connecting to MongoDB...');
        await client.connect();
        console.log('✅ Connected to MongoDB successfully!');
        
        const db = client.db(DB_NAME);
        const usersCollection = db.collection('users');
        
        // Update the demo user to add firstName and lastName
        const result = await usersCollection.updateOne(
            { email: 'demo@finfluence.com' },
            { 
                $set: {
                    firstName: 'Demo',
                    lastName: 'User'
                }
            }
        );
        
        if (result.matchedCount > 0) {
            console.log('✅ Demo user updated successfully!');
            console.log(`Modified ${result.modifiedCount} document(s)`);
        } else {
            console.log('❌ Demo user not found');
        }
        
    } catch (error) {
        console.error('❌ Update failed:', error);
    } finally {
        await client.close();
        console.log('🔒 Database connection closed');
    }
}

updateDemoUser();