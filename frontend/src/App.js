import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ShopPage from './pages/ShopPage';
import ProductDetail from './pages/ProductDetail';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrdersPage from './pages/OrdersPage';
import OrderDetail from './pages/OrderDetail';

// Farmer Dashboard
import FarmerDashboard from './pages/Farmer/FarmerDashboard';
import FarmerProducts from './pages/Farmer/FarmerProducts';
import AddProduct from './pages/Farmer/AddProduct';
import FarmerOrders from './pages/Farmer/FarmerOrders';

// Admin Dashboard
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminUsers from './pages/Admin/AdminUsers';
import AdminProducts from './pages/Admin/AdminProducts';
import AdminOrders from './pages/Admin/AdminOrders';

// Delivery Dashboard
import DeliveryDashboard from './pages/Delivery/DeliveryDashboard';
import DeliveryOrders from './pages/Delivery/DeliveryOrders';

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-screen"><div className="spinner"></div></div>;
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <ToastContainer position="top-right" autoClose={3000} />
          <Routes>
            {/* Public */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/product/:id" element={<ProductDetail />} />

            {/* Buyer */}
            <Route path="/cart" element={<ProtectedRoute roles={['buyer']}><CartPage /></ProtectedRoute>} />
            <Route path="/checkout" element={<ProtectedRoute roles={['buyer']}><CheckoutPage /></ProtectedRoute>} />
            <Route path="/orders" element={<ProtectedRoute roles={['buyer']}><OrdersPage /></ProtectedRoute>} />
            <Route path="/orders/:id" element={<ProtectedRoute><OrderDetail /></ProtectedRoute>} />

            {/* Farmer */}
            <Route path="/farmer" element={<ProtectedRoute roles={['farmer']}><FarmerDashboard /></ProtectedRoute>} />
            <Route path="/farmer/products" element={<ProtectedRoute roles={['farmer']}><FarmerProducts /></ProtectedRoute>} />
            <Route path="/farmer/products/add" element={<ProtectedRoute roles={['farmer']}><AddProduct /></ProtectedRoute>} />
            <Route path="/farmer/orders" element={<ProtectedRoute roles={['farmer']}><FarmerOrders /></ProtectedRoute>} />

            {/* Admin */}
            <Route path="/admin" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/users" element={<ProtectedRoute roles={['admin']}><AdminUsers /></ProtectedRoute>} />
            <Route path="/admin/products" element={<ProtectedRoute roles={['admin']}><AdminProducts /></ProtectedRoute>} />
            <Route path="/admin/orders" element={<ProtectedRoute roles={['admin']}><AdminOrders /></ProtectedRoute>} />

            {/* Delivery */}
            <Route path="/delivery" element={<ProtectedRoute roles={['delivery']}><DeliveryDashboard /></ProtectedRoute>} />
            <Route path="/delivery/orders" element={<ProtectedRoute roles={['delivery']}><DeliveryOrders /></ProtectedRoute>} />
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
