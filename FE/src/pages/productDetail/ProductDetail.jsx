import styles from './ProductDetail.module.css';
import { useParams, useLocation } from 'react-router-dom';

export default function ProductDetail() {
    const { slug } = useParams();
    const location = useLocation();
    const product = location.state?.product;

    // Product detail page
    if (!product) {
        return (
            <div className={styles.detailPage}>
                <div className={styles.wrapper}>
                    <p>Loading product details...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.detailPage}>
            <div className={styles.detailContainer}>
                {/* Product image */}
                <div className={styles.imageSection}>
                    <img 
                        src={product.primary_image?.url} 
                        alt={product.name}
                        className={styles.productImage}
                    />
                </div>

                {/* Product info */}
                <div className={styles.infoSection}>
                    <div className={styles.header}>
                        <p className={styles.category}>{product.category_name}</p>
                        <h1 className={styles.title}>{product.name}</h1>
                    </div>

                    {/* Rating */}
                    {product.avg_rating > 0 && (
                        <div className={styles.rating}>
                            <span className={styles.stars}>★ {parseFloat(product.avg_rating).toFixed(1)}</span>
                            <span className={styles.reviewCount}>({product.review_count} reviews)</span>
                        </div>
                    )}

                    {/* Price and stock */}
                    <div className={styles.priceSection}>
                        <span className={styles.price}>₫{parseFloat(product.display_price).toLocaleString('vi-VN')}</span>
                        <span className={styles.stock}>Stock: {product.total_stock}</span>
                    </div>

                    {/* Badges */}
                    <div className={styles.badges}>
                        {product.is_new && <span className={styles.badge}>New</span>}
                        {product.is_bestseller && <span className={styles.badge}>Bestseller</span>}
                        {product.is_featured && <span className={styles.badge}>Featured</span>}
                    </div>

                    {/* Sold info */}
                    {product.sold_count > 0 && (
                        <p className={styles.soldInfo}>Sold: {product.sold_count} items</p>
                    )}

                    {/* TODO: Add product details section here */}
                    <div className={styles.placeholder}>
                        <p>Product details section - customize as needed</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
