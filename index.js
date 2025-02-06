const express = require('express');
const { resolve } = require('path');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const User = require('./schema.js');

dotenv.config();

const app = express();
const port = 3010;

app.use(express.static('static'));

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to database'))
  .catch((err) => console.error('Error connecting to database:', err));

// POST API Endpoint
app.post('/api/users', async (req, res) => {
  try {
    const userData = req.body;

    // Validate and save user data
    const newUser = new User(userData);
    await newUser.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    if (error.name === 'ValidationError') {
      res
        .status(400)
        .json({ message: 'Validation error', details: error.message });
    } else {
      res.status(500).json({ message: 'Server error', details: error.message });
    }
  }
});

app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});