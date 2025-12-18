import React from 'react';

const AccountSummary = ({ user }) => {
  // Trouver le compte principal (LIQUIDITE)
  const mainAccount = user.accounts?.find(acc => acc.type === 'LIQUIDITE') || user.accounts?.[0];
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="p-4 sm:p-5 md:p-6 bg-white">
      {/* Pays */}
      <div className="text-gray-500 text-xs sm:text-sm mb-1 uppercase">
        {user.country || 'MAROC'}
      </div>
      
      {/* Nom du client */}
      <div className="text-gray-800 text-sm sm:text-base font-semibold mb-1 uppercase">
        {user.lastName} {user.firstName}
      </div>
      
      {/* Date du solde */}
      <div className="text-gray-500 text-[10px] sm:text-xs mb-2 sm:mb-3">
        VOTRE SOLDE DU {user.lastUpdate || new Date().toLocaleDateString('fr-FR')}
      </div>
      
      {/* Solde principal */}
      <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 ">
        {mainAccount ? formatCurrency(mainAccount.balance) : '0,00'} {mainAccount?.currency || '€'}
      </div>
      
      {/* Info compte bloqué (si applicable) */}
      {user.blockedAmount > 0 && (
        <div className="text-gray-500 text-xs sm:text-sm">
          COMPTE BLOQUE / FRAIS DE DEBLOCAGE: {formatCurrency(user.blockedAmount)}DH
        </div>
      )}
    </div>
  );
};

export default AccountSummary;