const router = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// const { auth } = require("../middleware/auth");
const userAuth = require("./userAuth");

router.post("/signup", async (req, res) => {
  try {
    const { username, email, password, address } = req.body;

    // check username
    if (!username) {
      return res.status(400).json({ message: "Username is required" });
    } else if (this.length < 4) {
      return res
        .status(400)
        .json({ message: "Username must be at least 4 characters long" });
    }

    // if username already exists

    const existsting = await User.findOne({ username: username });
    if (existsting) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // check email
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    // if email already exists
    const emailExists = await User.findOne({ email: email });
    if (emailExists) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // check password
    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    } else if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }

    // check address
    if (!address) {
      return res.status(400).json({ message: "Address is required" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create new user
    const newUser = new User({
      username: username,
      email: email,
      password: hashedPassword,
      address: address,
    });

    await newUser.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ essage: error.message });
  }
});

router.post("/signin", async (req, res) => {
  try {
    const { username, password } = req.body;

    // check username
    const user = await User.findOne({ username: username });
    if (!user) {
      return res.status(400).json({ message: "Username is required" });
    } else if (this.length < 4) {
      return res
        .status(400)
        .json({ message: "Username must be at least 4 characters long" });
    }
    // check password

    await bcrypt.compare(password, user.password, (err, result) => {
      if (err) {
        return res.status(400).json({ message: "Invalid password" });
      }
      if (result) {
        // generate token
        const token = jwt.sign(
          { name: user.username, role: user.role },
          process.env.JWT_SECRET,
          {
            expiresIn: "1d",
          }
        );
        return res
          .status(200)
          .json({ id: user._id, role: user.role, token: token });
      }
      return res.status(400).json({ message: "Invalid password" });
    });
  } catch (error) {
    res.status(500).json({ essage: error.message });
  }
});

// get user info

router.get("/getuser", userAuth, async (req, res) => {
  try {
    const { id } = req.headers;
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ essage: error.message });
  }
});
module.exports = router;

// update address
router.put("/updateaddress", userAuth, async (req, res) => {
  try {
    const { id } = req.headers;
    const { address } = req.body;
    await User.findByIdAndUpdate(id, { address: address });
    res.status(200).json({ message: "Address updated successfully" });
  } catch (error) {
    res.status(500).json({ essage: error.message });
  }
});
