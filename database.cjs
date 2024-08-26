const { MongoClient, ObjectId } = require('mongodb');

const url = 'mongodb://localhost:27017'; // Connection URL
const dbName = 'bookstore'; // Database Name
let db;

async function connectToDatabase() {
    const client = new MongoClient(url);
    await client.connect();
    db = client.db(dbName);
    console.log(`Connected to database: ${dbName}`);
}

function getDb() {
    if (!db) throw new Error('Database not connected');
    return db;
}

module.exports = { connectToDatabase, getDb, ObjectId };