const express = require('express');
const router = express.Router();
const ProductController = require('../controller/product.controller');

/**
 * @route GET /api/products/list
 * @description Lấy danh sách sản phẩm với các tùy chọn lọc và phân trang
 * @queryParam {String} category_id - Lọc sản phẩm theo danh mục (tùy chọn)
 * @queryParam {String} sort - Sắp xếp sản phẩm theo trường (price, created_at, view_count, sold_count, avg_rating) và thứ tự (asc, desc), ví
 */
router.get('/list', ProductController.getManyForList);
router.get('/:slug', ProductController.getDetailsBySlug);


module.exports = router;