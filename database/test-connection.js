// MongoDB Atlas Connection Test
// This script tests your MongoDB Atlas connection

const { MongoClient } = require('mongodb');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../backend/.env') });

const MONGODB_URI = process.env.MONGODB_URI;

async function testConnection() {
    console.log('🔍 Testing MongoDB Atlas connection...');
    console.log('Connection URI:', MONGODB_URI?.replace(/:[^:@]*@/, ':****@')); // Hide password in logs
    
    if (!MONGODB_URI) {
        console.log('❌ MONGODB_URI not found in environment variables');
        console.log('Please check your .env file in the backend directory');
        return;
    }

    const client = new MongoClient(MONGODB_URI);
    
    try {
        console.log('🔌 Attempting to connect...');
        await client.connect();
        
        console.log('✅ Successfully connected to MongoDB Atlas!');
        
        // Test database operations
        const db = client.db('finfluence');
        const collections = await db.listCollections().toArray();
        
        console.log('📁 Available collections:', collections.length > 0 ? collections.map(c => c.name) : 'None (database is empty)');
        
        // Test a simple operation
        const testCollection = db.collection('connection_test');
        const testDoc = { 
            message: 'Connection test successful', 
            timestamp: new Date(),
            project: 'FinFluence'
        };
        
        await testCollection.insertOne(testDoc);
        console.log('✅ Test document inserted successfully');
        
        const retrievedDoc = await testCollection.findOne({ project: 'FinFluence' });
        console.log('✅ Test document retrieved:', retrievedDoc ? 'Success' : 'Failed');
        
        // Clean up test document
        await testCollection.deleteOne({ project: 'FinFluence' });
        console.log('🧹 Test document cleaned up');
        
        console.log('🎉 MongoDB Atlas connection test completed successfully!');
        
    } catch (error) {
        console.log('❌ Connection failed!');
        console.log('Error details:', error.message);
        
        // Common error solutions
        if (error.message.includes('authentication failed')) {
            console.log('\n💡 Possible solutions:');
            console.log('1. Check your username and password in the connection string');
            console.log('2. Ensure the database user exists in MongoDB Atlas');
            console.log('3. Verify the user has proper permissions');
        } else if (error.message.includes('ENOTFOUND')) {
            console.log('\n💡 Possible solutions:');
            console.log('1. Check your cluster URL in the connection string');
            console.log('2. Ensure your internet connection is working');
            console.log('3. Verify the cluster is running in MongoDB Atlas');
        } else if (error.message.includes('IP not in whitelist')) {
            console.log('\n💡 Possible solutions:');
            console.log('1. Add your IP address to MongoDB Atlas Network Access');
            console.log('2. Or allow access from anywhere (0.0.0.0/0) for development');
        }
    } finally {
        await client.close();
        console.log('🔌 Connection closed');
    }
}

if (require.main === module) {
    testConnection();
}

module.exports = { testConnection };