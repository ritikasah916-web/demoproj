import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import GeneratorPage from './pages/GeneratorPage';
import ModelsPage from './pages/ModelsPage';
import EditorPage from './pages/EditorPage';
import ProfilePage from './pages/ProfilePage';

// Layout
import Layout from './components/Layout';

// Protected Route
function ProtectedRoute({ children, title }: { children: React.ReactNode; title: string }) {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Layout title={title}>{children}</Layout>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute title="Dashboard">
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/generator"
          element={
            <ProtectedRoute title="3D Generator">
              <GeneratorPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/models"
          element={
            <ProtectedRoute title="My Models">
              <ModelsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/editor/:modelId"
          element={
            <ProtectedRoute title="Model Editor">
              <EditorPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute title="Profile">
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
