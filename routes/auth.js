const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');


// Generate a strong secret key
const secretKey = process.env.SECRET_KEY;
// Calculate the expiration time for 7 days in seconds
const expiresIn = 7 * 24 * 60 * 60;

// Register a new user
// POST REQUEST
router.post('/register', async (req, res) => {
    try {
      const { fullname, email, password } = req.body;
  
      // Check if the email is already in use
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).json({ error: 'Email already in use' });
      }
  
      // If the email is unique, proceed to create the user
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({ fullname, email, password: hashedPassword });
      await user.save();
      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      res.status(500).json({ error: `Internal server error ${error}` });
    }

});
  
// Login user
// POST REQUEST
router.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ error: 'Authentication failed' });
      }
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ error: 'Authentication failed' });
      }
      
      // Generate a JWT token with the user's ID and sign it with the secret key
      const token = jwt.sign({ userId: user._id }, secretKey, { expiresIn });
      
      // Return the token with 'Bearer' prefix
      res.status(200).json({ token: `Bearer ${token}` });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
});


module.exports = router;
