const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();



public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "New user registered!"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.status(200).json(JSON.stringify(books, null, 2));
}); 

// Get book details based on ISBN

public_users.get('/isbn/:isbn', function (req, res) {
  // Retrieve the ISBN from the request parameters
  const isbn = req.params.isbn;
  
  // Access the book data using the ISBN
  const book = books[isbn];
  
  // Check if the book exists
  if (book) {
    // Return the book details as a JSON response
    return res.status(200).json(book);
  } else {
    // If the book is not found, return a 404 error
    return res.status(404).json({ message: "Book not found" });
  }
});
  
// Get book details based on author

public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    const matchingBooks = [];
  
    for (let key in books) {
      if (books[key].author === author) {
        matchingBooks.push(books[key]);
      }
    }
  
    if (matchingBooks.length > 0) {
      return res.status(200).json(matchingBooks);
    } else {
      return res.status(404).json({ message: "No books found for the given author" });
    }
  });

// Get all books based on title

public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    const matchingBooks = [];
  
    for (let key in books) {
      if (books[key].title === title) {
        matchingBooks.push(books[key]);
      }
    }
  
    if (matchingBooks.length > 0) {
      return res.status(200).json(matchingBooks);
    } else {
      return res.status(404).json({ message: "No books found with the given title" });
    }
  });

//  Get book review

public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
  
    if (book) {
      return res.status(200).json(book.reviews);
    } else {
      return res.status(404).json({ message: "No book found with the given ISBN" });
    }
  });

const axios = require('axios');

async function getBooks() {
    try {
        const response = await axios.get('http://localhost:5001/api/books');
        return response.data; // Assuming the API returns a list of books in the data property
    } catch (error) {
        console.error('Error fetching books:', error);
    }
}
  
  // Call the function to test it
getBooks().then(books => console.log(books));


const axios = require('axios');

async function getBookDetailsByISBN(isbn) {
    try {
        const response = await axios.get(`http://localhost:5001/api/books/${isbn}`);
        return response.data; // Assuming the API returns book details in the data property
    } catch (error) {
        console.error('Error fetching book details:', error);
    }
}

// Example call
getBookDetailsByISBN('1234567890').then(bookDetails => console.log(bookDetails));

const axios = require('axios');

async function getBookDetailsByAuthor(author) {
    try {
        const response = await axios.get(`http://localhost:5001/api/books?author=${encodeURIComponent(author)}`);
        return response.data; // Assuming the API returns book details in the data property
    } catch (error) {
        console.error('Error fetching book details:', error);
    }
}

// Example call
getBookDetailsByAuthor('John Doe').then(bookDetails => console.log(bookDetails));


const axios = require('axios');

function getBookDetailsByTitle(title) {
    return axios.get(`https://localhost:5001/books?title=${title}`)
        .then(response => {
            return response.data;
        })
        .catch(error => {
            console.error('Error fetching book details:', error);
        });
}

// Usage
getBookDetailsByTitle('Your Book Title')
    .then(data => {
        console.log('Book Details:', data);
    });






module.exports.general = public_users;
