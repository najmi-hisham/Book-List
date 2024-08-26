const express = require('express');
const router = express.Router();
const { getDb } = require('../database.cjs');
const { ObjectId } = require('mongodb'); // Import ObjectId from mongodb

// Fetch all books
router.get('/', async (req, res) => {
    try {
        const db = getDb();
        const collection = db.collection('books');
        const books = await collection.find().toArray();
        res.json(books);
    } catch (error) {
        console.error('Error fetching books:', error);
        res.status(500).json({ error: 'An error occurred while fetching books.' });
    }
});

// Add a new book
router.post('/', async (req, res) => {
    const { title, author, rating } = req.body;

    // Basic validation
    if (!title || !author || !rating) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    try {
        const db = getDb();
        const collection = db.collection('books');
        const result = await collection.insertOne({ title, author, rating });
        console.log('Book added:', result);

        // Return the newly created book
        const createdBook = {
            _id: result.insertedId,
            title,
            author,
            rating
        };
        res.status(201).json(createdBook);
    } catch (error) {
        console.error('Error creating book:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Update a book
router.put('/:id', async (req, res) => {
    const bookId = req.params.id;
    const { title, author, rating } = req.body;

    try {
        const db = getDb();
        const collection = db.collection('books');
        const result = await collection.updateOne(
            { _id: new ObjectId(bookId) }, // Use new ObjectId
            { $set: { title, author, rating } }
        );
        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.json({ message: 'Book updated successfully' });
    } catch (error) {
        console.error('Error updating book:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;



/*

GET: Find
POST: insertOne
PUT: updateOne


*/