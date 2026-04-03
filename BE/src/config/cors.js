/**
 * CORS Configuration
 * @description Cấu hình Cross-Origin Resource Sharing
 */

require('dotenv').config();

module.exports = {
  origin: process.env.CLIENT_URL,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};

