const express = require('express');
const axios = require('axios').default;
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const { response } = require('express');
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (username && password) {
      if (!isValid(username)) {
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registred. Now you can login"});
      } else {
        return res.status(404).json({message: "User already exists!"});
      }
    }
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
    // new Promise((resolve, reject) => {
    //     resolve(JSON.stringify(books,null,4));
    // });
    res.send(new Promise((resolve, reject) => {
        resolve(JSON.stringify(books,null,4));
    }));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  axios.get(books[isbn])
  .then(response => {
      res.send(response.data);
  })
  .catch(err => {
      console.error(err);
  })
//   res.send(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author
  let foundBooks = []
  for(var i = 0; i != Object.keys(books).length; i++) {

    if(books[i+1].author == author) {
        foundBooks.push(books[i+1])
    }
  }
  return res.send(foundBooks);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title
    let foundBooks = []
    for(var i = 0; i != Object.keys(books).length; i++) {
  
      if(books[i+1].title == title) {
          foundBooks.push(books[i+1])
      }
    }
    return res.send(foundBooks);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn
    return res.send(books[isbn].reviews);
});

module.exports.general = public_users;
