import React, { useState } from 'react';
import { X, Delete } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [clientNumber, setClientNumber] = useState('');
  const [code, setCode] = useState('');
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showKeyboard, setShowKeyboard] = useState(false);

  const handleNumberClick = (num) => {
    if (code.length < 6) {
      setCode(code + num);
    }
  };

  const handleDelete = () => {
    setCode(code.slice(0, -1));
  };

  const handleLogin = async () => {
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
      navigate('/dashboard'); // Redirige vers le tableau de bord après connexion
    } catch (error) {
      setErrorMessage(error.message || 'Identifiant ou mot de passe incorrect');
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#E8D5B7] flex flex-col items-center justify-start p-4 sm:p-6 lg:p-8 font-sans">
      {/* Logo Attijariwafa */}
      <div className="mt-4 sm:mt-8 mb-8 sm:mb-16 flex items-center gap-2 sm:gap-3">
        <div className="w-20 h-14 sm:w-24 sm:h-16 flex items-center justify-center relative">
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
          <span className="text-red-500 text-xs sm:text-sm font-semibold" style={{direction: 'rtl'}}>
            التجاري وفا
          </span>
          <span className="text-gray-800 text-lg sm:text-xl font-bold">
            Attijariwafa<span className="text-red-500">bank</span>
          </span>
        </div>
      </div>

      {/* Titre */}
      <div className="w-full max-w-md mb-6 sm:mb-8 px-2">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
          Bienvenue sur ma banque<br />ATTIJARIWAFA
        </h1>
      </div>

      {/* Authentication */}
      <div className="w-full max-w-md px-2">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6">Authentification</h2>

        {/* Message d'erreur */}
        {showError && (
          <div className="bg-white/60 rounded-2xl p-3 sm:p-4 mb-4 sm:mb-6 flex items-center justify-between">
            <span className="text-gray-800 text-xs sm:text-sm">
              {errorMessage || 'Echec - Identifiant ou mot de passe incorrect'}
            </span>
            <button onClick={() => setShowError(false)}>
              <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
            </button>
          </div>
        )}

        {/* N° Client */}
        <div className="mb-4 sm:mb-6">
          <label className="block text-gray-800 text-xs sm:text-sm font-medium mb-2">
            N° Client 
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
            className="w-full bg-transparent border-b-2 border-gray-800 py-2 sm:py-3 text-gray-900 text-base sm:text-lg focus:outline-none focus:border-gray-600"
            placeholder=""
            disabled={loading}
            maxLength={11}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
          />
          <p className="text-xs text-gray-600 mt-1">{clientNumber.length}/11 chiffres</p>
        </div>

        {/* Code */}
        <div className="mb-4 sm:mb-6">
          <label className="block text-gray-800 text-xs sm:text-sm font-medium mb-2">
            Code 
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
            onFocus={() => setShowKeyboard(true)}
            className="w-full bg-transparent border-b-2 border-gray-800 py-2 sm:py-3 text-gray-900 text-base sm:text-lg focus:outline-none focus:border-gray-600"
            placeholder=""
            disabled={loading}
            maxLength={6}
            autoComplete="new-password"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
          />
          <p className="text-xs text-gray-600 mt-1">{code.length}/6 chiffres</p>
        </div>

        {/* Clavier Numérique */}
        {showKeyboard && (
          <div className="mb-4 sm:mb-6 bg-white  text-blackrounded-2xl p-4 sm:p-6 grid grid-cols-3 gap-3 sm:gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => handleNumberClick(num.toString())}
                disabled={loading}
                className="bg-transparent hover:bg-white/20 active:bg-white/30 text-gray-900 text-2xl sm:text-3xl font-semibold py-4 sm:py-5 rounded-xl transition-all disabled:opacity-50"
              >
                {num}
              </button>
            ))}
            <div className="col-span-1"></div>
            <button
              type="button"
              onClick={() => handleNumberClick('0')}
              disabled={loading}
              className="bg-transparent hover:bg-white/20 active:bg-white/30 text-gray-900 text-2xl sm:text-3xl font-semibold py-4 sm:py-5 rounded-xl transition-all disabled:opacity-50"
            >
              0
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={loading}
              className="bg-transparent hover:bg-white/20 active:bg-white/30 text-gray-900 text-2xl sm:text-3xl font-bold py-4 sm:py-5 rounded-xl transition-all flex items-center justify-center disabled:opacity-50"
            >
              <Delete className="w-6 h-6 sm:w-8 sm:h-8" strokeWidth={2.5} />
            </button>
          </div>
        )}

        {/* Bouton Connexion */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-gray-900 text-white py-3 sm:py-4 rounded-full text-base sm:text-lg font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Connexion...' : 'Connexion'}
        </button>

        {/* Lien vers inscription */}
        <div className="mt-4 sm:mt-6 text-center">
          <p className="text-gray-700 text-xs sm:text-sm">
            Pas encore de compte ?{' '}
            <a
              href="/register"
              className="text-red-500 font-semibold hover:underline"
            >
              S'inscrire
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;