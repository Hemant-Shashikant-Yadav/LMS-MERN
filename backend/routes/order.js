const express = require("express");
const router = express.Router();
const userAuth = require("./userAuth");
const Order = require("../models/order");
const User = require("../models/user");

// add order
router.post("/add", userAuth, async (req, res) => {
  try {
    const { id } = req.headers;
    const { order } = req.body;

    for (const orderData of order) {
      const newOrder = new Order({
        user: id,
        book: orderData._id,
      });
      const orderDataDB = await newOrder.save();

      await User.findByIdAndUpdate(id, {
        $push: { orders: orderDataDB._id },
      });
      await Book.findByIdAndUpdate(orderData._id, {
        $pull: { cart: orderDataDB._id },
      });

      res.status(200).json({ message: "Order placed successfully" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// get order history
router.get("/history", userAuth, async (req, res) => {
  try {
    const { id } = req.headers;
    const user = await User.findById(id).populate({
      path: "orders",
      populate: {
        path: "book",
      },
    });
    const order = user.orders.reverse();

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// get all order details
router.get("/all", userAuth, async (req, res) => {
  try {
    const { id } = req.headers;
    const user = await User.findById(id);
    if (user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const order = await Order.find()
      .populate("book")
      .populate("user")
      .sort({ createdAt: -1 });
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// updae order status
router.put("/update/:id", userAuth, async (req, res) => {
  try {
    const { id } = req.headers;
    const user = await User.findById(id);
    if (user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { bookid } = req.params;

    await Order.findByIdAndUpdate(bookid, { status }, { new: true });
    res.status(200).json({ message: "Order status updated" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
