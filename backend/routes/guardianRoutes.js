const express = require('express');
const router = express.Router();
const Guardian = require('../models/Guardian');

// Register a new guardian
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please fill in all fields' });
    }

    const existingGuardian = await Guardian.findOne({ email });
    if (existingGuardian) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const newGuardian = new Guardian({ name, email, password });
    await newGuardian.save();

    res.status(201).json({ message: 'Guardian registered successfully', guardian: newGuardian });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});
// Login an existing guardian
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please enter both email and password' });
    }

    const guardian = await Guardian.findOne({ email });
    if (!guardian) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    if (guardian.password !== password) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    res.status(200).json({ message: 'Login successful', guardian });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});
module.exports = router;