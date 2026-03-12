/**
 * Account Routes
 * @description Định nghĩa các routes cho account management (change password, reset...)
 */

const express = require('express');
const router = express.Router();
const AccountController = require('../controller/account.controller');
const { authenticate } = require('../middlewares/authMiddleware');

/**
 * Account Routes
 * Base path: /api/account
 * Xử lý các chức năng liên quan đến tài khoản và bảo mật
 */

/**
 * @route   PUT /api/account/change-password
 * @desc    Đổi mật khẩu
 * @access  Private (yêu cầu đăng nhập)
 */
router.put('/change-password', authenticate, AccountController.changePassword);

/**
 * @route   POST /api/account/forgot-password
 * @desc    Quên mật khẩu - gửi email reset
 * @access  Public
 */
router.post('/forgot-password', AccountController.forgotPassword);

/**
 * @route   POST /api/account/reset-password
 * @desc    Reset mật khẩu với token
 * @access  Public
 */
router.post('/reset-password', AccountController.resetPassword);

module.exports = router;
