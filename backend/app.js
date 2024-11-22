const express = require('express');
const bodyParser = require('body-parser');
const usersRoutes = require('./routes/usersRoutes');
const eventsRoutes = require('./routes/eventsRoutes');
require('dotenv').config();
const app = express();
app.use(express.json());

// Middleware
app.use(bodyParser.json());
app.use('/api/users', usersRoutes);
app.use('/api', eventsRoutes);

module.exports = app;