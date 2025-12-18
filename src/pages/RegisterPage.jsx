import React, { useState } from 'react';
import { ArrowLeft, X, Copy, Check } from 'lucide-react';
import { userService } from '../services/userService';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    code: '',
    confirmCode: '',
    country: 'MAROC'
  });
  
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [generatedId, setGeneratedId] = useState('');
  const [copied, setCopied] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setShowError(false);
  };

  // Générer un ID à 11 chiffres unique
  const generateClientId = () => {
    let id = '';
    for (let i = 0; i < 11; i++) {
      id += Math.floor(Math.random() * 10);
    }
    return id;
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(generatedId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.lastName || !formData.email || 
        !formData.code || !formData.confirmCode) {
      setErrorMessage('Veuillez remplir tous les champs');
      setShowError(true);
      return;
    }

    if (formData.code.length < 6) {
      setErrorMessage('Le code doit contenir au moins 6 caractères');
      setShowError(true);
      return;
    }

    if (formData.code !== formData.confirmCode) {
      setErrorMessage('Les codes ne correspondent pas');
      setShowError(true);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setErrorMessage('Email invalide');
      setShowError(true);
      return;
    }

    setLoading(true);
    
    try {
      // ✅ Générer l'ID
      const newId = generateClientId();
      
      // ✅ Créer l'utilisateur SANS connexion automatique
      await userService.registerWithoutLogin({
        clientNumber: newId,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        code: formData.code,
        country: formData.country
      });
      
      // ✅ Afficher la page de succès avec l'ID
      setGeneratedId(newId);
      setLoading(false);
      setRegistrationSuccess(true);
    } catch (error) {
      setLoading(false);
      setErrorMessage(error.message || 'Une erreur est survenue');
      setShowError(true);
    }
  };

  // Page de succès avec l'ID généré
  if (registrationSuccess) {
    return (
      <div className="min-h-screen bg-[#D4C4A8] flex flex-col items-center justify-center p-6 font-sans">
        <div className="w-full max-w-md bg-white/80 rounded-3xl p-8 shadow-xl">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Inscription réussie !
            </h1>
            <p className="text-gray-700 text-sm">
              Votre compte a été créé avec succès
            </p>
          </div>

          <div className="bg-orange-400 to-red-500 rounded-2xl p-6 mb-6">
            <p className="text-white text-xs font-semibold mb-2 text-center">
              VOTRE IDENTIFIANT DE CONNEXION
            </p>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 mb-3">
              <p className="text-white text-3xl font-bold text-center tracking-wider">
                {generatedId}
              </p>
            </div>
            <button
              onClick={handleCopyId}
              className="w-full bg-white/30 hover:bg-white/40 text-white py-2 rounded-lg font-semibold text-sm transition-colors flex items-center justify-center gap-2"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  Copié !
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copier l'identifiant
                </>
              )}
            </button>
          </div>

          <div className="bg-yellow-50 border-2 border-yellow-400 rounded-xl p-4 mb-6">
            <p className="text-yellow-800 text-xs font-bold mb-2">⚠️ IMPORTANT</p>
            <p className="text-yellow-700 text-xs leading-relaxed">
              Notez bien cet identifiant à 11 chiffres ! Vous en aurez besoin pour vous connecter avec votre code secret.
            </p>
          </div>

          <div className="space-y-3 mb-6 text-sm text-gray-700">
            <div className="flex items-start gap-2">
              <span className="text-green-500 font-bold">✓</span>
              <p>Vous pouvez maintenant vous connecter</p>
            </div>
          </div>

          <button
            onClick={() => window.location.href = '/login'}
            className="w-full bg-gray-900 hover:bg-gray-800 text-white py-4 rounded-full font-semibold text-lg transition-colors"
          >
            Se connecter maintenant
          </button>
        </div>
      </div>
    );
  }

  // Formulaire d'inscription
  return (
    <div className="min-h-screen bg-[#D4C4A8] flex flex-col items-center justify-start p-6 font-sans">
      <button
        onClick={() => window.history.back()}
        className="self-start mb-4 flex items-center gap-2 text-gray-800 hover:text-gray-600"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Retour</span>
      </button>

      <div className="mb-8 flex items-center gap-3">
        <div className="w-20 h-14 flex items-center justify-center">
          <img src="images/logo.jpeg" alt="" />
        </div>
        <div className="flex flex-col">
          <span className="text-red-500 text-xs font-semibold" style={{direction: 'rtl'}}>
            التجاري وفا
          </span>
          <span className="text-gray-800 text-lg font-bold">
            Attijariwafa<span className="text-red-500">bank</span>
          </span>
        </div>
      </div>

      <div className="w-full max-w-md mb-8">
        <h1 className="text-2xl font-bold text-gray-900 leading-tight">
          Créer un compte
        </h1>
        <p className="text-gray-700 text-sm mt-2">
          Rejoignez Attijariwafa Bank
        </p>
      </div>

      <div className="w-full max-w-md">
        {showError && (
          <div className="bg-white/60 rounded-2xl p-4 mb-6 flex items-center justify-between">
            <span className="text-gray-800 text-sm">{errorMessage}</span>
            <button onClick={() => setShowError(false)}>
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        )}

        <form onSubmit={handleRegister}>
          <div className="space-y-5">
            <div>
              <label className="block text-gray-800 text-sm font-medium mb-2">
                Prénom *
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full bg-transparent border-b-2 border-gray-800 py-2 text-gray-900 focus:outline-none focus:border-gray-600"
                disabled={loading}
                required
                autoComplete="off"
              />
            </div>

            <div>
              <label className="block text-gray-800 text-sm font-medium mb-2">
                Nom *
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full bg-transparent border-b-2 border-gray-800 py-2 text-gray-900 focus:outline-none focus:border-gray-600"
                disabled={loading}
                required
                autoComplete="off"
              />
            </div>

            <div>
              <label className="block text-gray-800 text-sm font-medium mb-2">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-transparent border-b-2 border-gray-800 py-2 text-gray-900 focus:outline-none focus:border-gray-600"
                placeholder="exemple@email.com"
                disabled={loading}
                required
                autoComplete="off"
              />
            </div>

            <div>
              <label className="block text-gray-800 text-sm font-medium mb-2">
                Pays
              </label>
              <select
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="w-full bg-transparent border-b-2 border-gray-800 py-2 text-gray-900 focus:outline-none focus:border-gray-600"
                disabled={loading}
              >
                <option value="MAROC">MAROC</option>
                <option value="FRANCE">FRANCE</option>
                <option value="SENEGAL">SÉNÉGAL</option>
                <option value="ITALY">ITALY</option>
                <option value="BELGIQUE">BELGIQUE</option>
                <option value="AUTRICHE">AUTRICHE</option>
                <option value="ALLEMAGNE">ALLEMAGNE</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-800 text-sm font-medium mb-2">
                Code secret (min. 6 caractères) *
              </label>
              <input
                type="password"
                name="code"
                value={formData.code}
                onChange={handleChange}
                className="w-full bg-transparent border-b-2 border-gray-800 py-2 text-gray-900 focus:outline-none focus:border-gray-600"
                disabled={loading}
                minLength="6"
                required
                autoComplete="new-password"
              />
            </div>

            <div>
              <label className="block text-gray-800 text-sm font-medium mb-2">
                Confirmer le code *
              </label>
              <input
                type="password"
                name="confirmCode"
                value={formData.confirmCode}
                onChange={handleChange}
                className="w-full bg-transparent border-b-2 border-gray-800 py-2 text-gray-900 focus:outline-none focus:border-gray-600"
                disabled={loading}
                minLength="6"
                required
                autoComplete="new-password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-900 hover:bg-gray-800 text-white py-4 rounded-full font-semibold text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-8"
            >
              {loading ? 'Inscription en cours...' : "S'inscrire"}
            </button>
          </div>
        </form>

        <div className="text-center mt-6">
          <p className="text-gray-700 text-sm">
            Vous avez déjà un compte ?{' '}
            <button 
              onClick={() => window.location.href = '/login'}
              className="text-gray-900 font-semibold hover:underline"
            >
              Se connecter
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;