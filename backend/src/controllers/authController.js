import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { store } from "../data/store.js";
import { User } from "../models/User.js";
import { generateId } from "../utils/generateId.js";

const signToken = (user) =>
  // The demo app uses a default secret so local setup works before env files are copied.
  jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
      name: user.name,
    },
    process.env.JWT_SECRET || "campusx-super-secret",
    { expiresIn: "7d" }
  );

const sanitizeUser = (user) => {
  const { password, ...safeUser } = user;
  return safeUser;
};

export const signup = async (req, res) => {
  const { name, email, password, role, collegeName, phone } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email, and password are required." });
  }

  const users = await store.getUsers();
  const existingUser = users.find((user) => user.email.toLowerCase() === email.toLowerCase());

  if (existingUser) {
    return res.status(409).json({ message: "An account with this email already exists." });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = {
    _id: generateId("user"),
    name,
    email: email.toLowerCase(),
    password: hashedPassword,
    role: role || "user",
    collegeName: collegeName || "CampusX Partner College",
    phone: phone || "+91 9000000000",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80",
    createdAt: new Date().toISOString(),
  };

  if (mongoose.connection.readyState === 1) {
    const createdUser = await User.create(newUser);
    return res.status(201).json({
      message: "Account created successfully.",
      token: signToken(createdUser.toObject()),
      user: sanitizeUser(createdUser.toObject()),
    });
  }

  await store.saveUsers([newUser, ...users]);

  return res.status(201).json({
    message: "Account created successfully.",
    token: signToken(newUser),
    user: sanitizeUser(newUser),
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  const users = await store.getUsers();
  const user = users.find((item) => item.email.toLowerCase() === email.toLowerCase());

  if (!user) {
    return res.status(401).json({ message: "Invalid email or password." });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(401).json({ message: "Invalid email or password." });
  }

  return res.json({
    message: "Login successful.",
    token: signToken(user),
    user: sanitizeUser(user),
  });
};

export const getProfile = async (req, res) => {
  const users = await store.getUsers();
  const user = users.find((item) => item._id.toString() === req.user.id.toString());

  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }

  return res.json({ user: sanitizeUser(user) });
};
