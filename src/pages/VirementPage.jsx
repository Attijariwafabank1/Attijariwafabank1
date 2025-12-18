// pages/VirementPage.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Send, AlertCircle, Check, Download, Printer } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import BottomNavigation from '../components/BottomNavigation';
import { UserService } from '../services/UserService';
import emailjs from '@emailjs/browser';

const VirementPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState('form'); // 'form', 'success', 'receipt'
  const [transactionData, setTransactionData] = useState(null);
  
  const [formData, setFormData] = useState({
    beneficiaire: '',
    iban: '',
    bic: '',
    email: '',
    montant: '',
    motif: '',
    accountType: 'LIQUIDITE'
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // 🔥 CONFIGURATION EMAILJS - Remplacez par vos clés
  const EMAILJS_SERVICE_ID = 'service_82p42sq'; // Ex: 'service_abc123'
  const EMAILJS_TEMPLATE_ID = 'template_u90920h'; // Ex: 'template_xyz789'
  const EMAILJS_PUBLIC_KEY = '8yvMMNNMp_doHLwjz'; // Ex: 'user_123abc456def'

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Effacer l'erreur du champ modifié
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Bénéficiaire
    if (!formData.beneficiaire.trim()) {
      newErrors.beneficiaire = 'Le nom du bénéficiaire est requis';
    } else if (formData.beneficiaire.length < 3) {
      newErrors.beneficiaire = 'Le nom doit contenir au moins 3 caractères';
    }

    // IBAN
    if (!formData.iban.trim()) {
      newErrors.iban = 'L\'IBAN est requis';
    } else if (formData.iban.replace(/\s/g, '').length < 15) {
      newErrors.iban = 'IBAN invalide (minimum 15 caractères)';
    }

    // BIC
    if (!formData.bic.trim()) {
      newErrors.bic = 'Le code BIC est requis';
    } else if (formData.bic.length < 8 || formData.bic.length > 11) {
      newErrors.bic = 'BIC invalide (8 à 11 caractères)';
    }

    // Email
    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide';
    }

    // Montant
    if (!formData.montant) {
      newErrors.montant = 'Le montant est requis';
    } else if (parseFloat(formData.montant) <= 0) {
      newErrors.montant = 'Le montant doit être supérieur à 0';
    } else {
      const account = user.accounts.find(acc => acc.type === formData.accountType);
      if (parseFloat(formData.montant) > account.balance) {
        newErrors.montant = `Solde insuffisant (disponible: ${account.balance.toLocaleString('fr-FR')} ${account.currency})`;
      }
    }

    // Motif
    if (!formData.motif.trim()) {
      newErrors.motif = 'Le motif est requis';
    } else if (formData.motif.length < 3) {
      newErrors.motif = 'Le motif doit contenir au moins 3 caractères';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 🔥 FONCTION D'ENVOI D'EMAIL
  const sendConfirmationEmail = async (transaction) => {
    try {
      const templateParams = {
        beneficiaire_nom: formData.beneficiaire,
        beneficiaire_email: formData.email,
        emetteur_nom: `${user.firstName} ${user.lastName}`,
        montant: `${parseFloat(formData.montant).toLocaleString('fr-FR', {minimumFractionDigits: 2})} €`,
        reference: transaction.reference,
        date: new Date(transaction.date).toLocaleDateString('fr-FR'),
        heure: transaction.heure,
        motif: formData.motif,
        iban: formData.iban,
        bic: formData.bic,
        frais: `${transaction.frais.toLocaleString('fr-FR', {minimumFractionDigits: 2})} €`,
        total: `${(parseFloat(formData.montant) + transaction.frais).toLocaleString('fr-FR', {minimumFractionDigits: 2})} €`
      };

      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams,
        EMAILJS_PUBLIC_KEY
      );

      console.log('✅ Email envoyé avec succès');
    } catch (error) {
      console.error('❌ Erreur lors de l\'envoi de l\'email:', error);
      // Ne pas bloquer la transaction si l'email échoue
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    // Simulation de l'envoi du virement
    setTimeout(async () => {
      try {
        // Créer la transaction
        const transaction = await UserService.addTransaction({
          userId: user.id,
          type: 'Envoi',
          accountType: formData.accountType,
          destinataire: formData.beneficiaire,
          numeroDestinataire: formData.iban,
          montant: parseFloat(formData.montant),
          frais: parseFloat(formData.montant) * 0.005, // 0.5% de frais
          devise: '€',
          statut: 'Réussie',
          bic: formData.bic,
          email: formData.email,
          motif: formData.motif
        });

        // 🔥 ENVOYER L'EMAIL DE CONFIRMATION
        await sendConfirmationEmail(transaction);

        setTransactionData(transaction);
        setStep('success');
        setLoading(false);

        // Passer au reçu après 2 secondes
        setTimeout(() => {
          setStep('receipt');
        }, 2000);
      } catch (error) {
        setErrors({ submit: 'Erreur lors du virement' });
        setLoading(false);
      }
    }, 1500);
  };

  const downloadPDF = () => {
    // Créer le contenu du reçu
    const receiptContent = `
╔══════════════════════════════════════════════════════════╗
║          REÇU DE VIREMENT - ATTIJARIWAFA BANK          ║
╚══════════════════════════════════════════════════════════╝

Date: ${new Date(transactionData.date).toLocaleDateString('fr-FR')}
Heure: ${transactionData.heure}
Référence: ${transactionData.reference}

─────────────────────────────────────────────────────────

INFORMATIONS DE L'ÉMETTEUR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Nom: ${user.firstName} ${user.lastName}
Compte: ${formData.accountType}
Numéro client: ${user.clientNumber}

INFORMATIONS DU BÉNÉFICIAIRE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Nom: ${formData.beneficiaire}
IBAN: ${formData.iban}
BIC: ${formData.bic}
Email: ${formData.email}

DÉTAILS DU VIREMENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Montant: ${parseFloat(formData.montant).toLocaleString('fr-FR', {minimumFractionDigits: 2})} €
Frais: ${transactionData.frais.toLocaleString('fr-FR', {minimumFractionDigits: 2})} €
Total débité: ${(parseFloat(formData.montant) + transactionData.frais).toLocaleString('fr-FR', {minimumFractionDigits: 2})} €

Motif: ${formData.motif}

Statut: ${transactionData.statut}

─────────────────────────────────────────────────────────

Ce document est généré automatiquement et ne nécessite
pas de signature. Il fait office de preuve de transaction.

Un email de confirmation a été envoyé à: ${formData.email}

ATTIJARIWAFA BANK - Tous droits réservés
Service Client: +212 533 298844
Email: support@attijariwafa.ma
    `.trim();

    // Créer un blob et télécharger
    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `recu_virement_${transactionData.reference}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const printReceipt = () => {
    window.print();
  };

  // Page de succès
  if (step === 'success') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center p-6">
          <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <Check className="text-white" size={50} />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Virement effectué !</h2>
          <p className="text-gray-600 text-lg">Montant: {formData.montant} €</p>
          <p className="text-gray-500 mt-2">Bénéficiaire: {formData.beneficiaire}</p>
          <p className="text-sm text-gray-400 mt-4">Génération du reçu...</p>
          <p className="text-xs text-green-600 mt-2">✉️ Email de confirmation envoyé</p>
        </div>
      </div>
    );
  }

  // Page de reçu
  if (step === 'receipt' && transactionData) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <Header />
        
        <div className="p-4 max-w-3xl mx-auto">
          <button 
            onClick={() => navigate('/dashboard')} 
            className="flex items-center text-orange-600 mb-6 hover:text-orange-700 transition print:hidden"
          >
            <ArrowLeft size={20} className="mr-2" />
            <span className="font-medium">Retour au tableau de bord</span>
          </button>

          {/* Reçu */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-6" id="receipt">
            {/* En-tête */}
            <div className="text-center mb-8 pb-6 border-b-2 border-orange-600">
              <h1 className="text-3xl font-bold text-orange-600 mb-2">ATTIJARIWAFA BANK</h1>
              <p className="text-gray-600">Reçu de Virement</p>
            </div>

            {/* Statut */}
            <div className="bg-green-50 border-2 border-green-500 rounded-lg p-4 mb-6 flex items-center justify-center">
              <Check className="text-green-600 mr-3" size={24} />
              <span className="text-green-800 font-bold text-lg">Transaction réussie</span>
            </div>

            {/* Email notification */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6 text-center">
              <p className="text-sm text-blue-800">
                ✉️ Un email de confirmation a été envoyé à <strong>{formData.email}</strong>
              </p>
            </div>

            {/* Informations principales */}
            <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
              <div>
                <p className="text-gray-500">Date</p>
                <p className="font-semibold">{new Date(transactionData.date).toLocaleDateString('fr-FR')}</p>
              </div>
              <div>
                <p className="text-gray-500">Heure</p>
                <p className="font-semibold">{transactionData.heure}</p>
              </div>
              <div className="col-span-2">
                <p className="text-gray-500">Référence</p>
                <p className="font-semibold text-orange-600">{transactionData.reference}</p>
              </div>
            </div>

            {/* Émetteur */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-bold text-gray-800 mb-3">Émetteur</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Nom:</span>
                  <span className="font-semibold">{user.firstName} {user.lastName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Compte:</span>
                  <span className="font-semibold">{formData.accountType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">N° Client:</span>
                  <span className="font-semibold">{user.clientNumber}</span>
                </div>
              </div>
            </div>

            {/* Bénéficiaire */}
            <div className="mb-6 p-4 bg-orange-50 rounded-lg">
              <h3 className="font-bold text-gray-800 mb-3">Bénéficiaire</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Nom:</span>
                  <span className="font-semibold">{formData.beneficiaire}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">IBAN:</span>
                  <span className="font-semibold">{formData.iban}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">BIC:</span>
                  <span className="font-semibold">{formData.bic}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-semibold">{formData.email}</span>
                </div>
              </div>
            </div>

            {/* Montants */}
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-bold text-gray-800 mb-3">Détails financiers</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-lg">
                  <span className="text-gray-600">Montant:</span>
                  <span className="font-bold">{parseFloat(formData.montant).toLocaleString('fr-FR', {minimumFractionDigits: 2})} €</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Frais:</span>
                  <span className="font-semibold">{transactionData.frais.toLocaleString('fr-FR', {minimumFractionDigits: 2})} €</span>
                </div>
                <div className="flex justify-between text-xl font-bold pt-2 border-t-2 border-gray-300">
                  <span className="text-gray-800">Total débité:</span>
                  <span className="text-orange-600">{(parseFloat(formData.montant) + transactionData.frais).toLocaleString('fr-FR', {minimumFractionDigits: 2})} €</span>
                </div>
              </div>
            </div>

            {/* Motif */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-bold text-gray-800 mb-2">Motif</h3>
              <p className="text-gray-700">{formData.motif}</p>
            </div>

            {/* Pied de page */}
            <div className="text-center text-xs text-gray-500 pt-6 border-t border-gray-200">
              <p className="mt-3">ATTIJARIWAFA BANK - Service Client: +212 533 298844</p>
            </div>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 print:hidden">
            <button
              onClick={downloadPDF}
              className="bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 transition flex items-center justify-center"
            >
              <Download size={20} className="mr-2" />
              Télécharger le reçu
            </button>
            
            <button
              onClick={printReceipt}
              className="bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center"
            >
              <Printer size={20} className="mr-2" />
              Imprimer
            </button>
            
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
            >
              Terminer
            </button>
          </div>
        </div>

        <BottomNavigation />
      </div>
    );
  }

  // Formulaire de virement
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
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Nouveau Virement</h1>

          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start">
              <AlertCircle className="text-red-500 mr-3 mt-0.5 " size={20} />
              <p className="text-red-700">{errors.submit}</p>
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
                    {account.type} - {account.balance.toLocaleString('fr-FR', {minimumFractionDigits: 2})} {account.currency}
                  </option>
                ))}
              </select>
            </div>

            {/* Bénéficiaire */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom du bénéficiaire *
              </label>
              <input
                type="text"
                name="beneficiaire"
                value={formData.beneficiaire}
                onChange={handleChange}
                placeholder="Ex: Jean Dupont"
                className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                  errors.beneficiaire ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.beneficiaire && (
                <p className="text-red-500 text-sm mt-1">{errors.beneficiaire}</p>
              )}
            </div>

            {/* IBAN */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                IBAN / RIB *
              </label>
              <input
                type="text"
                name="iban"
                value={formData.iban}
                onChange={handleChange}
                placeholder="FR76 XXXX XXXX XXXX XXXX XXXX XXX"
                className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                  errors.iban ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.iban && (
                <p className="text-red-500 text-sm mt-1">{errors.iban}</p>
              )}
            </div>

            {/* BIC */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Code BIC / SWIFT *
              </label>
              <input
                type="text"
                name="bic"
                value={formData.bic}
                onChange={handleChange}
                placeholder="Ex: ATMACIABXXX"
                maxLength="11"
                className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                  errors.bic ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.bic && (
                <p className="text-red-500 text-sm mt-1">{errors.bic}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">Code BIC du bénéficiaire (8 à 11 caractères)</p>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email du bénéficiaire *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="exemple@email.com"
                className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">✉️ Un email de confirmation sera envoyé à cette adresse</p>
            </div>

            {/* Montant */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Montant *
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="montant"
                  value={formData.montant}
                  onChange={handleChange}
                  placeholder="0.00"
                  step="0.01"
                  min="0.01"
                  className={`w-full border rounded-lg px-4 py-3 pr-12 focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                    errors.montant ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                  €
                </span>
              </div>
              {errors.montant && (
                <p className="text-red-500 text-sm mt-1">{errors.montant}</p>
              )}
              {formData.montant && !errors.montant && (
                <p className="text-xs text-gray-500 mt-1">
                  Frais estimés: {(parseFloat(formData.montant) * 0.005).toLocaleString('fr-FR', {minimumFractionDigits: 2})} € (0.5%)
                </p>
              )}
            </div>

            {/* Motif */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Motif du virement *
              </label>
              <textarea
                name="motif"
                value={formData.motif}
                onChange={handleChange}
                placeholder="Ex: Loyer, Facture, Remboursement..."
                rows="3"
                className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none ${
                  errors.motif ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.motif && (
                <p className="text-red-500 text-sm mt-1">{errors.motif}</p>
              )}
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
                  <Send size={20} className="mr-2" />
                  Effectuer le virement
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

export default VirementPage;