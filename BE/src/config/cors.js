/**
 * CORS Configuration
 * @description Cấu hình Cross-Origin Resource Sharing
 */

require('dotenv').config();

module.exports = {
   origin: process.env.CLIENT_URL || 'http://localhost:5173' || 'https://web-ban-quan-ao-nu.vercel.app/',
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};

