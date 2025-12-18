import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home, MessageSquare, ArrowUpRight, Clock, LogOut } from 'lucide-react';

const BottomNavigation = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [activeItem, setActiveItem] = useState('accueil');

  const handleLogout = () => {
    if (window.confirm('Voulez-vous vraiment vous déconnecter ?')) {
      logout();
      navigate('/login');
    }
  };

  const navItems = [
    {
      id: 'accueil',
      label: 'Accueil',
      icon: Home,
      badge: null,
      action: () => {
        setActiveItem('accueil');
        navigate('/dashboard');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },
    {
      id: 'comptes',
      label: 'Comptes',
      icon: MessageSquare,
      badge: null,
      action: () => {
        setActiveItem('comptes');
        navigate('/compte');
      }
    },
    {
      id: 'virement',
      label: 'Virement',
      icon: ArrowUpRight,
      badge: null,
      action: () => {
        setActiveItem('virement');
        navigate('/virement');
      }
    },
    {
      id: 'encours',
      label: 'Virement En cours',
      shortLabel: 'En cours',
      icon: Clock,
      badge: null,
      action: () => {
        setActiveItem('encours');
        navigate('/virement-en-cours');
      }
    },
    {
      id: 'deconnexion',
      label: 'Deconnexion',
      shortLabel: 'Quitter',
      icon: LogOut,
      badge: null,
      action: handleLogout
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="flex justify-around items-center py-2 sm:py-3 px-1 sm:px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.id;
          
          return (
            <button
              key={item.id}
              onClick={item.action}
              className={`flex flex-col items-center gap-0.5 sm:gap-1 transition-all min-w-50px sm:min-w-64px ${
                isActive ? 'text-cyan-500' : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <div className="relative">
                <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                {item.badge && (
                  <span className="absolute -top-1 sm:-top-2 -right-1 sm:-right-2 bg-red-500 text-white text-[9px] sm:text-xs w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full flex items-center justify-center font-semibold">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[9px] sm:text-[10px] font-medium text-center leading-tight max-w-55px sm:max-w-60px">
                <span className="hidden sm:inline">{item.label}</span>
                <span className="sm:hidden">{item.shortLabel || item.label}</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;