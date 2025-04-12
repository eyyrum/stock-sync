const express = require('express');
const router = express.Router();
const { User } = require('../models');

// Get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new user
router.post('/', async (req, res) => {
  try {
    const { name, email, role } = req.body;
    const user = await User.create({
      name,
      email,
      role
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router; 