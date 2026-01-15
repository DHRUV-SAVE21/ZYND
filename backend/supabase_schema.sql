-- Flood Resilience Network Database Schema for Supabase
-- Execute this SQL in your Supabase SQL Editor

-- Enable PostGIS extension for geospatial queries
CREATE EXTENSION IF NOT EXISTS postgis;

-- ============================================
-- INCIDENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS incidents (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50) NOT NULL,
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'responding', 'resolved', 'closed')),
    
    -- Geospatial
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    location GEOGRAPHY(POINT, 4326),
    
    -- Metadata
    reporter_id TEXT NOT NULL,
    ai_analysis JSONB,
    image_url TEXT,
    notes TEXT,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create spatial index
CREATE INDEX idx_incidents_location ON incidents USING GIST(location);
CREATE INDEX idx_incidents_status ON incidents(status);
CREATE INDEX idx_incidents_severity ON incidents(severity);
CREATE INDEX idx_incidents_created_at ON incidents(created_at DESC);

-- Trigger to auto-update location from lat/lon
CREATE OR REPLACE FUNCTION update_incident_location()
RETURNS TRIGGER AS $$
BEGIN
    NEW.location = ST_SetSRID(ST_MakePoint(NEW.longitude, NEW.latitude), 4326);
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_incident_location
    BEFORE INSERT OR UPDATE ON incidents
    FOR EACH ROW
    EXECUTE FUNCTION update_incident_location();

-- ============================================
-- FLOOD PREDICTIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS flood_predictions (
    id BIGSERIAL PRIMARY KEY,
    region_name VARCHAR(255) NOT NULL,
    
    -- Risk Assessment
    risk_level VARCHAR(20) NOT NULL CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
    probability DOUBLE PRECISION NOT NULL CHECK (probability >= 0 AND probability <= 1),
    confidence DOUBLE PRECISION NOT NULL CHECK (confidence >= 0 AND confidence <= 1),
    
    -- Geospatial
    center_lat DOUBLE PRECISION NOT NULL,
    center_lon DOUBLE PRECISION NOT NULL,
    location GEOGRAPHY(POINT, 4326),
    
    -- Predictions
    predicted_time TIMESTAMPTZ NOT NULL,
    affected_population INTEGER,
    water_level_forecast DOUBLE PRECISION[],
    
    -- Weather Data
    rainfall_intensity DOUBLE PRECISION,
    soil_saturation DOUBLE PRECISION,
    river_level DOUBLE PRECISION,
    
    -- AI Analysis
    ai_reasoning JSONB,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ
);

CREATE INDEX idx_predictions_location ON flood_predictions USING GIST(location);
CREATE INDEX idx_predictions_risk ON flood_predictions(risk_level);
CREATE INDEX idx_predictions_expires ON flood_predictions(expires_at);
CREATE INDEX idx_predictions_region ON flood_predictions(region_name);

-- Trigger to auto-update location
CREATE OR REPLACE FUNCTION update_prediction_location()
RETURNS TRIGGER AS $$
BEGIN
    NEW.location = ST_SetSRID(ST_MakePoint(NEW.center_lon, NEW.center_lat), 4326);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_prediction_location
    BEFORE INSERT OR UPDATE ON flood_predictions
    FOR EACH ROW
    EXECUTE FUNCTION update_prediction_location();

-- ============================================
-- PUBLIC ALERTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public_alerts (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('safe', 'warning', 'critical')),
    
    -- Location targeting
    location_name VARCHAR(255) NOT NULL,
    center_lat DOUBLE PRECISION NOT NULL,
    center_lon DOUBLE PRECISION NOT NULL,
    radius_km DOUBLE PRECISION DEFAULT 10,
    location GEOGRAPHY(POINT, 4326),
    
    -- Evacuation info
    evacuation_required BOOLEAN DEFAULT FALSE,
    shelter_locations TEXT,
    evacuation_routes TEXT,
    
    -- Metadata
    issued_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE INDEX idx_alerts_location ON public_alerts USING GIST(location);
CREATE INDEX idx_alerts_active ON public_alerts(is_active);
CREATE INDEX idx_alerts_severity ON public_alerts(severity);
CREATE INDEX idx_alerts_expires ON public_alerts(expires_at);

-- Trigger to auto-update location
CREATE OR REPLACE FUNCTION update_alert_location()
RETURNS TRIGGER AS $$
BEGIN
    NEW.location = ST_SetSRID(ST_MakePoint(NEW.center_lon, NEW.center_lat), 4326);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_alert_location
    BEFORE INSERT OR UPDATE ON public_alerts
    FOR EACH ROW
    EXECUTE FUNCTION update_alert_location();

-- ============================================
-- RESOURCES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS resources (
    id BIGSERIAL PRIMARY KEY,
    unit_name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'available' CHECK (status IN ('available', 'deployed', 'maintenance', 'offline')),
    
    -- Location
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    location GEOGRAPHY(POINT, 4326),
    
    -- Capacity
    crew_size INTEGER DEFAULT 0,
    max_capacity INTEGER DEFAULT 0,
    fuel_level DOUBLE PRECISION DEFAULT 100,
    
    -- Assignment
    assigned_incident_id INTEGER REFERENCES incidents(id),
    deployed_at TIMESTAMPTZ,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_resources_location ON resources USING GIST(location);
CREATE INDEX idx_resources_status ON resources(status);
CREATE INDEX idx_resources_type ON resources(type);

-- Trigger to auto-update location
CREATE OR REPLACE FUNCTION update_resource_location()
RETURNS TRIGGER AS $$
BEGIN
    NEW.location = ST_SetSRID(ST_MakePoint(NEW.longitude, NEW.latitude), 4326);
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_resource_location
    BEFORE INSERT OR UPDATE ON resources
    FOR EACH ROW
    EXECUTE FUNCTION update_resource_location();

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS
ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE flood_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;

-- Public read access to alerts (no auth required)
CREATE POLICY "Public alerts are viewable by everyone"
ON public_alerts FOR SELECT
USING (is_active = true AND expires_at > NOW());

-- Authenticated users can read/write incidents
CREATE POLICY "Authenticated users can view incidents"
ON incidents FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can create incidents"
ON incidents FOR INSERT
TO authenticated
WITH CHECK (true);

-- Service role has full access
CREATE POLICY "Service role has full access to incidents"
ON incidents
TO service_role
USING (true)
WITH CHECK (true);

CREATE POLICY "Service role has full access to predictions"
ON flood_predictions
TO service_role
USING (true)
WITH CHECK (true);

CREATE POLICY "Service role has full access to alerts"
ON public_alerts
TO service_role
USING (true)
WITH CHECK (true);

CREATE POLICY "Service role has full access to resources"
ON resources
TO service_role
USING (true)
WITH CHECK (true);

-- ============================================
-- SAMPLE DATA FOR TESTING (Optional - will be replaced by realistic_mock_data.sql)
-- ============================================
-- Note: Skip this section if you plan to use realistic_mock_data.sql
-- These are minimal samples just to test schema structure

-- Uncomment below if you want basic test data without running realistic_mock_data.sql

/*
-- Insert sample resources
INSERT INTO resources (unit_name, type, latitude, longitude, status, crew_size, max_capacity, fuel_level) VALUES
('Rescue Unit Alpha-1', 'ambulance', 28.6139, 77.2090, 'available', 3, 4, 95.5),
('Fire Truck Beta-2', 'fire_truck', 28.6200, 77.2150, 'available', 5, 8, 88.0),
('Rescue Boat Delta-3', 'boat', 28.6100, 77.2000, 'available', 4, 10, 92.0),
('Medical Unit Gamma-4', 'ambulance', 28.6250, 77.2200, 'available', 2, 2, 100.0),
('Police Vehicle Epsilon-5', 'police', 28.6050, 77.1950, 'available', 2, 4, 85.0);

-- Insert sample active incident
INSERT INTO incidents (title, description, type, severity, status, latitude, longitude, reporter_id) VALUES
('Road Flooding - Main Street', 'Heavy water accumulation blocking main street intersection', 'flood', 'medium', 'active', 28.6139, 77.2090, 'user_123'),
('Flash Flood Warning - Downtown', 'Rapid water rise in downtown area', 'flood', 'high', 'active', 28.6200, 77.2150, 'user_456');
*/

-- ============================================
-- SETUP COMPLETE
-- ============================================
-- Next steps:
-- 1. Run add_profiles_table.sql (if you need user authentication)
-- 2. Run realistic_mock_data.sql (for comprehensive test data)
-- 
-- Or keep the sample data above for basic testing
