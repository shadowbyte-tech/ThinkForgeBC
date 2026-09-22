/* ============================================================
   RESOURCEX DEMO DATA — INDEX + REMAINING ENTITIES
   Demo helpers for filtering, sorting and lookup. All data is
   DEMO / SIMULATED and must be labeled in the UI.
   ============================================================ */

window.RX_DATA = window.RX_DATA || {};

/* ---------------- Material Bank entries ---------------- */

/** @type {import('./types.js').BankEntry[]} */
window.RX_DATA.bankEntries = [
  {
    id: 'BNK-PP-6102',
    materialId: 'RX-PP-6102',
    materialName: 'PP Woven Bag Regrind',
    category: 'Polymers',
    quantity: 6800,
    unit: 'kg',
    location: 'Ahmedabad, Gujarat',
    originalAsk: 40.0,
    currentAsk: 38.0,
    bulkOffer: 35.0,
    negotiable: true,
    daysListed: 45,
    buyerInterest: 4,
    status: 'banked',
    sellerManaged: true,
    notes: 'Seller has revised ask. Open to bulk enquiry. Minimum lot: 3,000 kg.',
    demo: true
  },
  {
    id: 'BNK-GL-7710',
    materialId: 'RX-GL-7710',
    materialName: 'Cullet — Mixed Colour',
    category: 'Glass',
    quantity: 8500,
    unit: 'kg',
    location: 'Pune, Maharashtra',
    originalAsk: 7.2,
    currentAsk: 6.8,
    bulkOffer: null,
    negotiable: true,
    daysListed: 21,
    buyerInterest: 2,
    status: 'active',
    sellerManaged: true,
    notes: 'Available in partial lots. Minimum 2,000 kg.',
    demo: true
  }
];

/* ---------------- Negotiations ---------------- */

/** @type {import('./types.js').Negotiation[]} */
window.RX_DATA.negotiations = [
  {
    id: 'NEG-001',
    materialId: 'RX-AL-9402',
    materialName: '6063 Aluminium Turnings',
    buyerName: 'Demo Buyer A',
    sellerName: 'Demo Industrial Facility',
    status: 'active',
    messages: [
      { from: 'buyer',  time: '2 days ago', text: 'Interested in the full 5,000 kg lot. Can you confirm availability and earliest pickup date?' },
      { from: 'seller', time: '2 days ago', text: 'Yes, full lot available. Pickup available from Monday onwards. Material is sorted and ready.' },
      { from: 'buyer',  time: '1 day ago',  text: 'Can you consider ₹88/kg for the full quantity? We can arrange pickup within 3 days.' },
      { from: 'seller', time: '1 day ago',  text: 'Counter offer: ₹91/kg for full 5,000 kg lot. Payment terms: advance 50% + balance before dispatch.' },
      { from: 'buyer',  time: '4 hours ago', text: 'We can do ₹89.50/kg. Payment: 100% advance. Pickup in 2 days. Final offer.' }
    ],
    offer:        { price: 88,    quantity: 5000, unit: 'kg', pickup: 'Within 3 days', payment: 'Advance 50%' },
    counterOffer: { price: 91,    quantity: 5000, unit: 'kg', pickup: 'From Monday',   payment: 'Advance 50% + balance' },
    demo: true
  }
];

/* ---------------- Dashboard stats ---------------- */

/** @type {{activeListings: number, potentialMatches: number, incomingOffers: number, activeNegotiations: number, bankedMaterials: number, activeJourneys: number, demo: true}} */
window.RX_DATA.dashboardStats = {
  activeListings: 12,
  potentialMatches: 8,
  incomingOffers: 4,
  activeNegotiations: 3,
  bankedMaterials: 5,
  activeJourneys: 2,
  demo: true
};

/* ---------------- Flow stages (scroll transition) ---------------- */

window.RX_DATA.flowStages = [
  { id: 'generation', label: 'Industrial Generation', desc: 'Surplus and byproduct streams identified at source' },
  { id: 'discovery',  label: 'Discovery',             desc: 'Listings published with technical specifications' },
  { id: 'matching',   label: 'Matching',              desc: 'Compatibility evaluated across grade, form and volume' },
  { id: 'value',      label: 'Net Value',             desc: 'Freight, processing and handling priced in' },
  { id: 'exchange',   label: 'Exchange',              desc: 'Terms negotiated directly between parties' },
  { id: 'next-use',   label: 'Next Use',              desc: 'Material re-enters industrial production' }
];

/* ---------------- Helpers ---------------- */

/** Get a material listing by technical ID. */
window.RX_DATA.getMaterial = function (id) {
  return (window.RX_DATA.materials || []).find(function (m) { return m.id === id; }) || null;
};

/** Get matches for a material, sorted by estimated net value (desc). */
window.RX_DATA.getMatchesFor = function (materialId) {
  return (window.RX_DATA.matches || [])
    .filter(function (m) { return m.materialId === materialId; })
    .sort(function (a, b) { return b.estimatedNetValue - a.estimatedNetValue; });
};

/** Get all matches with their parent material attached. */
window.RX_DATA.getAllMatches = function () {
  return (window.RX_DATA.matches || []).map(function (m) {
    return Object.assign({}, m, { material: window.RX_DATA.getMaterial(m.materialId) });
  });
};

/** Format a quantity with thousands separators + unit. */
window.RX_DATA.formatQty = function (qty, unit) {
  return qty.toLocaleString('en-IN') + ' ' + (unit || 'kg');
};

/** Format a ₹ amount. */
window.RX_DATA.formatINR = function (amount, decimals) {
  return '₹' + amount.toLocaleString('en-IN', {
    minimumFractionDigits: decimals || 0,
    maximumFractionDigits: decimals || 0
  });
};
