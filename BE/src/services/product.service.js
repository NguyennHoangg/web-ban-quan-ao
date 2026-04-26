const {
  findManyForList: findManyForListModel,
  findByIdDetailBySlug,
  createProduct,
  deleteProduct: deleteProductFromDB,
  findByCategory,
  updateProduct,
} = require("../model/product.model");
const { DB_ERRORS, VALIDATION_ERRORS } = require("../constants");
const { createError, PRODUCT_ERRORS } = require("../constants/errors");

async function findManyForList({
  category_id,
  sort = "newest",
  limit = 10,
  cursor,
  min_price,
  max_price,
  inStock,
  rating,
}) {
  try {
    const result = await findManyForListModel({
      category_id,
      sort,
      limit,
      cursor,
      min_price,
      max_price,
      inStock,
      rating,
    });

    return result.map(({ sort_key, ...product }) => product);
  } catch (error) {
    throw error;
  }
}

const findProductDetailsBySlug = async (slug) => {
  try {
    if (!slug) {
      throw createError(
        VALIDATION_ERRORS.MISSING_REQUIRED_FIELD,
        "Slug là bắt buộc",
      );
    }
    const result = await findByIdDetailBySlug(slug);
    if (!result) {
      throw createError(
        PRODUCT_ERRORS.PRODUCT_NOT_FOUND,
        "Không tìm thấy sản phẩm với slug đã cho",
      );
    }
    return result;
  } catch (error) {
    throw error;
  }
};

const deleteProduct = async (id) => {
  try {
    if (!id) {
      throw createError(
        VALIDATION_ERRORS.MISSING_REQUIRED_FIELD,
        "Id là bắt buộc",
      );
    }
    const result = await deleteProductFromDB(id);
    if (!result) {
      throw createError(
        PRODUCT_ERRORS.PRODUCT_NOT_FOUND,
        "Không tìm thấy sản phẩm với id đã cho",
      );
    }
    return result;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  findManyForList,
  findProductDetailsBySlug,
  createProduct,
  deleteProduct,
  findByCategory,
  updateProduct,
};
