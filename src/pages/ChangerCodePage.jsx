// pages/ChangerCodePage.jsx
import React, { useState } from 'react';
import { ArrowLeft, Lock, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import BottomNavigation from '../components/BottomNavigation';

const ChangerCodePage = () => {
  const navigate = useNavigate();
  const [showCurrentCode, setShowCurrentCode] = useState(false);
  const [showNewCode, setShowNewCode] = useState(false);
  const [showConfirmCode, setShowConfirmCode] = useState(false);
  
  const [codeData, setCodeData] = useState({
    currentCode: '',
    newCode: '',
    confirmCode: ''
  });
  const [codeError, setCodeError] = useState('');
  const [codeSuccess, setCodeSuccess] = useState('');

  const handleChangeCode = (e) => {
    e.preventDefault();
    setCodeError('');
    setCodeSuccess('');

    // Validation
    if (!codeData.currentCode || !codeData.newCode || !codeData.confirmCode) {
      setCodeError('Veuillez remplir tous les champs');
      return;
    }

    if (codeData.newCode.length < 6) {
      setCodeError('Le nouveau code doit contenir au moins 6 caractères');
      return;
    }

    if (codeData.newCode !== codeData.confirmCode) {
      setCodeError('Les codes ne correspondent pas');
      return;
    }

    // Ici vous appelleriez votre API pour changer le code
    setCodeSuccess('Code secret modifié avec succès !');
    setCodeData({ currentCode: '', newCode: '', confirmCode: '' });
    
    setTimeout(() => {
      navigate('/compte');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header />
      
      <div className="p-4 max-w-2xl mx-auto">
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
              <Lock size={32} />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Modifier le Code Secret</h1>
              <p className="text-orange-100 text-sm mt-1">Changez votre code d'accès en toute sécurité</p>
            </div>
          </div>
        </div>

        {/* Conseils de sécurité */}
       

        {/* Formulaire */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleChangeCode} className="space-y-6">
            {/* Code actuel */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Code actuel
              </label>
              <div className="relative">
                <input
                  type={showCurrentCode ? "text" : "password"}
                  value={codeData.currentCode}
                  onChange={(e) => setCodeData({ ...codeData, currentCode: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-12 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Entrez votre code actuel"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentCode(!showCurrentCode)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showCurrentCode ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Nouveau code */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nouveau code
              </label>
              <div className="relative">
                <input
                  type={showNewCode ? "text" : "password"}
                  value={codeData.newCode}
                  onChange={(e) => setCodeData({ ...codeData, newCode: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-12 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Entrez votre nouveau code"
                />
                <button
                  type="button"
                  onClick={() => setShowNewCode(!showNewCode)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showNewCode ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {codeData.newCode && (
                <div className="mt-2">
                  <div className="flex items-center gap-1">
                    <div className={`h-1 flex-1 rounded ${codeData.newCode.length >= 2 ? 'bg-red-500' : 'bg-gray-200'}`}></div>
                    <div className={`h-1 flex-1 rounded ${codeData.newCode.length >= 4 ? 'bg-yellow-500' : 'bg-gray-200'}`}></div>
                    <div className={`h-1 flex-1 rounded ${codeData.newCode.length >= 6 ? 'bg-orange-500' : 'bg-gray-200'}`}></div>
                    <div className={`h-1 flex-1 rounded ${codeData.newCode.length >= 8 ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    Force du code: {
                      codeData.newCode.length < 4 ? 'Faible' :
                      codeData.newCode.length < 6 ? 'Moyen' :
                      codeData.newCode.length < 8 ? 'Bon' : 'Excellent'
                    }
                  </p>
                </div>
              )}
            </div>

            {/* Confirmer le code */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Confirmer le nouveau code
              </label>
              <div className="relative">
                <input
                  type={showConfirmCode ? "text" : "password"}
                  value={codeData.confirmCode}
                  onChange={(e) => setCodeData({ ...codeData, confirmCode: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-12 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Confirmez votre nouveau code"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmCode(!showConfirmCode)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmCode ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Messages d'erreur et succès */}
            {codeError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-700 font-medium">❌ {codeError}</p>
              </div>
            )}

            {codeSuccess && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-700 font-medium">✅ {codeSuccess}</p>
              </div>
            )}

            {/* Boutons */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => navigate('/compte')}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="flex-1 bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 transition"
              >
                Changer le code
              </button>
            </div>
          </form>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default ChangerCodePage;