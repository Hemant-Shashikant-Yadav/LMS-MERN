const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Book = require("../models/Book");
const userAuth = require("./userAuth");

// add book to favourite
router.put("/add", userAuth, async (req, res) => {
  try {
    const { bookid } = req.headers;
    const { id } = req.headers;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.favorites.includes(bookid)) {
      return res.status(200).json({ message: "Book already added" });
    }
    // user.favorites.push(bookid);
    // await user.save();

    await User.findByIdAndUpdate(id, {
      $push: { favorites: bookid },
    });
    res.status(200).json({ message: "Book added to favourite" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// remove book from favourite
router.delete("/remove", userAuth, async (req, res) => {
  try {
    const { bookid } = req.headers;
    const { id } = req.headers;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!user.favorites.includes(bookid)) {
      return res.status(200).json({ message: "Book not added" });
    }
    // user.favorites.pull(bookid);
    // await user.save();
    await User.findByIdAndUpdate(id, {
      $pull: { favorites: bookid },
    });
    res.status(200).json({ message: "Book removed from favourite" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// get favourite books
router.get("/get", userAuth, async (req, res) => {
  try {
    const { id } = req.headers;
    const user = await User.findById(id).populate("favorites");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const favouritebooks = user.favorites;
    return res.json({
      status: "Success",
      data: favouritebooks,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// edit favourite books
module.exports = router;
