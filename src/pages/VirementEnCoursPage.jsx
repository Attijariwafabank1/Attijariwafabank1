import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserService } from '../services/UserService';
import { ArrowLeft, Clock, CheckCircle, XCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import BottomNavigation from '../components/BottomNavigation';

const VirementEnCoursPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [virements, setVirements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('tous'); // tous, En attente, Réussie, Échouée

  useEffect(() => {
    const loadVirements = async () => {
      if (user) {
        try {
          setLoading(true);
          // Charger toutes les transactions de l'utilisateur
          const transactions = await UserService.getUserTransactions(user.id);
          
          // Convertir les transactions en format virements
          const virementsFormates = transactions.map(t => ({
            id: t.id,
            beneficiaire: t.destinataire,
            iban: t.numeroDestinataire,
            montant: t.montant,
            motif: t.motif || 'Virement',
            date: new Date(t.date).toLocaleDateString('fr-FR'),
            statut: t.statut, // "Réussie", "Échouée", "En attente"
            accountType: t.accountType,
            heureCreation: t.heure,
            reference: t.reference,
            raisonEchec: t.motifEchec,
            frais: t.frais,
            devise: t.devise
          }));
          
          setVirements(virementsFormates);
        } catch (error) {
          console.error('Erreur chargement virements:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadVirements();
  }, [user]);

  const getStatutConfig = (statut) => {
    const configs = {
      'En attente': {
        label: 'En attente',
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200',
        icon: Clock
      },
      'En cours': {
        label: 'En cours',
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
        icon: RefreshCw
      },
      'Réussie': {
        label: 'Validé',
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        icon: CheckCircle
      },
      'Échouée': {
        label: 'Échoué',
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        icon: XCircle
      }
    };
    return configs[statut] || configs['En attente'];
  };

  const handleAnnuler = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir annuler ce virement ?')) {
      // Mise à jour locale uniquement (en production, faire un appel API)
      setVirements(virements.map(v => 
        v.id === id ? { ...v, statut: 'Échouée', raisonEchec: 'Annulé par l\'utilisateur' } : v
      ));
    }
  };

  const virementsAffiches = virements.filter(v => {
    if (filter === 'tous') return true;
    return v.statut === filter;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des virements...</p>
        </div>
      </div>
    );
  }

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
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Virements En Cours</h1>
          <p className="text-gray-600">Suivez l'état de vos virements en temps réel</p>
        </div>

        {/* Filtres - N'afficher QUE si il y a des virements */}
        {virements.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <div className="flex gap-2 overflow-x-auto">
              <button
                onClick={() => setFilter('tous')}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition ${
                  filter === 'tous' 
                    ? 'bg-orange-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Tous ({virements.length})
              </button>
              <button
                onClick={() => setFilter('En attente')}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition ${
                  filter === 'En attente' 
                    ? 'bg-yellow-500 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                En attente ({virements.filter(v => v.statut === 'En attente').length})
              </button>
              <button
                onClick={() => setFilter('Réussie')}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition ${
                  filter === 'Réussie' 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Validés ({virements.filter(v => v.statut === 'Réussie').length})
              </button>
              <button
                onClick={() => setFilter('Échouée')}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition ${
                  filter === 'Échouée' 
                    ? 'bg-red-500 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Échoués ({virements.filter(v => v.statut === 'Échouée').length})
              </button>
            </div>
          </div>
        )}

        {/* Liste des virements */}
        <div className="space-y-4">
          {virementsAffiches.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <AlertCircle className="mx-auto text-gray-400 mb-3" size={48} />
              <p className="text-gray-600 text-lg">Aucun virement {filter !== 'tous' ? filter.toLowerCase() : ''}</p>
              <p className="text-gray-400 text-sm mt-2">
                {user && user.isNewUser 
                  ? 'Effectuez votre premier virement pour le voir apparaître ici'
                  : filter !== 'tous' 
                    ? 'Essayez de changer le filtre'
                    : 'Vos virements en cours apparaîtront ici'
                }
              </p>
            </div>
          ) : (
            virementsAffiches.map((virement) => {
              const config = getStatutConfig(virement.statut);
              const Icon = config.icon;
              
              return (
                <div 
                  key={virement.id} 
                  className={`bg-white rounded-lg shadow-md border-l-4 ${config.borderColor} p-5 hover:shadow-lg transition`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-800 mb-1">
                        {virement.beneficiaire}
                      </h3>
                      <p className="text-sm text-gray-500">{virement.iban}</p>
                    </div>
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${config.bgColor} ${config.color}`}>
                      <Icon size={16} className={virement.statut === 'En cours' ? 'animate-spin' : ''} />
                      <span className="font-medium text-sm">{config.label}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Montant</p>
                      <p className="text-xl font-bold text-gray-800">
                        {virement.montant.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} {virement.devise}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Compte</p>
                      <p className="text-sm font-medium text-gray-700">{virement.accountType}</p>
                    </div>
                  </div>

                  {virement.motif && (
                    <div className="mb-3">
                      <p className="text-xs text-gray-500 mb-1">Motif</p>
                      <p className="text-sm text-gray-700">{virement.motif}</p>
                    </div>
                  )}

                  <div className="flex justify-between items-center text-xs text-gray-500 mb-3">
                    <span>Date: {virement.date} à {virement.heureCreation}</span>
                    <span>Réf: {virement.reference}</span>
                  </div>

                  {virement.frais > 0 && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 mb-3">
                      <p className="text-xs text-blue-700">
                        <strong>Frais:</strong> {virement.frais.toLocaleString('fr-FR', {minimumFractionDigits: 2})} {virement.devise}
                      </p>
                    </div>
                  )}

                  {virement.raisonEchec && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3">
                      <p className="text-sm text-red-700">
                        <strong>Raison:</strong> {virement.raisonEchec}
                      </p>
                    </div>
                  )}

                  {virement.statut === 'En attente' && (
                    <button
                      onClick={() => handleAnnuler(virement.id)}
                      className="w-full bg-red-50 text-red-600 py-2 rounded-lg font-medium text-sm hover:bg-red-100 transition"
                    >
                      Annuler le virement
                    </button>
                  )}

                  {virement.statut === 'Réussie' && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <p className="text-sm text-green-700 text-center">
                        ✓ Virement effectué avec succès
                      </p>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Bouton pour nouveau virement */}
        <button
          onClick={() => navigate('/virement')}
          className="w-full mt-6 bg-orange-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-orange-700 transition shadow-md"
        >
          + Nouveau Virement
        </button>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default VirementEnCoursPage;