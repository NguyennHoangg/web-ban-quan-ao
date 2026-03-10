const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/authMiddleware');
const userController = require('../controller/user.controller');

router.get('/get-profile/:id', authenticate, userController.getProfile);
router.put('/update-profile', authenticate, userController.updateProfile);
module.exports = router;