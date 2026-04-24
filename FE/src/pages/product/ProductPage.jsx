import styles from './ProductPage.module.css';
import ProductCard from '../../components/productCard/ProductCard';
import { useState, useEffect } from 'react';

// Initial empty state for products
const initialProducts = [];

export default function ProductPage() {
    const [products, setProducts] = useState(initialProducts);

    useEffect(() => {
        // Fetch products from API
        const fetchProducts = async () => {
            try {
                const res = await fetch('https://web-ban-quan-ao-9s0d.onrender.com/api/products/list');
                const data = await res.json();
                setProducts(data.products || []);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };
        fetchProducts();
    }, []);

    return (
        <div className={styles.productPage}>
            <div className={styles.wrapper}>
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
}