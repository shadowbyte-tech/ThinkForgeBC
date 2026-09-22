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
    distanceTotal: '~68 km',
    co2Savings: '~95%',
    recoveryRate: '~93%',
    transformations: {
      raw: {
        title: '5,000 kg Aluminium Turnings',
        desc: 'Machining waste directly from CNC processes. High surface area, coated in cutting fluids.'
      },
      processed: {
        title: '4,650 kg Remelted Aluminium',
        desc: 'Secondary feedstock ingots. Cleaned, melted, and verified for alloy composition.'
      },
      product: {
        title: 'Extruded Aluminium Sections',
        desc: 'New product ready for assembly. Structural components matching prime specifications.'
      }
    },
    nodes: [
      {
        id: 'n1', type: 'factory', label: 'CNC Manufacturing Facility', title: 'CNC Manufacturing Facility',
        location: 'Sangareddy, Telangana', x: 80, y: 200, stageLabel: 'Stage 1',
        detail: { role: 'Material Generator', output: '5,000 kg Aluminium Turnings', note: 'Demo facility' },
        io: 'Machining Ingot → 5,000 kg Turnings'
      },
      {
        id: 'n2', type: 'collection', label: 'Collection Point', title: 'Collection & Sorting Hub',
        location: 'Sangareddy, Telangana', x: 240, y: 200, stageLabel: 'Stage 2',
        detail: { role: 'Collection / Sorting', input: '5,200 kg (incl. mixed)', output: '5,000 kg sorted', note: 'Demo hub' },
        io: 'Raw Turnings → De-oiled & Baled'
      },
      {
        id: 'n3', type: 'listing', label: 'ResourceX Listing', title: 'ResourceX Digital Match',
        location: 'ResourceX Platform', x: 400, y: 200, stageLabel: 'Stage 3',
        detail: { role: 'Platform Listing', id: 'RX-AL-9402', status: 'Active — demo data' },
        io: 'Active Listing → Buyer Match'
      },
      {
        id: 'n4', type: 'processor', label: 'Demo Casting Facility A', title: 'Secondary Smelter Facility',
        location: 'Patancheru, Telangana', x: 560, y: 140, stageLabel: 'Stage 4',
        detail: { role: 'Recycler / Processor', input: '5,000 kg turnings', output: '4,650 kg remelted aluminium', note: 'Simulated output' },
        io: '5,000 kg Chips → 4,650 kg Secondary Ingot'
      },
      {
        id: 'n5', type: 'manufacturer', label: 'Aluminium Extrusion Plant', title: 'Aluminium Extrusion Works',
        location: 'Hyderabad, Telangana', x: 720, y: 140, stageLabel: 'Stage 5',
        detail: { role: 'Manufacturing', input: '4,650 kg feedstock', output: 'Extruded sections', note: 'Illustrative scenario' },
        io: 'Feedstock Ingot → Structural Extrusion'
      },
      {
        id: 'n6', type: 'product', label: 'New Product', title: 'Finished Structural Profiles',
        location: 'Automotive / Architecture', x: 880, y: 200, stageLabel: 'Stage 6',
        detail: { role: 'Final Product', product: 'Aluminium extrusion / structural section', note: 'Illustrative end use' },
        io: 'Extrusions → Architectural Assemblies'
      }
    ],
    edges: [
      { from: 'n1', to: 'n2', label: 'Collection / Transport', distance: '8 km' },
      { from: 'n2', to: 'n3', label: 'Listed on ResourceX', distance: '—' },
      { from: 'n3', to: 'n4', label: 'Matched + dispatched', distance: '42 km' },
      { from: 'n4', to: 'n5', label: 'Processed feedstock', distance: '18 km' },
      { from: 'n5', to: 'n6', label: 'Manufactured product', distance: '—' }
    ]
  },
  {
    id: 'JRN-PE-5218-002',
    materialId: 'RX-PE-5218',
    materialName: 'HDPE Regrind — Natural',
    status: 'simulated',
    distanceTotal: '~32 km',
    co2Savings: '~88%',
    recoveryRate: '~96%',
    transformations: {
      raw: {
        title: '12,000 kg HDPE Post-Industrial Scrap',
        desc: 'Clean production trimmings and rejected containers from packaging blow-moulding line.'
      },
      processed: {
        title: '11,500 kg High-Purity Regrind Flake',
        desc: 'Sorted, de-dusted, and granulated to 4-8mm consistent flake with verified MFI.'
      },
      product: {
        title: 'Industrial Drainage & Cable Conduits',
        desc: 'Extruded dual-wall corrugated conduit pipes meeting ASTM non-pressure drainage specs.'
      }
    },
    nodes: [
      {
        id: 'n1', type: 'factory', label: 'Packaging Blow Moulding Plant', title: 'Packaging Blow Moulding Plant',
        location: 'Hyderabad, Telangana', x: 80, y: 200, stageLabel: 'Stage 1',
        detail: { role: 'Material Generator', output: '12,000 kg Trimmings', note: 'Post-industrial clean trimmings' },
        io: 'Blow-moulding rejects → 12,000 kg Scrap'
      },
      {
        id: 'n2', type: 'collection', label: 'Granulation Unit', title: 'In-House Granulation Unit',
        location: 'Hyderabad, Telangana', x: 240, y: 200, stageLabel: 'Stage 2',
        detail: { role: 'Granulation', input: '12,000 kg scrap', output: '11,500 kg flake', note: 'Clean flake' },
        io: 'Bottles/Trimmings → 4-8mm Flake'
      },
      {
        id: 'n3', type: 'listing', label: 'ResourceX Listing', title: 'ResourceX Platform Listing',
        location: 'ResourceX Platform', x: 400, y: 200, stageLabel: 'Stage 3',
        detail: { role: 'Platform Listing', id: 'RX-PE-5218', status: 'Active — demo data' },
        io: 'Active Listing → Buyer Match'
      },
      {
        id: 'n4', type: 'processor', label: 'Demo Pipe Manufacturing Unit', title: 'Demo Pipe Manufacturing Unit',
        location: 'Jeedimetla, Telangana', x: 560, y: 140, stageLabel: 'Stage 4',
        detail: { role: 'Extruder Processor', input: '11,500 kg regrind', output: 'Extruded Pipes', note: '14km haul' },
        io: '11,500 kg Flake → Extrusion Feedstock'
      },
      {
        id: 'n5', type: 'manufacturer', label: 'Conduit Pipe Extrusion', title: 'Continuous Extrusion Line',
        location: 'Jeedimetla, Telangana', x: 720, y: 140, stageLabel: 'Stage 5',
        detail: { role: 'Manufacturing', input: 'Extrusion feed', output: 'Finished conduit', note: 'Corrugated conduits' },
        io: 'Regrind Feed → Corrugated Pipes'
      },
      {
        id: 'n6', type: 'product', label: 'New Product', title: 'Infrastructure Conduits',
        location: 'Infrastructure / Telecom', x: 880, y: 200, stageLabel: 'Stage 6',
        detail: { role: 'Final Product', product: 'Telecom and electrical conduits', note: 'Illustrative end use' },
        io: 'Finished Conduits → Underground Cabling'
      }
    ],
    edges: [
      { from: 'n1', to: 'n2', label: 'Internal conveyance', distance: '0 km' },
      { from: 'n2', to: 'n3', label: 'Listed on ResourceX', distance: '—' },
      { from: 'n3', to: 'n4', label: 'Matched + dispatched', distance: '14 km' },
      { from: 'n4', to: 'n5', label: 'Extrusion line', distance: '—' },
      { from: 'n5', to: 'n6', label: 'Telecom infrastructure installation', distance: '18 km' }
    ]
  },
  {
    id: 'JRN-ST-3301-003',
    materialId: 'RX-ST-3301',
    materialName: 'MS Scrap — Shredded',
    status: 'simulated',
    distanceTotal: '~45 km',
    co2Savings: '~74%',
    recoveryRate: '~98%',
    transformations: {
      raw: {
        title: '25,000 kg Shredded Mild Steel',
        desc: 'Processed scrap from automotive stamping offcuts and heavy fabrication.'
      },
      processed: {
        title: '24,200 kg Electric Arc Billets',
        desc: 'Melted in electric arc furnace, deoxidised, and cast into square continuous billets.'
      },
      product: {
        title: 'Fe500D TMT Reinforcement Bars',
        desc: 'Hot-rolled high-strength reinforcement bars for commercial civil construction.'
      }
    },
    nodes: [
      {
        id: 'n1', type: 'factory', label: 'Automotive Stamping Yard', title: 'Automotive Stamping Yard',
        location: 'Nagpur, Maharashtra', x: 80, y: 200, stageLabel: 'Stage 1',
        detail: { role: 'Generator', output: '25,000 kg MS Scrap', note: 'Stamping offcuts' },
        io: 'Sheet trimming → Heavy Steel Scrap'
      },
      {
        id: 'n2', type: 'collection', label: 'Demo Scrap Aggregator', title: 'Magnetic Separation & Sizing',
        location: 'Nagpur, Maharashtra', x: 240, y: 200, stageLabel: 'Stage 2',
        detail: { role: 'Aggregation', input: '25,000 kg', output: 'Sized scrap', note: 'Dense packing' },
        io: 'Unsorted Scrap → 25-300mm Shredded MS'
      },
      {
        id: 'n3', type: 'listing', label: 'ResourceX Listing', title: 'ResourceX Platform Listing',
        location: 'ResourceX Platform', x: 400, y: 200, stageLabel: 'Stage 3',
        detail: { role: 'Platform Listing', id: 'RX-ST-3301', status: 'Active — demo data' },
        io: 'Active Listing → Steel Mill Match'
      },
      {
        id: 'n4', type: 'processor', label: 'Demo Induction Furnace Unit', title: 'Induction Furnace Unit',
        location: 'Butibori, Maharashtra', x: 560, y: 140, stageLabel: 'Stage 4',
        detail: { role: 'Mini Steel Plant', input: '25,000 kg scrap', output: 'Continuous billets', note: '26km haul' },
        io: 'Shredded Scrap → Molten Secondary Steel'
      },
      {
        id: 'n5', type: 'manufacturer', label: 'TMT Rolling Mill', title: 'Structural Rebar Rolling Mill',
        location: 'Butibori, Maharashtra', x: 720, y: 140, stageLabel: 'Stage 5',
        detail: { role: 'Rolling Mill', input: 'Cast billets', output: 'TMT bars', note: 'Thermal quenching' },
        io: 'Steel Billets → Hot-rolled Rebars'
      },
      {
        id: 'n6', type: 'product', label: 'New Product', title: 'Civil Infrastructure Reinforcement',
        location: 'Metro Rail Project', x: 880, y: 200, stageLabel: 'Stage 6',
        detail: { role: 'Final Product', product: 'Fe500D Reinforcement Steel', note: 'Civil infrastructure' },
        io: 'TMT Rebars → Concrete Structures'
      }
    ],
    edges: [
      { from: 'n1', to: 'n2', label: 'Local aggregation', distance: '12 km' },
      { from: 'n2', to: 'n3', label: 'Listed on ResourceX', distance: '—' },
      { from: 'n3', to: 'n4', label: 'Matched + dispatched', distance: '26 km' },
      { from: 'n4', to: 'n5', label: 'Hot transfer to rolling mill', distance: '1 km' },
      { from: 'n5', to: 'n6', label: 'Construction dispatch', distance: '6 km' }
    ]
  }
];

/** Helper to retrieve or synthesize a full 6-stage journey for any material ID */
window.RX_DATA.getJourneyFor = function (materialId) {
  var found = (window.RX_DATA.journeys || []).find(function (j) {
    return j.materialId === materialId;
  });
  if (found) return found;

  var mat = (window.RX_DATA.materialsMap && window.RX_DATA.materialsMap[materialId]) ||
            (window.RX_DATA.materials || []).find(function (m) { return m.id === materialId; }) || {
              id: materialId,
              name: 'Industrial Secondary Material',
              quantity: 5000,
              unit: 'kg',
              location: 'Regional Industrial Center',
              category: 'Secondary Resources'
            };

  return {
    id: 'JRN-GEN-' + materialId,
    materialId: mat.id,
    materialName: mat.name,
    status: 'simulated',
    distanceTotal: '~54 km',
    co2Savings: '~85%',
    recoveryRate: '~92%',
    transformations: {
      raw: {
        title: (mat.quantity || 5000).toLocaleString() + ' ' + (mat.unit || 'kg') + ' ' + mat.name,
        desc: 'Secondary byproduct stream generated directly from manufacturing operations at ' + (mat.location || 'site') + '.'
      },
      processed: {
        title: Math.round((mat.quantity || 5000) * 0.92).toLocaleString() + ' ' + (mat.unit || 'kg') + ' Refined Feedstock',
        desc: 'Sorted, decontaminated, and conditioned for downstream processing at certified facility.'
      },
      product: {
        title: 'New Industrial Product / Secondary Component',
        desc: 'Integrated into commercial product manufacturing, displacing virgin material feedstock.'
      }
    },
    nodes: [
      {
        id: 'n1', type: 'factory', label: 'Industrial Generator', title: (mat.seller && mat.seller.name) || 'Industrial Generation Facility',
        location: mat.location || 'Regional Cluster', x: 80, y: 200, stageLabel: 'Stage 1',
        detail: { role: 'Material Generator', output: (mat.quantity || 5000) + ' ' + (mat.unit || 'kg'), note: 'Primary byproduct source' },
        io: 'Production Byproduct → ' + (mat.quantity || 5000) + ' ' + (mat.unit || 'kg')
      },
      {
        id: 'n2', type: 'collection', label: 'Collection & QC Point', title: 'Secondary Resource Logistics Hub',
        location: mat.location || 'Regional Cluster', x: 240, y: 200, stageLabel: 'Stage 2',
        detail: { role: 'Collection & Assay', input: 'Batch', output: 'Graded', note: 'Quality verification' },
        io: 'Raw Lot → Graded & Staged'
      },
      {
        id: 'n3', type: 'listing', label: 'ResourceX Platform', title: 'ResourceX Net Value Match',
        location: 'Digital Platform', x: 400, y: 200, stageLabel: 'Stage 3',
        detail: { role: 'Platform Listing', id: mat.id, status: 'Active Listing' },
        io: 'Listing → Direct Counterparty Match'
      },
      {
        id: 'n4', type: 'processor', label: 'Certified Downstream Processor', title: 'Processing & Recovery Unit',
        location: 'Neighboring Industrial Area', x: 560, y: 140, stageLabel: 'Stage 4',
        detail: { role: 'Processor', input: 'Feedstock', output: 'Recycled input', note: 'Thermal / mechanical recovery' },
        io: 'Raw Secondary → Recovered Raw Material'
      },
      {
        id: 'n5', type: 'manufacturer', label: 'Manufacturing Plant', title: 'End-Product Fabrication',
        location: 'Regional Manufacturing Zone', x: 720, y: 140, stageLabel: 'Stage 5',
        detail: { role: 'Manufacturer', input: 'Secondary feedstock', output: 'New component', note: 'Specification-compliant' },
        io: 'Secondary Feedstock → New Component'
      },
      {
        id: 'n6', type: 'product', label: 'New Product', title: 'Next Productive Use',
        location: 'Commercial Market', x: 880, y: 200, stageLabel: 'Stage 6',
        detail: { role: 'Final Application', product: 'Finished Product', note: 'Circular loop closure' },
        io: 'Component → Final Commercial Assembly'
      }
    ],
    edges: [
      { from: 'n1', to: 'n2', label: 'Initial logistics', distance: '10 km' },
      { from: 'n2', to: 'n3', label: 'Listed on ResourceX', distance: '—' },
      { from: 'n3', to: 'n4', label: 'Matched + dispatched', distance: '34 km' },
      { from: 'n4', to: 'n5', label: 'Feedstock transit', distance: '10 km' },
      { from: 'n5', to: 'n6', label: 'Product deployment', distance: '—' }
    ]
  };
};

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
