-- ============================================
-- REALISTIC MOCK DATA FOR ZYND FLOOD MANAGEMENT SYSTEM - MUMBAI FOCUS
-- Execute this AFTER running:
-- 1. supabase_schema.sql
-- 2. add_profiles_table.sql (optional, for auth)
-- ============================================

-- Clear existing data in correct order (respect foreign key constraints)
-- Step 1: Delete dependent resources first
DELETE FROM resources WHERE assigned_incident_id IS NOT NULL;
DELETE FROM resources WHERE unit_name LIKE 'Rescue Unit Alpha-1' OR unit_name LIKE 'Fire Truck Beta-2';
DELETE FROM resources WHERE unit_name LIKE '%NDRF%' OR unit_name LIKE '%IAF%';

-- Step 2: Now safe to delete incidents
DELETE FROM incidents WHERE title LIKE 'Road Flooding - Main Street' OR title LIKE 'Flash Flood Warning - Downtown';
DELETE FROM incidents WHERE title LIKE '%Mumbai%' OR title LIKE '%Mithi River%' OR title LIKE '%SEVERE FLOODING%' OR title LIKE '%CRITICAL%';

-- Step 3: Clear other tables
DELETE FROM public_alerts WHERE title LIKE '%EVACUATION%' OR title LIKE '%SAFE ZONE%' OR title LIKE '%Mumbai%';
DELETE FROM flood_predictions WHERE region_name LIKE '%Mumbai%' OR region_name LIKE '%Mithi%';

-- ============================================
-- INCIDENTS - Current Active Flood Situations (MUMBAI FOCUS)
-- ============================================

INSERT INTO incidents (title, description, type, severity, status, latitude, longitude, reporter_id, ai_analysis, created_at) VALUES
-- CRITICAL - Active Mumbai Flooding
('SEVERE FLOODING - Mithi River Overflow Kurla East', 
 'Mithi River has breached banks in Kurla East. Water level 3m above danger mark. 125,000+ residents affected. Airport operations suspended. Power lines down in multiple areas.',
 'flood', 'critical', 'active', 
 19.0760, 72.8777, 'mumbai_control_center',
 '{"predicted_peak": "2026-01-15T23:00:00Z", "affected_area_km2": 45, "population_at_risk": 125000, "evacuation_priority": "immediate", "water_rise_rate_cm_per_hour": 12.5, "critical_infrastructure": ["airport", "power_grid", "railway"]}'::jsonb,
 NOW() - INTERVAL '20 minutes'),

('CRITICAL - Mahim Creek Overflow Bandra-Dadar', 
 'Mahim Creek flooding Dadar, Mahim, and Bandra West. 4-6 feet water in residential areas. Local train services suspended. Electrocution risk extreme.',
 'flood', 'critical', 'responding',
 19.0378, 72.8478, 'bmc_emergency_cell',
 '{"predicted_peak": "2026-01-15T22:00:00Z", "affected_area_km2": 32, "population_at_risk": 98000, "power_grid_affected": true, "medical_facilities_at_risk": 4, "railway_lines_affected": ["western", "harbour"]}'::jsonb,
 NOW() - INTERVAL '35 minutes'),

('FLASH FLOOD EMERGENCY - Andheri Malad Subway', 
 'Severe waterlogging in Andheri-Malad corridor. 5 feet water in subway. Multiple vehicles trapped. NDRF rescue operations ongoing.',
 'flood', 'critical', 'responding',
 19.1136, 72.8697, 'mumbai_traffic_control',
 '{"predicted_peak": "2026-01-15T20:30:00Z", "affected_area_km2": 18, "population_at_risk": 76000, "vehicles_trapped": 45, "metro_services_disrupted": true, "rainfall_intensity_mm_per_hour": 85}'::jsonb,
 NOW() - INTERVAL '45 minutes'),

('CRITICAL FLOODING - Sion Matunga Low Areas',
 'Continuous rainfall causing severe flooding in Sion, Matunga, King Circle. Central railway tracks submerged. Multiple buildings evacuated.',
 'flood', 'critical', 'active',
 19.0433, 72.8587, 'central_railway_disaster',
 '{"predicted_peak": "2026-01-16T01:00:00Z", "affected_area_km2": 22, "population_at_risk": 52000, "railway_tracks_submerged_km": 8.5, "buildings_evacuated": 23}'::jsonb,
 NOW() - INTERVAL '1 hour'),

-- HIGH SEVERITY - Mumbai Developing Situations
('HIGH TIDE WARNING - Colaba Worli Marine Drive', 
 'High tide (4.8m) + heavy rainfall causing sea water inundation. Marine Drive, Worli Sea Face, Colaba at risk. Prepare evacuation.',
 'flood', 'high', 'active',
 18.9220, 72.8347, 'mumbai_meteorological',
 '{"predicted_peak": "2026-01-15T23:30:00Z", "affected_area_km2": 15, "population_at_risk": 45000, "high_tide_height_m": 4.8, "sea_wall_breach_risk": "high"}'::jsonb,
 NOW() - INTERVAL '50 minutes'),

('CHEMICAL CONTAMINATION RISK - Chembur Industrial Belt',
 'Factory drainage overflow in Chembur-Ghatkopar industrial area. Chemical plant flooding. 5000+ workers evacuated. Hazmat teams deployed.',
 'flood', 'high', 'responding',
 19.0626, 72.9061, 'mpcb_emergency_response',
 '{"predicted_peak": "2026-01-15T21:00:00Z", "affected_area_km2": 12, "population_at_risk": 38000, "chemical_contamination": true, "industrial_units_affected": 28, "hazmat_response": "active"}'::jsonb,
 NOW() - INTERVAL '1 hour 10 minutes'),

('LAKE OVERFLOW WARNING - Powai Vihar Lake',
 'Powai Lake water level critical. Overflow imminent. Low-lying Powai areas on high alert. IIT Bombay monitoring continuously.',
 'flood', 'high', 'active',
 19.1197, 72.9073, 'powai_municipal_ward',
 '{"predicted_peak": "2026-01-16T03:00:00Z", "affected_area_km2": 8, "population_at_risk": 22000, "lake_capacity_percent": 98, "overflow_risk": "very_high"}'::jsonb,
 NOW() - INTERVAL '2 hours'),

('CREEK BREACH ALERT - Mankhurd Trombay Creek',
 'Trombay Creek water level rising rapidly. Embankment seepage detected. Mankhurd, Vashi link road at risk.',
 'flood', 'high', 'active',
 19.0438, 72.9344, 'navi_mumbai_disaster_mgmt',
 '{"predicted_peak": "2026-01-15T22:30:00Z", "affected_area_km2": 14, "population_at_risk": 34000, "embankment_breach_probability": 0.72, "evacuation_time_hours": 3}'::jsonb,
 NOW() - INTERVAL '40 minutes'),

-- MEDIUM SEVERITY - Mumbai Monitoring
('WATERLOGGING - Thane Ghodbunder Road',
 'Heavy waterlogging on Ghodbunder Road, Thane. Traffic at standstill. 2-3 feet water accumulation. Drainage pumps deployed.',
 'flood', 'medium', 'active',
 19.2183, 72.9781, 'thane_municipal_corp',
 '{"water_depth_cm": 75, "affected_area_km2": 5.5, "population_at_risk": 18000, "duration_estimate_hours": 6, "pumps_deployed": 12}'::jsonb,
 NOW() - INTERVAL '1 hour 30 minutes'),

('NULLAH OVERFLOW - Jogeshwari Andheri Nullah',
 'Andheri nullah overflowing due to continuous rainfall. JVLR and Link Road traffic diverted. Minor residential flooding.',
 'flood', 'medium', 'active',
 19.1368, 72.8512, 'western_suburbs_bmc',
 '{"water_depth_cm": 60, "affected_area_km2": 7, "population_at_risk": 12000, "traffic_diversion_active": true}'::jsonb,
 NOW() - INTERVAL '2 hours 15 minutes'),

('SUBURBAN WATERLOGGING - Borivali Kandivali West',
 'Waterlogging in Borivali and Kandivali residential areas. Sewer backup causing flooding in ground floor flats.',
 'flood', 'medium', 'active',
 19.2284, 72.8514, 'borivali_ward_office',
 '{"water_depth_cm": 45, "affected_area_km2": 9, "population_at_risk": 25000, "sewer_backup": true, "buildings_affected": 156}'::jsonb,
 NOW() - INTERVAL '3 hours'),

-- LOW SEVERITY - Mumbai Early Warnings
('RAINFALL ALERT - Vasai Virar Region',
 'Heavy rainfall forecast for Vasai-Virar. Soil saturation 80%. Low-lying areas may experience waterlogging.',
 'flood', 'low', 'active',
 19.4612, 72.8397, 'vasai_virar_municipal',
 '{"soil_saturation_percent": 80, "predicted_rainfall_mm": 120, "time_to_impact_hours": 4, "drainage_system_capacity_percent": 85}'::jsonb,
 NOW() - INTERVAL '1 hour'),

('DEPRESSION WATCH - Arabian Sea Mumbai Coast',
 'Low pressure in Arabian Sea. Possible intensification. Coastal Mumbai may experience heavy rainfall in 24-48 hours.',
 'flood', 'low', 'active',
 18.9388, 72.8354, 'mumbai_imd_station',
 '{"cyclone_probability": 0.35, "time_to_impact_hours": 36, "predicted_rainfall_mm": 180, "storm_surge_risk_cm": 60, "wind_speed_kmph": 45}'::jsonb,
 NOW() - INTERVAL '30 minutes');

-- ============================================
-- FLOOD PREDICTIONS - AI Generated Forecasts (MUMBAI FOCUS)
-- ============================================

INSERT INTO flood_predictions (
    region_name, risk_level, probability, confidence, 
    center_lat, center_lon, predicted_time, 
    affected_population, water_level_forecast, 
    rainfall_intensity, soil_saturation, river_level,
    ai_reasoning, expires_at
) VALUES
-- Next 6 hours - HIGH RISK (MUMBAI FOCUS)
('Mumbai Mithi River Basin - Kurla East', 'critical', 0.95, 0.91,
 19.0760, 72.8777, NOW() + INTERVAL '2 hours',
 125000, ARRAY[3.2, 3.8, 4.5, 5.1, 5.8, 6.2],
 85.5, 0.97, 6.5,
 '{"model": "LSTM-v3.2-Mumbai", "factors": ["airport_drainage_overwhelmed", "continuous_heavy_rainfall", "soil_saturation_critical", "tidal_backflow"], "historical_accuracy": 0.93, "similar_events": ["2005-07-mumbai-deluge", "2017-08-urban-flood"]}'::jsonb,
 NOW() + INTERVAL '12 hours'),

('Mumbai Mahim Creek - Bandra Dadar', 'critical', 0.92, 0.89,
 19.0378, 72.8478, NOW() + INTERVAL '3 hours',
 98000, ARRAY[2.8, 3.4, 4.0, 4.6, 5.2, 5.7],
 78.2, 0.95, 5.4,
 '{"model": "LSTM-v3.2-Mumbai", "factors": ["creek_overflow", "railway_embankment_breach_risk", "slum_areas_vulnerable"], "evacuation_time_needed_hours": 4, "railway_disruption_expected": true}'::jsonb,
 NOW() + INTERVAL '14 hours'),

('Mumbai Andheri-Malad Corridor', 'critical', 0.88, 0.86,
 19.1136, 72.8697, NOW() + INTERVAL '1 hours',
 76000, ARRAY[1.8, 2.2, 2.8, 3.4, 3.9, 4.2],
 92.0, 0.93, 4.5,
 '{"model": "LSTM-v3.2-Mumbai", "factors": ["subway_flooding", "metro_tunnel_risk", "inadequate_pumping"], "metro_services_affected": true, "highway_closure_probable": true}'::jsonb,
 NOW() + INTERVAL '10 hours'),

-- Next 12-24 hours - ELEVATED RISK (MUMBAI)
('Mumbai Colaba-Worli Coastal Belt', 'high', 0.81, 0.83,
 18.9220, 72.8347, NOW() + INTERVAL '10 hours',
 45000, ARRAY[1.2, 1.5, 1.9, 2.3, 2.7, 3.0],
 65.0, 0.84, 2.8,
 '{"model": "LSTM-v3.2-Mumbai", "factors": ["high_tide_4.8m", "sea_wall_overtopping", "storm_surge"], "high_tide_time": "23:30", "sea_level_rise_cm": 45}'::jsonb,
 NOW() + INTERVAL '36 hours'),

('Mumbai Sion-Matunga Railway Corridor', 'high', 0.78, 0.80,
 19.0433, 72.8587, NOW() + INTERVAL '8 hours',
 52000, ARRAY[2.1, 2.5, 2.9, 3.3, 3.7, 4.0],
 72.5, 0.86, 3.8,
 '{"model": "LSTM-v3.2-Mumbai", "factors": ["central_railway_tracks_low_lying", "drainage_system_aged"], "railway_disruption_hours": 18}'::jsonb,
 NOW() + INTERVAL '32 hours'),

('Mumbai Chembur Industrial Zone', 'high', 0.75, 0.78,
 19.0626, 72.9061, NOW() + INTERVAL '6 hours',
 38000, ARRAY[1.8, 2.1, 2.5, 2.9, 3.2, 3.5],
 68.0, 0.82, 3.3,
 '{"model": "LSTM-v3.2-Mumbai", "factors": ["industrial_drainage_overflow", "chemical_contamination_risk"], "hazmat_response_required": true}'::jsonb,
 NOW() + INTERVAL '30 hours'),

-- 24-48 hours - MODERATE RISK (MUMBAI)
('Mumbai Powai Lake Overflow Zone', 'medium', 0.62, 0.74,
 19.1197, 72.9073, NOW() + INTERVAL '24 hours',
 22000, ARRAY[1.5, 1.7, 2.0, 2.2, 2.4, 2.6],
 45.0, 0.75, 2.3,
 '{"model": "LSTM-v3.2-Mumbai", "factors": ["lake_capacity_98_percent", "overflow_channels_blocked"], "iit_bombay_monitoring": true}'::jsonb,
 NOW() + INTERVAL '54 hours'),

('Mumbai Thane Ghodbunder Corridor', 'medium', 0.58, 0.71,
 19.2183, 72.9781, NOW() + INTERVAL '20 hours',
 18000, ARRAY[1.2, 1.4, 1.6, 1.8, 2.0, 2.1],
 38.5, 0.68, 1.9,
 '{"model": "LSTM-v3.2-Mumbai", "factors": ["thane_creek_tidal_influence", "urban_sprawl_drainage"], "traffic_congestion_expected": true}'::jsonb,
 NOW() + INTERVAL '48 hours'),

-- 48+ hours - MONITORING (MUMBAI)
('Mumbai Borivali-Kandivali Suburbs', 'low', 0.35, 0.66,
 19.2284, 72.8514, NOW() + INTERVAL '48 hours',
 15000, ARRAY[0.8, 0.9, 1.0, 1.1, 1.2, 1.2],
 22.0, 0.58, 1.1,
 '{"model": "LSTM-v3.2-Mumbai", "factors": ["higher_elevation", "improved_drainage_recent"], "confidence_improving": true}'::jsonb,
 NOW() + INTERVAL '72 hours'),

('Mumbai Navi Mumbai MIDC', 'low', 0.38, 0.68,
 19.0330, 73.0297, NOW() + INTERVAL '52 hours',
 28000, ARRAY[1.0, 1.1, 1.3, 1.4, 1.5, 1.6],
 28.0, 0.62, 1.4,
 '{"model": "LSTM-v3.2-Mumbai", "factors": ["planned_drainage_system", "lower_rainfall_predicted"]}'::jsonb,
 NOW() + INTERVAL '76 hours');

-- ============================================
-- PUBLIC ALERTS - Active Warnings (MUMBAI FOCUS)
-- ============================================

INSERT INTO public_alerts (
    title, message, severity, location_name,
    center_lat, center_lon, radius_km,
    evacuation_required, shelter_locations, evacuation_routes,
    issued_at, expires_at, is_active
) VALUES
-- CRITICAL ALERTS (MUMBAI)
('IMMEDIATE EVACUATION - Mithi River Kurla East',
 '🚨 CRITICAL ALERT: Mithi River severe overflow. Water level 3m above danger mark. Evacuate NOW from Kurla East, Bandra East, Vakola areas. Power lines down. Move to higher ground immediately.',
 'critical', 'Mumbai Kurla-Bandra Belt',
 19.0760, 72.8777, 6.0,
 true, 
 'Bandra Sports Complex (2.5km W), MMRDA Grounds (3km N), Kurla Nehru Nagar School (1.8km E)',
 'Route 1: Western Express Highway → Andheri. Route 2: LBS Marg → Ghatkopar. AVOID: All Mithi River bridges, Santacruz Airport Area',
 NOW() - INTERVAL '20 minutes',
 NOW() + INTERVAL '8 hours',
 true),

('FLASH FLOOD WARNING - Mumbai Suburbs',
 '⚠️ SEVERE ALERT: Mithi River overflow. Heavy flooding in Kurla, Bandra East, Mahim. Airport closed. Do NOT venture out. Power lines down - ELECTROCUTION RISK.',
 'critical', 'Mumbai - Kurla-Bandra Belt',
 19.0760, 72.8777, 12.0,
 true,
 'Bandra Sports Complex (2.5km W), MMRDA Grounds (3km N), Kurla Nehru Nagar School (1.8km E)',
 'Route 1: Western Express Highway → Andheri. Route 2: LBS Marg → Ghatkopar. AVOID: All subways and underpasses',
 NOW() - INTERVAL '1 hour',
 NOW() + INTERVAL '12 hours',
 true),

-- HIGH ALERTS  
('HIGH RISK - Brahmaputra Rising',
 '⚠️ HIGH ALERT: Water levels rising in Brahmaputra tributary. Guwahati low areas at risk in 6-8 hours. Prepare to evacuate. Keep documents and essentials ready.',
 'warning', 'Guwahati - Brahmaputra Basin',
 26.1445, 91.7362, 15.0,
 false,
 'IIT Guwahati Campus (12km W), Kamrup Metropolitan Hall (4km N), Don Bosco School (6km E)',
 'Route 1: NH27 → Noonmati. Route 2: GS Road → Khanapara. Monitor local radio',
 NOW() - INTERVAL '20 minutes',
 NOW() + INTERVAL '10 hours',
 true),

('WATCH ALERT - Kerala Heavy Rain',
 '⚠️ WATCH: Continuous heavy rainfall in Western Ghats. Periyar dam release scheduled. Low-lying areas prepare for possible evacuation in next 12 hours.',
 'warning', 'Kochi - Ernakulam District',
 9.9312, 76.2673, 20.0,
 false,
 'Ernakulam Town Hall (5km N), Marine Drive School (3km W), Kakkanad Collectorate (8km E)',
 'Route 1: NH66 → Thrippunithura. Route 2: Seaport-Airport Road → Kalamassery',
 NOW() - INTERVAL '2 hours',
 NOW() + INTERVAL '18 hours',
 true),

-- SAFE ZONES
('SAFE ZONE VERIFIED - South Delhi',
 '✅ SAFE: South Delhi areas (Vasant Vihar, Greater Kailash, Hauz Khas) are NOT affected. No evacuation needed. Relief camps available if needed.',
 'safe', 'South Delhi',
 28.5494, 77.2001, 10.0,
 false,
 'Siri Fort Auditorium, IIT Delhi Campus, JNU Convention Center',
 'All routes open and safe',
 NOW() - INTERVAL '1 hour',
 NOW() + INTERVAL '24 hours',
 true),

('SAFE ZONE - Bangalore City',
 '✅ SAFE: Bangalore city not affected by flooding. Weather normal. City functioning normally.',
 'safe', 'Bangalore',
 12.9716, 77.5946, 25.0,
 false,
 'Not required - city is safe',
 'All routes operational',
 NOW() - INTERVAL '30 minutes',
 NOW() + INTERVAL '48 hours',
 true);

-- ============================================
-- RESOURCES - Emergency Response Units
-- ============================================

INSERT INTO resources (
    unit_name, type, latitude, longitude, status, 
    crew_size, max_capacity, fuel_level, assigned_incident_id
) VALUES
-- DEPLOYED UNITS (Active in Field) - assigned_incident_id will be updated below
('NDRF Team Alpha-1 (Delhi)', 'rescue_team', 28.7100, 77.2080, 'deployed', 8, 15, 78.5, NULL),
('NDRF Boat Unit B-2 (Delhi)', 'rescue_boat', 28.7050, 77.2100, 'deployed', 4, 12, 82.0, NULL),
('Delhi Fire Brigade Unit-7', 'fire_rescue', 28.7020, 77.2050, 'deployed', 6, 8, 91.5, NULL),
('Ambulance - AIIMS Emergency', 'ambulance', 28.7060, 77.2070, 'deployed', 2, 4, 88.0, NULL),

('NDRF Team Beta-3 (Mumbai)', 'rescue_team', 19.0800, 72.8800, 'deployed', 10, 20, 72.0, NULL),
('Mumbai Fire Brigade-12', 'fire_rescue', 19.0780, 72.8790, 'deployed', 7, 10, 85.5, NULL),
('Coast Guard Boat CG-401', 'rescue_boat', 19.0750, 72.8750, 'deployed', 6, 15, 94.0, NULL),

-- AVAILABLE UNITS (Ready to Deploy)
('NDRF Team Gamma-5 (Guwahati)', 'rescue_team', 26.1500, 91.7400, 'available', 8, 15, 95.0, NULL),
('Assam Police Rescue Unit-3', 'police', 26.1480, 91.7380, 'available', 4, 6, 91.0, NULL),

('NDRF Team Delta-7 (Kochi)', 'rescue_team', 9.9400, 76.2700, 'available', 9, 18, 97.5, NULL),
('Kerala Rescue Boat KB-12', 'rescue_boat', 9.9380, 76.2680, 'available', 5, 12, 89.0, NULL),

('NDRF Team Epsilon-9 (Patna)', 'rescue_team', 25.6000, 85.1400, 'available', 8, 15, 93.0, NULL),
('Bihar Flood Relief Boat-8', 'rescue_boat', 25.5980, 85.1380, 'available', 4, 10, 87.5, NULL),

('NDRF Team Zeta-11 (Kolkata)', 'rescue_team', 22.5800, 88.3700, 'available', 10, 20, 96.0, NULL),
('West Bengal Fire Service-24', 'fire_rescue', 22.5780, 88.3680, 'available', 6, 8, 90.5, NULL),

-- MEDICAL UNITS
('Mobile Medical Unit MMU-1 (Delhi)', 'medical', 28.7000, 77.2000, 'available', 3, 5, 85.0, NULL),
('Mobile Medical Unit MMU-2 (Mumbai)', 'medical', 19.0700, 72.8700, 'deployed', 3, 5, 78.0, NULL),
('Ambulance AMB-Delhi-21', 'ambulance', 28.6900, 77.2200, 'available', 2, 4, 92.0, NULL),
('Ambulance AMB-Mumbai-14', 'ambulance', 19.0850, 72.8850, 'available', 2, 4, 88.5, NULL),

-- SUPPLY TRUCKS
('Relief Supply Truck RST-1', 'supply_truck', 28.7150, 77.2150, 'deployed', 2, 50, 81.0, NULL),
('Relief Supply Truck RST-2', 'supply_truck', 19.0820, 72.8820, 'deployed', 2, 50, 76.5, NULL),
('Food Distribution Van FDV-3', 'supply_truck', 26.1520, 91.7420, 'available', 2, 30, 94.5, NULL),

-- AERIAL UNITS
('IAF Helicopter H-1 (Delhi)', 'helicopter', 28.5665, 77.1032, 'available', 3, 8, 85.0, NULL),
('IAF Helicopter H-2 (Mumbai)', 'helicopter', 19.0896, 72.8656, 'deployed', 3, 8, 72.5, NULL),
('Drone Surveillance DS-1', 'drone', 28.7100, 77.2100, 'deployed', 1, 0, 65.0, NULL),
('Drone Surveillance DS-2', 'drone', 19.0780, 72.8780, 'deployed', 1, 0, 58.0, NULL);

-- ============================================
-- LINK RESOURCES TO INCIDENTS
-- ============================================
-- Now that both incidents and resources exist, link deployed units to incidents

-- Link Delhi units to Yamuna flood incident
UPDATE resources 
SET assigned_incident_id = (
    SELECT id FROM incidents 
    WHERE title LIKE '%Yamuna River Bank Breach%' 
    LIMIT 1
)
WHERE unit_name IN (
    'NDRF Team Alpha-1 (Delhi)',
    'NDRF Boat Unit B-2 (Delhi)',
    'Delhi Fire Brigade Unit-7',
    'Ambulance - AIIMS Emergency',
    'Relief Supply Truck RST-1',
    'Drone Surveillance DS-1'
);

-- Link Mumbai units to Mithi River incident
UPDATE resources 
SET assigned_incident_id = (
    SELECT id FROM incidents 
    WHERE title LIKE '%Mumbai Mithi River%' 
    LIMIT 1
)
WHERE unit_name IN (
    'NDRF Team Beta-3 (Mumbai)',
    'Mumbai Fire Brigade-12',
    'Coast Guard Boat CG-401',
    'Mobile Medical Unit MMU-2 (Mumbai)',
    'Relief Supply Truck RST-2',
    'IAF Helicopter H-2 (Mumbai)',
    'Drone Surveillance DS-2'
);

COMMIT;

-- ============================================
-- USER PROFILES SETUP (OPTIONAL)
-- ============================================
-- Note: Run add_profiles_table.sql BEFORE this section if you want user profiles
-- 
-- After creating users in Supabase Auth Dashboard, link them to profiles:
-- 
-- Example 1: Link existing user
-- INSERT INTO public.profiles (id, email, full_name, role, phone, organization)
-- SELECT id, email, 'Emergency Coordinator', 'admin', '+91-9876543210', 'ZYND Command Center'
-- FROM auth.users WHERE email = 'admin@zynd.ai' LIMIT 1;
--
-- Example 2: Link responder user
-- INSERT INTO public.profiles (id, email, full_name, role, phone, organization)
-- SELECT id, email, 'Field Responder', 'responder', '+91-9123456789', 'NDRF Delhi'
-- FROM auth.users WHERE email = 'responder@zynd.ai' LIMIT 1;
--
-- Example 3: Link citizen user
-- INSERT INTO public.profiles (id, email, full_name, role, phone, organization)
-- SELECT id, email, 'Citizen Reporter', 'user', '+91-9988776655', NULL
-- FROM auth.users WHERE email = 'citizen@example.com' LIMIT 1;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- View all active incidents by severity
-- SELECT severity, COUNT(*) as count FROM incidents WHERE status = 'active' GROUP BY severity ORDER BY CASE severity WHEN 'critical' THEN 1 WHEN 'high' THEN 2 WHEN 'medium' THEN 3 ELSE 4 END;

-- View upcoming predictions (next 24h)
-- SELECT region_name, risk_level, probability, predicted_time FROM flood_predictions WHERE predicted_time < NOW() + INTERVAL '24 hours' ORDER BY predicted_time;

-- View resource deployment status
-- SELECT type, status, COUNT(*) as count FROM resources GROUP BY type, status ORDER BY type, status;

-- Find nearest resources to a location (example: Delhi 28.7, 77.2)
-- SELECT unit_name, type, status, ST_Distance(location, ST_MakePoint(77.2, 28.7)::geography) / 1000 as distance_km FROM resources WHERE status IN ('available', 'deployed') ORDER BY distance_km LIMIT 10;

