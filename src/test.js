
const { MongoClient } = require('mongodb');

async function main() {
    const uri = 'mongodb+srv://Roey:1234@amigos.mq3ny.mongodb.net/';
    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log('Connected to MongoDB');

        // Your database and collection name
        const db = client.db('amigos');
        const collection = db.collection('products');

        // Retrieve data (e.g., all documents in the collection)
        const documents = await collection.find({}).toArray();
        console.log('Documents retrieved:', documents);
    } finally {
        await client.close();
    }
}

main().catch(console.error);
