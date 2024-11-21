const express = require('express');
const bodyParser = require('body-parser');
const usersRoutes = require('./routes/usersRoutes');
require('dotenv').config();
const app = express();
app.use(express.json());

// Middleware
app.use(bodyParser.json());
app.use('/users', usersRoutes);

module.exports = app;