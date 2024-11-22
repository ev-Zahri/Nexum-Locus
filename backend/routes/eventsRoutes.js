const express = require('express');
const authenticate = require('../middleware/authMiddleware');
const { getAllEvents, getEvent, addEvent, updateEvent, deleteEvent } = require('../controllers/eventsController');
const router = express.Router();

router.get('/event', getEvent);
router.get('/events', getAllEvents);
router.post('/events', addEvent);
router.put('/events/:id', updateEvent);
router.delete('/events/:id', deleteEvent);

module.exports = router;