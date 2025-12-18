// context/AuthContext.jsx - AVEC ÉCOUTE DES ÉVÉNEMENTS
import React, { createContext, useState, useContext, useEffect } from 'react';
import { UserService } from '../services/UserService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // 🔥 Charger au démarrage + forcer rechargement en DEV
  useEffect(() => {
    console.log('🔄 AuthContext - Initialisation');
    
    // 🔥 Forcer le rechargement des users depuis DEFAULT_USERS
    if (UserService.forceReloadInDev) {
      UserService.forceReloadInDev();
    }
    
    const currentUser = UserService.getCurrentUser();
    
    if (currentUser) {
      console.log('👤 User chargé:', currentUser);
      setUser(currentUser);
      setIsAuthenticated(true);
    }
    
    setLoading(false);
  }, []);

  // 🔥 ÉCOUTER les modifications de user
  useEffect(() => {
    const handleUserUpdate = () => {
      console.log('🔔 Événement userUpdated reçu');
      const freshUser = UserService.getCurrentUser();
      
      if (freshUser) {
        console.log('🔄 Rechargement user:', freshUser);
        setUser({...freshUser, _refresh: Date.now()});
        setIsAuthenticated(true);
      } else {
        console.log('❌ Plus de user');
        setUser(null);
        setIsAuthenticated(false);
      }
    };

    window.addEventListener('userUpdated', handleUserUpdate);

    return () => {
      window.removeEventListener('userUpdated', handleUserUpdate);
    };
  }, []);

  const login = async (clientNumber, code) => {
    try {
      const userData = await UserService.login(clientNumber, code);
      setUser({...userData});
      setIsAuthenticated(true);
      return userData;
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const newUser = await UserService.register(userData);
      setUser({...newUser});
      setIsAuthenticated(true);
      return newUser;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    UserService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUser = async (updatedData) => {
    try {
      const updatedUser = await UserService.updateUser(updatedData);
      // Pas besoin de setUser ici, l'événement le fera automatiquement
      return updatedUser;
    } catch (error) {
      throw error;
    }
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    updateUser
  };

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

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};