const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();

console.log('Starting server initialization...');

const url = 'mongodb+srv://Roey:1234@amigos.mq3ny.mongodb.net/';
const dbName = 'amigos';

// Middleware to parse JSON
app.use(express.json()); // Add this line
app.use(express.static('public'));

console.log('Middleware set up...');

// Allow CORS for all origins
app.use((_req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS'); // Add allowed methods
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

console.log('CORS enabled...');

// Route to fetch products
app.get('/api/products', async (_req, res) => {
    console.log('Received request for /api/products');

    const client = new MongoClient(url, { serverSelectionTimeoutMS: 5000 });

    try {
        console.log('Attempting to connect to database...');
        await client.connect();
        console.log('Connected to database successfully');

        const db = client.db(dbName);
        const collection = db.collection('products');
        console.log('Fetching products...');
        const documents = await collection.find({}).toArray();

        console.log(`Fetched ${documents.length} products`);
        res.json(documents);
    } catch (err) {
        console.error('Error connecting to the database or fetching products', err);
        res.status(500).json({ error: 'Error fetching products' });
    } finally {
        await client.close();
        console.log('Database connection closed');
    }
});

// Route to create a new account
app.post('/api/create-account', async (req, res) => {
    console.log('Request body:', req.body);

    const client = new MongoClient(url, { serverSelectionTimeoutMS: 5000 });

    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection('customers');

        const newCustomerId = Date.now();

        const newUser = {
            customer_id: newCustomerId,
            first_name: req.body.firstName,
            last_name: req.body.lastName,
            email: req.body.email,
            phone: parseInt(req.body.phoneNumber),
            address: req.body.address,
            city: req.body.city,
            postal_code: parseInt(req.body.postalCode),
            created_at: new Date(),
            newsletter: req.body.newsletter,
        };

        const result = await collection.insertOne(newUser);
        console.log(`New customer created with ID: ${result.insertedId}`);

        res.status(201).json({ message: 'Account created successfully', customerId: newCustomerId });
    } catch (err) {
        console.error('Error inserting customer into the database', err);
        res.status(500).json({ error: 'Failed to create account' });
    } finally {
        await client.close();
    }
});

// Route to fetch all customers
app.get('/api/customers', async (req, res) => {
    const client = new MongoClient(url, { serverSelectionTimeoutMS: 5000 });

    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection('customers');

        const customers = await collection.find({}).toArray();
        res.status(200).json(customers);
    } catch (err) {
        console.error('Error fetching customers from the database', err);
        res.status(500).json({ error: 'Failed to fetch customers' });
    } finally {
        await client.close();
    }
});

console.log('Routes set up...');

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is now running on port ${PORT}`);
    console.log(`You can access the API at http://localhost:${PORT}/api/products`);
    console.log(`You can access the API at http://localhost:${PORT}/api/create-account`);
    console.log(`You can access the API at http://localhost:${PORT}/api/customers`);
});

console.log('Server initialization complete. Waiting for connections...');
