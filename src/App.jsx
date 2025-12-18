// App.jsx - VERSION CORRIGÉE
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import VirementPage from './pages/VirementPage';
import VirementEnCoursPage from './pages/VirementEnCoursPage';
import RetraitPage from './pages/RetraitPage';
import ComptePage from './pages/ComptePage';
import CartesPage from './pages/CartesPage';
import AidePage from './pages/AidePage';
import ChangerCodePage from './pages/ChangerCodePage';
import HistoriqueTransactionsPage from './pages/HistoriqueTransactionsPage';
import NotificationsPage from './pages/NotificationsPage';

// ✅ Composant des routes - TOUT est à l'intérieur du Provider
function AppRoutes() {
  // ✅ Route protégée - définie ICI (dans le Provider)
  const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();
    
    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement...</p>
          </div>
        </div>
      );
    }
    
    return isAuthenticated ? children : <Navigate to="/login" replace />;
  };

  // ✅ Route publique - définie ICI (dans le Provider)
  const PublicRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();
    
    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement...</p>
          </div>
        </div>
      );
    }
    
    return !isAuthenticated ? children : <Navigate to="/dashboard" replace />;
  };

  return (
    <Routes>
      {/* Redirect root to login */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      
      {/* Routes publiques */}
      <Route 
        path="/login" 
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
      
      {/* Routes protégées */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/virement" 
        element={
          <ProtectedRoute>
            <VirementPage />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/virement-en-cours" 
        element={
          <ProtectedRoute>
            <VirementEnCoursPage />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/retrait" 
        element={
          <ProtectedRoute>
            <RetraitPage />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/compte" 
        element={
          <ProtectedRoute>
            <ComptePage />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/cartes" 
        element={
          <ProtectedRoute>
            <CartesPage />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/aide" 
        element={
          <ProtectedRoute>
            <AidePage />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/changer-code" 
        element={
          <ProtectedRoute>
            <ChangerCodePage />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/historique-transactions" 
        element={
          <ProtectedRoute>
            <HistoriqueTransactionsPage />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/notifications" 
        element={
          <ProtectedRoute>
            <NotificationsPage />
          </ProtectedRoute>
        } 
      />
      
      {/* 404 - Redirection vers login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

// ✅ App principal
function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <AppRoutes />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;