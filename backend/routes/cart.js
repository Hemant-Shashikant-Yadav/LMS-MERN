const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Book = require("../models/Book");
const userAuth = require("./userAuth");

// add book to cart

router.put("/add", userAuth, async (req, res) => {
  try {
    const { bookid } = req.headers;
    const { id } = req.headers;
    const user = await User.findById(id);

    if (user.cart.includes(bookid)) {
      return res.status(200).json({ message: "Book already added" });
    }
    // user.cart.push(bookid);
    // await user.save();
    await User.findByIdAndUpdate(id, {
      $push: { cart: bookid },
    });

    res.status(200).json({ message: "Book added to cart" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//  remove book from cart
router.delete("/remove", userAuth, async (req, res) => {
  try {
    const { bookid } = req.headers;
    const { id } = req.headers;
    const user = await User.findById(id);
    if (!user.cart.includes(bookid)) {
      return res.status(200).json({ message: "Book not added" });
    }
    // user.cart.pull(bookid);
    // await user.save();
    await User.findByIdAndUpdate(id, {
      $pull: { cart: bookid },
    });
    res.status(200).json({ message: "Book removed from cart" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// get cart books

router.get("/get", userAuth, async (req, res) => {
  try {
    const { id } = req.headers;
    const user = await User.findById(id).populate("cart");
    const cart = user.cart.reverse();
    res.status(200).json({ cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
