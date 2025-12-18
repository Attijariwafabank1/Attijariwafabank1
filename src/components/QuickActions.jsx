import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowDownLeft, ArrowUpRight, CreditCard, HelpCircle } from 'lucide-react';

const QuickActions = ({ activeTab, setActiveTab }) => {
  const navigate = useNavigate();

  const actions = [
    {
      id: 'retrait',
      label: 'Retrait',
      icon: ArrowDownLeft,
      path: '/retrait'
    },
    {
      id: 'virement',
      label: 'Virement',
      icon: ArrowUpRight,
      path: '/virement'
    },
    {
      id: 'cartes',
      label: 'Cartes',
      icon: CreditCard,
      path: '/cartes'
    },
    {
      id: 'aide',
      label: 'Aide',
      icon: HelpCircle,
      path: '/aide'
    },
  ];

  const handleActionClick = (action) => {
    setActiveTab(action.id);
    navigate(action.path);
  };

  return (
    <div className="px-6 mb-6">
      <div className="flex justify-around items-center py-4 border-b border-gray-200">
        {actions.map((action) => {
          const Icon = action.icon;
          const isActive = activeTab === action.id;
          
          return (
            <button
              key={action.id}
              onClick={() => handleActionClick(action)}
              className={`flex flex-col items-center gap-2 transition-all ${
                isActive ? 'text-cyan-500' : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-sm font-medium">{action.label}</span>
              {isActive && (
                <div className="w-full h-0.5 bg-cyan-500 rounded-full mt-1" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActions;