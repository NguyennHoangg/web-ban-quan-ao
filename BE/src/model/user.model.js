/**
 * User Model
 * @description Quản lý dữ liệu và thao tác với bảng users
 */

const { query, getClient } = require("../config/db");
const { createError } = require("../constants");

const {
  DB_ERRORS,
  USER_ERRORS,
  AUTH_ERRORS,
  VALIDATION_ERRORS,
} = require("../constants");
/**
 * Create a new user (profile data only, no password)
 * Password is stored in separate accounts table
 * @param {Object} userData - User data object
 * @param {string} userData.id - User ID (generated)
 * @param {string} userData.email - User email
 * @param {string} userData.fullName - User full name
 * @param {string} userData.phone - User phone number
 * @param {string} userData.role - User role (default: 'customer')
 * @returns {Promise<Object>} Created user
 */
const createUser = async (userData) => {
  const { id, email, fullName, phone, role = "customer" } = userData;

  // Validate required fields
  if (!id || !email || !fullName || !phone) {
    throw new Error("Missing required fields: id, email, fullName, phone");
  }

  try {
    // Insert user query (profile data only)
    const insertQuery = `
      INSERT INTO users (id, email, phone, full_name, role, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
      RETURNING id, email, full_name, phone, role, created_at
    `;

    const result = await query(insertQuery, [
      id,
      email,
      phone,
      fullName,
      role,
    ]);

    return result.rows[0];
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

/**
 * Find user by email
 * @param {string} email - User email
 * @returns {Promise<Object|null>} User object or null
 */
const findUserByEmail = async (email) => {
  try {
    const result = await query("SELECT * FROM users WHERE email = $1 LIMIT 1", [
      email,
    ]);

    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    console.error("Error finding user by email:", error);
    throw error;
  }
};

/**
 * Find user by ID
 * @param {string} userId - User ID
 * @returns {Promise<Object|null>} User object or null
 */
const findUserById = async (userId) => {
  try {
    const result = await query("SELECT * FROM users WHERE id = $1 LIMIT 1", [
      userId,
    ]);

    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    console.error("Error finding user by ID:", error);
    throw error;
  }
};

/**
 * Update user profile
 * @param {Object} userData - User data object
 * @param {string} userData.id - User ID (required)
 * @param {string} [userData.full_name] - User full name
 * @param {string} [userData.date_of_birth] - User date of birth
 * @param {string} [userData.gender] - User gender
 * @param {string} [userData.email] - User email
 * @param {string} [userData.phone] - User phone number
 * @returns {Promise<Object>} Updated user
 */
const updateUserProfile = async (userData) => {
  try {
    const { id, full_name, date_of_birth, gender, email, phone } = userData;

    // Validate required fields
    if (!id) {
      throw createError(
        VALIDATION_ERRORS.MISSING_REQUIRED_FIELD,
        "Id là bắt buộc",
      );
    }

    // Build dynamic update query based on provided fields
    const result = await query(
      `UPDATE users SET 
         full_name = COALESCE($1, full_name),
         date_of_birth = COALESCE($2, date_of_birth),
         gender = COALESCE($3, gender),
         email = COALESCE($4, email),
         phone = COALESCE($5, phone),
         updated_at = NOW()
         WHERE id = $6
         RETURNING id, email, full_name, phone, date_of_birth, gender, email, phone, role, tier, loyalty_points, total_spent, total_orders, updated_at`,
      [full_name, date_of_birth, gender, email, phone, id],
    );

    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    throw error;
  }
};


module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
  updateUserProfile
};
