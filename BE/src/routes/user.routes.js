const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/authMiddleware');
const userController = require('../controller/user.controller');

router.get('/get-profile/:id', authenticate, userController.getProfile);

module.exports = router;