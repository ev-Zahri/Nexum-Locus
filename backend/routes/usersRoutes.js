const express = require('express');
const { login, register, getProfile, updateProfile,logout } = require('../controllers/usersController');
const { authenticate, authorize } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile/:id', authenticate, authorize(['user', 'admin']), getProfile);
router.put('/profile/:id', authenticate, authorize(['user', 'admin']), updateProfile);
router.get('/logout', authorize(['user', 'admin']), logout);

module.exports = router;