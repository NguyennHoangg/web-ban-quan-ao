import ProductCard from '../../components/productCard/ProductCard';
import styles from './ProductPage.module.css';

const productList = [
    {
        id: 1,
        imageUrl: 'https://images.unsplash.com/photo-1516826957135-700dedea698c?auto=format&fit=crop&w=700&q=80',
        category: 'Crewneck T-Shirt',
        badge: '+6',
        title: 'BASIC',
        price: '199',
    },
];

export default function ProductPage() {
    return (
        <div className={styles.productPage}>
            <div className={styles.wrapper}>
                {productList.map((product) => (
                    <ProductCard
                        key={product.id}
                        imageUrl={product.imageUrl}
                        category={product.category}
                        badge={product.badge}
                        title={product.title}
                        price={product.price}
                    />
                ))}
            </div>
        </div>
    );
}