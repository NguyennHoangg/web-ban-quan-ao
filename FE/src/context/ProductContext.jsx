import { createContext, useContext, useEffect, useState } from 'react';

/**
 * ProductContext - Quản lý state products toàn ứng dụng
 * Fetch API chỉ 1 lần khi ứng dụng load
 */
const ProductContext = createContext();

export function ProductProvider({ children }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchProducts();
    }, []); // Chỉ chạy 1 lần khi component mount

    const fetchProducts = async () => {
        setLoading(true);
        setError(null);
        
        try {
            const res = await fetch('https://web-ban-quan-ao-9s0d.onrender.com/api/products/list', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                // Thêm credentials nếu backend yêu cầu
                credentials: 'include',
            });

            // Kiểm tra response status
            if (!res.ok) {
                throw new Error(`API Error: ${res.status} ${res.statusText}`);
            }

            const data_res = await res.json();

            // Kiểm tra cấu trúc response
            if (data_res.success && data_res.data && Array.isArray(data_res.data.products)) {
                setProducts(data_res.data.products);
            } else if (Array.isArray(data_res.products)) {
                setProducts(data_res.products);
            } else {
                throw new Error('Invalid response structure from API');
            }

            setError(null);
        } catch (err) {
            console.error('Error fetching products:', err.message);
            setError(err.message);
            setProducts([]); // Reset products khi có lỗi
        } finally {
            setLoading(false);
        }
    };

    const value = {
        products,
        loading,
        error,
        refetch: fetchProducts, // Cho phép refetch nếu cần thiết
    };

    return (
        <ProductContext.Provider value={value}>
            {children}
        </ProductContext.Provider>
    );
}

/**
 * Custom Hook: useProducts
 * Sử dụng để lấy dữ liệu products từ Context
 * @returns {Object} { products, loading, error, refetch }
 */
export function useProducts() {
    const context = useContext(ProductContext);
    
    if (!context) {
        throw new Error('useProducts must be used within ProductProvider');
    }
    
    return context;
}
