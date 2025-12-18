import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { X } from 'lucide-react';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [clientNumber, setClientNumber] = useState('');
  const [code, setCode] = useState('');
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!clientNumber || !code) {
      setErrorMessage('Veuillez remplir tous les champs');
      setShowError(true);
      return;
    }

    if (clientNumber.length !== 11) {
      setErrorMessage('Le numéro client doit contenir exactement 11 chiffres');
      setShowError(true);
      return;
    }

    if (code.length !== 6) {
      setErrorMessage('Le code doit contenir exactement 6 chiffres');
      setShowError(true);
      return;
    }

    setLoading(true);
    
    try {
      await login(clientNumber, code);
      setLoading(false);
      navigate('/dashboard');
    } catch (error) {
      setLoading(false);
      setErrorMessage(error.message || 'Identifiant ou mot de passe incorrect');
      setShowError(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#D4C4A8] flex flex-col items-center justify-start p-6 font-sans">
      {/* Logo Attijariwafa */}
      <div className="mt-8 mb-16 flex items-center gap-3">
        <div className="w-24 h-16 flex items-center justify-center relative">
          <img 
            src="images/logo.jpeg" 
            alt="Attijariwafa Bank" 
            className="w-full h-full object-contain p-2"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'block';
            }}
          />
          <div className="text-xs text-center text-black font-bold hidden">
            LOGO<br/>ICI
          </div>
        </div>
        <div className="flex flex-col">
          <span className="text-red-500 text-sm font-semibold" style={{direction: 'rtl'}}>
            التجاري وفا
          </span>
          <span className="text-gray-800 text-xl font-bold">
            Attijariwafa<span className="text-red-500">bank</span>
          </span>
        </div>
      </div>

      {/* Titre */}
      <div className="w-full max-w-md mb-12">
        <h1 className="text-3xl font-bold text-gray-900 leading-tight">
          Bienvenue sur ma banque<br />ATTIJARIWAFA
        </h1>
      </div>

      {/* Authentication */}
      <div className="w-full max-w-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-8">Authentification</h2>

        {/* Message d'erreur */}
        {showError && (
          <div className="bg-white/60 rounded-2xl p-4 mb-6 flex items-center justify-between animate-shake">
            <span className="text-gray-800 text-sm">
              {errorMessage || 'Echec - Identifiant ou mot de passe incorrect'}
            </span>
            <button onClick={() => setShowError(false)}>
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        )}

        <form onSubmit={handleLogin}>
          {/* N° Client */}
          <div className="mb-6">
            <label className="block text-gray-800 text-sm font-medium mb-2">
              N° Client (11 chiffres)
            </label>
            <input
              type="text"
              value={clientNumber}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '');
                if (value.length <= 11) {
                  setClientNumber(value);
                }
              }}
              className="w-full bg-transparent border-b-2 border-gray-800 py-3 text-gray-900 text-lg focus:outline-none focus:border-gray-600"
              placeholder=""
              disabled={loading}
              maxLength="11"
              autoComplete="off"
            />
            <p className="text-xs text-gray-600 mt-1">{clientNumber.length}/11 chiffres</p>
          </div>

          {/* Code */}
          <div className="mb-8">
            <label className="block text-gray-800 text-sm font-medium mb-2">
              Code (6 chiffres)
            </label>
            <input
              type="password"
              value={code}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '');
                if (value.length <= 6) {
                  setCode(value);
                }
              }}
              className="w-full bg-transparent border-b-2 border-gray-800 py-3 text-2xl tracking-widest focus:outline-none focus:border-gray-600"
              placeholder=""
              maxLength="6"
              disabled={loading}
              autoComplete="new-password"
            />
            <p className="text-xs text-gray-600 mt-1">{code.length}/6 chiffres</p>
          </div>

          {/* Bouton Connexion */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-900 text-white py-4 rounded-full text-lg font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Connexion...' : 'Connexion'}
          </button>
        </form>

        {/* Lien vers inscription */}
        <div className="mt-6 text-center">
          <p className="text-gray-700 text-sm">
            Pas encore de compte ?{' '}
            <button
              onClick={() => navigate('/register')}
              className="text-red-500 font-semibold hover:underline"
            >
              S'inscrire
            </button>
          </p>
        </div>

        {/* Info de test */}
        <div className="mt-8 p-4 bg-white/40 rounded-xl">
          <p className="text-xs text-gray-700 font-semibold mb-2">💡 Compte de test :</p>
          <p className="text-xs text-gray-600">N° Client: 27148050000 (11 chiffres)</p>
          <p className="text-xs text-gray-600">Code: 123456 (6 chiffres)</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;