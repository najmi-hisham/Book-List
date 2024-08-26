const bookForm = document.getElementById('BookForm');
const showBooksBtn = document.getElementById('showBooksBtn');

if (bookForm && showBooksBtn) {
    bookForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent default form submission

        const title = document.getElementById('title').value;
        const author = document.getElementById('author').value;
        const rating = document.getElementById('rating').value;

        try {
            const response = await axios.post('/book', { title, author, rating });
            console.log('Book added:', response.data);
            alert('Book added successfully!');
            bookForm.reset(); // Clear form fields
        } catch (error) {
            console.error('Error adding book:', error);
            alert('Failed to add book.');
        }
    });

    showBooksBtn.addEventListener('click', async () => {
        try {
            const response = await axios.get('/book');
            const books = response.data;

            const booksList = document.getElementById('books-list');
            booksList.innerHTML = ''; // Clear previous list

            books.forEach(book => {
                const listItem = document.createElement('li');
                listItem.innerHTML = `
                    ${book.title} by ${book.author}, Rating: ${book.rating}
                    <button class="modify-btn" data-id="${book._id}">Modify</button>
                `;
                booksList.appendChild(listItem);
            });

            // Attach click event handlers to modify buttons
            document.querySelectorAll('.modify-btn').forEach(button => {
                button.addEventListener('click', () => {
                    const bookId = button.getAttribute('data-id');
                    showEditForm(bookId);
                });
            });
        } catch (error) {
            console.error('Error fetching books:', error);
            alert('Failed to fetch books.');
        }
    });
} else {
    console.error('One or more required elements are missing in the DOM.');
}

function showEditForm(bookId) {
    // Retrieve the book details from the DOM (or you can fetch them from the server)
    const listItem = document.querySelector(`.modify-btn[data-id="${bookId}"]`).closest('li');
    const originalTitle = listItem.childNodes[0].textContent.split(' by ')[0].trim();
    const originalAuthor = listItem.childNodes[0].textContent.split(' by ')[1].split(', Rating:')[0].trim();
    const originalRating = listItem.childNodes[0].textContent.split('Rating: ')[1].trim();

    // Show prompts with the original values as default
    const title = prompt('Enter new title:', originalTitle) || originalTitle;
    const author = prompt('Enter new author:', originalAuthor) || originalAuthor;
    const rating = prompt('Enter new rating:', originalRating) || originalRating;

    // Validate rating
    const numericRating = parseFloat(rating);
    if (title && author && !isNaN(numericRating)) {
        modifyBook(bookId, { title, author, rating: numericRating });
    } else {
        alert('Invalid input. Rating must be a number.');
    }
}


async function modifyBook(bookId, updatedBook) {
    try {
        const response = await axios.put(`/book/${bookId}`, updatedBook);
        console.log('Book updated:', response.data);
        alert('Book updated successfully!');
        showBooksBtn.click(); // Refresh the list
    } catch (error) {
        console.error('Error updating book:', error);
        alert('Failed to update book.');
    }
}
