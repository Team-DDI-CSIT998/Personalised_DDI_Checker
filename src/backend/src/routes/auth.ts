// routes/auth.ts
import express, { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Account, { IAccount, Role } from "../models/Account";

const router = express.Router();

router.post("/register", async (req: Request, res: Response) => {
  try {
    const { email, password, role, confirmRoleAddition } = req.body;
    if (!email || !password || !role) {
      res.status(400).json({ message: "Email, password, and role are required." });
      return;
    }

    const existingAccount: IAccount | null = await Account.findOne({ email });
    if (existingAccount) {
      if (existingAccount.roles.includes(role)) {
        res.status(400).json({ message: "User already exists with this role." });
        return;
      } else {
        if (!confirmRoleAddition) {
          res.status(409).json({
            message: "This email is already registered. Do you want to add the new role to your account?",
            addNewRole: true
          });
          return;
        } else {
          existingAccount.roles.push(role);
          await existingAccount.save();
          const token = jwt.sign({ id: existingAccount._id }, process.env.JWT_SECRET as string, { expiresIn: "1h" });
          res.json({ message: "Role added successfully", token, user: existingAccount });
          return;
        }
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newAccount = new Account({
        email,
        password: hashedPassword,
        roles: [role]
      });
      await newAccount.save();
      const token = jwt.sign({ id: newAccount._id }, process.env.JWT_SECRET as string, { expiresIn: "1h" });
      res.status(201).json({ message: "User registered successfully", token, user: newAccount });
      return;
    }
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message || "Failed to register user" });
    return;
  }
});

router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const account = await Account.findOne({ email });
    if (!account) {
      res.status(400).json({ message: "User not found" });
      return;
    }

    const isMatch = await bcrypt.compare(password, account.password);
    if (!isMatch) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    const token = jwt.sign({ id: account._id }, process.env.JWT_SECRET as string, { expiresIn: "1h" });
    res.status(200).json({
      message: "Login successful",
      token,
      user: { id: account._id, email: account.email, roles: account.roles }
    });
    return;
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message || "Failed to login" });
    return;
  }
});

export default router;
