// pages/AidePage.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, HelpCircle, Phone, Mail, MessageCircle, FileText, Search, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import BottomNavigation from '../components/BottomNavigation';

const AidePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);

  const categories = [
    {
      id: 1,
      title: 'Virement & Transferts',
      icon: <MessageCircle size={24} />,
      questions: [
        { q: 'Comment effectuer un virement ?', a: 'Allez dans la section Virement, remplissez les informations du bénéficiaire et validez.' },
        { q: 'Quels sont les délais de virement ?', a: 'Les virements nationaux sont instantanés, les virements internationaux prennent 1-3 jours ouvrés.' },
        { q: 'Y a-t-il des frais sur les virements ?', a: 'Les virements nationaux sont gratuits. Des frais peuvent s\'appliquer pour les virements internationaux.' }
      ]
    },
    {
      id: 2,
      title: 'Cartes Bancaires',
      icon: <FileText size={24} />,
      questions: [
        { q: 'Comment bloquer ma carte ?', a: 'Rendez-vous dans Mes Cartes et cliquez sur "Bloquer la carte".' },
        { q: 'Comment commander une nouvelle carte ?', a: 'Contactez votre agence ou utilisez la section Cartes pour faire une demande.' },
        { q: 'Que faire en cas de perte/vol ?', a: 'Bloquez immédiatement votre carte via l\'application et contactez le 0522 XX XX XX.' }
      ]
    },
    {
      id: 3,
      title: 'Compte & Sécurité',
      icon: <HelpCircle size={24} />,
      questions: [
        { q: 'Comment modifier mon code ?', a: 'Allez dans Paramètres > Sécurité > Modifier le code secret.' },
        { q: 'Comment consulter mon historique ?', a: 'Accédez à la section Comptes et sélectionnez "Historique des transactions".' },
        { q: 'Mon compte est-il sécurisé ?', a: 'Oui, toutes vos données sont cryptées et protégées selon les normes bancaires internationales.' }
      ]
    },
    {
      id: 4,
      title: 'Retraits',
      icon: <Phone size={24} />,
      questions: [
        { q: 'Comment retirer sans carte ?', a: 'Utilisez la fonction Retrait sans carte pour générer un code temporaire.' },
        { q: 'Quel est le montant maximum ?', a: 'Le montant maximum par retrait est de 5 000 €.' },
        { q: 'Combien de temps le code est-il valide ?', a: 'Le code de retrait est valable pendant 24 heures.' }
      ]
    }
  ];

  const contacts = [
    { type: 'Téléphone', value: '0522 XX XX XX', icon: <Phone size={20} />, color: 'blue' },
    { type: 'Email', value: 'support@attijariwafabank.com', icon: <Mail size={20} />, color: 'green' },
    { type: 'Chat', value: 'Chat en direct', icon: <MessageCircle size={20} />, color: 'orange' }
  ];

  const filteredCategories = categories.filter(cat =>
    cat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cat.questions.some(q => q.q.toLowerCase().includes(searchQuery.toLowerCase()))
  );

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

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Centre d'Aide</h1>
          <p className="text-gray-600 mb-4">Bonjour {user.firstName}, comment pouvons-nous vous aider ?</p>

          {/* Barre de recherche */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Rechercher une question..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Contacts rapides */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Nous Contacter</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {contacts.map((contact, index) => (
              <button
                key={index}
                className={`border-2 border-${contact.color}-300 rounded-lg p-4 hover:bg-${contact.color}-50 transition text-left`}
              >
                <div className={`text-${contact.color}-600 mb-2`}>{contact.icon}</div>
                <p className="font-semibold text-gray-800 text-sm">{contact.type}</p>
                <p className="text-xs text-gray-600 mt-1">{contact.value}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Catégories de questions */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-800">Questions Fréquentes</h2>
          
          {filteredCategories.map((category) => (
            <div key={category.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <button
                onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
                className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition"
              >
                <div className="flex items-center">
                  <div className="text-orange-600 mr-4">{category.icon}</div>
                  <span className="font-semibold text-gray-800">{category.title}</span>
                </div>
                <ChevronRight 
                  className={`text-gray-400 transition-transform ${selectedCategory === category.id ? 'rotate-90' : ''}`} 
                  size={20} 
                />
              </button>

              {selectedCategory === category.id && (
                <div className="border-t border-gray-200 bg-gray-50">
                  {category.questions.map((item, index) => (
                    <div key={index} className="p-5 border-b border-gray-200 last:border-b-0">
                      <p className="font-semibold text-gray-800 mb-2">{item.q}</p>
                      <p className="text-gray-600 text-sm">{item.a}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Informations client */}
      
      </div>

      <BottomNavigation />
    </div>
  );
};

export default AidePage;