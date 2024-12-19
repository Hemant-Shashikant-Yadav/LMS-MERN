const mongoose = require("mongoose");

const connect = async () => {
  try {
    await mongoose.connect(process.env.URI);
    console.log("Connected to database sucessfully");
  } catch (error) {
    console.error("Databse connection error: " + error);
  }
};

connect();
