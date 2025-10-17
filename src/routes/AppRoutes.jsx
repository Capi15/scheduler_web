import { Routes, Route } from 'react-router-dom';
import LoginPage from '../pages/sessions/LoginPage';
import RegisterPage from '../pages/sessions/RegisterPage';
import ForgotPasswordPage from '../pages/sessions/ForgotPasswordPage';
import ResetPasswordPage from '../pages/sessions/ResetPasswordPage';
import DashboardPage from '../pages/home/DashboardPage';
import UsersPage from '../pages/users/UsersPage';
import RolesPage from '../pages/users/RolesPage';
import ProductTypesPage from '../pages/inventory/ProductTypesPage';
import ProductsPage from '../pages/inventory/ProductsPage';
import StocksPage from '../pages/inventory/StocksPage';
import ProfilePage from '../pages/users/ProfilePage';
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';
import Layout from '../layouts/Layout';

function AppRoutes() {
  return (
    <Routes>
      {/* Páginas públicas (acessíveis só se não autenticado) */}
      <Route
        path="/"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <PublicRoute>
            <ForgotPasswordPage />
          </PublicRoute>
        }
      />
      <Route
        path="/reset-password"
        element={
          <PublicRoute>
            <ResetPasswordPage />
          </PublicRoute>
        }
      />

      {/* Páginas privadas (acessíveis apenas se autenticado) */}
      <Route
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/roles" element={<RolesPage />} />
        <Route path="/inventory/product_types" element={<ProductTypesPage />} />
        <Route path="/inventory/products" element={<ProductsPage />} />
        <Route path="/inventory/stocks" element={<StocksPage />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
