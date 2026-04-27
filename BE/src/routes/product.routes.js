const express = require('express');
const router = express.Router();
const ProductController = require('../controller/product.controller');

/**
 * @route GET /api/products/list
 * @description Lấy danh sách sản phẩm với các tùy chọn lọc và phân trang
 * @queryParam {String} category_id - Lọc sản phẩm theo danh mục (tùy chọn)
 * @queryParam {String} sort - Sắp xếp sản phẩm theo trường (price, created_at, view_count, sold_count, avg_rating) và thứ tự (asc, desc), ví dụ: "price:asc" (tùy chọn, mặc định: "created_at:desc")
 * @queryParam {Number} limit - Số lượng sản phẩm trả về trên mỗi trang (tùy chọn, mặc định: 10)
 * @queryParam {String} cursor - Giá trị của trường sắp xếp của sản phẩm cuối cùng trên trang trước để phân trang tiếp theo (tùy chọn)
 */
router.get('/list', ProductController.getManyForList);
router.get('/:slug', ProductController.getDetailsBySlug);
router.delete('/:id', ProductController.deleteProduct);

module.exports = router;