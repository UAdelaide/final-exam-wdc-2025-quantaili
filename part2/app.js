const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '/public')));

// Routes
const walkRoutes = require('./routes/walkRoutes');
const userRoutes = require('./routes/userRoutes');
const dogRoutes = require('./routes/dogRoutes');
const walkRequestRoutes = require('./routes/walkRequestRoutes');
const walkerRoutes = require('./routes/walkerRoutes');

app.use('/api/walks', walkRoutes);
app.use('/api/users', userRoutes);
app.use('/api/dogs', dogRoutes);
app.use('/api/walkrequests', walkRequestRoutes);
app.use('/api/walkers', walkerRoutes);

// Export the app instead of listening here
module.exports = app;