const { findManyForList, findProductDetailsBySlug, deleteProduct } = require("../services/product.service");

const ProductController = {
    async getManyForList(req, res, next) {
        try {
            const { category_id, sort, limit, cursor, min_price, max_price, inStock, rating } = req.query;
            const products = await findManyForList({
                category_id,
                sort,
                limit: parseInt(limit) || 10,
                cursor: cursor ? JSON.parse(cursor) : undefined,
                min_price: min_price !== undefined ? parseFloat(min_price) : undefined,
                max_price: max_price !== undefined ? parseFloat(max_price) : undefined,
                inStock: inStock === "true",
                rating:
                    rating !== undefined && rating !== ""
                        ? parseFloat(rating)
                        : undefined,
            });

            return res.status(200).json({
                success: true,
                data: { products },
            });
        } catch (error) {
           next(error);
        }   
    },

    /**
     * 
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     * @returns 
     */
    async getDetailsBySlug(req, res, next) {
    try {
      const { slug } = req.params;
      const product = await findProductDetailsBySlug(slug);
        if (!product) {
         return res.status(404).json({
            success: false,
            message: "Không tìm thấy sản phẩm với slug đã cho",
          });  
        
      }

      return res.status(200).json({
        success: true,
        data: {
          product
        }
    })

    } catch (error) {
        next(error);
    }
},

 async deleteProduct(req, res, next) {
    try {
      const { id } = req.params;
      const result = await deleteProduct(id);
      return res.status(200).json({
        success: true,
        message: "Xóa sản phẩm thành công",
      });
    } catch (error) {
      next(error);
    }
},
}


module.exports = ProductController;