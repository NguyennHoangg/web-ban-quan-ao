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
// Sample product data
const sampleProducts = [
    {
                "id": "prod_8ec172907730",
                "name": "Áo Tank Top EasyCare™ Waffle Ít Nhăn Giữ Phom Non Branded 002 Nâu",
                "slug": "ao-tank-top-easycare-waffle-it-nhan-giu-phom-non-branded-002-nau",
                "short_description": "Áo Tank Top EasyCare™ Waffle Ít Nhăn Giữ Phom Non Branded 002 Nâu",
                "brand": "YAME",
                "display_price": "99450.00",
                "original_price": "150000.00", 
                "discount_percent": 34,
                "total_stock": "594",
                "avg_rating": "4.8",
                "review_count": 15,
                "sold_count": 120,
                "is_featured": false,
                "is_new": true,
                "is_bestseller": false,
                "category_group": "tops",
                "is_sale": true,
                "has_variants": true,
                "category_id": "cat_186feb42c99b",
                "category_name": "Áo Thun TankTop (Áo Thun 3 Lỗ)",
                "category_slug": "ao-thun-tanktop-ao-thun-3-lo",
                "collections": ["The Weekend", "Summer 2026", "EasyCare Series"],
                "created_at": "2026-03-05T16:44:13.111Z",
                "primary_image": {
                    "id": "img_f09cf58af710",
                    "url": "https://yame.vn/cdn/shop/files/23717_thumb_1.jpg?v=1760775957&width=533",
                    "alt_text": "Áo Tank Top EasyCare™ Waffle",
                    "is_primary": true,
                    "sort_order": 0,
                    "thumbnail_url": "https://yame.vn/cdn/shop/files/23717_thumb_1.jpg?v=1760775957&width=533"
                }
            },
            {
                "id": "prod_6a403e854ef7",
                "name": "Áo Polo ColorLock™ Khóa Màu Pique Thoát Nhiệt The Weekend 008 Xanh Dương Trắng",
                "slug": "ao-polo-colorlock-khoa-mau-pique-thoat-nhiet-the-weekend-008-xanh-duong-trang",
                "short_description": "Áo Polo ColorLock™ chất liệu Pique thoáng mát, thiết kế phối màu hiện đại.",
                "brand": "YAME",
                "display_price": "434150.00",
                "original_price": "550000.00",
                "discount_percent": 21,
                "total_stock": "431",
                "avg_rating": "4.9",
                "review_count": 42,
                "sold_count": 215,
                "is_featured": true,
                "is_new": true,
                "is_bestseller": true,
                "category_group": "tops",
                "is_sale": true,
                "has_variants": true,
                "category_id": "cat_58ae251115cf",
                "category_name": "Áo Polo Tay Ngắn",
                "category_slug": "ao-polo-tay-ngan",
                "collections": ["The Weekend", "Premium Polo"],
                "created_at": "2026-02-20T08:30:00.000Z",
                "primary_image": {
                    "id": "img_abd49aa24fb0",
                    "url": "https://yame.vn/cdn/shop/files/TheWeekend008XanhDuongTrang1.jpg?v=1769487172&width=533",
                    "alt_text": "Áo Polo ColorLock™",
                    "is_primary": true,
                    "sort_order": 0,
                    "thumbnail_url": "https://yame.vn/cdn/shop/files/TheWeekend008XanhDuongTrang1.jpg?v=1769487172&width=533"
                }
            },
            {
                "id": "prod_c7a064bcd823",
                "name": "Áo Tank Top FlexFit™ Cotton Mềm Mịn Co Giãn The No Style 021 Đen",
                "slug": "ao-tank-top-flexfit-cotton-mem-min-co-gian-the-no-style-021-den",
                "short_description": "Chất liệu FlexFit™ độc quyền, co giãn tối ưu cho mọi hoạt động.",
                "brand": "YAME",
                "display_price": "192950.00",
                "original_price": "192950.00",
                "discount_percent": 0,
                "total_stock": "441",
                "avg_rating": "4.7",
                "review_count": 8,
                "sold_count": 56,
                "is_featured": false,
                "is_new": true,
                "is_bestseller": false,
                "category_group": "tops",
                "is_sale": false,
                "has_variants": true,
                "category_id": "cat_186feb42c99b",
                "category_name": "Áo Thun TankTop (Áo Thun 3 Lỗ)",
                "category_slug": "ao-thun-tanktop-ao-thun-3-lo",
                "collections": ["The No Style", "Essentials"],
                "created_at": "2026-01-15T10:15:00.000Z",
                "primary_image": {
                    "id": "img_9fea6e557fb0",
                    "url": "https://yame.vn/cdn/shop/files/ao-thun-no-style-m21-den-1174885125.jpg?v=1760775732&width=533",
                    "alt_text": "Áo Tank Top FlexFit™ Đen",
                    "is_primary": true,
                    "sort_order": 0,
                    "thumbnail_url": "https://yame.vn/cdn/shop/files/ao-thun-no-style-m21-den-1174885125.jpg?v=1760775732&width=533"
                }
            },
            {
                "id": "prod_74fb72d0a870",
                "name": "Áo Tank Top FlexFit™ Cotton Thoáng Da The No Style 022 Nâu Nhạt",
                "slug": "ao-tank-top-flexfit-cotton-thoang-da-the-no-style-022-nau-nhat",
                "short_description": "Thiết kế thoáng da, màu sắc trẻ trung phù hợp đi chơi, tập gym.",
                "brand": "YAME",
                "display_price": "167450.00",
                "original_price": "210000.00",
                "discount_percent": 20,
                "total_stock": "394",
                "avg_rating": "4.5",
                "review_count": 12,
                "sold_count": 89,
                "is_featured": false,
                "is_new": true,
                "is_bestseller": false,
                "category_group": "tops",
                "is_sale": true,
                "has_variants": true,
                "category_id": "cat_186feb42c99b",
                "category_name": "Áo Thun TankTop (Áo Thun 3 Lỗ)",
                "category_slug": "ao-thun-tanktop-ao-thun-3-lo",
                "collections": ["The No Style", "Summer 2026"],
                "created_at": "2026-03-01T14:20:00.000Z",
                "primary_image": {
                    "id": "img_326d8465ee8b",
                    "url": "https://yame.vn/cdn/shop/files/ao-thun-no-style-m22-be-1174878745.jpg?v=1760775851&width=533",
                    "alt_text": "Áo Tank Top FlexFit™ Nâu Nhạt",
                    "is_primary": true,
                    "sort_order": 0,
                    "thumbnail_url": "https://yame.vn/cdn/shop/files/ao-thun-no-style-m22-be-1174878745.jpg?v=1760775851&width=533"
                }
            },
            
];

export default function HomePage() {
    const [products, setProducts] = useState(sampleProducts);

    useEffect(() => {
        // Initialize AOS (Animate On Scroll)
        AOS.init({
            duration: 1000,
            once: true,
            offset: 100
        });

        // TODO: Fetch products from API
        // const fetchProducts = async () => {
        //     try {
        //         const res = await fetch('/api/products');
        //         const data = await res.json();
        //         setProducts(data.products);
        //     } catch (error) {
        //         console.error('Error fetching products:', error);
        //     }
        // };
        // fetchProducts();
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
                        <img src={sampleImage1} alt="Sample 1" />
                        <img src={sampleImage2} alt="Sample 2" />
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