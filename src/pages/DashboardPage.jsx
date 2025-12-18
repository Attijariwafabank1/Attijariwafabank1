import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import AccountSummary from '../components/AccountSummary';
import QuickActions from '../components/QuickActions';
import FinanceCards from '../components/FinanceCards';
import BottomNavigation from '../components/BottomNavigation';

const DashboardPage = () => {
  const { user, updateKey } = useAuth(); // ✅ Récupérer updateKey
  const [activeTab, setActiveTab] = useState('aide');

  // ✅ Log pour voir les changements
  useEffect(() => {
    console.log('👤 USER dans Dashboard:', user);
    console.log('🔑 UpdateKey:', updateKey);
  }, [user, updateKey]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <div key={updateKey} className="min-h-screen bg-white font-sans pb-20">
      {/* ✅ La clé change = React re-monte TOUT le composant */}
      


      <Header />
      <AccountSummary user={user} />
      <QuickActions activeTab={activeTab} setActiveTab={setActiveTab} />
      <FinanceCards accounts={user.accounts} />
      <BottomNavigation />
    </div>
  );
};

export default DashboardPage;