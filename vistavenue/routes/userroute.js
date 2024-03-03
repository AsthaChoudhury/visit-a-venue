const express = require("express");
const router = express.Router();
const userModel = require("../models/user");

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const newuser = new userModel({ name, email, password });
    const saveduser = await newuser.save();
    res
      .status(201)
      .json({ message: "User registered successfully", user: saveduser });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email, password });
    if (user) {
      const temp = {
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        _id: user._id,
      };
      res.send(temp);
    } else {
      return res.status(400).json({ message: "Login failed" });
    }
  } catch (error) {
    return res.status(400).json({ error });
  }
});

router.get("/getallusers", async (req, res) => {
  try {
    const users = await Users.find();
    res.send(users);
  } catch (error) {
    return res.status(400).json({ message: "user not found" });
  }
});

module.exports = router;
