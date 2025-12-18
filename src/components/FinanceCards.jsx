import React from 'react';

const FinanceCards = ({ accounts }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-500',
      red: 'bg-red-500',
      green: 'bg-green-500',
      yellow: 'bg-yellow-500',
    };
    return colors[color] || 'bg-blue-500';
  };

  const getDotColor = (color) => {
    const colors = {
      blue: 'text-blue-500',
      red: 'text-red-500',
      green: 'text-green-500',
      yellow: 'text-yellow-500',
    };
    return colors[color] || 'text-blue-500';
  };

  // Calculer le pourcentage pour la barre de progression (simulation)
  const getProgressPercentage = (balance) => {
    const maxBalance = Math.max(...accounts.map(acc => acc.balance));
    return Math.min((balance / maxBalance) * 100, 100);
  };

  return (
    <div className="px-4 sm:px-5 md:px-6 pb-4 sm:pb-5 md:pb-6">
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {accounts && accounts.length > 0 ? (
          accounts.map((account, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-xl sm:rounded-2xl p-3 sm:p-4 hover:shadow-md transition-shadow"
            >
              {/* Type de compte avec dot coloré */}
              <div className="flex items-center gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                <span className={`text-xl sm:text-2xl ${getDotColor(account.color)}`}>●</span>
                <span className="text-gray-600 text-[10px] sm:text-xs font-semibold uppercase truncate">
                  {account.type}
                </span>
              </div>

              {/* Montant */}
              <div className="text-gray-900 text-base sm:text-lg md:text-xl font-bold mb-2 sm:mb-3 ">
                {formatCurrency(account.balance)}{account.currency}
              </div>

              {/* Barre de progression */}
              <div className="w-full bg-gray-200 rounded-full h-1 sm:h-1.5">
                <div
                  className={`h-1 sm:h-1.5 rounded-full transition-all ${getColorClasses(account.color)}`}
                  style={{ width: `${getProgressPercentage(account.balance)}%` }}
                />
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-2 text-center text-gray-500 py-6 sm:py-8 text-sm sm:text-base">
            Aucun compte disponible
          </div>
        )}
      </div>
    </div>
  );
};

export default FinanceCards;