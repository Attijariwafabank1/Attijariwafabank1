// pages/RetraitPage.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, ArrowDown, AlertCircle, Check, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import BottomNavigation from '../components/BottomNavigation';

const RetraitPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    montant: '',
    accountType: 'LIQUIDITE',
    agence: 'Casablanca - Centre Ville'
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [codeRetrait, setCodeRetrait] = useState('');

  const agences = [
    'Casablanca - Centre Ville',
    'Rabat - Agdal',
    'Marrakech - Gueliz',
    'Tanger - Médina',
    'Fès - Ville Nouvelle'
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const generateCode = () => {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (!formData.montant || parseFloat(formData.montant) <= 0) {
      setError('Veuillez entrer un montant valide');
      setLoading(false);
      return;
    }

    const account = user.accounts.find(acc => acc.type === formData.accountType);
    if (parseFloat(formData.montant) > account.balance) {
      setError('Solde insuffisant sur ce compte');
      setLoading(false);
      return;
    }

    if (parseFloat(formData.montant) > 5000) {
      setError('Le montant maximum par retrait est de 5 000 €');
      setLoading(false);
      return;
    }

    // Simulation du retrait
    setTimeout(() => {
      setCodeRetrait(generateCode());
      setSuccess(true);
      setLoading(false);
    }, 1500);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <Check className="text-white" size={50} />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Retrait autorisé !</h2>
          
          <div className="bg-orange-50 border-2 border-orange-500 rounded-lg p-6 mb-6">
            <p className="text-sm text-gray-600 mb-2">Code de retrait :</p>
            <p className="text-4xl font-bold text-orange-600 tracking-widest mb-2">{codeRetrait}</p>
            <p className="text-xs text-gray-500">Valable 24h</p>
          </div>

          <div className="text-left bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600">Montant: <span className="font-bold">{formData.montant} €</span></p>
            <p className="text-sm text-gray-600 mt-2">Agence: <span className="font-bold">{formData.agence}</span></p>
          </div>

          <p className="text-sm text-gray-500 mb-6">
            Présentez ce code et votre pièce d'identité à l'agence sélectionnée pour effectuer votre retrait.
          </p>

          <button
            onClick={() => navigate('/dashboard')}
            className="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 transition"
          >
            Retour au tableau de bord
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header />
      
      <div className="p-4 max-w-2xl mx-auto">
        <button 
          onClick={() => navigate('/dashboard')} 
          className="flex items-center text-orange-600 mb-6 hover:text-orange-700 transition"
        >
          <ArrowLeft size={20} className="mr-2" />
          <span className="font-medium">Retour</span>
        </button>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-6">
            <div className="bg-orange-100 p-3 rounded-full mr-4">
              <ArrowDown className="text-orange-600" size={24} />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Retrait sans carte</h1>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start">
              <AlertCircle className="text-red-500 mr-3  mt-0.5" size={20} />
              <p className="text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Compte source */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Compte à débiter *
              </label>
              <select
                name="accountType"
                value={formData.accountType}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                {user.accounts.map((account) => (
                  <option key={account.type} value={account.type}>
                    {account.type} - {account.balance.toLocaleString('fr-FR')} {account.currency}
                  </option>
                ))}
              </select>
            </div>

            {/* Montant */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Montant du retrait *
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="montant"
                  value={formData.montant}
                  onChange={handleChange}
                  placeholder="0.00"
                  step="10"
                  min="10"
                  max="5000"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-12 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                  €
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-2">Montant maximum: 5 000 € par retrait</p>
            </div>

            {/* Montants rapides */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-3">Montants rapides</p>
              <div className="grid grid-cols-4 gap-2">
                {[20, 50, 100, 200].map(amount => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => setFormData({ ...formData, montant: amount.toString() })}
                    className="border-2 border-gray-300 rounded-lg py-2 text-sm font-semibold text-gray-700 hover:border-orange-500 hover:text-orange-600 transition"
                  >
                    {amount}€
                  </button>
                ))}
              </div>
            </div>

            {/* Agence */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                <MapPin size={16} className="mr-2" />
                Agence de retrait *
              </label>
              <select
                name="agence"
                value={formData.agence}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                {agences.map((agence) => (
                  <option key={agence} value={agence}>
                    {agence}
                  </option>
                ))}
              </select>
            </div>

            {/* Information */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Information :</strong> Vous recevrez un code de retrait valable 24h. 
                Présentez-vous à l'agence avec ce code et votre pièce d'identité.
              </p>
            </div>

            {/* Bouton de soumission */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-orange-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Traitement en cours...
                </>
              ) : (
                <>
                  <ArrowDown size={20} className="mr-2" />
                  Générer le code de retrait
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default RetraitPage;