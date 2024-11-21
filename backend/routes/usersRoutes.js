const express = require('express');
const { login, register, getProfile, updateProfil,logout } = require('../controllers/usersController');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
// router.get('/profile', getProfile);
// router.put('/profile', updateProfil);
// router.get('/logout', logout);

module.exports = router;