import './App.css';
import Header from './components/header/Header.jsx';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import ScrollToTop from './components/scrollToTop/ScrollToTop.jsx';
import HomePage from './pages/homepage/HomePage.jsx';
import ProductPage from './pages/product/ProductPage.jsx';
import ProductDetail from './pages/productDetail/ProductDetail.jsx';
import AboutUsPage from './pages/aboutUs/AboutUsPage.jsx';
import CartPage from './pages/cartPage/CartPage.jsx';
import Footer from './components/footer/Footer.jsx';
import LoginPage from './pages/loginPage/LoginPage.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import DetailProductPage from './pages/detailProductPage/DetailProductPage.jsx';

function App() {
  return (
    <Router>
      <ScrollToTop /> {/* Đặt ngay sau Router để lắng nghe mọi thay đổi pathname */}
      <AuthProvider> {/* Bọc AuthProvider ngoài cùng để quản lý đăng nhập toàn app */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductPage />} />
          <Route path="/about-us" element={<AboutUsPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/products/test" element={<DetailProductPage />} />

        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;