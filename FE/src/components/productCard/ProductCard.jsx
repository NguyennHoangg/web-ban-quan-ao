import styles from './ProductCard.module.css';

export default function ProductCard({
    imageUrl,
    category,
    title,
    price,
    badge,
}) {
    return (
        <article className={styles.card}>
            <div className={styles.imageWrap}>
                <img src={imageUrl} alt={title} className={styles.image} />
            </div>

            <div className={styles.content}>
                <div className={styles.metaRow}>
                    <p className={styles.category}>{category}</p>
                    {badge ? <span className={styles.badge}>{badge}</span> : null}
                </div>

                <div className={styles.bottomRow}>
                    <h3 className={styles.title}>{title}</h3>
                    <span className={styles.price}>${price}</span>
                </div>
            </div>
        </article>
    );
}
