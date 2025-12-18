import React, { useState } from 'react';
import { Bell, Menu, X, User, CreditCard, FileText, HelpCircle, LogOut, Download, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Notifications fictives
  const notifications = [
    {
      id: 1,
      type: 'virement',
      titre: 'Virement reçu',
      message: 'Vous avez reçu 500€ de Jean Dupont',
      date: 'Il y a 2h',
      lu: false
    },
    {
      id: 2,
      type: 'alert',
      titre: 'Alerte de sécurité',
      message: 'Nouvelle connexion détectée depuis Paris',
      date: 'Il y a 5h',
      lu: false
    }
  ];

  const handleLogout = () => {
    if (window.confirm('Voulez-vous vraiment vous déconnecter ?')) {
      logout();
      navigate('/login');
    }
  };

  return (
    <>
      <div className="bg-white border-b border-gray-200 p-3 sm:p-4 flex items-center justify-between sticky top-0 z-50">
        {/* Logo */}
        <div className="flex items-center gap-1 sm:gap-2">
          <div className="w-8 h-7 sm:w-10 sm:h-9 md:w-12 md:h-10 flex items-center justify-center">
            <img 
              src="images/logo.jpeg" 
              alt="Attijariwafa Bank" 
              className="w-full h-full object-contain p-1"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'block';
              }}
            />
            <div className="text-[8px] text-black font-bold hidden">
              LOGO
            </div>
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-red-500 text-[8px] sm:text-[9px] md:text-[10px] font-semibold" style={{direction: 'rtl'}}>
              التجاري وفا
            </span>
            <span className="text-gray-800 text-xs sm:text-sm font-bold">
              Attijariwafa<span className="text-red-500">bank</span>
            </span>
          </div>
        </div>
        
        {/* Actions à droite */}
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
          {/* Notification avec dropdown */}
          <div className="relative">
            <button 
              onClick={() => {
                navigate('/notifications');
                setShowNotifications(false);
              }}
              className="relative hover:opacity-70 transition-opacity"
            >
              <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
              {notifications.filter(n => !n.lu).length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] sm:text-xs w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center font-semibold">
                  {notifications.filter(n => !n.lu).length}
                </span>
              )}
            </button>
          </div>
          
          {/* Menu burger - visible uniquement sur mobile */}
          <button 
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="md:hidden hover:opacity-70 transition-opacity"
          >
            {showMobileMenu ? (
              <X className="w-6 h-6 sm:w-7 sm:h-7 text-gray-900" />
            ) : (
              <Menu className="w-6 h-6 sm:w-7 sm:h-7 text-gray-900" />
            )}
          </button>
        </div>
      </div>

      {/* Menu Mobile Sidebar */}
      {showMobileMenu && (
        <>
        
          
          {/* Sidebar */}
          <div className="fixed top-0 right-0 h-full w-[85%] max-w-[320px] sm:max-w-64 bg-white shadow-2xl z-50 md:hidden transform transition-transform animate-slide-in">
            <div className="flex flex-col h-full">
              {/* En-tête du menu */}
              <div className="bg-orange-600 to-red-600 p-4 sm:p-6 text-white">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <h2 className="text-lg sm:text-xl font-bold">Menu</h2>
                  <button onClick={() => setShowMobileMenu(false)}>
                    <X className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full flex items-center justify-center text-orange-600 font-bold text-base sm:text-lg">
                    {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-sm sm:text-base truncate">{user?.firstName} {user?.lastName}</p>
                    <p className="text-xs opacity-90">N° {user?.clientNumber}</p>
                  </div>
                </div>
              </div>

              {/* Menu items */}
              <div className="flex-1 overflow-y-auto p-3 sm:p-4">
                <div className="space-y-1">
                  {/* Profil */}
                  <button 
                    onClick={() => { 
                      navigate('/compte'); 
                      setShowMobileMenu(false); 
                    }}
                    className="w-full flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 hover:bg-gray-100 rounded-lg transition"
                  >
                    <User className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                    <span className="text-gray-800 font-medium text-sm sm:text-base">Mon profil</span>
                  </button>

                  {/* Mes comptes */}
                  <button 
                    onClick={() => { 
                      navigate('/dashboard'); 
                      setShowMobileMenu(false); 
                    }}
                    className="w-full flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 hover:bg-gray-100 rounded-lg transition"
                  >
                    <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                    <span className="text-gray-800 font-medium text-sm sm:text-base">Mes comptes</span>
                  </button>

                  {/* Historique */}
                  <button 
                    onClick={() => { 
                      navigate('/historique-transactions'); 
                      setShowMobileMenu(false); 
                    }}
                    className="w-full flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 hover:bg-gray-100 rounded-lg transition"
                  >
                    <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                    <span className="text-gray-800 font-medium text-sm sm:text-base">Historique</span>
                  </button>

                  {/* Mes Cartes */}
                  <button 
                    onClick={() => { 
                      navigate('/cartes'); 
                      setShowMobileMenu(false); 
                    }}
                    className="w-full flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 hover:bg-gray-100 rounded-lg transition"
                  >
                    <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                    <span className="text-gray-800 font-medium text-sm sm:text-base">Mes cartes</span>
                  </button>

                  {/* Télécharger RIB */}
                  <button 
                    onClick={() => { 
                      alert('Téléchargement du RIB en cours...');
                      setShowMobileMenu(false);
                    }}
                    className="w-full flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 hover:bg-gray-100 rounded-lg transition"
                  >
                    <Download className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                    <span className="text-gray-800 font-medium text-sm sm:text-base">Télécharger RIB</span>
                  </button>

                  <div className="border-t border-gray-200 my-2 sm:my-3"></div>

                  {/* Changer Code */}
                  <button 
                    onClick={() => { 
                      navigate('/changer-code'); 
                      setShowMobileMenu(false); 
                    }}
                    className="w-full flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 hover:bg-gray-100 rounded-lg transition"
                  >
                    <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                    <span className="text-gray-800 font-medium text-sm sm:text-base">Changer code PIN</span>
                  </button>

                  {/* Aide */}
                  <button 
                    onClick={() => { 
                      navigate('/aide'); 
                      setShowMobileMenu(false); 
                    }}
                    className="w-full flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 hover:bg-gray-100 rounded-lg transition"
                  >
                    <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                    <span className="text-gray-800 font-medium text-sm sm:text-base">Aide & Support</span>
                  </button>
                </div>
              </div>

              {/* Déconnexion */}
              <div className="p-3 sm:p-4 border-t border-gray-200">
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-red-50 hover:bg-red-100 rounded-lg transition text-red-600"
                >
                  <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="font-medium text-sm sm:text-base">Se déconnecter</span>
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Header;