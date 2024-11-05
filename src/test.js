require('dotenv').config();
const { MongoClient } = require('mongodb');

const url = process.env.MONGODB_URL;
const dbName = process.env.DB_NAME;

async function testConnection() {
    const client = new MongoClient(url);
    try {
        await client.connect();
        console.log('Connected successfully to MongoDB');
        const db = client.db(dbName);
        console.log('Database:', db.databaseName);
    } catch (error) {
        console.error('Connection error:', error);
    } finally {
        await client.close();
    }
}

testConnection();
