// services/UserService.js - VERSION COMPLÈTE AVEC MODE DEV
let USERS_STORAGE = null;
let TRANSACTIONS_STORAGE = null;
const CURRENT_USER_KEY = 'attijariwafa_current_user';
const USERS_DB_KEY = 'attijariwafa_users_db';

// 🔥 MODE DÉVELOPPEMENT - Met false en production
const DEV_MODE = true;

const DEFAULT_USERS = [
  {
    id: '1',
    clientNumber: '27148050000',
    cardNumber: '1301 0215 9290 1200 ',
    code: '123456',
    firstName: 'PAULINE',
    lastName: 'MARMIER',
    email: 'pauline.marmier@email.com',
    phone: '+212 575 678912',
    address: 'Boulevard Molay Youssef, 20000 Cassablanca',
    city: 'Casablanca',
    postalCode: '08 BP 123',
    country: 'MAROC',
    accounts: [
      { type: 'LIQUIDITE', balance: 17541386.85, currency: '€', color: 'blue' },
      { type: 'ASSURANCE', balance: 2700.00, currency: '€', color: 'red' },
      { type: 'ECONOMIE', balance: 15000.00, currency: '€', color: 'green' },
      { type: 'EPARGNE', balance: 2100.00, currency: '€', color: 'yellow' }
    ],
    blockedAmount: 567115.31,
    lastUpdate: '25 / 10 / 2025',
    isNewUser: false
  }
];

const DEFAULT_TRANSACTIONS = [
  {
    id: 'TRX2025121745678',
    userId: '1',
    date: '2023-10-10',
    heure: '14:30',
    type: 'Envoi',
    accountType: 'LIQUIDITE',
    destinataire: 'JEAN DUPONT',
    numeroDestinataire: 'FR76 3000 4560 4856 7455 3646 748',
    montant: 5000,
    frais: 25,
    devise: '€',
    statut: 'Réussie',
    reference: 'TRX2025121745678'
  },
  {
    id: 'TRX2025121634521',
    userId: '1',
    date: '2022-07-21',
    heure: '09:15',
    type: 'envoie',
    accountType: 'LIQUIDITE',
    destinataire: 'BARRIL ANTHONY',
    numeroDestinataire: 'FR76 1780 6001 8404 1676 6849 143',
    montant: 15000,
    frais: 0,
    devise: '€',
    statut: 'Réussie',
    reference: 'TRX2025121634521'
  },
  {
    id: 'TRX2025121523456',
    userId: '1',
    date: '2022-11-15',
    heure: '18:45',
    type: 'Envoi',
    accountType: 'LIQUIDITE',
    destinataire: 'AHMED KALIF',
    numeroDestinataire: 'MA64 1234 2333 5373 2734 123',
    montant: 3000,
    frais: 15,
    devise: '€',
    statut: 'Réussie',
    reference: 'TRX2025121523456'
  },
  {
    id: 'TRX2025121512345',
    userId: '1',
    date: '2024-12-15',
    heure: '11:20',
    type: 'Retrait',
    accountType: 'LIQUIDITE',
    destinataire: 'Distributeur Cocody',
    numeroDestinataire: 'ATM-CASSABLANCA-001',
    montant: 20000,
    frais: 100,
    devise: '€',
    statut: 'Réussie',
    reference: 'TRX2025121512345'
  },
  {
    id: 'TRX2025121478901',
    userId: '1',
    date: '2024-12-14',
    heure: '16:30',
    type: 'Envoi',
    accountType: 'LIQUIDITE',
    destinataire: 'FLORENT LOPEZ',
    numeroDestinataire: 'FR76 1580 6801 8404 1676 6849 143',
    montant: 10000,
    frais: 50,
    devise: '€',
    statut: 'Échouée',
    reference: 'TRX2025121478901',
    motifEchec: 'Solde insuffisant'
  },
  {
    id: 'TRX2025121367890',
    userId: '1',
    date: '2022-12-13',
    heure: '21:05',
    type: 'Dépôt',
    accountType: 'LIQUIDITE',
    destinataire: 'Agent Yopougon',
    numeroDestinataire: 'AGENT-CASSABLANCA-003',
    montant: 50000,
    frais: 0,
    devise: '€',
    statut: 'Réussie',
    reference: 'TRX2025121367890'
  },
  {
    id: 'TRX2025121256789',
    userId: '1',
    date: '2023-08-12',
    heure: '08:40',
    type: 'Envoi',
    accountType: 'ECONOMIE',
    destinataire: 'BARRIL ANTHONY',
    numeroDestinataire: 'FR76 1780 6001 8404 1676 6849 143',
    montant: 7500,
    frais: 37,
    devise: '€',
    statut: 'Réussie',
    reference: 'TRX2025121256789'
  },
  {
    id: 'TRX2025121145678',
    userId: '1',
    date: '2025-12-11',
    heure: '15:25',
    type: 'Transfert compte',
    accountType: 'LIQUIDITE',
    destinataire: 'ECONOMIE',
    numeroDestinataire: 'Compte ECONOMIE',
    montant: 10000,
    frais: 0,
    devise: '€',
    statut: 'Réussie',
    reference: 'TRX2025121145678'
  }
];

const notifyUserUpdate = () => {
  window.dispatchEvent(new CustomEvent('userUpdated'));
};

const saveUsersToStorage = () => {
  if (USERS_STORAGE) {
    localStorage.setItem(USERS_DB_KEY, JSON.stringify(USERS_STORAGE));
  }
};

const loadUsersFromStorage = () => {
  const stored = localStorage.getItem(USERS_DB_KEY);
  if (stored) {
    USERS_STORAGE = JSON.parse(stored);
    return true;
  }
  return false;
};

// 🔥 INITIALISATION AVEC MODE DEV
const initializeUsers = () => {
  if (DEV_MODE) {
    // 🔥 EN MODE DEV: TOUJOURS recharger depuis DEFAULT_USERS
    console.log('🔧 DEV MODE: Rechargement depuis DEFAULT_USERS');
    USERS_STORAGE = JSON.parse(JSON.stringify(DEFAULT_USERS));
    saveUsersToStorage();
    
    // 🔥 Mettre à jour le current user aussi
    const currentUserStored = localStorage.getItem(CURRENT_USER_KEY);
    if (currentUserStored) {
      const currentUser = JSON.parse(currentUserStored);
      const freshUser = USERS_STORAGE.find(u => u.id === currentUser.id);
      if (freshUser) {
        const { code: _, ...userWithoutCode } = freshUser;
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutCode));
        notifyUserUpdate(); // 🔥 Notifier React
        console.log('✅ Current user mis à jour');
      }
    }
  } else if (!USERS_STORAGE) {
    // MODE PROD: Charger depuis localStorage une seule fois
    const loaded = loadUsersFromStorage();
    if (!loaded) {
      USERS_STORAGE = JSON.parse(JSON.stringify(DEFAULT_USERS));
      saveUsersToStorage();
    }
  }
};

const initializeTransactions = () => {
  if (!TRANSACTIONS_STORAGE) {
    TRANSACTIONS_STORAGE = JSON.parse(JSON.stringify(DEFAULT_TRANSACTIONS));
  }
};

export const UserService = {
  // 🔥 NOUVELLE FONCTION: Forcer le rechargement en DEV
  forceReloadInDev: () => {
    if (DEV_MODE) {
      console.log('🔧 Force reload in DEV mode');
      USERS_STORAGE = null; // Reset
      initializeUsers(); // Recharge depuis DEFAULT_USERS
    }
  },

  login: (clientNumber, code) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        initializeUsers();
        const user = USERS_STORAGE.find(u => 
          String(u.clientNumber).trim() === String(clientNumber).trim() && 
          String(u.code).trim() === String(code).trim()
        );
        
        if (user) {
          const { code: _, ...userWithoutCode } = user;
          localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutCode));
          notifyUserUpdate();
          resolve(userWithoutCode);
        } else {
          reject(new Error('Identifiant ou mot de passe incorrect'));
        }
      }, 500);
    });
  },

  register: (userData) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        initializeUsers();
        
        const exists = USERS_STORAGE.find(u => 
          String(u.clientNumber) === String(userData.clientNumber)
        );
        
        if (exists) {
          reject(new Error('Ce numéro client existe déjà'));
          return;
        }

        const newUser = {
          id: Date.now().toString(),
          clientNumber: userData.clientNumber,
          cardNumber: `4532 ${userData.clientNumber.slice(-4)} ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)}`,
          code: userData.code,
          firstName: userData.firstName.toUpperCase(),
          lastName: userData.lastName.toUpperCase(),
          email: userData.email,
          phone: userData.phone || '',
          address: userData.address || '',
          city: userData.city || '',
          postalCode: userData.postalCode || '',
          country: userData.country || 'MAROC',
          accounts: [
            { type: 'LIQUIDITE', balance: 0, currency: '€', color: 'blue' },
            { type: 'ASSURANCE', balance: 0, currency: '€', color: 'red' },
            { type: 'ECONOMIE', balance: 0, currency: '€', color: 'green' },
            { type: 'EPARGNE', balance: 0, currency: '€', color: 'yellow' }
          ],
          blockedAmount: 0,
          lastUpdate: new Date().toLocaleDateString('fr-FR'),
          isNewUser: true
        };

        USERS_STORAGE.push(newUser);
        saveUsersToStorage();
        
        const { code: _, ...userWithoutCode } = newUser;
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutCode));
        notifyUserUpdate();
        resolve(userWithoutCode);
      }, 500);
    });
  },

  registerWithoutLogin: (userData) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        initializeUsers();
        
        const exists = USERS_STORAGE.find(u => 
          String(u.clientNumber) === String(userData.clientNumber)
        );
        
        if (exists) {
          reject(new Error('Ce numéro client existe déjà'));
          return;
        }

        const newUser = {
          id: Date.now().toString(),
          clientNumber: userData.clientNumber,
          cardNumber: `4532 ${userData.clientNumber.slice(-4)} ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)}`,
          code: userData.code,
          firstName: userData.firstName.toUpperCase(),
          lastName: userData.lastName.toUpperCase(),
          email: userData.email,
          phone: userData.phone || '',
          address: userData.address || '',
          city: userData.city || '',
          postalCode: userData.postalCode || '',
          country: userData.country || 'MAROC',
          accounts: [
            { type: 'LIQUIDITE', balance: 0, currency: '€', color: 'blue' },
            { type: 'ASSURANCE', balance: 0, currency: '€', color: 'red' },
            { type: 'ECONOMIE', balance: 0, currency: '€', color: 'green' },
            { type: 'EPARGNE', balance: 0, currency: '€', color: 'yellow' }
          ],
          blockedAmount: 0,
          lastUpdate: new Date().toLocaleDateString('fr-FR'),
          isNewUser: true
        };

        USERS_STORAGE.push(newUser);
        saveUsersToStorage();
        
        const { code: _, ...userWithoutCode } = newUser;
        resolve(userWithoutCode);
      }, 500);
    });
  },

  getCurrentUser: () => {
    const user = localStorage.getItem(CURRENT_USER_KEY);
    return user ? JSON.parse(user) : null;
  },

  logout: () => {
    localStorage.removeItem(CURRENT_USER_KEY);
    notifyUserUpdate();
  },

  updateUser: (updatedData) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        USERS_STORAGE = null;
        initializeUsers();
        
        const currentUser = UserService.getCurrentUser();
        
        if (!currentUser) {
          reject(new Error('Utilisateur non connecté'));
          return;
        }

        const userIndex = USERS_STORAGE.findIndex(u => u.id === currentUser.id);
        
        if (userIndex === -1) {
          reject(new Error('Utilisateur non trouvé'));
          return;
        }

        USERS_STORAGE[userIndex] = {
          ...USERS_STORAGE[userIndex],
          email: updatedData.email !== undefined ? updatedData.email : USERS_STORAGE[userIndex].email,
          phone: updatedData.phone !== undefined ? updatedData.phone : USERS_STORAGE[userIndex].phone,
          address: updatedData.address !== undefined ? updatedData.address : USERS_STORAGE[userIndex].address,
          city: updatedData.city !== undefined ? updatedData.city : USERS_STORAGE[userIndex].city,
          postalCode: updatedData.postalCode !== undefined ? updatedData.postalCode : USERS_STORAGE[userIndex].postalCode,
          lastUpdate: new Date().toLocaleDateString('fr-FR')
        };
        
        saveUsersToStorage();
        
        const { code: _, ...userWithoutCode } = USERS_STORAGE[userIndex];
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutCode));
        
        notifyUserUpdate();
        
        resolve(userWithoutCode);
      }, 500);
    });
  },

  changeCode: (currentCode, newCode) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const currentUser = UserService.getCurrentUser();
        if (!currentUser) {
          reject(new Error('Utilisateur non connecté'));
          return;
        }

        USERS_STORAGE = null;
        initializeUsers();
        
        const userIndex = USERS_STORAGE.findIndex(u => u.id === currentUser.id);
        
        if (userIndex === -1) {
          reject(new Error('Utilisateur non trouvé'));
          return;
        }

        if (String(USERS_STORAGE[userIndex].code) !== String(currentCode)) {
          reject(new Error('Code actuel incorrect'));
          return;
        }

        USERS_STORAGE[userIndex] = {
          ...USERS_STORAGE[userIndex],
          code: newCode,
          lastUpdate: new Date().toLocaleDateString('fr-FR')
        };
        
        saveUsersToStorage();
        notifyUserUpdate();
        resolve({ success: true });
      }, 500);
    });
  },

  debugStorage: () => {
    console.log('=== DEBUG ===');
    console.log('Current:', localStorage.getItem(CURRENT_USER_KEY));
    console.log('DB:', localStorage.getItem(USERS_DB_KEY));
    console.log('Memory:', USERS_STORAGE);
  },

  getUserTransactions: (userId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        initializeTransactions();
        const currentUser = UserService.getCurrentUser();
        if (currentUser && currentUser.isNewUser) {
          resolve([]);
          return;
        }
        const userTransactions = TRANSACTIONS_STORAGE
          .filter(t => t.userId === userId)
          .sort((a, b) => new Date(b.date + ' ' + b.heure) - new Date(a.date + ' ' + a.heure));
        resolve(userTransactions);
      }, 300);
    });
  },

  getTransactionsByAccount: (userId, accountType) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        initializeTransactions();
        const currentUser = UserService.getCurrentUser();
        if (currentUser && currentUser.isNewUser) {
          resolve([]);
          return;
        }
        const accountTransactions = TRANSACTIONS_STORAGE
          .filter(t => t.userId === userId && t.accountType === accountType)
          .sort((a, b) => new Date(b.date + ' ' + b.heure) - new Date(a.date + ' ' + a.heure));
        resolve(accountTransactions);
      }, 300);
    });
  },

  addTransaction: (transactionData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        initializeTransactions();
        const newTransaction = {
          id: `TRX${Date.now()}`,
          ...transactionData,
          date: new Date().toISOString().split('T')[0],
          heure: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
          reference: `TRX${Date.now()}`
        };
        TRANSACTIONS_STORAGE.unshift(newTransaction);
        resolve(newTransaction);
      }, 500);
    });
  },

  getTransactionStats: (userId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        initializeTransactions();
        const currentUser = UserService.getCurrentUser();
        if (currentUser && currentUser.isNewUser) {
          resolve({
            total: 0,
            reussies: 0,
            echouees: 0,
            en_attente: 0,
            totalEnvoye: 0,
            totalRecu: 0,
            totalFrais: 0
          });
          return;
        }
        const userTransactions = TRANSACTIONS_STORAGE.filter(t => t.userId === userId);
        const stats = {
          total: userTransactions.length,
          reussies: userTransactions.filter(t => t.statut === 'Réussie').length,
          echouees: userTransactions.filter(t => t.statut === 'Échouée').length,
          en_attente: userTransactions.filter(t => t.statut === 'En attente').length,
          totalEnvoye: userTransactions
            .filter(t => t.type === 'Envoi' && t.statut === 'Réussie')
            .reduce((sum, t) => sum + t.montant, 0),
          totalRecu: userTransactions
            .filter(t => t.type === 'Réception' && t.statut === 'Réussie')
            .reduce((sum, t) => sum + t.montant, 0),
          totalFrais: userTransactions
            .filter(t => t.statut === 'Réussie')
            .reduce((sum, t) => sum + t.frais, 0)
        };
        resolve(stats);
      }, 300);
    });
  },

  searchTransactions: (userId, searchTerm) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        initializeTransactions();
        const currentUser = UserService.getCurrentUser();
        if (currentUser && currentUser.isNewUser) {
          resolve([]);
          return;
        }
        const filtered = TRANSACTIONS_STORAGE
          .filter(t => t.userId === userId)
          .filter(t => 
            t.destinataire.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.type.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .sort((a, b) => new Date(b.date + ' ' + b.heure) - new Date(a.date + ' ' + a.heure));
        resolve(filtered);
      }, 300);
    });
  }
};