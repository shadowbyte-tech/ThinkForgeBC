-- ============================================================
-- RESOURCEX PRODUCTION DATABASE SCHEMA
-- Industrial Resources. Reimagined.
-- Target: PostgreSQL / Supabase
-- ============================================================

-- ENVIRONMENT CONFIGURATION:
-- Client applications require:
--   NEXT_PUBLIC_SUPABASE_URL=https://<your-project-id>.supabase.co
--   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
--
-- SECURITY WARNING:
-- NEVER provide or expose SUPABASE_SERVICE_ROLE_KEY to the client-side frontend!
-- All client mutations must operate strictly via Row Level Security (RLS).
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------
-- 1. ORGANIZATIONS
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    industry_type VARCHAR(100) NOT NULL,
    facility_location VARCHAR(255) NOT NULL,
    state VARCHAR(100),
    country VARCHAR(100) DEFAULT 'India',
    registration_number VARCHAR(100),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),
    tier VARCHAR(50) DEFAULT 'Standard',
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------
-- 2. PROFILES (Users linked to Supabase Auth)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY, -- References auth.users(id)
    organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) DEFAULT 'member' CHECK (role IN ('admin', 'manager', 'member', 'procurement', 'sustainability')),
    phone VARCHAR(50),
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------
-- 3. MATERIALS (Master Catalog)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS materials (
    id VARCHAR(50) PRIMARY KEY, -- e.g. 'RX-AL-9402'
    organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
    created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    subcategory VARCHAR(100),
    physical_form VARCHAR(100) NOT NULL,
    quantity NUMERIC(14, 2) NOT NULL,
    unit VARCHAR(20) NOT NULL DEFAULT 'kg',
    location VARCHAR(255) NOT NULL,
    lat NUMERIC(9, 6),
    lng NUMERIC(9, 6),
    price_per_unit NUMERIC(12, 2) NOT NULL,
    estimated_net_value NUMERIC(14, 2),
    co2_avoidance_kg NUMERIC(14, 2),
    technical_specs JSONB DEFAULT '{}'::jsonb,
    contaminants JSONB DEFAULT '{}'::jsonb,
    certifications TEXT[],
    images TEXT[],
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'banked', 'matched', 'in_negotiation', 'archived')),
    is_demo BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------
-- 4. MATERIAL LISTINGS (Marketplace Postings)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS material_listings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    material_id VARCHAR(50) REFERENCES materials(id) ON DELETE CASCADE,
    seller_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    minimum_order_qty NUMERIC(14, 2) DEFAULT 1,
    availability_window VARCHAR(100),
    logistics_terms VARCHAR(100) DEFAULT 'Ex-Works / Buyer Pick-up',
    is_published BOOLEAN DEFAULT true,
    view_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------
-- 5. MATCHES (Pairings & Net Value Calculations)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS matches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    material_id VARCHAR(50) REFERENCES materials(id) ON DELETE CASCADE,
    buyer_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    buyer_name VARCHAR(255) NOT NULL,
    buyer_industry VARCHAR(100),
    location VARCHAR(255) NOT NULL,
    distance_km NUMERIC(8, 2) NOT NULL,
    compatibility_score NUMERIC(5, 2) NOT NULL,
    gross_offer NUMERIC(14, 2) NOT NULL,
    freight_cost NUMERIC(14, 2) NOT NULL DEFAULT 0,
    processing_cost NUMERIC(14, 2) NOT NULL DEFAULT 0,
    net_value NUMERIC(14, 2) NOT NULL,
    match_factors JSONB DEFAULT '{}'::jsonb,
    is_best_match BOOLEAN DEFAULT false,
    status VARCHAR(50) DEFAULT 'proposed' CHECK (status IN ('proposed', 'exploring', 'countered', 'agreed', 'declined')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------
-- 6. OFFERS (Formal Purchase & Off-take Bids)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS offers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    listing_id UUID REFERENCES material_listings(id) ON DELETE CASCADE,
    buyer_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    offer_amount_per_unit NUMERIC(12, 2) NOT NULL,
    total_amount NUMERIC(14, 2) NOT NULL,
    quantity NUMERIC(14, 2) NOT NULL,
    terms TEXT,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'countered', 'accepted', 'rejected', 'expired')),
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------
-- 7. NEGOTIATIONS (Bilateral Negotiation Channels)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS negotiations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    material_id VARCHAR(50) REFERENCES materials(id) ON DELETE CASCADE,
    match_id UUID REFERENCES matches(id) ON DELETE SET NULL,
    buyer_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    seller_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    initial_offer NUMERIC(14, 2) NOT NULL,
    current_gross_offer NUMERIC(14, 2) NOT NULL,
    current_counter_offer NUMERIC(14, 2),
    agreed_price NUMERIC(14, 2),
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'counter_sent', 'agreed', 'cancelled')),
    last_activity_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------
-- 8. NEGOTIATION MESSAGES (Thread Messages & Offers)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS negotiation_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    negotiation_id UUID REFERENCES negotiations(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    sender_role VARCHAR(20) NOT NULL CHECK (sender_role IN ('buyer', 'seller', 'system')),
    message_text TEXT NOT NULL,
    offer_data JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------
-- 9. MATERIAL BANK (Seller-Governed Unmatched Reserve)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS material_bank (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    material_id VARCHAR(50) REFERENCES materials(id) ON DELETE CASCADE,
    seller_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    current_ask_price NUMERIC(12, 2) NOT NULL,
    pricing_model VARCHAR(50) DEFAULT 'fixed_seller_governed' CHECK (pricing_model IN ('fixed_seller_governed', 'market_indexed', 'counter_only')),
    reserve_until TIMESTAMPTZ,
    days_in_bank INT DEFAULT 0,
    buyer_interest_count INT DEFAULT 0,
    seller_notes TEXT,
    status VARCHAR(50) DEFAULT 'banked' CHECK (status IN ('banked', 'dispatched', 'withdrawn')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------
-- 10. JOURNEYS (Circular Lifecycle Pipelines)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS journeys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    material_id VARCHAR(50) REFERENCES materials(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    circular_index NUMERIC(5, 2) DEFAULT 100.0,
    current_stage INT DEFAULT 1,
    total_stages INT DEFAULT 6,
    co2_avoidance_metric NUMERIC(14, 2),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------
-- 11. JOURNEY NODES (Stages in Lifecycle)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS journey_nodes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    journey_id UUID REFERENCES journeys(id) ON DELETE CASCADE,
    stage_index INT NOT NULL,
    label VARCHAR(100) NOT NULL,
    role VARCHAR(100) NOT NULL,
    description TEXT,
    facility_name VARCHAR(255),
    coordinates JSONB DEFAULT '{"x": 0, "y": 0}'::jsonb,
    is_completed BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------
-- 12. JOURNEY EDGES (Transit Links Between Stages)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS journey_edges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    journey_id UUID REFERENCES journeys(id) ON DELETE CASCADE,
    from_node_id UUID REFERENCES journey_nodes(id) ON DELETE CASCADE,
    to_node_id UUID REFERENCES journey_nodes(id) ON DELETE CASCADE,
    transit_mode VARCHAR(50) DEFAULT 'Road Freight (Electric / Bio-Diesel)',
    distance_km NUMERIC(8, 2) DEFAULT 0,
    loss_rate_pct NUMERIC(5, 2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------
-- 13. SAVED MATERIALS (Shortlist / Watchlist)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS saved_materials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    material_id VARCHAR(50) REFERENCES materials(id) ON DELETE CASCADE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, material_id)
);

-- ------------------------------------------------------------
-- 14. NOTIFICATIONS (User Updates & Activity Alerts)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'general',
    link TEXT,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------
-- INDEXES
-- ------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_materials_category ON materials(category);
CREATE INDEX IF NOT EXISTS idx_materials_status ON materials(status);
CREATE INDEX IF NOT EXISTS idx_materials_location ON materials(location);
CREATE INDEX IF NOT EXISTS idx_matches_material_id ON matches(material_id);
CREATE INDEX IF NOT EXISTS idx_negotiations_material ON negotiations(material_id);
CREATE INDEX IF NOT EXISTS idx_neg_messages_neg_id ON negotiation_messages(negotiation_id);
CREATE INDEX IF NOT EXISTS idx_bank_material_id ON material_bank(material_id);
CREATE INDEX IF NOT EXISTS idx_saved_user_id ON saved_materials(user_id);
CREATE INDEX IF NOT EXISTS idx_notif_user_id ON notifications(user_id);

-- ------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE material_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE negotiations ENABLE ROW LEVEL SECURITY;
ALTER TABLE negotiation_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE material_bank ENABLE ROW LEVEL SECURITY;
ALTER TABLE journeys ENABLE ROW LEVEL SECURITY;
ALTER TABLE journey_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE journey_edges ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Public Read Catalog Policies
CREATE POLICY "Public read on active materials" ON materials FOR SELECT USING (true);
CREATE POLICY "Public read on listings" ON material_listings FOR SELECT USING (true);
CREATE POLICY "Public read on matches" ON matches FOR SELECT USING (true);
CREATE POLICY "Public read on material bank" ON material_bank FOR SELECT USING (true);
CREATE POLICY "Public read on journeys" ON journeys FOR SELECT USING (true);
CREATE POLICY "Public read on journey nodes" ON journey_nodes FOR SELECT USING (true);
CREATE POLICY "Public read on journey edges" ON journey_edges FOR SELECT USING (true);

-- Authenticated User Policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Sellers can manage listings" ON material_listings FOR ALL USING (auth.uid() = seller_id);
CREATE POLICY "Users can manage own offers" ON offers FOR ALL USING (auth.uid() = buyer_id);
CREATE POLICY "Participants can view negotiations" ON negotiations FOR SELECT USING (auth.uid() = buyer_id OR auth.uid() = seller_id);
CREATE POLICY "Participants can insert messages" ON negotiation_messages FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM negotiations WHERE negotiations.id = negotiation_id AND (negotiations.buyer_id = auth.uid() OR negotiations.seller_id = auth.uid()))
);
CREATE POLICY "Users can manage saved materials" ON saved_materials FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
