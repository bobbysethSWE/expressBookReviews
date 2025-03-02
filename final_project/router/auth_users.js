const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// Register a new user
regd_users.post('/register', (req, res) => {
    const { username, password } = req.body;

    // Validate username
    if (!isValid(username)) {
        return res.status(400).json({ error: 'Invalid username.' });
    }

    // Check if username and password are provided
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required.' });
    }

    // Check if the username already exists
    const userExists = users.find(user => user.username === username);
    if (userExists) {
        return res.status(400).json({ error: 'Username already exists.' });
    }

    // Add the new user to the database
    users.push({ username, password });
    res.status(201).json({ message: 'User registered successfully.' });
});

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
return username && username.length >= 3;
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    // Find the user in the database
    const user = users.find(user => user.username === username && user.password === password);
    // Return true if user is found, otherwise false
    return user !== undefined;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Logged in!"});
});

// Login a registered user
regd_users.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Check if username and password are provided
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required.' });
    }

    // Authenticate the user
    const user = users.find(user => user.username === username && user.password === password);
    if (!user) {
        return res.status(401).json({ error: 'Invalid username or password.' });
    }

    // Generate a JWT
    const token = jwt.sign({ username }, 'secretkey', { expiresIn: '1h' });

    // Send the token to the client
    res.status(200).json({ message: 'Login successful.', token });
});

// Add a book review

regd_users.put('/auth/review/:isbn', (req, res) => {
    res.send('PUT route is working'); 
    const isbn = req.params.isbn;
    const review = req.query.review;
    const username = req.session.username; // Assuming username is stored in session

    // Fetch the book by ISBN from your database or data structure
    let book = getBookByISBN(isbn); // Implement this function based on your data source

    if (!book) {
        return res.status(404).send('Book not found');
    }

    // Check if the user has already reviewed this book
    let userReview = book.reviews.find(r => r.username === username);

    if (userReview) {
        // Modify existing review
        userReview.review = review;
        res.send('Review updated successfully');
    } else {
        // Add new review
        book.reviews.push({ username: username, review: review });
        res.send('Review added successfully');
    }
  
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.username; // Assuming username is stored in session

    // Fetch the book by ISBN from your database or data structure
    let book = getBookByISBN(isbn); // Implement this function based on your data source

    if (!book) {
        return res.status(404).send('Book not found');
    }

    // Find the index of the user's review
    const reviewIndex = book.reviews.findIndex(r => r.username === username);

    if (reviewIndex !== -1) {
        // Remove the review from the array
        book.reviews.splice(reviewIndex, 1);
        res.send('Review deleted successfully');
    } else {
        res.status(403).send('You can only delete your own reviews');
    }

    // Save the updated book data back to your database or data structure
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
