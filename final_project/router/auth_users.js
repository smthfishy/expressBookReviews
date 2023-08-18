const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ 
    let userswithsamename = users.filter((user)=>{
        return user.username === username
      });
      if(userswithsamename.length > 0){
        return true;
      } else {
        return false;
      }
}

const authenticatedUser = (username,password)=>{ //returns boolean
    let validusers = users.filter((user)=>{
        return (user.username === username && user.password === password)
      });
      if(validusers.length > 0){
        return true;
      } else {
        return false;
      }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (!username || !password) {
        return res.status(404).json({message: "Error logging in"});
    }
    if (authenticatedUser(username,password)) {
      let accessToken = jwt.sign({
        data: password
      }, 'access', { expiresIn: 60 * 60});
      req.session.authorization = {
        accessToken,username
    }
    return res.status(200).send("User successfully logged in");
    } else {
      return res.status(208).json({message: "Invalid Login. Check username and password"});
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization.username;
  let book = books[isbn];
  if(book) {
      let review = req.body.review;
      if(review) {
        console.log(Object.keys(book.reviews).length);
        for(var i = 0; i != Object.keys(book.reviews).length; i++){
                if(book.reviews[i].username === username) {
                    book.reviews[i].review = review;
                }
                else {
                book.reviews.push({"username": username, "review": review});
                }
        }
        if(Object.keys(book.reviews).length === 0 ) {
            book.reviews = [];
            book.reviews[0] = {"username": username, "review": review};
        }
      }
    }
  res.send(book)
});

regd_users.delete("/auth/review/:isbn", (req, res) => { 
    const isbn = req.params.isbn;
  const username = req.session.authorization.username;
  let book = books[isbn];
  if(book) {
    for(var i = 0; i != Object.keys(book.reviews).length; i++){
        if(book.reviews[i].username === username) {
            delete book.reviews[i]
        }
}
  }
  res.send(`Review from user ${username} has been deleted.`);
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
