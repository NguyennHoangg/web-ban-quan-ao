const { query } = require("../config/db");

/**
 * Bản đồ sắp xếp cho các trường hợp sort khác nhau
 * - newest: Sắp xếp theo ngày tạo mới nhất (created_at DESC)
 * - oldest: Sắp xếp theo ngày tạo cũ nhất
 * - price_asc: Sắp xếp theo giá tăng dần
 * - price_desc: Sắp xếp theo giá giảm dần
 * - name_asc: Sắp xếp theo tên A-Z
 * - name_desc: Sắp xếp theo tên Z-A
 * - best_selling: Sắp xếp theo số lượng đã bán giảm dần
 * - rating: Sắp xếp theo đánh giá giảm dần
 * */
const SORT_MAP = {
  newest: { col: "sort_key", dir: "DESC", cursorCol: "sort_key" },
  oldest: { col: "sort_key", dir: "ASC", cursorCol: "sort_key" },
  price_asc: { col: "display_price", dir: "ASC", cursorCol: "display_price" },
  price_desc: {
    col: "display_price",
    dir: "DESC",
    cursorCol: "display_price",
  },
  name_asc: { col: "name", dir: "ASC", cursorCol: "name" },
  name_desc: { col: "name", dir: "DESC", cursorCol: "name" },
  best_selling: { col: "sold_count", dir: "DESC", cursorCol: "sold_count" },
  rating: { col: "avg_rating", dir: "DESC", cursorCol: "avg_rating" },
};

const PRODUCT_IMAGE_JSON_SQL = `
  jsonb_build_object(
    'id', pi.id,
    'url', pi.url,
    'thumbnail_url', pi.thumbnail_url,
    'alt_text', pi.alt_text,
    'is_primary', pi.is_primary,
    'sort_order', pi.sort_order
  )
`;

const VARIANT_IMAGES_SQL = `
  SELECT jsonb_agg(
    ${PRODUCT_IMAGE_JSON_SQL}
    ORDER BY pi.sort_order ASC, pi.created_at ASC
  ) AS images
  FROM product_images pi
  WHERE pi.variant_id = pv.id
`;

const PRODUCT_VARIANT_IMAGES_SQL = `
  SELECT jsonb_agg(
    ${PRODUCT_IMAGE_JSON_SQL}
    ORDER BY pi.sort_order ASC, pi.created_at ASC
  ) AS product_images
  FROM product_images pi
  WHERE pi.product_id = p.id
    AND pi.variant_id IS NULL
`;

const PRIMARY_PRODUCT_IMAGE_SQL = `
  SELECT jsonb_build_object(
    'id', pi.id,
    'url', pi.url,
    'thumbnail_url', pi.thumbnail_url,
    'alt_text', pi.alt_text,
    'is_primary', pi.is_primary,
    'sort_order', pi.sort_order
  ) AS primary_image
  FROM product_images pi
  WHERE pi.product_id = p.id
  ORDER BY pi.is_primary DESC, pi.sort_order ASC, pi.created_at ASC
  LIMIT 1
`;

const PRODUCT_LIST_SQL = ({ whereClause, cursorClause, col, dir, limitPlaceholder }) => `
  WITH list AS (
    SELECT
      p.id,
      p.name,
      p.slug,
      p.short_description,
      p.brand,
      COALESCE(p.published_at, p.updated_at) AS sort_key,
      COALESCE(v.price_min, p.base_price) AS display_price,
      COALESCE(v.total_stock, 0) AS total_stock,
      p.avg_rating,
      p.review_count,
      p.sold_count,
      p.is_featured,
      p.is_new,
      p.is_bestseller,
      c.id AS category_id,
      c.name AS category_name,
      c.slug AS category_slug,
      img.primary_image
    FROM products p
    LEFT JOIN categories c ON c.id = p.category_id
    LEFT JOIN LATERAL (
      SELECT
        MIN(pv.price) AS price_min,
        SUM(COALESCE(pv.stock_qty, 0)) AS total_stock
      FROM product_variants pv
      WHERE pv.product_id = p.id AND pv.is_active = TRUE
    ) v ON TRUE
    LEFT JOIN LATERAL (
      ${PRIMARY_PRODUCT_IMAGE_SQL}
    ) img ON TRUE
    ${whereClause}
  )
  SELECT *
  FROM list
  ${cursorClause}
  ORDER BY ${col} ${dir}, id ${dir}
  LIMIT ${limitPlaceholder};
`;

const VARIANTS_SQL = `
  SELECT jsonb_agg(
    jsonb_build_object(
      'id', pv.id,
      'sku', pv.sku,
      'size', pv.size,
      'color', pv.color,
      'price', pv.price,
      'sale_price', pv.sale_price,
      'stock_qty', pv.stock_qty,
      'sold_qty', pv.sold_qty,
      'image_url', pv.image_url,
      'is_active', pv.is_active,
      'is_default', pv.is_default,
      'images', COALESCE(vi.images, '[]'::jsonb)
    )
    ORDER BY pv.is_default DESC, pv.created_at ASC
  ) AS variants
  FROM product_variants pv
  LEFT JOIN LATERAL (
    ${VARIANT_IMAGES_SQL}
  ) vi ON true
  WHERE pv.product_id = p.id
`;

const PRODUCT_DETAIL_SQL = `
  SELECT
    p.id,
    p.name,
    p.slug,
    p.sku,
    p.short_description,
    p.description,
    p.brand,
    p.base_price,
    p.requires_shipping,
    p.weight_grams,
    p.sold_count,
    p.avg_rating,
    p.review_count,
    p.is_featured,
    p.is_new,
    p.is_bestseller,
    p.published_at,
    p.created_at,
    p.updated_at,
    c.id AS category_id,
    c.name AS category_name,
    c.slug AS category_slug,
    COALESCE(v.variants, '[]'::jsonb) AS variants,
    COALESCE(img.product_images, '[]'::jsonb) AS product_images
  FROM products p
  LEFT JOIN categories c ON c.id = p.category_id
  LEFT JOIN LATERAL (
    ${VARIANTS_SQL}
  ) v ON true
  LEFT JOIN LATERAL (
    ${PRODUCT_VARIANT_IMAGES_SQL}
  ) img ON true
  WHERE p.slug = $1;
`;

/**
 * Tìm kiếm nhiều sản phẩm với các tùy chọn lọc và sắp xếp
 *
 * @param {String} param.category_id id của danh mục để lọc sản phẩm (tùy chọn)
 * @param {String} param.sort sắp xếp theo một trong các giá trị: 'newest', 'oldest', 'price_asc', 'price_desc', 'name_asc', 'name_desc', 'best_selling', 'rating'
 * @param {Number} param.limit giới hạn số lượng sản phẩm trả về (mặc định là 10)
 * @param {Object} param.cursor là một đối tượng chứa thông tin về vị trí hiện tại trong phân trang, bao gồm:
 *   - value: giá trị của trường sắp xếp (ví dụ: created_at, price, name, sold_count, rating)
 *   - id: id của sản phẩm để đảm bảo tính duy nhất trong phân trang
 * @returns số lượng sản phẩm tìm được dựa trên các điều kiện lọc và sắp xếp đã cho
 * @throws lỗi nếu có vấn đề trong quá trình truy vấn cơ sở dữ liệu
 */
const findManyForList = async ({
  category_id,
  sort = "newest",
  limit = 10,
  cursor,
  min_price,
  max_price,
  inStock,
  rating,
}) => {
  try {
    const { col, dir, cursorCol } = SORT_MAP[sort] || SORT_MAP.newest;
    const op = dir === "DESC" ? "<" : ">";
    const params = [];
    const conditions = [];

    conditions.push(`p.status = 'active'`);

    if (category_id) {
      params.push(category_id);
      conditions.push(`p.category_id = $${params.length}`);
    }

    if (min_price !== undefined) {
      params.push(min_price);
      conditions.push(
        `COALESCE(v.price_min, p.base_price) >= $${params.length}`,
      );
    }

    if (max_price !== undefined) {
      params.push(max_price);
      conditions.push(
        `COALESCE(v.price_min, p.base_price) <= $${params.length}`,
      );
    }

    if (inStock === true) {
      conditions.push(`COALESCE(v.total_stock, 0) > 0`);
    }

    if (rating !== undefined) {
      params.push(rating);
      conditions.push(`p.avg_rating >= $${params.length}`);
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    let cursorClause = "";
    if (cursor && cursor.value !== undefined && cursor.id) {
      params.push(cursor.value, cursor.id);
      cursorClause = `
        WHERE (
          list.${cursorCol} ${op} $${params.length - 1}
          OR (list.${cursorCol} = $${params.length - 1} AND list.id ${op} $${params.length})
        )
      `;
    }

    params.push(limit);
    const sql = PRODUCT_LIST_SQL({
      whereClause,
      cursorClause,
      col,
      dir,
      limitPlaceholder: `$${params.length}`,
    });


    const { rows } = await query(sql, params);
    return rows;
  } catch (error) {
    console.error("Error in findManyForList:", error);
    throw error;
  }
};

/**
 * Hàm tìm kiếm chi tiết một sản phẩm dựa trên slug, bao gồm thông tin cơ bản, các biến thể và hình ảnh liên quan
 * @param {*} slug slug của sản phẩm cần tìm kiếm chi tiết
 * @returns thông tin chi tiết của sản phẩm, bao gồm các trường cơ bản và các biến thể, hình ảnh liên quan
 * @throws lỗi nếu có vấn đề trong quá trình truy vấn cơ sở dữ liệu
 */
const findByIdDetailBySlug = async (slug) => {
  try {
    const sql = PRODUCT_DETAIL_SQL;

    const { rows } = await query(sql, [slug]);
    return rows[0] || null;
  } catch (error) {
    console.error("Error in findByIdDetailBySlug:", error);
    throw error;
  }
};

const createProduct = async (newProduct) => {
  try {
    query("BEGIN");
    const insertProductSql = `
          INSERT INTO products (
            name, slug, sku, short_description, description, brand, base_price,
            requires_shipping, weight_grams, status, is_featured, is_new,
            is_bestseller, published_at, meta_title, meta_description, meta_keywords,
            category_id, created_at, updated_at
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7,
            $8, $9, $10, $11, $12,
            $13, $14, $15, $16,
            $17, NOW(), NOW()
          ) RETURNING id;
        `;
  } catch (error) {
    query("ROLLBACK");
    console.error("Error in createProduct:", error);
    throw error;
  }
};

const updateProduct = async (product) => {};

const deleteProduct = async (id) => {};

module.exports = {
  findManyForList,
  findByIdDetailBySlug,
};
