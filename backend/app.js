const express = require("express");

const app = express();

require("dotenv").config();
require("./connection/connection");
const userRoute = require("./routes/user");
const bookRoute = require("./routes/book");
const cartRoute = require("./routes/cart");
const orderRoute = require("./routes/order");
const favouriteRoute = require("./routes/favourite");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/user", userRoute);
app.use("/api/book", bookRoute);
app.use("/api/cart", cartRoute);
app.use("/api/order", orderRoute);
app.use("/api/favourite", favouriteRoute);

app.listen(
  process.env.PORT,
  console.log("Server started http://localhost:8000")
);
