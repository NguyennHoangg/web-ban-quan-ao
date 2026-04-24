/**
 * User Controller
 * @description Xử lý các chức năng liên quan đến thông tin profile người dùng
 */

const { createError } = require("../constants");
const { asyncHandler } = require("../middlewares/errorHandler");
const { HTTP_STATUS, USER_ERRORS, VALIDATION_ERRORS } = require("../constants");
const { getProfile, updateProfile } = require("../services/user.service");
const UserController = {
  /**
   * Lấy thông tin profile
   * GET /api/users/:id
   */
  getProfile: asyncHandler(async (req, res) => {
    try {
      const { id } = req.params;

      const user = await getProfile(id);

      return res.status(HTTP_STATUS.OK).json({
        success: true,
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  }),

  /**
   * Cập nhật thông tin profile
   * PUT /api/users/:id
   */
  updateProfile: asyncHandler(async (req, res) => {
    try {
      const { id, full_name, date_of_birth, gender, email, phone } = req.body;

      // Truyền object vào service - tối ưu khi có nhiều tham số
      const user = await updateProfile({
        id,
        full_name,
        date_of_birth,
        gender,
        email,
        phone,
      });

      return res.status(HTTP_STATUS.OK).json({
        success: true,
        message: "Cập nhật thông tin thành công",
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  }),
};

module.exports = UserController;
