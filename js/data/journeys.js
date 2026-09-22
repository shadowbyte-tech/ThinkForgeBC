/* ============================================================
   RESOURCEX DEMO DATA — JOURNEYS + HERO NETWORK
   Journeys are SIMULATED conceptual views — NOT live tracking.
   Types: see js/data/types.js (Journey, NetworkNode, NetworkEdge)
   ============================================================ */

window.RX_DATA = window.RX_DATA || {};

/** @type {import('./types.js').Journey[]} */
window.RX_DATA.journeys = [
  {
    id: 'JRN-AL-9402-001',
    materialId: 'RX-AL-9402',
    materialName: '6063 Aluminium Turnings',
    status: 'simulated',
    nodes: [
      {
        id: 'n1', type: 'factory', label: 'CNC Manufacturing Facility',
        location: 'Sangareddy, Telangana', x: 80, y: 200,
        detail: { role: 'Material Generator', output: '5,000 kg Aluminium Turnings', note: 'Demo facility' }
      },
      {
        id: 'n2', type: 'collection', label: 'Collection Point',
        location: 'Sangareddy, Telangana', x: 240, y: 200,
        detail: { role: 'Collection / Sorting', input: '5,200 kg (incl. mixed)', output: '5,000 kg sorted', note: 'Demo hub' }
      },
      {
        id: 'n3', type: 'listing', label: 'ResourceX Listing',
        location: 'Platform', x: 400, y: 200,
        detail: { role: 'Platform Listing', id: 'RX-AL-9402', status: 'Active — demo data' }
      },
      {
        id: 'n4', type: 'processor', label: 'Demo Casting Facility A',
        location: 'Patancheru, Telangana', x: 560, y: 140,
        detail: { role: 'Recycler / Processor', input: '5,000 kg turnings', output: '4,650 kg remelted aluminium', note: 'Simulated output' }
      },
      {
        id: 'n5', type: 'manufacturer', label: 'Aluminium Extrusion Plant',
        location: 'Hyderabad, Telangana', x: 720, y: 140,
        detail: { role: 'Manufacturing', input: '4,650 kg feedstock', output: 'Extruded sections', note: 'Illustrative scenario' }
      },
      {
        id: 'n6', type: 'product', label: 'New Product',
        location: '—', x: 960, y: 200,
        detail: { role: 'Final Product', product: 'Aluminium extrusion / structural section', note: 'Illustrative end use' }
      }
    ],
    edges: [
      { from: 'n1', to: 'n2', label: 'Collection / Transport', distance: '8 km' },
      { from: 'n2', to: 'n3', label: 'Listed on ResourceX', distance: '—' },
      { from: 'n3', to: 'n4', label: 'Matched + dispatched', distance: '42 km' },
      { from: 'n4', to: 'n5', label: 'Processed feedstock', distance: '18 km' },
      { from: 'n5', to: 'n6', label: 'Manufactured product', distance: '—' }
    ]
  }
];

/** @type {import('./types.js').NetworkNode[]} */
window.RX_DATA.network = {
  /** Node roles for the conceptual hero network diagram. */
  stages: [
    { id: 'factory',      label: 'FACTORY',      roleLabel: 'Industrial Generator',  role: 'generator',     x: 8,   y: 50 },
    { id: 'material',     label: 'MATERIAL',     roleLabel: 'Secondary Resource',    role: 'material',      x: 29,  y: 24 },
    { id: 'processor',    label: 'PROCESSOR',    roleLabel: 'Processing / Recovery', role: 'processor',     x: 50,  y: 56 },
    { id: 'manufacturer', label: 'MANUFACTURER', roleLabel: 'Potential End User',    role: 'manufacturer',  x: 71,  y: 22 },
    { id: 'product',      label: 'NEW PRODUCT',  roleLabel: 'Next Productive Use',   role: 'product',       x: 92,  y: 50 }
  ],
  edges: [
    { from: 'factory', to: 'material' },
    { from: 'material', to: 'processor' },
    { from: 'processor', to: 'manufacturer' },
    { from: 'manufacturer', to: 'product' },
    { from: 'material', to: 'processor', label: 'alt' },
    { from: 'processor', to: 'manufacturer', label: 'alt' }
  ]
};
