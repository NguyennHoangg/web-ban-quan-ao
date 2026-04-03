/**
 * JWT Configuration
 * @description Cấu hình JWT secret keys và expiration times
 */

require('dotenv').config();

module.exports = {
  jwtSecret: process.env.JWT_SECRET_KEY,
  jwtRefresh: process.env.JWT_REFRESH_KEY,
  jwtExpire: "1d",
  jwtfreshExpire: "7d"
};
