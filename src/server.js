const express = require('express');
const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
const app = express();
const path = require('path'); // Make sure to require path
const bodyParser = require('body-parser'); // Required to parse JSON bodies
console.log('Starting server initialization...');

const url = 'mongodb+srv://Roey:1234@amigos.mq3ny.mongodb.net/';
const dbName = 'amigos';

// Middleware to parse JSON
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

console.log('Middleware set up...');

// Allow CORS for all origins
app.use((_req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

console.log('CORS enabled...');

// Route to fetch products
app.get('/api/products', async (_req, res) => {
    const client = new MongoClient(url, { serverSelectionTimeoutMS: 5000 });

    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection('products');
        const documents = await collection.find({}).toArray();

        res.json(documents);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching products' });
    } finally {
        await client.close();
    }
});

// Route to create a new account
app.post('/api/create-account', async (req, res) => {
    const client = new MongoClient(url, { serverSelectionTimeoutMS: 5000 });

    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection('customers');

        // Hash the password before storing it in the database
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const newUser = {
            customer_id: Date.now(),
            first_name: req.body.firstName,
            last_name: req.body.lastName,
            email: req.body.email,
            phone: parseInt(req.body.phoneNumber),
            address: req.body.address,
            entrance: req.body.entrance,   // Adding entrance
            apartment: req.body.apartment, // Adding apartment
            floor: req.body.floor,         // Adding floor
            city: req.body.city,
            postal_code: parseInt(req.body.postalCode),
            created_at: new Date(),
            password: hashedPassword,  // Store hashed password
            newsletter: req.body.newsletter,
            password: req.body.password, // Assuming you're storing password as plaintext (though it should ideally be hashed)
        };
        

        const result = await collection.insertOne(newUser);
        res.status(201).json({ message: 'Account created successfully', customerId: newUser.customer_id });
    } catch (err) {
        res.status(500).json({ error: 'Failed to create account' });
    } finally {
        await client.close();
    }
});

// Login endpoint with password verification
app.post('/api/customers', async (req, res) => {
    const { email, password } = req.body;

    const client = new MongoClient(url, { serverSelectionTimeoutMS: 5000 });

    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection('customers');

        // Find the customer by email
        const customer = await collection.findOne({ email });

        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        // Compare provided password with hashed password stored in the database
        const passwordMatch = await bcrypt.compare(password, customer.password);

        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        // If login is successful, return the first name
        return res.status(200).json({ firstName: customer.first_name });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    } finally {
        await client.close();
    }
});


app.post('/api/admins', async (req, res) => {
    const { email, password } = req.body;

    const client = new MongoClient(url, { serverSelectionTimeoutMS: 5000 });

    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection('administrators'); 

        // Find the admin by email
        const admin = await collection.findOne({ email });

        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        // Compare the provided password with the stored password directly
        if (password !== admin.password) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        // If login is successful, return the first name
        return res.status(200).json({ firstName: admin.first_name });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    } finally {
        await client.close();
    }
});

console.log('Routes set up...');

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Server is now running on port ${PORT}`);
    console.log(`You can access the API at http://localhost:${PORT}/api/products`);
    console.log(`You can access the API at http://localhost:${PORT}/api/create-account`);
    console.log(`You can access the API at http://localhost:${PORT}/api/customers`);
    console.log(`You can access the API at http://localhost:${PORT}/api/admins`);

});
