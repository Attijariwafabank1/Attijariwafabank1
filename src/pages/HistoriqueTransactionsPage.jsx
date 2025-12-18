// pages/HistoriqueTransactionsPage.jsx
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, ArrowUpRight, ArrowDownLeft, RefreshCw, CheckCircle, XCircle, AlertCircle, Search, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import BottomNavigation from '../components/BottomNavigation';
import { UserService } from '../services/UserService';

const HistoriqueTransactionsPage = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('Tous');
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = UserService.getCurrentUser();
    if (!user) {
      navigate('/login');
      return;
    }
    setCurrentUser(user);
    loadTransactions(user.id);
    loadStats(user.id);
  }, [navigate]);

  const loadTransactions = async (userId) => {
    setLoading(true);
    try {
      const data = await UserService.getUserTransactions(userId);
      setTransactions(data);
    } catch (error) {
      console.error('Erreur chargement transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async (userId) => {
    try {
      const data = await UserService.getTransactionStats(userId);
      setStats(data);
    } catch (error) {
      console.error('Erreur chargement stats:', error);
    }
  };

  const handleSearch = async () => {
    if (!currentUser) return;
    
    if (searchTerm.trim() === '') {
      loadTransactions(currentUser.id);
    } else {
      setLoading(true);
      try {
        const results = await UserService.searchTransactions(currentUser.id, searchTerm);
        setTransactions(results);
      } catch (error) {
        console.error('Erreur recherche:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const getTransactionIcon = (type) => {
    switch(type) {
      case 'Envoi': 
        return <ArrowUpRight size={24} className="text-red-600" />;
      case 'Réception': 
        return <ArrowDownLeft size={24} className="text-green-600" />;
      case 'Retrait': 
        return <ArrowUpRight size={24} className="text-orange-600" />;
      case 'Dépôt': 
        return <ArrowDownLeft size={24} className="text-blue-600" />;
      case 'Transfert compte': 
        return <RefreshCw size={24} className="text-purple-600" />;
      default: 
        return <RefreshCw size={24} className="text-gray-600" />;
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const formatMontant = (montant, devise = '€') => {
    return new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(montant) + ' ' + devise;
  };

  const filteredTransactions = transactions.filter(t => {
    if (filterType === 'Tous') return true;
    return t.type === filterType;
  });

  if (loading && transactions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw size={48} className="text-orange-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Chargement des transactions...</p>
        </div>
      </div>
    );
  }

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
              <Clock size={32} />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Historique des Transactions</h1>
              <p className="text-orange-100 text-sm mt-1">Toutes vos opérations bancaires</p>
            </div>
          </div>
        </div>

        {/* Statistiques */}
        {stats && (
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Réussies</p>
                  <p className="text-2xl font-bold text-green-600 mt-1">{stats.reussies}</p>
                </div>
                <CheckCircle size={32} className="text-green-600" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Échouées</p>
                  <p className="text-2xl font-bold text-red-600 mt-1">{stats.echouees}</p>
                </div>
                <XCircle size={32} className="text-red-600" />
              </div>
            </div>
          </div>
        )}

        {/* Barre de recherche et filtre */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex gap-2 mb-3">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Rechercher une transaction..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            <button
              onClick={handleSearch}
              className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition"
            >
              <Search size={20} />
            </button>
          </div>

          {/* Filtres */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <Filter size={18} className="text-gray-600 " />
            {['Tous', 'Envoi', 'Réception', 'Retrait', 'Dépôt', 'Transfert compte'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap transition ${
                  filterType === type
                    ? 'bg-orange-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Alerte de sécurité */}
        {stats && stats.echouees > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <AlertCircle className="text-yellow-600 mr-3 mt-0.5 " size={20} />
              <div>
                <h3 className="font-semibold text-yellow-900 mb-1">⚠️ Attention</h3>
                <p className="text-sm text-yellow-800">
                  {stats.echouees} transaction(s) ont échoué. Vérifiez vos informations ou contactez le support.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Liste des transactions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800">
              {filteredTransactions.length} transaction(s)
            </h2>
            <button
              onClick={() => loadTransactions(currentUser?.id)}
              className="text-orange-600 hover:text-orange-700 transition"
            >
              <RefreshCw size={20} />
            </button>
          </div>
          
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <AlertCircle size={48} className="mx-auto mb-3 text-gray-300" />
              <p>Aucune transaction trouvée</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTransactions.map((transaction) => (
                <div 
                  key={transaction.id} 
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition cursor-pointer"
                  onClick={() => {
                    alert(`Détails de la transaction\n\nRéférence: ${transaction.reference}\nMontant: ${formatMontant(transaction.montant, transaction.devise)}\nFrais: ${formatMontant(transaction.frais, transaction.devise)}\nCompte: ${transaction.accountType}`);
                  }}
                >
                  <div className="flex items-start gap-4">
                    {/* Icône transaction */}
                    <div className="mt-1">
                      {getTransactionIcon(transaction.type)}
                    </div>

                    {/* Informations */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-semibold text-gray-800">{transaction.type}</p>
                          <p className="text-sm text-gray-600 mt-1">{transaction.destinataire}</p>
                          {transaction.numeroDestinataire && (
                            <p className="text-xs text-gray-500 mt-0.5">{transaction.numeroDestinataire}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className={`text-lg font-bold ${
                            transaction.type === 'Réception' || transaction.type === 'Dépôt'
                              ? 'text-green-600'
                              : 'text-red-600'
                          }`}>
                            {transaction.type === 'Réception' || transaction.type === 'Dépôt' ? '+' : '-'}
                            {formatMontant(transaction.montant, transaction.devise)}
                          </p>
                          {transaction.frais > 0 && (
                            <p className="text-xs text-gray-500 mt-1">
                              Frais: {formatMontant(transaction.frais, transaction.devise)}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm mt-2 pt-2 border-t border-gray-100">
                        <div className="flex items-center text-gray-500">
                          <Clock size={14} className="mr-1" />
                          {formatDate(transaction.date)} à {transaction.heure}
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          transaction.statut === 'Réussie' 
                            ? 'bg-green-100 text-green-700' 
                            : transaction.statut === 'Échouée'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {transaction.statut}
                        </span>
                      </div>

                      <p className="text-xs text-gray-400 mt-2">Réf: {transaction.reference}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-6 space-y-3">
          <button
            onClick={() => navigate('/virement')}
            className="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 transition flex items-center justify-center gap-2"
          >
            <ArrowUpRight size={20} />
            Nouvelle transaction
          </button>
          
          <button
            onClick={() => {
              alert('Fonctionnalité de téléchargement du relevé en cours de développement');
            }}
            className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
          >
            Télécharger le relevé
          </button>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default HistoriqueTransactionsPage;