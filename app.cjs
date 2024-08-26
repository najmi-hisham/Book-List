const express = require('express');
const { connectToDatabase } = require('./database.cjs');
const booksRouter = require('./routes/bookRoute.cjs');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('public')); // Ensure this points to the 'public' directory

app.use('/book', booksRouter);

connectToDatabase()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Failed to connect to the database:', error);
    });
