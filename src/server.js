const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();

console.log('Starting server initialization...');

const url = 'mongodb+srv://Roey:1234@amigos.mq3ny.mongodb.net/';
const dbName = 'amigos';

app.use(express.static('public'));

console.log('Middleware set up...');

// Allow CORS for all origins
app.use((_req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

console.log('CORS enabled...');

// Route to fetch products
app.get('/api/products', async (_req, res) => {
    console.log('Received request for /api/products');
    
    const client = new MongoClient(url, {
        serverSelectionTimeoutMS: 5000 // 5 seconds timeout
    });

    try {
        console.log('Attempting to connect to database...');
        await client.connect();
        console.log('Connected to database successfully');

        const db = client.db(dbName);
        const collection = db.collection('products');
        console.log('Fetching products...');
        const documents = await collection.find({}).toArray();
        
        console.log(`Fetched ${documents.length} products`);
        console.log('First product:', documents[0]);  // Log the first product
        
        res.json(documents);
    } catch (err) {
        console.error('Error connecting to the database or fetching products', err);
        res.status(500).json({ error: 'Error fetching products' });
    } finally {
        await client.close();
        console.log('Database connection closed');
    }
});

console.log('Routes set up...');

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is now running on port ${PORT}`);
    console.log(`You can access the API at http://localhost:${PORT}/api/products`);
});

console.log('Server initialization complete. Waiting for connections...');
