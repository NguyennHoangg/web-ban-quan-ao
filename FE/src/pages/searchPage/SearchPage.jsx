import { useEffect, useMemo, useState } from 'react';
import ProductCard from '../../components/productCard/ProductCard';
import SearchFiltersPanel from './components/SearchFiltersPanel';
import ProductGridSkeleton from './components/ProductGridSkeleton';
import {
    DEFAULT_COLORS,
    DEFAULT_SIZES,
    SORT_OPTIONS,
    buildQuery,
    formatLabel,
    getColorKeysFromVariantColor,
    normalizeText,
} from './searchFilters.utils';

const API_BASE_URL = 'https://web-ban-quan-ao-9s0d.onrender.com/api/products';

export default function SearchPage() {
    const [products, setProducts] = useState([]);
    const [productDetailsMap, setProductDetailsMap] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

    const [filtersMeta, setFiltersMeta] = useState({
        categories: [],
        colors: [],
        sizes: [],
        min_price: 0,
        max_price: 0,
    });

    const [searchInput, setSearchInput] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [priceRange, setPriceRange] = useState({ min: '', max: '' });
    const [selectedColors, setSelectedColors] = useState([]);
    const [selectedShapes, setSelectedShapes] = useState([]);
    const [minRating, setMinRating] = useState(0);
    const [isSaleOnly, setIsSaleOnly] = useState(false);
    const [sort, setSort] = useState('newest');
    const [loadingDetails, setLoadingDetails] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setSearchQuery(searchInput.trim());
        }, 300);
        return () => clearTimeout(timer);
    }, [searchInput]);

    useEffect(() => {
        let mounted = true;
        const fetchFilterMeta = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/filters`);
                const json = await res.json();
                if (!res.ok || !json.success) throw new Error('Không tải được metadata filter');
                if (!mounted) return;
                setFiltersMeta({
                    categories: json.data?.categories || [],
                    colors: (json.data?.colors || []).length ? json.data.colors : DEFAULT_COLORS,
                    sizes: (json.data?.sizes || []).length ? json.data.sizes : DEFAULT_SIZES,
                    min_price: json.data?.min_price || 0,
                    max_price: json.data?.max_price || 0,
                });
            } catch {
                if (mounted) {
                    try {
                        const fallbackRes = await fetch(`${API_BASE_URL}/list?limit=100&sort=newest`);
                        const fallbackJson = await fallbackRes.json();
                        const fallbackProducts = fallbackJson?.data?.products || [];

                        const categoryMap = new Map();
                        let minPrice = Number.POSITIVE_INFINITY;
                        let maxPrice = 0;
                        const sizeSet = new Set();
                        const colorSet = new Set();

                        fallbackProducts.forEach((product) => {
                            if (product.category_id && product.category_name) {
                                categoryMap.set(product.category_id, {
                                    id: product.category_id,
                                    name: product.category_name,
                                    slug: product.category_slug || '',
                                });
                            }
                            const price = Number(product.display_price || 0);
                            if (!Number.isNaN(price) && price > 0) {
                                minPrice = Math.min(minPrice, price);
                                maxPrice = Math.max(maxPrice, price);
                            }
                        });

                        // Fallback metadata should use real variant values to ensure filters match.
                        const detailSamples = fallbackProducts.slice(0, 24);
                        const detailResponses = await Promise.all(
                            detailSamples.map(async (product) => {
                                try {
                                    const res = await fetch(`${API_BASE_URL}/${product.slug}`);
                                    const json = await res.json();
                                    if (res.ok && json.success && json.data?.product) return json.data.product;
                                } catch {
                                    return null;
                                }
                                return null;
                            }),
                        );

                        detailResponses.forEach((detail) => {
                            if (!detail?.variants) return;
                            detail.variants.forEach((variant) => {
                                const size = normalizeText(variant.size);
                                const colorKeys = getColorKeysFromVariantColor(variant.color);
                                if (size) sizeSet.add(size);
                                colorKeys.forEach((key) => colorSet.add(key));
                            });
                        });

                        setFiltersMeta({
                            categories: Array.from(categoryMap.values()),
                            colors: colorSet.size > 0 ? Array.from(colorSet).sort() : DEFAULT_COLORS,
                            sizes: sizeSet.size > 0 ? Array.from(sizeSet).sort() : DEFAULT_SIZES,
                            min_price: Number.isFinite(minPrice) ? minPrice : 0,
                            max_price: maxPrice || 0,
                        });
                    } catch {
                        setFiltersMeta({
                            categories: [],
                            colors: DEFAULT_COLORS,
                            sizes: DEFAULT_SIZES,
                            min_price: 0,
                            max_price: 0,
                        });
                    }
                }
            }
        };
        fetchFilterMeta();
        return () => { mounted = false; };
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        setError('');
        try {
            const query = buildQuery({
                searchQuery,
                selectedCategories,
                selectedColors,
                selectedShapes,
                minPrice: priceRange.min,
                maxPrice: priceRange.max,
                minRating,
                isSaleOnly,
                sort,
                limit: 50,
            });
            const res = await fetch(`${API_BASE_URL}/list?${query}`);
            const json = await res.json();
            if (!res.ok || !json.success) throw new Error('Không tải được danh sách sản phẩm');
            setProducts(json.data?.products || []);
        } catch (err) {
            setProducts([]);
            setError(err.message || 'Đã có lỗi xảy ra');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [searchQuery, selectedCategories, selectedColors, selectedShapes, priceRange.min, priceRange.max, minRating, isSaleOnly, sort]);

    useEffect(() => {
        const needVariantFilters = selectedColors.length > 0 || selectedShapes.length > 0;
        if (!needVariantFilters || products.length === 0) return;

        let active = true;
        const fetchDetailsForFiltering = async () => {
            const missing = products.filter((product) => !productDetailsMap[product.slug]);
            if (missing.length === 0) return;

            setLoadingDetails(true);
            try {
                const responses = await Promise.all(
                    missing.map(async (product) => {
                        try {
                            const res = await fetch(`${API_BASE_URL}/${product.slug}`);
                            const json = await res.json();
                            if (res.ok && json.success && json.data?.product) {
                                return [product.slug, json.data.product];
                            }
                        } catch {
                            return null;
                        }
                        return null;
                    }),
                );

                if (!active) return;
                setProductDetailsMap((prev) => {
                    const next = { ...prev };
                    responses.forEach((entry) => {
                        if (entry) next[entry[0]] = entry[1];
                    });
                    return next;
                });
            } finally {
                if (active) setLoadingDetails(false);
            }
        };

        fetchDetailsForFiltering();
        return () => { active = false; };
    }, [products, selectedColors, selectedShapes, productDetailsMap]);

    const clearAll = () => {
        setSearchInput('');
        setSearchQuery('');
        setSelectedCategories([]);
        setPriceRange({ min: '', max: '' });
        setSelectedColors([]);
        setSelectedShapes([]);
        setMinRating(0);
        setIsSaleOnly(false);
        setSort('newest');
    };

    const activeChips = useMemo(() => {
        const chips = [];
        if (searchQuery.trim()) chips.push({ type: 'search', key: 'search', label: `Từ khóa: ${searchQuery}` });
        selectedCategories.forEach((id) => {
            const category = filtersMeta.categories.find((item) => item.id === id);
            chips.push({ type: 'category', key: `cat-${id}`, value: id, label: category?.name || id });
        });
        selectedColors.forEach((color) => chips.push({ type: 'color', key: `color-${color}`, value: color, label: `Màu: ${formatLabel(color)}` }));
        selectedShapes.forEach((size) => chips.push({ type: 'shape', key: `shape-${size}`, value: size, label: `Fit: ${size.toUpperCase()}` }));
        if (priceRange.min !== '' || priceRange.max !== '') {
            chips.push({
                type: 'price',
                key: 'price',
                label: `Giá: ${priceRange.min || 0} - ${priceRange.max || '∞'}`,
            });
        }
        if (minRating > 0) chips.push({ type: 'rating', key: 'rating', label: `Từ ${minRating}★` });
        if (isSaleOnly) chips.push({ type: 'sale', key: 'sale', label: 'Đang giảm giá' });
        return chips;
    }, [searchQuery, selectedCategories, selectedColors, selectedShapes, priceRange.min, priceRange.max, minRating, isSaleOnly, filtersMeta.categories]);

    const activeFilterCount = activeChips.length;

    const removeChip = (chip) => {
        if (chip.type === 'search') setSearchQuery('');
        if (chip.type === 'category') setSelectedCategories((prev) => prev.filter((item) => item !== chip.value));
        if (chip.type === 'color') setSelectedColors((prev) => prev.filter((item) => item !== chip.value));
        if (chip.type === 'shape') setSelectedShapes((prev) => prev.filter((item) => item !== chip.value));
        if (chip.type === 'price') setPriceRange({ min: '', max: '' });
        if (chip.type === 'rating') setMinRating(0);
        if (chip.type === 'sale') setIsSaleOnly(false);
    };

    const filteredProducts = useMemo(() => {
        return products.filter((product) => {
            if (selectedCategories.length > 0 && !selectedCategories.includes(product.category_id)) {
                return false;
            }

            if (selectedColors.length === 0 && selectedShapes.length === 0) return true;

            const detail = productDetailsMap[product.slug];
            if (!detail || !Array.isArray(detail.variants)) return false;

            const variants = detail.variants || [];

            if (selectedShapes.length > 0) {
                const hasSize = variants.some((variant) =>
                    selectedShapes.includes(normalizeText(variant.size)),
                );
                if (!hasSize) return false;
            }

            if (selectedColors.length > 0) {
                const hasColor = variants.some((variant) =>
                    getColorKeysFromVariantColor(variant.color).some((colorKey) =>
                        selectedColors.includes(colorKey),
                    ),
                );
                if (!hasColor) return false;
            }

            return true;
        });
    }, [products, selectedCategories, selectedColors, selectedShapes, productDetailsMap]);

    return (
        <div className="bg-gradient-to-b from-gray-50 via-gray-50 to-gray-100/60 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
                <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
                    <div className="relative w-full">
                        <input
                            className="w-full bg-white border border-gray-300 text-gray-900 rounded-lg px-4 py-3 pr-11 shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                            value={searchInput}
                            onChange={(event) => setSearchInput(event.target.value)}
                            placeholder="Tìm theo tên, mô tả..."
                            aria-label="Tìm kiếm sản phẩm"
                        />
                        {searchInput && (
                            <button
                                type="button"
                                onClick={() => setSearchInput('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full text-xs bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                                aria-label="Xóa nội dung tìm kiếm"
                            >
                                ×
                            </button>
                        )}
                    </div>
                <div className="relative min-w-[190px]">
                    <select
                        value={sort}
                        onChange={(event) => setSort(event.target.value)}
                        className="h-11 w-full rounded-xl border border-gray-300 px-3 pr-8 text-sm text-gray-900 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent appearance-none"
                    >
                        {SORT_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                    </select>
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs">▼</span>
                </div>
                <button type="button" className="lg:hidden h-11 rounded-xl border border-gray-300 bg-white px-4 text-sm font-medium" onClick={() => setIsMobileFilterOpen(true)}>
                    Bộ lọc {activeFilterCount > 0 ? `(${activeFilterCount})` : ''}
                </button>
                </div>
            </div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row gap-8">
                <div className="hidden lg:block lg:w-72 lg:flex-shrink-0">
                    <SearchFiltersPanel
                        filtersMeta={filtersMeta}
                        selectedShapes={selectedShapes}
                        selectedCategories={selectedCategories}
                        selectedColors={selectedColors}
                        priceRange={priceRange}
                        isSaleOnly={isSaleOnly}
                        minRating={minRating}
                        clearAll={clearAll}
                        setSelectedShapes={setSelectedShapes}
                        setSelectedCategories={setSelectedCategories}
                        setSelectedColors={setSelectedColors}
                        setPriceRange={setPriceRange}
                        setIsSaleOnly={setIsSaleOnly}
                        setMinRating={setMinRating}
                    />
                </div>
                <section className="flex-1">
                    <div className="sticky top-2 z-20 flex flex-wrap items-center gap-2 mb-4 bg-white/90 backdrop-blur border border-gray-100 rounded-xl px-3 py-2 shadow-sm">
                        <span className="text-sm text-gray-600 mr-1">Kết quả: <strong className="text-gray-900">{filteredProducts.length}</strong> sản phẩm</span>
                        {activeChips.length > 0 && <span className="text-xs text-gray-400">|</span>}
                        {activeChips.map((chip) => (
                            <button key={chip.key} type="button" className="inline-flex items-center gap-1 text-xs text-gray-700 border border-gray-300 rounded-full px-3 py-1.5 bg-white hover:bg-gray-100 transition-colors" onClick={() => removeChip(chip)}>
                                {chip.label} <span>×</span>
                            </button>
                        ))}
                        {activeChips.length > 0 && (
                            <button type="button" onClick={clearAll} className="text-sm font-semibold text-red-500 hover:text-red-600">Clear All</button>
                        )}
                    </div>

                    {(loading || loadingDetails) && <ProductGridSkeleton />}
                    {error && !loading && <p className="py-4 text-sm text-red-600">{error}</p>}

                    {!loading && !loadingDetails && !error && filteredProducts.length === 0 && (
                        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center shadow-sm">
                            <div className="text-3xl mb-3">🔍</div>
                            <h3 className="text-lg font-semibold text-gray-900">Không tìm thấy sản phẩm phù hợp</h3>
                            <p className="mt-2 text-sm text-gray-500">Thử thay đổi bộ lọc hoặc xóa tất cả để xem nhiều sản phẩm hơn.</p>
                            <button type="button" onClick={clearAll} className="mt-4 inline-flex rounded-lg bg-gray-900 text-white px-4 py-2 text-sm font-medium">Clear All Filters</button>
                        </div>
                    )}

                    {!loading && !loadingDetails && !error && filteredProducts.length > 0 && (
                        <div className="flex-1">
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                                {filteredProducts.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        </div>
                    )}
                </section>
            </div>

            {isMobileFilterOpen && (
                <div className="fixed inset-0 z-50 bg-black/40 flex items-end lg:hidden" onClick={() => setIsMobileFilterOpen(false)}>
                    <div className="bg-white w-full rounded-t-2xl max-h-[85vh] overflow-y-auto p-4" onClick={(event) => event.stopPropagation()}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-base font-semibold">Bộ lọc</h3>
                            <button type="button" className="text-sm text-gray-600" onClick={() => setIsMobileFilterOpen(false)}>Close</button>
                        </div>
                        <SearchFiltersPanel
                            isMobile
                            filtersMeta={filtersMeta}
                            selectedShapes={selectedShapes}
                            selectedCategories={selectedCategories}
                            selectedColors={selectedColors}
                            priceRange={priceRange}
                            isSaleOnly={isSaleOnly}
                            minRating={minRating}
                            clearAll={clearAll}
                            setSelectedShapes={setSelectedShapes}
                            setSelectedCategories={setSelectedCategories}
                            setSelectedColors={setSelectedColors}
                            setPriceRange={setPriceRange}
                            setIsSaleOnly={setIsSaleOnly}
                            setMinRating={setMinRating}
                        />
                        <button type="button" className="mt-4 w-full rounded-lg bg-gray-900 text-white py-2.5 text-sm font-medium" onClick={() => setIsMobileFilterOpen(false)}>
                            Apply
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
