/**
 * User Service
 * @description Xử lý các chức năng quản lý thông tin profile người dùng
 */

const {
  findUserById,
  updateUserProfile,
} = require("../model/user.model");
const {
  createError,
  USER_ERRORS,
  DB_ERRORS,
  VALIDATION_ERRORS,
} = require("../constants");
const { createValidationError } = require("../constants/errors");

class UserService {
  /**
   * Laays chi tiết profile người dùng
   * @param {string} userId User Id
   * @returns {User} neeus thanh cong
   */
  async getProfile(userId) {
    try {
      if (!userId) {
        throw createError(VALIDATION_ERRORS.MISSING_REQUIRED_FIELD);
      }

      const result = await findUserById(userId);
      if (!result) {
        throw createError(USER_ERRORS.USER_NOT_FOUND);
      }

      return {
        id: result.id,
        email: result.email,
        full_name: result.full_name,
        phone: result.phone,
        avatar_url: result.avatar_url,
        role: result.role,
        tier: result.tier,
        loyalty_points: result.loyalty_points,
        total_spent: result.total_spent,
        total_orders: result.total_orders,
        created_at: result.created_at,
      };
    } catch (error) {
      if (error.isOperational) {
        throw error;
      }
      throw createError(DB_ERRORS);
    }
  }

  /**
   * Update profile
   * @param {String} userId User Id
   * @param {String} full_name
   */

  async updateProfile({ id, full_name, date_of_birth, gender, email, phone }) {
    try {
      const errs = [];
      if (!id) {
        errs.push({ field: "id", message: "Id là bắt buộc" });
      }
      if (!full_name) {
        errs.push({ field: "full_name", message: "Họ tên là bắt buộc" });
      }
      if (!email) {
        errs.push({ field: "email", message: "Email là bắt buộc" });
      }
      if (!date_of_birth) {
        errs.push({ field: "date_of_birth", message: "Ngày sinh là bắt buộc" });
      }
      if (!gender) {
        errs.push({ field: "gender", message: "Giới tính là bắt buộc" });
      }
      if (!phone) {
        errs.push({ field: "phone", message: "Số điện thoại là bắt buộc" });
      }

      if (errs.length > 0) {
        throw createValidationError(errs);
      }
      // Kiểm tra tồn tại
      const existingUser = await findUserById(id);
      if (!existingUser) {
        throw createError(USER_ERRORS.USER_NOT_FOUND);
      }

      // Cập nhật thông tin người dùng
      const updateduser = await updateUserProfile({
        id,
        full_name,
        date_of_birth,
        gender,
        email,
        phone
      });

      // Kiểm tra cập nhật thành công
      if (!updateduser) {
        throw createError(USER_ERRORS.USER_NOT_FOUND);
      }

      // Trả về thông tin người dùng đã cập nhật
      return {
          id: updateduser.id,
          email: updateduser.email,
          full_name: updateduser.full_name,
          phone: updateduser.phone,
          avatar_url: updateduser.avatar_url,
          role: updateduser.role,
          tier: updateduser.tier,
          loyalty_points: updateduser.loyalty_points,
          total_spent: updateduser.total_spent,
          total_orders: updateduser.total_orders,
          created_at: updateduser.created_at,
          updated_at: updateduser.updated_at,
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new UserService();
