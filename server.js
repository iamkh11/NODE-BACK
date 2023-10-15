
// import express, { json } from 'express';
// import { connect } from 'mongoose';
const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const port = process.env.PORT ||3000;
const app = express();
require('dotenv').config();

const authMiddleware = require('./middleware/auth');

// Middleware
// app.use(bodyParser.json());
app.use(express.json());


app.get('/protected-route', authMiddleware, (req, res) => {
  res.json({ message: 'This route is protected and requires authentication' });
});

// Routes
const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes); 



app.get('/health', (req,res) => {
    res.json({
        status: 'UP',
        version: '1.0.0'
    });
});

// CONNECT TO MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Error connecting to MongoDB Atlas', err));






app.listen(port,'0.0.0.0', () => {
    console.log(`Server is RUNNING on http://0.0.0.0:${port}`)
});

