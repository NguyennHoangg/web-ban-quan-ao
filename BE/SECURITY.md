# Biện Pháp Bảo Mật (Security Measures)

## 🛡️ Tóm Tắt

Dự án đã implement các biện pháp bảo mật quan trọng để chống lại các lỗ hổng phổ biến.

---

## ✅ 1. SQL Injection Protection

### Đã Implement:

#### ✅ Parameterized Queries
Tất cả queries trong models đều sử dụng **parameterized queries** với PostgreSQL:

```javascript
// ✅ AN TOÀN - Dùng $1, $2, $3 với array parameters
await query(
  'SELECT * FROM users WHERE email = $1 LIMIT 1',
  [email]
);
```

**Files protected:**
- [`src/model/user.model.js`](src/model/user.model.js)
- [`src/model/account.model.js`](src/model/account.model.js)
- [`src/model/session.model.js`](src/model/session.model.js)

#### ✅ Whitelist Validation cho Dynamic Table/Field Names
File [`src/utils/generateId.js`](src/utils/generateId.js) đã được bảo vệ:

```javascript
// ✅ FIXED - Whitelist validation
const ALLOWED_TABLES = {
  'users': ['id', 'email'],
  'accounts': ['id', 'identifier'],
  'sessions': ['id', 'refresh_token'],
  // ...
};

const validateTableAndField = (tableName, idField) => {
  if (!ALLOWED_TABLES[tableName]) {
    throw new Error(`Invalid table name: ${tableName}`);
  }
  if (!ALLOWED_TABLES[tableName].includes(idField)) {
    throw new Error(`Invalid field name: ${idField}`);
  }
};
```

### ❌ Những gì KHÔNG NÊN làm:

```javascript
// ❌ NGUY HIỂM - String concatenation
await query(`SELECT * FROM users WHERE email = '${email}'`);

// ❌ NGUY HIỂM - Template literals với user input
await query(`SELECT * FROM ${tableName} WHERE id = $1`, [id]);
```

---

## ✅ 2. XSS (Cross-Site Scripting) Protection

### Đã Implement:

#### ✅ Input Sanitization với express-validator
File [`src/middlewares/validators/auth.validator.js`](src/middlewares/validators/auth.validator.js):

```javascript
body('email')
  .trim()
  .escape()  // ✅ Escape HTML characters
  .isEmail()
  .normalizeEmail()
  .toLowerCase()

body('fullName')
  .trim()
  .escape()  // ✅ Escape HTML characters
  .matches(/^[a-zA-ZÀ-ỹ\s]+$/)  // ✅ Chỉ cho phép chữ cái
```

**Chức năng:**
- `escape()`: Chuyển đổi `<`, `>`, `&`, `'`, `"` thành HTML entities
- `trim()`: Loại bỏ whitespace
- Pattern matching: Chỉ cho phép ký tự hợp lệ

---

## ✅ 3. Authentication & Authorization

### Đã Implement:

#### ✅ Password Hashing với bcrypt
```javascript
const hashedPassword = await bcrypt.hash(password, 10);
```

#### ✅ JWT Token Authentication
- **Access Token**: Short-lived (15 phút)
- **Refresh Token**: Long-lived (7 ngày), stored in HTTP-only cookie

#### ✅ HTTP-Only Cookies cho Refresh Token
```javascript
res.cookie("refreshToken", token, {
  httpOnly: true,        // ✅ Không thể truy cập từ JavaScript
  secure: true,          // ✅ HTTPS only trong production
  sameSite: 'strict',    // ✅ CSRF protection
  maxAge: 7 * 24 * 60 * 60 * 1000
});
```

#### ✅ Session Management
- Tracking active sessions per user
- Device information logging
- IP address logging
- Session invalidation on logout

---

## ✅ 4. Input Validation

### Validation Layers:

#### Layer 1: Middleware Validation (Controller Level)
File: [`src/middlewares/validators/auth.validator.js`](src/middlewares/validators/auth.validator.js)

**Register Validation:**
- Email: Format validation, normalization
- Password: Min 6 chars, phải có hoa/thường/số
- Full Name: 2-100 chars, chỉ chữ cái
- Phone: Format số điện thoại Việt Nam
- Role: Whitelist ('customer' hoặc 'admin')

**Login Validation:**
- Email: Format validation
- Password: Required

#### Layer 2: Business Logic Validation (Service Level)
File: [`src/services/user.service.js`](src/services/user.service.js)

- Check user existence
- Check duplicate email/phone
- Password verification
- Account status verification

---

## ✅ 5. CORS Configuration

File: [`src/config/cors.js`](src/config/cors.js)

```javascript
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,  // ✅ Allow cookies
  optionsSuccessStatus: 200
};
```

---

## ⚠️ Recommendations & Best Practices

### 1. Environment Variables
Đảm bảo `.env` chứa:
```env
DB_PASSWORD=<strong-password>
JWT_SECRET=<random-secret-256-bits>
JWT_REFRESH_SECRET=<different-random-secret>
NODE_ENV=production
FRONTEND_URL=https://your-domain.com
```

### 2. Rate Limiting
**TODO:** Cần implement rate limiting cho APIs:
```bash
npm install express-rate-limit
```

### 3. Helmet.js
**TODO:** Thêm security headers:
```bash
npm install helmet
```

### 4. HTTPS Only
Trong production, **BẮT BUỘC** dùng HTTPS:
```javascript
secure: process.env.NODE_ENV === 'production'
```

### 5. Database User Permissions
- Tạo database user riêng cho app
- Chỉ cấp quyền SELECT, INSERT, UPDATE, DELETE
- **KHÔNG** cấp quyền DROP, ALTER

---

## 📋 Security Checklist

- [x] SQL Injection protection với parameterized queries
- [x] SQL Injection protection với whitelist validation
- [x] XSS protection với input sanitization
- [x] Password hashing với bcrypt
- [x] JWT authentication
- [x] HTTP-only cookies
- [x] CORS configuration
- [x] Input validation (2 layers)
- [x] Session management
- [ ] Rate limiting (**TODO**)
- [ ] Helmet.js security headers (**TODO**)
- [ ] HTTPS enforcement (**TODO** - Production)
- [ ] Database user permissions (**TODO**)

---

## 🔍 Testing Security

### Test SQL Injection:
```bash
# Test với malicious input
POST /api/auth/login
{
  "email": "admin@test.com' OR '1'='1",
  "password": "anything"
}
# Expected: Validation error hoặc Authentication failed
```

### Test XSS:
```bash
POST /api/auth/register
{
  "email": "test@test.com",
  "fullName": "<script>alert('XSS')</script>",
  "password": "Test123",
  "phone": "0912345678"
}
# Expected: Validation error - Invalid characters
```

---

## 📚 References

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP SQL Injection Prevention](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html)
- [OWASP XSS Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)

---

**Last Updated:** March 6, 2026
