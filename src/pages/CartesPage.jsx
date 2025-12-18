// pages/CartesPage.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, CreditCard, Lock, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import BottomNavigation from '../components/BottomNavigation';

const CartesPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showDetails, setShowDetails] = useState({});

  const toggleDetails = (cardId) => {
    setShowDetails(prev => ({
      ...prev,
      [cardId]: !prev[cardId]
    }));
  };

  // Utilise le numéro de carte de l'utilisateur
  const generateCardNumber = () => {
    if (user.cardNumber) {
      return user.cardNumber;
    }
    const clientNum = user.clientNumber || '0000';
    return `4532 ${clientNum.slice(-4).padStart(4, '0')} 0000 0000`;
  };

  // Date d'expiration fictive (2 ans dans le futur)
  const getExpirationDate = () => {
    const date = new Date();
    date.setFullYear(date.getFullYear() + 2);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    return `${month}/${year}`;
  };

  // Carte principale liée au compte principal
  const mainCard = {
    id: 1,
    holder: `${user.firstName} ${user.lastName}`,
    linkedAccount: user.accounts[0].type,
    balance: user.accounts[0].balance,
    currency: user.accounts[0].currency,
    cardNumber: generateCardNumber(),
    expiration: getExpirationDate(),
    status: 'active'
  };

  const getCardColor = (type) => {
    if (type === 'LIQUIDITE') return 'from-blue-600 to-blue-800';
    if (type === 'ASSURANCE') return 'from-red-600 to-red-800';
    if (type === 'ECONOMIE') return 'from-green-600 to-green-800';
    if (type === 'EPARGNE') return 'from-yellow-600 to-yellow-800';
    return 'from-gray-600 to-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header />
      
      <div className="p-4 max-w-4xl mx-auto">
        <button 
          onClick={() => navigate('/dashboard')} 
          className="flex items-center text-orange-600 mb-6 hover:text-orange-700 transition"
        >
          <ArrowLeft size={20} className="mr-2" />
          <span className="font-medium">Retour</span>
        </button>

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">Mes Cartes Bancaires</h1>
        </div>

        <div className="space-y-6">
          {/* Carte principale */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden max-w-md mx-auto">
            {/* Carte visuelle */}
            <div className={`bg-green-800 ${getCardColor(mainCard.linkedAccount)} p-4 sm:p-5 md:p-6 text-white relative`}>
              {/* Puce de carte */}
              <div className="w-10 h-8 sm:w-12 sm:h-10 mb-4 sm:mb-6 opacity-90">
                <img src="images/logo.jpeg" alt="" className="w-full h-full object-contain" />
              </div>
              
              {/* Numéro de carte */}
              <div className="mb-3 sm:mb-4">
                <p className="text-sm sm:text-base md:text-lg font-mono tracking-wider sm:tracking-widest">
                  {showDetails[mainCard.id] 
                    ? mainCard.cardNumber 
                    : `**** **** **** ${mainCard.cardNumber.slice(-4)}`
                  }
                </p>
              </div>

              {/* Solde */}
              <div className="mb-3 sm:mb-4">
                <p className="text-xl sm:text-2xl md:text-3xl font-bold">
                  {mainCard.balance.toLocaleString('fr-FR', {minimumFractionDigits: 2})} {mainCard.currency}
                </p>
              </div>

              {/* Titulaire et Expiration */}
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-xs opacity-70 mb-1">Titulaire</p>
                  <p className="font-semibold text-xs sm:text-sm uppercase">{mainCard.holder}</p>
                </div>
                <div>
                  <p className="text-xs opacity-70 mb-1 text-right">Exp.</p>
                  <p className="font-semibold text-xs sm:text-sm">{mainCard.expiration}</p>
                </div>
              </div>
            </div>

            {/* Détails et actions */}
            <div className="p-4 sm:p-6 space-y-4">
              {/* Actions rapides */}
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <button 
                  onClick={() => toggleDetails(mainCard.id)}
                  className="flex items-center justify-center border-2 border-gray-300 rounded-lg py-2 sm:py-3 hover:border-orange-500 hover:text-orange-600 transition text-sm sm:text-base"
                >
                  {showDetails[mainCard.id] ? <EyeOff size={18} className="mr-1 sm:mr-2" /> : <Eye size={18} className="mr-1 sm:mr-2" />}
                  <span className="hidden sm:inline">{showDetails[mainCard.id] ? 'Masquer' : 'Voir numéro'}</span>
                  <span className="sm:hidden">{showDetails[mainCard.id] ? 'Masquer' : 'Voir'}</span>
                </button>
                
                <button className="flex items-center justify-center bg-red-50 border-2 border-red-300 text-red-600 rounded-lg py-2 sm:py-3 hover:bg-red-100 transition text-sm sm:text-base">
                  <Lock size={18} className="mr-1 sm:mr-2" />
                  Bloquer
                </button>
              </div>

              {/* Informations détaillées */}
              {showDetails[mainCard.id] && (
                <div className="bg-gray-50 rounded-lg p-3 sm:p-4 space-y-2 sm:space-y-3 animate-fadeIn">
                  <div className="flex justify-between items-center">
                    <span className="text-xs sm:text-sm text-gray-600">Numéro complet</span>
                    <span className="font-mono font-semibold text-xs sm:text-sm">{mainCard.cardNumber}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs sm:text-sm text-gray-600">CVV</span>
                    <span className="font-mono font-semibold text-xs sm:text-sm">***</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs sm:text-sm text-gray-600">Client N°</span>
                    <span className="font-semibold text-xs sm:text-sm">{user.clientNumber}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs sm:text-sm text-gray-600">Compte lié</span>
                    <span className="font-semibold text-xs sm:text-sm">{mainCard.linkedAccount}</span>
                  </div>
                </div>
              )}

              {/* Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
                <p className="text-xs sm:text-sm text-blue-800">
                  <strong>Info :</strong> Cette carte est liée à votre compte {mainCard.linkedAccount}. 
                  Les transactions seront débitées de ce compte.
                </p>
              </div>
            </div>
          </div>

          {/* Autres comptes - Possibilité de commander des cartes */}
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-bold text-gray-800 mb-4">Autres comptes disponibles</h2>
            <div className="space-y-3 sm:space-y-4">
              {user.accounts.slice(1).map((account, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:border-orange-300 transition">
                  <div className="flex items-center justify-between mb-2 sm:mb-3">
                    <div className="flex items-center">
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center mr-3 sm:mr-4`}
                           style={{
                             backgroundColor: 
                               account.color === 'red' ? '#fee2e2' :
                               account.color === 'green' ? '#dcfce7' :
                               account.color === 'yellow' ? '#fef9c3' : '#e5e7eb'
                           }}>
                        <CreditCard 
                          style={{
                            color: 
                              account.color === 'red' ? '#dc2626' :
                              account.color === 'green' ? '#16a34a' :
                              account.color === 'yellow' ? '#ca8a04' : '#6b7280'
                          }}
                          size={20} 
                          className="sm:w-6 sm:h-6"
                        />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm sm:text-base text-gray-800">{account.type}</h3>
                        <p className="text-xs sm:text-sm text-gray-500">
                          {account.balance.toLocaleString('fr-FR', {minimumFractionDigits: 2})} {account.currency}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded p-2 sm:p-3 text-xs text-gray-600">
                    <p className="mt-1">💳 Carte Visa liée au compte {account.type}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default CartesPage;