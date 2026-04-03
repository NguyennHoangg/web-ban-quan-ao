import './App.css'
import Header from './components/header/Header.jsx';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import HomePage from './pages/homepage/HomePage.jsx';
import ProductPage from './pages/product/ProductPage.jsx';
import AboutUsPage from './pages/aboutUs/AboutUsPage.jsx';
import CartPage from './pages/cartPage/CartPage.jsx';
import Footer from './components/footer/Footer.jsx';

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
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="products" element={<ProductPage />} />
          <Route path="about-us" element={<AboutUsPage />} />
          <Route path="cart" element={<CartPage />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
