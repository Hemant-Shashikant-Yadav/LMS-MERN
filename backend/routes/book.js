const express = require("express");
const router = express.Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const Book = require("../models/Book");
const userAuth = require("./userAuth");

// Admin Routes for Book Management

// Add new book
router.post("/add", userAuth, async (req, res) => {
  try {
    // check  if user is admin
    const { id } = req.headers;
    const user = await User.findById(id);
    if (user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { url, title, author, price, description, language } = req.body;
    const newBook = new Book({
      url: url,
      title: title,
      author: author,
      price: price,
      description: description,
      language: language,
    });
    await newBook.save();
    res.status(201).json({ message: "Book added successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// {
//   "url": "https://www.google.com",
//   "title": "Book 1",
//   "author": "Author 1",
//   "price": 100,
//   "description": "This is a book",
//   "language": "English"
// }

// Update book details
router.put("/update", userAuth, async (req, res) => {
  try {
    const { bookid } = req.headers;

    await Book.findByIdAndUpdate(bookid, {
      url: req.body.url,
      title: req.body.title,
      author: req.body.author,
      price: req.body.price,
      description: req.body.description,
      language: req.body.language,
    });
    res.status(200).json({ message: "Book updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete book
router.delete("/delete", userAuth, async (req, res) => {
  try {
    const { bookid } = req.headers;
    await Book.findByIdAndDelete(bookid);
    res.json({ message: "Book deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all books
router.get("/getall", async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });

    return res.json({
      status: "Success",
      data: books,
    });
  } catch (error) {
    res.status
      .status(500)
      .json({ message: "Error fetching books", error: error.message });
  }
});

// Get recently added books
router.get("/recent", async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 }).limit(4);
    return res.json({
      status: "Success",
      data: books,
    });
  } catch (error) {
    res.status
      .status(500)
      .json({ message: "Error fetching books", error: error.message });
  }
});

// Get book by ID
router.get("/get/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    return res.json({
      status: "Success",
      data: books,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
