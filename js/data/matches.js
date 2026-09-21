/* ============================================================
   RESOURCEX DEMO DATA — MATCHES
   Net-value matches are SIMULATED figures for demonstration.
   Keyed by material ID. Types: see js/data/types.js (Match)
   ============================================================ */

window.RX_DATA = window.RX_DATA || {};

/** @type {Record<string, import('./types.js').Match[]>} */
window.RX_DATA.matches = {
  'RX-AL-9402': [
    {
      id: 'MATCH-A-001',
      materialId: 'RX-AL-9402',
      buyerName: 'Demo Casting Facility A',
      buyerType: 'Recycler / Caster',
      location: 'Patancheru, Telangana',
      distance: 42,
      compatibility: 96,
      compatibilityFactors: { grade: 98, quantity: 95, processing: 96, application: 97, location: 94 },
      grossOffer: 463200,
      freight: 3200,
      processing: 18000,
      handling: 0,
      storage: 0,
      estimatedNetValue: 442000,
      offerPerKg: 92.64,
      netPerKg: 88.4,
      notes: 'Direct remelting capability. No pre-processing required before use.',
      status: 'pending',
      demo: true
    },
    {
      id: 'MATCH-B-002',
      materialId: 'RX-AL-9402',
      buyerName: 'Demo Secondary Aluminium Plant B',
      buyerType: 'Secondary Smelter',
      location: 'Medak, Telangana',
      distance: 110,
      compatibility: 91,
      compatibilityFactors: { grade: 93, quantity: 92, processing: 88, application: 94, location: 78 },
      grossOffer: 465000,
      freight: 8500,
      processing: 12000,
      handling: 0,
      storage: 0,
      estimatedNetValue: 444500,
      offerPerKg: 93.0,
      netPerKg: 88.9,
      notes: 'Secondary smelter, slight premium offered. Higher freight due to distance.',
      status: 'pending',
      demo: true
    },
    {
      id: 'MATCH-C-003',
      materialId: 'RX-AL-9402',
      buyerName: 'Demo Alloy Processor C',
      buyerType: 'Alloy Processor',
      location: 'Zaheerabad, Telangana',
      distance: 68,
      compatibility: 88,
      compatibilityFactors: { grade: 85, quantity: 90, processing: 88, application: 90, location: 87 },
      grossOffer: 450000,
      freight: 5200,
      processing: 22000,
      handling: 4000,
      storage: 0,
      estimatedNetValue: 418800,
      offerPerKg: 90.0,
      netPerKg: 83.76,
      notes: 'Additional pre-processing step required. Lower net value despite moderate distance.',
      status: 'pending',
      demo: true
    }
  ],
  'RX-PE-5218': [
    {
      id: 'MATCH-D-004',
      materialId: 'RX-PE-5218',
      buyerName: 'Demo Pipe Manufacturing Unit',
      buyerType: 'Pipe Extruder',
      location: 'Jeedimetla, Telangana',
      distance: 14,
      compatibility: 94,
      compatibilityFactors: { grade: 95, quantity: 92, processing: 95, application: 96, location: 89 },
      grossOffer: 582000,
      freight: 2100,
      processing: 9000,
      handling: 0,
      storage: 0,
      estimatedNetValue: 570900,
      offerPerKg: 48.5,
      netPerKg: 47.58,
      notes: 'Short haul. Extrusion-grade natural HDPE accepted without blending.',
      status: 'pending',
      demo: true
    }
  ],
  'RX-ST-3301': [
    {
      id: 'MATCH-E-005',
      materialId: 'RX-ST-3301',
      buyerName: 'Demo Induction Furnace Unit',
      buyerType: 'Mini Steel Plant',
      location: 'Butibori, Maharashtra',
      distance: 26,
      compatibility: 90,
      compatibilityFactors: { grade: 88, quantity: 97, processing: 93, application: 90, location: 84 },
      grossOffer: 855000,
      freight: 14500,
      processing: 21000,
      handling: 6000,
      storage: 0,
      estimatedNetValue: 813500,
      offerPerKg: 34.2,
      netPerKg: 32.54,
      notes: 'High tonnage intake. Furnace-ready sizing already achieved.',
      status: 'pending',
      demo: true
    }
  ],
  'RX-GL-7710': [
    {
      id: 'MATCH-F-006',
      materialId: 'RX-GL-7710',
      buyerName: 'Demo Container Glass Plant',
      buyerType: 'Glass Manufacturer',
      location: 'Chakan, Maharashtra',
      distance: 38,
      compatibility: 87,
      compatibilityFactors: { grade: 82, quantity: 90, processing: 91, application: 88, location: 85 },
      grossOffer: 57800,
      freight: 4600,
      processing: 5200,
      handling: 0,
      storage: 0,
      estimatedNetValue: 48000,
      offerPerKg: 6.8,
      netPerKg: 5.65,
      notes: 'Mixed colour cullet accepted for amber container lines.',
      status: 'pending',
      demo: true
    }
  ],
  'RX-TX-4480': [
    {
      id: 'MATCH-TX-007',
      materialId: 'RX-TX-4480',
      buyerName: 'Demo Industrial Yarn Spinners',
      buyerType: 'Open-end Spinning Mill',
      location: 'Tiruppur, Tamil Nadu',
      distance: 52,
      compatibility: 93,
      compatibilityFactors: { grade: 95, quantity: 92, processing: 90, application: 96, location: 92 },
      grossOffer: 90880,
      freight: 2800,
      processing: 6400,
      handling: 0,
      storage: 0,
      estimatedNetValue: 81680,
      offerPerKg: 28.4,
      netPerKg: 25.53,
      notes: 'Industrial yarn blending. Low trash content appreciated.',
      status: 'pending',
      demo: true
    },
    {
      id: 'MATCH-TX-008',
      materialId: 'RX-TX-4480',
      buyerName: 'Demo Non-Woven Felt Ltd',
      buyerType: 'Automotive Acoustic Mfg',
      location: 'Hosur, Tamil Nadu',
      distance: 280,
      compatibility: 86,
      compatibilityFactors: { grade: 88, quantity: 95, processing: 85, application: 90, location: 72 },
      grossOffer: 96000,
      freight: 9200,
      processing: 7000,
      handling: 1500,
      storage: 0,
      estimatedNetValue: 78300,
      offerPerKg: 30.0,
      netPerKg: 24.47,
      notes: 'Offers higher gross price, but freight over 280km reduces net yield.',
      status: 'pending',
      demo: true
    }
  ],
  'RX-PP-6102': [
    {
      id: 'MATCH-PP-009',
      materialId: 'RX-PP-6102',
      buyerName: 'Demo Industrial Strapping Co',
      buyerType: 'Packaging Extruder',
      location: 'Sanand, Gujarat',
      distance: 35,
      compatibility: 95,
      compatibilityFactors: { grade: 94, quantity: 96, processing: 95, application: 98, location: 92 },
      grossOffer: 258400,
      freight: 3400,
      processing: 10200,
      handling: 0,
      storage: 0,
      estimatedNetValue: 244800,
      offerPerKg: 38.0,
      netPerKg: 36.0,
      notes: 'Excellent fit for non-critical PET/PP strapping extrusion line.',
      status: 'pending',
      demo: true
    },
    {
      id: 'MATCH-PP-010',
      materialId: 'RX-PP-6102',
      buyerName: 'Demo Moulded Crates Ltd',
      buyerType: 'Injection Moulding',
      location: 'Vadodara, Gujarat',
      distance: 115,
      compatibility: 89,
      compatibilityFactors: { grade: 87, quantity: 90, processing: 88, application: 92, location: 80 },
      grossOffer: 265200,
      freight: 8600,
      processing: 14000,
      handling: 2000,
      storage: 0,
      estimatedNetValue: 240600,
      offerPerKg: 39.0,
      netPerKg: 35.38,
      notes: 'Higher gross ask, higher transit distance.',
      status: 'pending',
      demo: true
    }
  ],
  'RX-CO-8841': [
    {
      id: 'MATCH-CO-011',
      materialId: 'RX-CO-8841',
      buyerName: 'Demo Highway Contractors',
      buyerType: 'Infrastructure Builder',
      location: 'Hosakote, Karnataka',
      distance: 28,
      compatibility: 94,
      compatibilityFactors: { grade: 92, quantity: 98, processing: 96, application: 95, location: 89 },
      grossOffer: 360000,
      freight: 35000,
      processing: 15000,
      handling: 8000,
      storage: 0,
      estimatedNetValue: 302000,
      offerPerKg: 2.4,
      netPerKg: 2.01,
      notes: 'Sub-base layer compaction test confirmed.',
      status: 'pending',
      demo: true
    }
  ],
  'RX-EL-2203': [
    {
      id: 'MATCH-EL-012',
      materialId: 'RX-EL-2203',
      buyerName: 'Demo Certified Precious Metals Recovery',
      buyerType: 'Authorized E-Waste Refiner',
      location: 'Sriperumbudur, Tamil Nadu',
      distance: 45,
      compatibility: 96,
      compatibilityFactors: { grade: 98, quantity: 92, processing: 95, application: 97, location: 96 },
      grossOffer: 168000,
      freight: 3200,
      processing: 18000,
      handling: 2000,
      storage: 0,
      estimatedNetValue: 144800,
      offerPerKg: 210.0,
      netPerKg: 181.0,
      notes: 'State Pollution Control Board certified facility. Assay upon receipt.',
      status: 'pending',
      demo: true
    }
  ]
};

/** Helper to get or dynamically synthesize realistic matches for any material */
window.RX_DATA.getMatchesForMaterial = function (materialId) {
  var pool = window.RX_DATA.matches || {};
  if (pool[materialId] && pool[materialId].length > 0) {
    return pool[materialId];
  }
  // Synthesize realistic matches from material info
  var mat = (window.RX_DATA.materialsMap && window.RX_DATA.materialsMap[materialId]) || 
            (window.RX_DATA.materials || []).find(function(m) { return m.id === materialId; }) || {
              id: materialId, name: 'Industrial Secondary Stream', quantity: 5000, askingPrice: 50, location: 'Regional Industrial Zone'
            };
  var qty = mat.quantity || 5000;
  var basePrice = mat.askingPrice || 50;
  var gross = Math.round(qty * basePrice);
  
  return [
    {
      id: 'MATCH-SIM-A-' + materialId,
      materialId: materialId,
      buyerName: 'Regional ' + (mat.category || 'Materials') + ' Processor',
      buyerType: 'Direct Processor',
      location: 'Industrial Cluster A (Nearby)',
      distance: 35,
      compatibility: 95,
      compatibilityFactors: { grade: 96, quantity: 94, processing: 95, application: 96, location: 94 },
      grossOffer: gross,
      freight: Math.round(35 * 45),
      processing: Math.round(gross * 0.04),
      handling: 0,
      storage: 0,
      estimatedNetValue: gross - Math.round(35 * 45) - Math.round(gross * 0.04),
      offerPerKg: basePrice,
      netPerKg: +((gross - Math.round(35 * 45) - Math.round(gross * 0.04)) / qty).toFixed(2),
      notes: 'Direct feed capability. Optimal local match.',
      status: 'pending',
      demo: true
    },
    {
      id: 'MATCH-SIM-B-' + materialId,
      materialId: materialId,
      buyerName: 'Secondary Recovery Hub B',
      buyerType: 'Recovery Smelter',
      location: 'Industrial Corridor B',
      distance: 95,
      compatibility: 89,
      compatibilityFactors: { grade: 91, quantity: 90, processing: 86, application: 93, location: 76 },
      grossOffer: Math.round(gross * 1.02),
      freight: Math.round(95 * 55),
      processing: Math.round(gross * 0.03),
      handling: 1500,
      storage: 0,
      estimatedNetValue: Math.round(gross * 1.02) - Math.round(95 * 55) - Math.round(gross * 0.03) - 1500,
      offerPerKg: +(basePrice * 1.02).toFixed(2),
      netPerKg: +((Math.round(gross * 1.02) - Math.round(95 * 55) - Math.round(gross * 0.03) - 1500) / qty).toFixed(2),
      notes: 'Higher base offer offset by longer haul.',
      status: 'pending',
      demo: true
    }
  ];
};
