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

// MongoDB connection function
async function connectToMongo() {
    const client = new MongoClient(url, { serverSelectionTimeoutMS: 5000 });
    await client.connect();
    const db = client.db(dbName);
    return { client, db };
}

// Route to fetch products
app.get('/api/products', async (_req, res) => {
    const { client, db } = await connectToMongo();

    try {
        const collection = db.collection('products');
        const documents = await collection.find({}).toArray();
        res.json(documents);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching products' });
    } finally {
        await client.close();
    }
});

// Route to upload cart data to MongoDB
app.post('/update-cart', async (req, res) => {
    const { customerId, username, cartItems } = req.body;

    if (!customerId || !username) {
        return res.status(400).json({ error: 'Missing customerId or username' });
    }

    const { client, db } = await connectToMongo();

    try {
        const collection = db.collection('carts');

        // Find an existing cart by customerId, or create a new one
        const existingCart = await collection.findOne({ customerId });

        if (existingCart) {
            // Update the existing cart with new cart items
            await collection.updateOne(
                { customerId },
                { $set: { cartItems, username } }
            );
            res.status(200).json({ message: 'Cart updated successfully' });
        } else {
            // Create a new cart for the customer
            await collection.insertOne({ customerId, username, cartItems });
            res.status(201).json({ message: 'Cart created successfully' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Error updating cart in the database' });
    } finally {
        await client.close();
    }
});

// Route to create a new account
app.post('/api/create-account', async (req, res) => {
    const { client, db } = await connectToMongo();

    try {
        const collection = db.collection('customers');
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const customerId = Date.now(); // Consider using a better ID generation method

        const newUser = {
            customer_id: customerId,
            first_name: req.body.firstName,
            last_name: req.body.lastName,
            email: req.body.email,
            phone: parseInt(req.body.phoneNumber),
            address: req.body.address,
            entrance: req.body.entrance,
            apartment: req.body.apartment,
            floor: req.body.floor,
            city: req.body.city,
            postal_code: parseInt(req.body.postalCode),
            created_at: new Date(),
            password: hashedPassword,
            newsletter: req.body.newsletter,
        };

        await collection.insertOne(newUser);
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
    const { client, db } = await connectToMongo();

    try {
        const collection = db.collection('customers');
        const customer = await collection.findOne({ email });

        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        const passwordMatch = await bcrypt.compare(password, customer.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        // Include customerId in the response
        res.status(200).json({ firstName: customer.first_name, customerId: customer.customer_id });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    } finally {
        await client.close();
    }
});

// Admin login endpoint
app.post('/api/admins', async (req, res) => {
    const { email, password } = req.body;
    const { client, db } = await connectToMongo();

    try {
        const collection = db.collection('administrators');
        const admin = await collection.findOne({ email });

        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        const passwordMatch = await bcrypt.compare(password, admin.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        res.status(200).json({ firstName: admin.first_name });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    } finally {
        await client.close();
    }
});

app.post('/create-order', async (req, res) => {
    const { client, db } = await connectToMongo();

    try {
        const orderData = req.body;

        // Validate necessary fields
        if (!orderData.customer_id || !orderData.total_amount) {
            return res.status(400).json({ error: 'Missing required order data' });
        }

        // Insert the new order into the 'total_orders' collection
        const collection = db.collection('total_orders');
        await collection.insertOne(orderData);

        res.status(201).json({ message: 'Order created successfully' });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ error: 'Failed to create order' });
    } finally {
        await client.close();
    }
    console.log("Order route processed...");
});

app.get('/get-shipping-address/:customerId', async (req, res) => {
    const { client, db } = await connectToMongo();
    const { customerId } = req.params;

    try {
        const collection = db.collection('customers');
        
        // Find the customer by customer_id
        const customer = await collection.findOne({ customer_id: parseInt(customerId) });

        if (!customer) {
            return res.status(404).json({ error: 'Customer not found' });
        }

        // Send back the address and city
        res.status(200).json({
            address: customer.address,
            city: customer.city
        });
    } catch (err) {
        console.error('Error fetching shipping details:', err);
        res.status(500).json({ error: 'Failed to retrieve shipping details' });
    } finally {
        await client.close();
    }
});

app.get('/api/orders/all', async (req, res) => {
    const { customer_id } = req.query;

    if (!customer_id) {
        return res.status(400).json({ error: 'Customer ID is required' });
    }

    try {
        const { client, db } = await connectToMongo();
        const collection = db.collection('total_orders');

        const orders = await collection.find({ customer_id: customer_id }).toArray();

        if (orders.length > 0) {
            res.status(200).json(orders);
        } else {
            res.status(200).json({ message: 'לא נמצאו הזמנות למשתמש זה.' });
        }
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ error: 'Server error' });
    }
});


console.log('Routes set up...');

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
