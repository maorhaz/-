require('dotenv').config();
const express = require('express');
const { MongoClient, ObjectId } = require('mongodb'); // Ensure ObjectId is included
const bcrypt = require('bcryptjs');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');

console.log('Starting server initialization...');

// Environment variables
const url = process.env.MONGODB_URL;
const dbName = process.env.DB_NAME;

// Parse JSON
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

console.log('Middleware set up...');

// Allow CORS for all origins
app.use((_req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Add DELETE
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

// Route for fetching each product by ID
app.get('/api/products/:id', async (req, res) => {
    const client = new MongoClient(url, { serverSelectionTimeoutMS: 5000 });
    const productId = req.params.id;

    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection('products');

        console.log(`Fetching product with ID: ${productId}`);

        const product = await collection.findOne({ _id: new ObjectId(productId) });

        if (product) {
            res.status(200).json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (err) {
        console.error('Error fetching product:', err);
        res.status(500).json({ error: 'Error fetching product', details: err.message });
    } finally {
        await client.close();
    }
});

// New product creation route
app.post('/api/products', async (req, res) => {
    const client = new MongoClient(url, { serverSelectionTimeoutMS: 5000 });

    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection('products');
        const newProduct = req.body;

        console.log('Attempting to add product:', newProduct);

        const result = await collection.insertOne(newProduct);

        // Log result for better clarity
        console.log('Insert result:', result);

        // Updated condition to check for result.acknowledged
        if (result.acknowledged && result.insertedId) {
            console.log('Product added successfully:', newProduct);
            res.status(201).json({ message: 'Product added successfully', product: newProduct });
        } else {
            console.error('Failed to add product:', result);
            res.status(500).json({ message: 'Failed to add product' });
        }
    } catch (err) {
        console.error('Error adding product:', err);
        res.status(500).json({ error: 'Error adding product', details: err.message });
    } finally {
        await client.close();
    }
});

// Update product route
app.put('/api/products/:id', async (req, res) => {
    const client = new MongoClient(url, { serverSelectionTimeoutMS: 5000 });
    const productId = req.params.id;
    const updatedProduct = req.body;

    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection('products');

        console.log(`Attempting to update product with ID: ${productId}`);
        const result = await collection.updateOne({ _id: new ObjectId(productId) }, { $set: updatedProduct });

        if (result.modifiedCount === 1) {
            res.status(200).json({ message: 'Product updated successfully', product: updatedProduct });
        } else {
            res.status(404).json({ message: 'Product not found or no changes made' });
        }
    } catch (err) {
        console.error('Error updating product:', err);
        res.status(500).json({ error: 'Error updating product', details: err.message });
    } finally {
        await client.close();
    }
});


// Product deletion route
app.delete('/api/products/:id', async (req, res) => {
    const client = new MongoClient(url, { serverSelectionTimeoutMS: 5000 });
    const productId = req.params.id;

    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection('products');

        console.log(`Attempting to delete product with ID: ${productId}`);

        const result = await collection.deleteOne({ _id: new ObjectId(productId) });

        if (result.deletedCount === 1) {
            res.status(200).json({ message: 'Product deleted successfully' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (err) {
        console.error('Error deleting product:', err);
        res.status(500).json({ error: 'Error deleting product', details: err.message });
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

// Admin login endpoint with password verification
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

        // Compare the provided password with the hashed password in the database
        const passwordMatch = await bcrypt.compare(password, admin.password);

        if (!passwordMatch) {
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
    console.log(`You can access the API at http://localhost:${PORT}/api/products`);
    console.log(`You can access the API at http://localhost:${PORT}/api/create-account`);
    console.log(`You can access the API at http://localhost:${PORT}/api/customers`);
    console.log(`You can access the API at http://localhost:${PORT}/api/admins`);
});
