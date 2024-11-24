const express = require('express');
const { authenticate, authorize } = require('../middleware/authMiddleware');
const { getAllEvents, getEvent, addEvent, updateEvent, deleteEvent } = require('../controllers/eventsController');
const router = express.Router();

router.get('/event', getEvent);
router.get('/events', getAllEvents);
router.post('/events', authenticate, authorize(['admin']), addEvent);
router.put('/events/:id', authenticate, authorize(['admin']), updateEvent);
router.delete('/events/:id', authenticate, authorize(['admin']), deleteEvent);

module.exports = router;