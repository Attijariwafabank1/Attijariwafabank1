// pages/NotificationsPage.jsx
import React, { useState } from 'react';
import { ArrowLeft, Bell, Send, Shield, CreditCard, TrendingUp, Mail, Smartphone, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import BottomNavigation from '../components/BottomNavigation';

const NotificationsPage = () => {
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);

  // États pour les notifications
  const [notifications, setNotifications] = useState({
    virements: true,
    connexions: true,
    operations: false,
    marketing: false,
    soldesBas: true,
    operationsImportantes: true,
    promotions: false,
    newsletter: false
  });

  // Canaux de notification
  const [canaux, setCanaux] = useState({
    email: true,
    sms: true,
    push: false
  });

  const handleSave = () => {
    // Ici vous appelleriez votre API pour sauvegarder les préférences
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      navigate('/compte');
    }, 2000);
  };

  const notificationCategories = [
    {
      title: 'Virements',
      description: 'Recevez une notification pour chaque virement',
      icon: <Send size={24} className="text-orange-600" />,
      key: 'virements',
      color: 'orange'
    },
    {
      title: 'Connexions',
      description: 'Alertes de sécurité pour les nouvelles connexions',
      icon: <Shield size={24} className="text-blue-600" />,
      key: 'connexions',
      color: 'blue'
    },
    {
      title: 'Opérations',
      description: 'Retraits, dépôts et autres transactions',
      icon: <CreditCard size={24} className="text-green-600" />,
      key: 'operations',
      color: 'green'
    },
    {
      title: 'Soldes bas',
      description: 'Alerte quand votre solde est inférieur à un seuil',
      icon: <TrendingUp size={24} className="text-red-600" />,
      key: 'soldesBas',
      color: 'red'
    },
    {
      title: 'Opérations importantes',
      description: 'Transactions supérieures à 500 000 FCFA',
      icon: <TrendingUp size={24} className="text-purple-600" />,
      key: 'operationsImportantes',
      color: 'purple'
    },
    {
      title: 'Marketing',
      description: 'Offres et promotions exclusives',
      icon: <Mail size={24} className="text-pink-600" />,
      key: 'marketing',
      color: 'pink'
    },
    {
      title: 'Promotions',
      description: 'Nouveaux produits et services',
      icon: <TrendingUp size={24} className="text-yellow-600" />,
      key: 'promotions',
      color: 'yellow'
    },
    {
      title: 'Newsletter',
      description: 'Actualités bancaires et conseils financiers',
      icon: <Mail size={24} className="text-indigo-600" />,
      key: 'newsletter',
      color: 'indigo'
    }
  ];

  const canauxNotification = [
    {
      title: 'Email',
      description: 'Recevez les notifications par email',
      icon: <Mail size={24} className="text-orange-600" />,
      key: 'email'
    },
    {
      title: 'SMS',
      description: 'Recevez les notifications par SMS',
      icon: <Smartphone size={24} className="text-orange-600" />,
      key: 'sms'
    },
    {
      title: 'Push',
      description: 'Notifications push sur votre appareil',
      icon: <Bell size={24} className="text-orange-600" />,
      key: 'push'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header />
      
      <div className="p-4 max-w-4xl mx-auto">
        <button 
          onClick={() => navigate('/compte')} 
          className="flex items-center text-orange-600 mb-6 hover:text-orange-700 transition"
        >
          <ArrowLeft size={20} className="mr-2" />
          <span className="font-medium">Retour</span>
        </button>

        {/* En-tête */}
        <div className=" bg-orange-600 to-orange-700 rounded-lg shadow-md p-6 text-white mb-6">
          <div className="flex items-center">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-4">
              <Bell size={32} />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Notifications</h1>
              <p className="text-orange-100 text-sm mt-1">Gérez vos préférences de notification</p>
            </div>
          </div>
        </div>

        {/* Message de succès */}
        {saved && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-center">
            <Check className="text-green-600 mr-3" size={24} />
            <p className="text-green-800 font-medium">✅ Préférences enregistrées avec succès !</p>
          </div>
        )}

        {/* Canaux de notification */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Canaux de notification</h2>
          <p className="text-sm text-gray-600 mb-4">Choisissez comment vous souhaitez recevoir vos notifications</p>
          
          <div className="space-y-4">
            {canauxNotification.map((canal) => (
              <div key={canal.key} className="flex justify-between items-center p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center flex-1">
                  <div className="mr-4">{canal.icon}</div>
                  <div>
                    <p className="font-semibold text-gray-800">{canal.title}</p>
                    <p className="text-sm text-gray-500">{canal.description}</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={canaux[canal.key]}
                    onChange={(e) => setCanaux({ ...canaux, [canal.key]: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute  after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Types de notifications */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Types de notifications</h2>
          <p className="text-sm text-gray-600 mb-4">Personnalisez les types d'alertes que vous souhaitez recevoir</p>
          
          <div className="space-y-4">
            {notificationCategories.map((category) => (
              <div key={category.key} className="flex justify-between items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                <div className="flex items-center flex-1">
                  <div className="mr-4">{category.icon}</div>
                  <div>
                    <p className="font-semibold text-gray-800">{category.title}</p>
                    <p className="text-sm text-gray-500">{category.description}</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications[category.key]}
                    onChange={(e) => setNotifications({ ...notifications, [category.key]: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute  after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                </label>
              </div>
            ))}
          </div>
        </div>

      
     
        {/* Boutons d'action */}
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/compte')}
            className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            className="flex-1 bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 transition"
          >
            Enregistrer
          </button>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default NotificationsPage;