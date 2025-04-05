// import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";
import express, { Request, Response } from "express";

const router = express.Router();


// Register Route
router.post("/register", async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    console.log("existingUser", existingUser);
    if (existingUser) { res.status(400).json({ message: "User already exists" }); }
    else {
      // Hash Password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Save User
      const newUser = new User({ username, email, password: hashedPassword });
      await newUser.save();

      res.status(201).json({ message: "User registered successfully" });
    }

  }
  catch (err: any) {
    res.status(500).json({ error: err.message });
    // res.status(500).json({ error: err});
  }
});


// Login Route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    // if (!user) return res.status(400).json({ message: "User not found" });

    if (!user) {
      res.status(400).json({ message: "User not found" });
    } else {

      // Compare Password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) { res.status(400).json({ message: "Invalid credentials" }); } else {
        // Generate Token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, { expiresIn: "1h" });

        // res.json({ token, user: { id: user._id, username: user.username, email: user.email } });
        res.status(200).json({ message: "Login successful", token, user: { id: user._id, username: user.username, email: user.email } });

      }

    }


  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
