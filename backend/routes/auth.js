const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth.controller');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/users', authController.getUsers);
router.get('/user', authController.checkToken, (req, res) => {
    // Return user data
    res.json({ user: req.user });
});
router.get('/user/:id', authController.getUserById);
  

module.exports = router;