/* ============================================================
   RESOURCEX — DOMAIN TYPES
   Shared JSDoc type definitions for the demo data layer.
   All data in /js/data is DEMO / SIMULATED and must be labeled
   as such wherever it is rendered.
   ============================================================ */

/**
 * Material category as shown in the marketplace.
 * @typedef {Object} MaterialCategory
 * @property {string} name        Display name, e.g. "Metals"
 * @property {string} slug        URL-safe slug, e.g. "metals"
 * @property {string} icon        Single-glyph technical icon
 * @property {number} count       Demo catalogue count (illustrative)
 * @property {string} desc        One-line description
 */

/**
 * A material spec sheet entry (free-form key/values, mono-rendered).
 * @typedef {Object<string, string>} MaterialSpecs
 */

/**
 * A listed material on the marketplace.
 * @typedef {Object} MaterialListing
 * @property {string} id             Technical ID, e.g. "RX-AL-9402"
 * @property {string} name           Human name, e.g. "6063 Aluminium Turnings"
 * @property {string} category       Display category
 * @property {string} categorySlug   Category slug (used for visual class)
 * @property {string} grade          Material grade, e.g. "6063"
 * @property {string} form           Physical form, e.g. "Turnings"
 * @property {string} condition      Condition, e.g. "Sorted"
 * @property {number} quantity       Quantity in `unit`
 * @property {'kg'}   unit           Mass unit (demo layer uses kg)
 * @property {string} location       "City, State"
 * @property {{lat: number, lng: number}} coordinates Illustrative only
 * @property {string} availability   Availability note
 * @property {number} askingPrice    Asking price per unit (₹/kg, demo)
 * @property {string} priceUnit      Price unit suffix
 * @property {string} currency       Currency glyph
 * @property {string} contamination  Contamination descriptor
 * @property {string[]} applications Potential applications
 * @property {string} description    Short listing description
 * @property {MaterialSpecs} specifications Technical spec sheet
 * @property {{id: string, name: string, type: string}} seller Demo seller
 * @property {'active'|'banked'} status Listing status
 * @property {number} daysListed     Days on platform (demo)
 * @property {number} matchCount     Number of demo matches
 * @property {string} imageClass     CSS visual class, e.g. "rx-cat-metals"
 * @property {true}   demo           Always true — demo data marker
 */

/**
 * Per-factor compatibility scores for a match (0–100).
 * @typedef {Object} MatchFactors
 * @property {number} grade
 * @property {number} quantity
 * @property {number} processing
 * @property {number} application
 * @property {number} location
 */

/**
 * A potential buyer match for a material.
 * @typedef {Object} Match
 * @property {string} id                 Match ID, e.g. "MATCH-A-001"
 * @property {string} buyerName          Demo buyer name
 * @property {string} buyerType          e.g. "Secondary Smelter"
 * @property {string} location           Buyer location
 * @property {number} distance           Approx. distance in km (illustrative)
 * @property {number} compatibility      Overall score 0–100
 * @property {MatchFactors} compatibilityFactors
 * @property {number} grossOffer         Gross value of the lot (₹)
 * @property {number} freight            Deduction (₹)
 * @property {number} processing         Deduction (₹)
 * @property {number} handling           Deduction (₹)
 * @property {number} storage            Deduction (₹)
 * @property {number} estimatedNetValue  Net after deductions (₹)
 * @property {number} offerPerKg
 * @property {number} netPerKg
 * @property {string} notes              Why this match ranks here
 * @property {'pending'|'negotiating'|'accepted'} status
 * @property {true}   demo
 */

/**
 * A node on a material journey.
 * @typedef {Object} JourneyNode
 * @property {string} id
 * @property {'factory'|'collection'|'listing'|'processor'|'manufacturer'|'product'} type
 * @property {string} label
 * @property {string} location
 * @property {number} x        Layout coordinate (conceptual diagram space)
 * @property {number} y
 * @property {{role: string, [k: string]: string}} detail
 */

/**
 * A directed edge between two journey nodes.
 * @typedef {Object} JourneyEdge
 * @property {string} from
 * @property {string} to
 * @property {string} label
 * @property {string} distance  Human distance ("42 km") or "—"
 */

/**
 * A material journey — a conceptual, simulated lifecycle view.
 * NOT live tracking.
 * @typedef {Object} Journey
 * @property {string} id
 * @property {string} materialId
 * @property {string} materialName
 * @property {'simulated'} status
 * @property {JourneyNode[]} nodes
 * @property {JourneyEdge[]} edges
 */

/**
 * A material bank entry (seller-managed holding). Demo only.
 * @typedef {Object} BankEntry
 * @property {string} id
 * @property {string} materialId
 * @property {string} materialName
 * @property {string} category
 * @property {number} quantity
 * @property {string} unit
 * @property {string} location
 * @property {number} originalAsk
 * @property {number} currentAsk
 * @property {number|null} bulkOffer
 * @property {boolean} negotiable
 * @property {number} daysListed
 * @property {number} buyerInterest
 * @property {'banked'|'active'} status
 * @property {boolean} sellerManaged
 * @property {string} notes
 * @property {true} demo
 */

/**
 * A negotiation thread. Demo only.
 * @typedef {Object} Negotiation
 * @property {string} id
 * @property {string} materialId
 * @property {string} materialName
 * @property {string} buyerName
 * @property {string} sellerName
 * @property {'active'|'closed'} status
 * @property {{from: 'buyer'|'seller', time: string, text: string}[]} messages
 * @property {{price: number, quantity: number, unit: string, pickup: string, payment: string}} offer
 * @property {{price: number, quantity: number, unit: string, pickup: string, payment: string}} counterOffer
 * @property {true} demo
 */

/** @typedef {'factory'|'material'|'processor'|'manufacturer'|'product'} NetworkRole */

/**
 * A hero network node (conceptual diagram — not live data).
 * @typedef {Object} NetworkNode
 * @property {string} id
 * @property {NetworkRole} role
 * @property {string} label       Short label, e.g. "FACTORY"
 * @property {string} roleLabel   Role shown on hover, e.g. "Industrial Generator"
 * @property {number} x           Relative x position (0–100)
 * @property {number} y           Relative y position (0–100)
 */

/**
 * A directed connection between hero network nodes.
 * @typedef {Object} NetworkEdge
 * @property {string} from
 * @property {string} to
 * @property {string} [label]
 */

/* Loaded as a classic script — JSDoc typedefs only, no runtime exports. */
