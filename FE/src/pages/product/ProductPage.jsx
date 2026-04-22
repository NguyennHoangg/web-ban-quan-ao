import styles from './ProductPage.module.css';
import ProductCard from '../../components/productCard/ProductCard';
import { useState, useEffect } from 'react';

// Sample product data
const sampleProducts = [
    {
        id: "prod_6a403e854ef7",
        name: "Áo Polo ColorLock™ Khóa Màu Pique Thoát Nhiệt The Weekend 008 Xanh Dương Trắng",
        slug: "ao-polo-colorlock-khoa-mau-pique-thoat-nhiet-the-weekend-008-xanh-duong-trang",
        brand: "YAME",
        display_price: "434150.00",
        total_stock: "431",
        avg_rating: "4.5",
        review_count: 12,
        sold_count: 45,
        is_featured: false,
        is_new: true,
        is_bestseller: false,
        category_name: "Áo Polo Tay Ngắn",
        primary_image: {
            id: "img_abd49aa24fb0",
            url: "https://yame.vn/cdn/shop/files/TheWeekend008XanhDuongTrang1.jpg?v=1769487172&width=533"
        }
    },
    {
        id: "prod_c7a064bcd823",
        name: "Áo Tank Top FlexFit™ Cotton Mềm Mịn Co Giãn The No Style 021 Đen",
        slug: "ao-tank-top-flexfit-cotton-mem-min-co-gian-the-no-style-021-den",
        brand: "YAME",
        display_price: "192950.00",
        total_stock: "441",
        avg_rating: "4.8",
        review_count: 25,
        sold_count: 120,
        is_featured: true,
        is_new: false,
        is_bestseller: true,
        category_name: "Áo Thun TankTop",
        primary_image: {
            id: "img_9fea6e557fb0",
            url: "https://yame.vn/cdn/shop/files/ao-thun-no-style-m21-den-1174885125.jpg?v=1760775732&width=533"
        }
    },
    {
        id: "prod_737077923dad",
        name: "Áo Tank Top FlexFit™ Cotton Mềm Mịn Co Giãn The No Style 021 Trắng",
        slug: "ao-tank-top-flexfit-cotton-mem-min-co-gian-the-no-style-021-trang",
        brand: "YAME",
        display_price: "192950.00",
        total_stock: "514",
        avg_rating: "4.6",
        review_count: 18,
        sold_count: 95,
        is_featured: false,
        is_new: false,
        is_bestseller: true,
        category_name: "Áo Thun TankTop",
        primary_image: {
            id: "img_ab30ffa05f2c",
            url: "https://yame.vn/cdn/shop/files/ao-thun-no-style-m21-tr-ng-1174884422.jpg?v=1760775760&width=533"
        }
    },
    {
        id: "prod_c8ed2390d376",
        name: "Áo Tank Top FlexFit™ Cotton Mềm Mịn Co Giãn The No Style 021 Xanh Dương Nhạt",
        slug: "ao-tank-top-flexfit-cotton-mem-min-co-gian-the-no-style-021-xanh-duong-nhat",
        brand: "YAME",
        display_price: "192950.00",
        total_stock: "452",
        avg_rating: "4.3",
        review_count: 14,
        sold_count: 67,
        is_featured: false,
        is_new: true,
        is_bestseller: false,
        category_name: "Áo Thun TankTop",
        primary_image: {
            id: "img_4d1e6c05aae1",
            url: "https://yame.vn/cdn/shop/files/ao-thun-no-style-m21-xanh-d-ng-1174885108.jpg?v=1760775792&width=533"
        }
    },
    {
        id: "prod_49efcc4fd84e",
        name: "Áo Thun Tank Top FlexFit™ Cotton Mềm Mịn Co Giãn The No Style 021 Nâu",
        slug: "ao-thun-tank-top-flexfit-cotton-mem-min-co-gian-the-no-style-021-nau",
        brand: "YAME",
        display_price: "192950.00",
        total_stock: "415",
        avg_rating: "4.4",
        review_count: 11,
        sold_count: 52,
        is_featured: false,
        is_new: false,
        is_bestseller: false,
        category_name: "Áo Thun TankTop",
        primary_image: {
            id: "img_d220e362fb50",
            url: "https://yame.vn/cdn/shop/files/ao-thun-no-style-m21-nau-1174885089.jpg?v=1760775818&width=533"
        }
    },
    {
        id: "prod_74fb72d0a870",
        name: "Áo Tank Top FlexFit™ Cotton Thoáng Da The No Style 022 Nâu Nhạt",
        slug: "ao-tank-top-flexfit-cotton-thoang-da-the-no-style-022-nau-nhat",
        brand: "YAME",
        display_price: "167450.00",
        total_stock: "394",
        avg_rating: "4.7",
        review_count: 20,
        sold_count: 89,
        is_featured: true,
        is_new: false,
        is_bestseller: false,
        category_name: "Áo Thun TankTop",
        primary_image: {
            id: "img_326d8465ee8b",
            url: "https://yame.vn/cdn/shop/files/ao-thun-no-style-m22-be-1174878745.jpg?v=1760775851&width=533"
        }
    }
];

export default function ProductPage() {
    const [products, setProducts] = useState(sampleProducts);

    useEffect(() => {
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
        <div className={styles.productPage}>
            <div className={styles.wrapper}>
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
}