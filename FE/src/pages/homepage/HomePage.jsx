import styles from './HomePage.module.css';
import sampleImage1 from '../../assets/images/sample1.webp';
import sampleImage2 from '../../assets/images/sample2.webp';
import sampleImage3 from '../../assets/images/sample3.webp';
import sampleImage4 from '../../assets/images/sample4.webp';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import ProductCard from '../../components/productCard/ProductCard';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
// Initial empty state for products
const initialProducts = [];

export default function HomePage() {
    const [products, setProducts] = useState(initialProducts);

    useEffect(() => {
        // Initialize AOS (Animate On Scroll)
        AOS.init({
            duration: 1000,
            once: true,
            offset: 100
        });

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
        <div className={styles.homePage}>
            <section className={styles.heroSection} data-aos="fade-up">
                <div className={styles.heroContent}>
                    <div className={styles.left}>
                        <div className={styles.leftTop}>
                            <div className={styles.leftTopHeading}>
                                <div className={styles.row}>NEW</div>
                                <div className={styles.row}>COLLECTION</div>
                            </div>
                            <div className={styles.leftTopTime}>
                                <div>SUMMER</div>
                                <div>2026</div>
                            </div>
                        </div>
                        <Link to="/products">
                        <div className={styles.leftBottom}>
                            <button className={styles.shopNowButton}>Go To Shop <FontAwesomeIcon icon={faArrowRight} /></button>
                            
                            </div>
                        </Link>
                    </div>
                    <div className={styles.right}>
                        <video src="/3d-model.webm" autoPlay loop muted></video>
                    </div>
                </div>
            </section>
            <section className={styles.newThisWeekSection} data-aos="fade-up">
                <div className={styles.newThisWeek}>
                    <div className={styles.TopHeading}>
                        <div className={styles.leftTopHeadingNewThisWeek}>
                            <div className={styles.row}>NEW</div>
                            <div className={styles.row}>THIS WEEK</div>
                        </div>
                    </div>

                    <div className={styles.newThisWeekGrid}>
                        {products.filter(product => product.is_new).slice(0, 4).map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                    <div className={styles.viewAllLink}>
                        <Link to="/products"><button  className={styles.shopNowButton}>View All  <FontAwesomeIcon icon={faArrowRight} /></button></Link>
                    </div>
                </div>

            </section>
            <section className={styles.newThisWeekSection} data-aos="fade-up">
                <div className={styles.newThisWeek}>
                    <div className={styles.TopHeading}>
                        <div className={styles.leftTopHeadingNewThisWeek}>
                            <div className={styles.row}>The Weekend</div>
                            <div className={styles.row}>Collections</div>
                        </div>
                    </div>

                    <div className={styles.newThisWeekGrid}>
                        {products.filter(product => product.collections && product.collections.includes("The Weekend")).slice(0, 4).map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                    <div className={styles.viewAllLink}>
                        <Link to="/products"><button  className={styles.shopNowButton}>View All  <FontAwesomeIcon icon={faArrowRight} /></button></Link>
                    </div>
                </div>

            </section>
            <section className={styles.ourApproachToFashionDesign} >
                <div data-aos="fade-up">
                    <div className={styles.ourApproachToFashionDesignHeading}>Our Approach to fashion design </div>
                <div className={styles.ourApproachToFashionDesignContent}>At elegant vogue , we blend creativity with craftsmanship to create fashion that transcends trends and stands the test of time each design is meticulously crafted, ensuring the highest quelity exqulsite finish</div>
                
                </div>
                <div className={styles.ourApproachToFashionDesignImages} data-aos="fade-up">
                    <img src={sampleImage4} alt="Sample 4" />
                    <img src={sampleImage3} alt="Sample 3" />
                    
                    <img src={sampleImage1} alt="Sample 1" />
                </div>
            </section>
        </div>
    );
}