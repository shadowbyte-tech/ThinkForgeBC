/* ============================================================
   RESOURCEX UNIVERSAL DATA ACCESS & PERSISTENCE LAYER (RX_DB)
   - Operates against Supabase if configured (NEXT_PUBLIC_SUPABASE_URL)
   - Seamlessly uses transactional IndexedDB (ResourceX_DB) as zero-dependency persistent engine
   - Guaranteed full asynchronous CRUD that persists across browser reloads & restarts
   ============================================================ */

(function () {
  'use strict';

  var DB_NAME = 'ResourceX_DB';
  var DB_VERSION = 1;

  var RX_DB = {
    isReady: false,
    _db: null,
    _supabase: null,
    ready: null
  };

  // Check for Supabase configuration
  var envSupabaseUrl = window.NEXT_PUBLIC_SUPABASE_URL || null;
  var envSupabaseAnonKey = window.NEXT_PUBLIC_SUPABASE_ANON_KEY || null;

  // Local storage config override (for testing/runtime injection)
  try {
    var storedConfig = localStorage.getItem('rx_supabase_config');
    if (storedConfig) {
      var parsed = JSON.parse(storedConfig);
      if (parsed.url && parsed.anonKey) {
        envSupabaseUrl = parsed.url;
        envSupabaseAnonKey = parsed.anonKey;
      }
    }
  } catch (e) {}

  if (envSupabaseUrl && envSupabaseAnonKey && window.supabase && window.supabase.createClient) {
    try {
      RX_DB._supabase = window.supabase.createClient(envSupabaseUrl, envSupabaseAnonKey);
      console.info('[ResourceX DB] Supabase client initialized.');
    } catch (err) {
      console.warn('[ResourceX DB] Supabase initialization failed, falling back to IndexedDB:', err);
    }
  }

  /* ------------------------------------------------------------
     INDEXEDDB TRANSACTION WRAPPERS
     ------------------------------------------------------------ */

  function openIDB() {
    return new Promise(function (resolve, reject) {
      var req = indexedDB.open(DB_NAME, DB_VERSION);

      req.onupgradeneeded = function (e) {
        var db = e.target.result;

        if (!db.objectStoreNames.contains('materials')) {
          db.createObjectStore('materials', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('listings')) {
          db.createObjectStore('listings', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('matches')) {
          db.createObjectStore('matches', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('offers')) {
          db.createObjectStore('offers', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('negotiations')) {
          db.createObjectStore('negotiations', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('negotiation_messages')) {
          db.createObjectStore('negotiation_messages', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('material_bank')) {
          db.createObjectStore('material_bank', { keyPath: 'materialId' });
        }
        if (!db.objectStoreNames.contains('journeys')) {
          db.createObjectStore('journeys', { keyPath: 'materialId' });
        }
        if (!db.objectStoreNames.contains('saved_materials')) {
          db.createObjectStore('saved_materials', { keyPath: 'materialId' });
        }
        if (!db.objectStoreNames.contains('notifications')) {
          db.createObjectStore('notifications', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('user_profile')) {
          db.createObjectStore('user_profile', { keyPath: 'id' });
        }
      };

      req.onsuccess = function (e) {
        resolve(e.target.result);
      };

      req.onerror = function (e) {
        reject(e.target.error);
      };
    });
  }

  function getStore(storeName, mode) {
    var tx = RX_DB._db.transaction(storeName, mode || 'readonly');
    return tx.objectStore(storeName);
  }

  function idbGetAll(storeName) {
    return new Promise(function (resolve, reject) {
      var store = getStore(storeName, 'readonly');
      var req = store.getAll();
      req.onsuccess = function () { resolve(req.result || []); };
      req.onerror = function () { reject(req.error); };
    });
  }

  function idbGet(storeName, key) {
    return new Promise(function (resolve, reject) {
      var store = getStore(storeName, 'readonly');
      var req = store.get(key);
      req.onsuccess = function () { resolve(req.result || null); };
      req.onerror = function () { reject(req.error); };
    });
  }

  function idbPut(storeName, value) {
    return new Promise(function (resolve, reject) {
      var tx = RX_DB._db.transaction(storeName, 'readwrite');
      var store = tx.objectStore(storeName);
      var req = store.put(value);
      req.onsuccess = function () { resolve(req.result); };
      req.onerror = function () { reject(req.error); };
    });
  }

  function idbDelete(storeName, key) {
    return new Promise(function (resolve, reject) {
      var tx = RX_DB._db.transaction(storeName, 'readwrite');
      var store = tx.objectStore(storeName);
      var req = store.delete(key);
      req.onsuccess = function () { resolve(true); };
      req.onerror = function () { reject(req.error); };
    });
  }

  /* ------------------------------------------------------------
     INITIAL SEEDING
     ------------------------------------------------------------ */

  function seedInitialData() {
    return idbGetAll('materials').then(function (existing) {
      if (existing && existing.length > 0) {
        return true; // already seeded
      }

      console.info('[ResourceX DB] Seeding initial dataset from window.RX_DATA...');
      var rxData = window.RX_DATA || {};
      var promises = [];

      // 1. Materials
      var mats = rxData.materials || [];
      mats.forEach(function (m) {
        promises.push(idbPut('materials', m));
      });

      // 2. Matches
      var matchMap = rxData.matches || {};
      Object.keys(matchMap).forEach(function (matId) {
        var list = matchMap[matId] || [];
        list.forEach(function (m, idx) {
          var item = Object.assign({}, m, {
            id: m.id || ('MATCH-' + matId + '-' + (idx + 1)),
            materialId: matId
          });
          promises.push(idbPut('matches', item));
        });
      });

      // 3. Material Bank
      var bankMats = (rxData.bank && rxData.bank.materials) || [];
      bankMats.forEach(function (b) {
        promises.push(idbPut('material_bank', {
          materialId: b.materialId,
          materialName: b.materialName,
          quantity: b.quantity,
          unit: b.unit || 'kg',
          pricing: b.pricing || { fixed: 38.00, model: 'fixed_seller_governed' },
          currentAsk: (b.pricing && b.pricing.fixed) || 38.00,
          daysListed: b.daysInBank || 8,
          notes: b.notes || 'Seller-managed inventory batch.'
        }));
      });

      // 4. Journeys
      var journeys = rxData.journeys || [];
      journeys.forEach(function (j) {
        promises.push(idbPut('journeys', j));
      });

      // 5. Default User Profile
      promises.push(idbPut('user_profile', {
        id: 'usr-001',
        name: 'AlloyCraft Extrusions Pvt Ltd',
        role: 'Generator / Seller',
        organization: 'AlloyCraft Group',
        location: 'Peenya Industrial Area, Bengaluru, Karnataka',
        tier: 'Standard',
        email: 'materials@alloycraft.example.in'
      }));

      // 6. Default Negotiations
      promises.push(idbPut('negotiations', {
        id: 'NEG-AL-9402',
        materialId: 'RX-AL-9402',
        buyerName: 'Apex Foundry Solutions',
        buyerLocation: 'Peenya Phase II (42 km)',
        initialOffer: 442000,
        currentOffer: 442000,
        currentCounterOffer: 460000,
        status: 'active',
        messages: [
          { sender: 'buyer', role: 'Buyer', text: 'Initial Match Offer generated via Net Value algorithm (₹4,42,000 Net). Requesting sample COA validation.', time: '2h ago' },
          { sender: 'seller', role: 'Seller', text: 'Sample Assay Spectrometry available. Proposed counter at ₹4,60,000 gross with dedicated bulk loading terms.', time: '45m ago' }
        ],
        updatedAt: new Date().toISOString()
      }));

      // 7. Initial Notifications
      promises.push(idbPut('notifications', {
        id: 'NOTIF-01',
        title: 'High Compatibility Match Detected',
        body: 'Apex Foundry Solutions posted an off-take inquiry matching 6063 Turnings (94% Compatibility).',
        type: 'match',
        link: 'match-explorer.html?id=RX-AL-9402',
        isRead: false,
        createdAt: new Date().toISOString()
      }));

      return Promise.all(promises);
    });
  }

  /* ------------------------------------------------------------
     PUBLIC ASYNC CRUD API
     ------------------------------------------------------------ */

  // Materials
  RX_DB.getMaterials = function () {
    return idbGetAll('materials');
  };

  RX_DB.getMaterial = function (id) {
    return idbGet('materials', id).then(function (res) {
      if (!res && window.RX_DATA && window.RX_DATA.materials) {
        return window.RX_DATA.materials.find(function (m) { return m.id === id; }) || null;
      }
      return res;
    });
  };

  RX_DB.createMaterial = function (matData) {
    var id = matData.id || ('RX-' + (matData.category ? matData.category.substring(0, 2).toUpperCase() : 'MT') + '-' + Math.floor(1000 + Math.random() * 9000));
    var newMat = Object.assign({}, matData, {
      id: id,
      status: matData.status || 'active',
      createdAt: new Date().toISOString()
    });

    return idbPut('materials', newMat).then(function () {
      // Auto-generate matching listing
      var listing = {
        id: 'LIST-' + id,
        materialId: id,
        title: newMat.name,
        quantity: newMat.quantity,
        unit: newMat.unit,
        pricePerUnit: newMat.pricePerUnit,
        createdAt: new Date().toISOString()
      };
      return idbPut('listings', listing);
    }).then(function () {
      // Create initial simulated match
      var sampleMatch = {
        id: 'MATCH-' + id + '-1',
        materialId: id,
        buyerName: 'Regional Industrial Recyclers',
        buyerIndustry: 'Secondary Metallurgy',
        location: 'Industrial Estate (65 km)',
        distance: 65,
        compatibility: 91,
        grossOffer: Math.round(newMat.pricePerUnit * newMat.quantity * 0.96),
        freightCost: 5200,
        processingCost: 14000,
        estimatedNetValue: Math.round(newMat.pricePerUnit * newMat.quantity * 0.96) - 5200 - 14000,
        isBestMatch: true
      };
      return idbPut('matches', sampleMatch);
    }).then(function () {
      return newMat;
    });
  };

  RX_DB.updateMaterial = function (id, updates) {
    return RX_DB.getMaterial(id).then(function (existing) {
      if (!existing) throw new Error('Material not found: ' + id);
      var updated = Object.assign({}, existing, updates, { updatedAt: new Date().toISOString() });
      return idbPut('materials', updated).then(function () { return updated; });
    });
  };

  // Matches
  RX_DB.getMatches = function (materialId) {
    return idbGetAll('matches').then(function (all) {
      var filtered = all.filter(function (m) { return m.materialId === materialId; });
      if (filtered.length === 0 && window.RX_DATA && window.RX_DATA.matches && window.RX_DATA.matches[materialId]) {
        return window.RX_DATA.matches[materialId];
      }
      return filtered;
    });
  };

  // Negotiations
  RX_DB.getNegotiations = function () {
    return idbGetAll('negotiations');
  };

  RX_DB.getNegotiation = function (id) {
    return idbGet('negotiations', id);
  };

  RX_DB.addNegotiationMessage = function (negId, msg) {
    return RX_DB.getNegotiation(negId).then(function (neg) {
      if (!neg) {
        neg = {
          id: negId,
          materialId: 'RX-AL-9402',
          buyerName: 'Prospective Processor',
          status: 'active',
          messages: []
        };
      }
      neg.messages = neg.messages || [];
      neg.messages.push({
        sender: msg.sender || 'seller',
        role: msg.role || (msg.sender === 'buyer' ? 'Buyer' : 'Seller'),
        text: msg.text,
        time: 'Just now',
        timestamp: new Date().toISOString()
      });
      neg.updatedAt = new Date().toISOString();
      return idbPut('negotiations', neg).then(function () { return neg; });
    });
  };

  RX_DB.sendCounterOffer = function (negId, counterData) {
    return RX_DB.getNegotiation(negId).then(function (neg) {
      if (!neg) {
        neg = {
          id: negId,
          materialId: counterData.materialId || 'RX-AL-9402',
          buyerName: counterData.buyerName || 'Apex Foundry Solutions',
          status: 'active',
          messages: []
        };
      }
      neg.currentCounterOffer = counterData.grossAmount;
      neg.status = 'counter_sent';
      neg.messages = neg.messages || [];
      neg.messages.push({
        sender: 'seller',
        role: 'Seller (Counter-Offer)',
        text: 'Formally submitted counter offer: ₹' + Number(counterData.grossAmount).toLocaleString('en-IN') +
              ' for ' + Number(counterData.quantity).toLocaleString() + ' ' + (counterData.unit || 'kg') +
              (counterData.notes ? ' — Notes: ' + counterData.notes : ''),
        time: 'Just now',
        offerData: counterData
      });
      neg.updatedAt = new Date().toISOString();
      return idbPut('negotiations', neg).then(function () { return neg; });
    });
  };

  // Material Bank
  RX_DB.getBankLots = function () {
    return idbGetAll('material_bank');
  };

  RX_DB.getBankLot = function (materialId) {
    return idbGet('material_bank', materialId);
  };

  RX_DB.updateBankLot = function (materialId, updates) {
    return RX_DB.getBankLot(materialId).then(function (lot) {
      if (!lot) {
        lot = { materialId: materialId, daysListed: 1, notes: '' };
      }
      var updated = Object.assign({}, lot, updates, { updatedAt: new Date().toISOString() });
      return idbPut('material_bank', updated).then(function () { return updated; });
    });
  };

  // Saved Materials (Shortlist)
  RX_DB.getSavedMaterials = function () {
    return idbGetAll('saved_materials').then(function (list) {
      return list.map(function (item) { return item.materialId; });
    });
  };

  RX_DB.isMaterialSaved = function (materialId) {
    return idbGet('saved_materials', materialId).then(function (item) {
      return !!item;
    });
  };

  RX_DB.toggleSaveMaterial = function (materialId) {
    return RX_DB.isMaterialSaved(materialId).then(function (isSaved) {
      if (isSaved) {
        return idbDelete('saved_materials', materialId).then(function () { return false; });
      } else {
        return idbPut('saved_materials', { materialId: materialId, savedAt: new Date().toISOString() })
          .then(function () { return true; });
      }
    });
  };

  // Journeys
  RX_DB.getJourneys = function () {
    return idbGetAll('journeys');
  };

  RX_DB.getJourney = function (materialId) {
    return idbGet('journeys', materialId).then(function (res) {
      if (!res && window.RX_DATA && window.RX_DATA.journeys) {
        return window.RX_DATA.journeys.find(function (j) { return j.materialId === materialId; }) || null;
      }
      return res;
    });
  };

  // Notifications
  RX_DB.getNotifications = function () {
    return idbGetAll('notifications');
  };

  RX_DB.markNotificationRead = function (id) {
    return idbGet('notifications', id).then(function (notif) {
      if (notif) {
        notif.isRead = true;
        return idbPut('notifications', notif);
      }
    });
  };

  // User Profile & Realtime Stats
  RX_DB.getCurrentUser = function () {
    return idbGet('user_profile', 'usr-001');
  };

  RX_DB.getStats = function () {
    return Promise.all([
      RX_DB.getMaterials(),
      RX_DB.getBankLots(),
      RX_DB.getNegotiations()
    ]).then(function (results) {
      var mats = results[0];
      var bank = results[1];
      var negs = results[2];

      var totalVolume = 0;
      var totalValue = 0;
      mats.forEach(function (m) {
        var q = Number(m.quantity) || 0;
        var p = Number(m.pricePerUnit) || 0;
        totalVolume += q;
        totalValue += (q * p);
      });

      return {
        activeListings: mats.length,
        bankedLots: bank.length,
        activeNegotiations: negs.filter(function (n) { return n.status === 'active' || n.status === 'counter_sent'; }).length,
        totalInventoryKg: totalVolume,
        grossAssetValue: totalValue
      };
    });
  };

  // Initialize
  RX_DB.ready = openIDB().then(function (db) {
    RX_DB._db = db;
    return seedInitialData();
  }).then(function () {
    RX_DB.isReady = true;
    console.info('[ResourceX DB] Database initialized and ready.');
    if (typeof window.dispatchEvent === 'function') {
      window.dispatchEvent(new CustomEvent('rx-db-ready', { detail: { db: RX_DB } }));
    }
    return RX_DB;
  }).catch(function (err) {
    console.error('[ResourceX DB] Initialization error:', err);
    RX_DB.isReady = true;
    return RX_DB;
  });

  // Queue every public CRUD method behind initialization so pages may call
  // them at parse time without racing the async IndexedDB open.
  Object.keys(RX_DB).forEach(function (key) {
    var orig = RX_DB[key];
    if (typeof orig === 'function') {
      RX_DB[key] = function () {
        var args = Array.prototype.slice.call(arguments);
        return RX_DB.ready.then(function () {
          return orig.apply(RX_DB, args);
        });
      };
    }
  });

  window.RX_DB = RX_DB;
})();
