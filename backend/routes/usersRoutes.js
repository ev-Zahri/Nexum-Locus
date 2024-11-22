const express = require('express');
const { login, register, getProfile, updateProfile,logout } = require('../controllers/usersController');
const authenticate = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile/:id', authenticate, getProfile);
router.put('/profile/:id', authenticate, updateProfile);
router.get('/logout', logout);

module.exports = router;