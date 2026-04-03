import './App.css';
import Header from './components/header/Header.jsx';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import HomePage from './pages/homepage/HomePage.jsx';
import ProductPage from './pages/product/ProductPage.jsx';
import AboutUsPage from './pages/aboutUs/AboutUsPage.jsx';
import CartPage from './pages/cartPage/CartPage.jsx';
import Footer from './components/footer/Footer.jsx';
import LoginPage from './pages/loginPage/LoginPage.jsx';
import { AuthProvider } from './context/AuthContext.jsx';

// Cấu trúc Layout để Header và Footer luôn hiển thị ở mọi trang
function Layout() {
  return (
    <>
      <Header />
      <main className="appMain">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider> {/* Bọc AuthProvider ngoài cùng để quản lý đăng nhập toàn app */}
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="products" element={<ProductPage />} />
            <Route path="about-us" element={<AboutUsPage />} />
            <Route path="cart" element={<CartPage />} />
            <Route path="login" element={<LoginPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;