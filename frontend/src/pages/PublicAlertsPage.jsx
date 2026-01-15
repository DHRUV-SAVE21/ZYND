import React, { useState, useEffect } from 'react';
import { Shield, MapPin, Radio, AlertOctagon, CheckCircle, Navigation, Search, Menu, Clock, Home, Phone, Users, CheckSquare, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import EvacuationRouteMap from '../components/EvacuationRouteMap';

// Comprehensive Mock Alert Data - Mumbai Focus
const allAlerts = [
    { 
        id: 1, 
        type: 'critical',
        location: 'Mumbai Mithi River - Kurla East',
        coordinates: { lat: 19.0760, lon: 72.8777 },
        message: '🚨 IMMEDIATE EVACUATION: Mithi River severe overflow. Water level critical. Move to higher ground NOW!', 
        time: '5 min ago',
        shelters: ['Bandra Sports Complex (2.5km W)', 'MMRDA Grounds (3km N)', 'Kurla Nehru Nagar School (1.8km E)'],
        shelterCoordinates: [
            { name: 'Bandra Sports Complex', lat: 19.0760, lon: 72.8477 },
            { name: 'MMRDA Grounds', lat: 19.1060, lon: 72.8777 },
            { name: 'Kurla Nehru Nagar School', lat: 19.0760, lon: 72.9077 }
        ],
        evacuationRoutes: ['Route 1: Western Express Highway → Andheri', 'Route 2: LBS Marg → Ghatkopar'],
        affected: 125000,
        instructions: [
            'Evacuate immediately - power lines down',
            'Do NOT wade through floodwater',
            'Airport operations suspended',
            'Call 108 for emergency rescue'
        ]
    },
    { 
        id: 2, 
        type: 'critical', 
        location: 'Mumbai Bandra-Mahim Creek Overflow',
        coordinates: { lat: 19.0378, lon: 72.8478 },
        message: '🚨 SEVERE FLOODING: Mahim Creek overflowing. Dadar, Mahim, Bandra West submerged. Evacuate NOW.', 
        time: '12 min ago',
        shelters: ['Shivaji Park Ground (2km N)', 'Bandra Reclamation Sports Complex (1.5km W)', 'Dharavi Transit Camp (3km E)'],
        shelterCoordinates: [
            { name: 'Shivaji Park Ground', lat: 19.0578, lon: 72.8378 },
            { name: 'Bandra Reclamation Sports Complex', lat: 19.0378, lon: 72.8278 },
            { name: 'Dharavi Transit Camp', lat: 19.0378, lon: 72.8778 }
        ],
        evacuationRoutes: ['Route 1: SV Road → Santacruz', 'Route 2: Link Road → Andheri'],
        affected: 98000,
        instructions: [
            'Local train services suspended',
            'Avoid all creek bridges',
            'Move to upper floors immediately',
            'Emergency boats deployed in area'
        ]
    },
    { 
        id: 3, 
        type: 'critical',
        location: 'Mumbai Andheri-Malad Low-Lying Areas',
        coordinates: { lat: 19.1136, lon: 72.8697 },
        message: '🚨 CRITICAL ALERT: Severe waterlogging. 3-5 feet water in Andheri Subway, Malad Link Road. Life-threatening situation.',
        time: '20 min ago',
        shelters: ['Andheri Sports Complex (2km N)', 'Cooper Hospital Grounds (1.5km S)', 'Malad MHADA Complex (2.5km W)'],
        shelterCoordinates: [
            { name: 'Andheri Sports Complex', lat: 19.1336, lon: 72.8697 },
            { name: 'Cooper Hospital Grounds', lat: 19.0936, lon: 72.8697 },
            { name: 'Malad MHADA Complex', lat: 19.1136, lon: 72.8397 }
        ],
        evacuationRoutes: ['Route 1: Western Express Highway → Goregaon', 'Route 2: SV Road → Vile Parle'],
        affected: 76000,
        instructions: [
            'Do NOT enter subways or underpasses',
            'Metro services disrupted',
            'Electrocution risk - stay away from water',
            'Call 1916 for NDRF rescue'
        ]
    },
    { 
        id: 4, 
        type: 'warning',
        location: 'Mumbai Colaba-Worli Sea Link Area',
        coordinates: { lat: 18.9220, lon: 72.8347 },
        message: '⚠️ HIGH ALERT: High tide + heavy rainfall. Marine Drive, Worli, Colaba at risk. Prepare to evacuate.',
        time: '35 min ago',
        shelters: ['Shivaji Park Stadium (5km N)', 'Breach Candy Hospital (2km E)', 'Nehru Planetarium Complex (3km N)'],
        shelterCoordinates: [
            { name: 'Shivaji Park Stadium', lat: 18.9720, lon: 72.8347 },
            { name: 'Breach Candy Hospital', lat: 18.9220, lon: 72.8547 },
            { name: 'Nehru Planetarium Complex', lat: 18.9520, lon: 72.8147 }
        ],
        evacuationRoutes: ['Route 1: Pedder Road → Malabar Hill', 'Route 2: Worli Sea Face → Prabhadevi'],
        affected: 45000,
        instructions: [
            'High tide expected at 11:30 PM',
            'Sea water inundation possible',
            'Keep valuables on upper floors',
            'Monitor BMC alerts continuously'
        ]
    },
    { 
        id: 5, 
        type: 'warning', 
        location: 'Mumbai Sion-Matunga Low Regions',
        coordinates: { lat: 19.0433, lon: 72.8587 },
        message: '⚠️ FLOOD WARNING: Heavy rainfall continues. Sion, Matunga, King Circle waterlogged. Prepare evacuation kit.', 
        time: '45 min ago',
        shelters: ['Ruia College Grounds (1.5km N)', 'KEM Hospital Complex (2km W)', 'Sion Fort Area (1km E)'],
        shelterCoordinates: [
            { name: 'Ruia College Grounds', lat: 19.0583, lon: 72.8587 },
            { name: 'KEM Hospital Complex', lat: 19.0433, lon: 72.8387 },
            { name: 'Sion Fort Area', lat: 19.0433, lon: 72.8687 }
        ],
        evacuationRoutes: ['Route 1: Sion-Panvel Highway → Chembur', 'Route 2: Eastern Express Highway → Kurla'],
        affected: 52000,
        instructions: [
            'Central Line trains delayed',
            'Harbour Line partially operational',
            'Keep phones charged',
            'Stock drinking water and food'
        ]
    },
    { 
        id: 6, 
        type: 'warning',
        location: 'Mumbai Chembur-Ghatkopar Industrial Belt',
        coordinates: { lat: 19.0626, lon: 72.9061 },
        message: '⚠️ ALERT: Factory drainage overflow. Chemical plant areas flooded. Industrial workers evacuate immediately.',
        time: '1h ago',
        shelters: ['Ghatkopar Sports Complex (3km N)', 'Chembur Gymkhana (2km S)', 'VN Purav Marg School (2.5km W)'],
        shelterCoordinates: [
            { name: 'Ghatkopar Sports Complex', lat: 19.0926, lon: 72.9061 },
            { name: 'Chembur Gymkhana', lat: 19.0326, lon: 72.9061 },
            { name: 'VN Purav Marg School', lat: 19.0626, lon: 72.8761 }
        ],
        evacuationRoutes: ['Route 1: Eastern Express Highway → Mankhurd', 'Route 2: LBS Marg → Vikhroli'],
        affected: 38000,
        instructions: [
            'Chemical contamination risk',
            'Avoid contact with floodwater',
            'Industrial workers report to safety zones',
            'Pollution Control Board monitoring'
        ]
    },
    {
        id: 7,
        type: 'safe',
        location: 'Mumbai Bandra-Khar-Santacruz Highlands',
        coordinates: { lat: 19.0596, lon: 72.8295 },
        message: '✅ SAFE ZONE: Higher elevation area. No flooding risk. Relief camps available for displaced families.',
        time: '30 min ago',
        shelters: ['Bandra Kurla Complex', 'Santacruz Sports Complex', 'Khar Gymkhana'],
        evacuationRoutes: ['All routes open and safe'],
        affected: 0,
        instructions: [
            'Area is safe - shelter available',
            'Relief camps accepting displaced persons',
            'Volunteer registration open',
            'Donate food, water, medicines'
        ]
    },
    {
        id: 8,
        type: 'safe',
        location: 'Mumbai Powai-Vikhroli Hills',
        coordinates: { lat: 19.1197, lon: 72.9073 },
        message: '✅ SAFE: Elevated area. No flood risk. Community centers open for evacuees.',
        time: '45 min ago',
        shelters: ['IIT Bombay Campus', 'Hiranandani Gardens Community Hall', 'Powai Lake Sports Complex'],
        evacuationRoutes: ['All routes operational'],
        affected: 0,
        instructions: [
            'City functioning normally',
            'No flood risk in this region',
            'All services operational',
            'Stay informed for future alerts'
        ]
    }
];

const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'bn', name: 'বাংলা', flag: '🇧🇩' }
];

const PublicAlertsPage = () => {
    const [filter, setFilter] = useState('all');
    const [userLocation, setUserLocation] = useState(null);
    const [locationStatus, setLocationStatus] = useState('loading'); // loading, safe, warning, critical
    const [nearestSafeZone, setNearestSafeZone] = useState('Calculating...');
    const [safeZoneCoordinates, setSafeZoneCoordinates] = useState(null);
    const [selectedLanguage, setSelectedLanguage] = useState('en');
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredAlerts, setFilteredAlerts] = useState(allAlerts);
    const [selectedAlert, setSelectedAlert] = useState(null);
    const [showHistory, setShowHistory] = useState(false);

    // Calculate distance between two coordinates (Haversine formula)
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371; // Earth's radius in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                  Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    };

    // Filter alerts based on user location and search
    useEffect(() => {
        let filtered = allAlerts;

        // Filter by severity
        if (filter !== 'all') {
            filtered = filtered.filter(alert => alert.type === filter);
        }

        // Filter by search query
        if (searchQuery) {
            filtered = filtered.filter(alert => 
                alert.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                alert.message.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Sort by distance if user location available
        if (userLocation) {
            filtered = filtered.map(alert => ({
                ...alert,
                distance: calculateDistance(
                    userLocation.lat, userLocation.lon,
                    alert.coordinates.lat, alert.coordinates.lon
                )
            })).sort((a, b) => a.distance - b.distance);
        }

        setFilteredAlerts(filtered);
    }, [filter, searchQuery, userLocation]);

    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const userLoc = {
                        lat: position.coords.latitude,
                        lon: position.coords.longitude
                    };
                    setUserLocation(userLoc);
                    
                    // Check if user is near any critical zones
                    const nearCritical = allAlerts.find(alert => {
                        if (alert.type === 'critical') {
                            const dist = calculateDistance(
                                userLoc.lat, userLoc.lon,
                                alert.coordinates.lat, alert.coordinates.lon
                            );
                            return dist < 20; // Within 20km
                        }
                        return false;
                    });

                    const nearWarning = allAlerts.find(alert => {
                        if (alert.type === 'warning') {
                            const dist = calculateDistance(
                                userLoc.lat, userLoc.lon,
                                alert.coordinates.lat, alert.coordinates.lon
                            );
                            return dist < 30; // Within 30km
                        }
                        return false;
                    });

                    // Find nearest shelter from the danger zone itself (not from random safe zones)
                    let nearestShelter = null;
                    let dangerZone = nearCritical || nearWarning;
                    
                    if (dangerZone && dangerZone.shelterCoordinates) {
                        // Find closest shelter from this specific danger zone
                        const sheltersWithDistance = dangerZone.shelterCoordinates.map(shelter => ({
                            ...shelter,
                            distance: calculateDistance(
                                userLoc.lat, userLoc.lon,
                                shelter.lat, shelter.lon
                            )
                        }));
                        nearestShelter = sheltersWithDistance.sort((a, b) => a.distance - b.distance)[0];
                    }

                    if (nearCritical) {
                        setLocationStatus('critical');
                        setNearestSafeZone(nearestShelter?.name || nearCritical.shelters[0]);
                        setSafeZoneCoordinates(nearestShelter ? { lat: nearestShelter.lat, lon: nearestShelter.lon } : null);
                    } else if (nearWarning) {
                        setLocationStatus('warning');
                        setNearestSafeZone(nearestShelter?.name || nearWarning.shelters[0]);
                        setSafeZoneCoordinates(nearestShelter ? { lat: nearestShelter.lat, lon: nearestShelter.lon } : null);
                    } else {
                        setLocationStatus('safe');
                        setNearestSafeZone('Current location');
                        setSafeZoneCoordinates(null);
                    }
                },
                (error) => {
                    console.error('Location error:', error);
                    setLocationStatus('safe');
                    setNearestSafeZone('Enable location for accurate status');
                }
            );
        } else {
            setLocationStatus('safe');
            setNearestSafeZone('Enable location for accurate status');
        }
    }, []);

    return (
        <div className="min-h-screen bg-transparent text-white pt-24 pb-20 md:pb-0">

            {/* Mobile-Friendly Header */}
            <div className="bg-black/60 backdrop-blur-xl text-white p-4 sticky top-0 z-50 border-b border-white/10">
                <div className="flex justify-between items-center max-w-6xl mx-auto">
                    <div className="flex items-center gap-2">
                        <Radio className="text-red-500 animate-pulse" />
                        <h1 className="font-bold text-lg tracking-wide">ZYND ALERT NET</h1>
                        <span className="bg-red-500/20 text-red-400 text-[10px] font-bold px-2 py-0.5 rounded ml-2">LIVE</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <select 
                            value={selectedLanguage}
                            onChange={(e) => setSelectedLanguage(e.target.value)}
                            className="bg-white/10 text-xs rounded border border-white/20 px-2 py-1 outline-none text-white"
                        >
                            {languages.map(lang => (
                                <option key={lang.code} value={lang.code} className="text-black">
                                    {lang.flag} {lang.name}
                                </option>
                            ))}
                        </select>
                        <button 
                            onClick={() => setShowHistory(!showHistory)}
                            className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                            title="Alert History"
                        >
                            <Clock size={20} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6">

                {/* Safety Check Status Card */}
                <div className={`backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-white/10 border-l-4 ${
                    locationStatus === 'safe' ? 'bg-green-900/20 border-l-green-500' : 
                    locationStatus === 'warning' ? 'bg-orange-900/20 border-l-orange-500' :
                    locationStatus === 'critical' ? 'bg-red-900/20 border-l-red-500' :
                    'bg-gray-900/20 border-l-gray-500'
                }`}>
                    <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-full ${
                            locationStatus === 'safe' ? 'bg-green-500/10 text-green-500' :
                            locationStatus === 'warning' ? 'bg-orange-500/10 text-orange-500' :
                            locationStatus === 'critical' ? 'bg-red-500/10 text-red-500' :
                            'bg-gray-500/10 text-gray-500'
                        }`}>
                            {locationStatus === 'safe' && <CheckCircle size={24} />}
                            {locationStatus === 'warning' && <AlertOctagon size={24} />}
                            {locationStatus === 'critical' && <AlertOctagon size={24} className="animate-pulse" />}
                            {locationStatus === 'loading' && <MapPin size={24} className="animate-pulse" />}
                        </div>
                        <div className="flex-1">
                            <h2 className="font-bold text-white text-lg">
                                {locationStatus === 'safe' && 'You are in a SAFE ZONE'}
                                {locationStatus === 'warning' && 'CAUTION - Monitor Situation'}
                                {locationStatus === 'critical' && '🚨 DANGER ZONE - EVACUATE NOW'}
                                {locationStatus === 'loading' && 'Checking your location...'}
                            </h2>
                            <p className="text-gray-400 text-sm mt-1">
                                {userLocation 
                                    ? `Based on your GPS location (${userLocation.lat.toFixed(4)}°, ${userLocation.lon.toFixed(4)}°)`
                                    : 'Enable location services for personalized alerts'
                                }
                            </p>
                            <div className="mt-4 flex gap-3">
                                <button className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-colors shadow-lg ${
                                    locationStatus === 'safe' 
                                        ? 'bg-green-600 hover:bg-green-700 text-white' 
                                        : 'bg-orange-600 hover:bg-orange-700 text-white'
                                }`}>
                                    {locationStatus === 'safe' ? "I'm Safe" : "Need Help"}
                                </button>
                                <button className="flex-1 bg-white/10 text-gray-200 py-2 px-4 rounded-lg font-medium text-sm hover:bg-white/20 transition-colors border border-white/5">
                                    Report Incident
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Live Evacuation Route Map with Turn-by-Turn Navigation */}
                <EvacuationRouteMap
                    userLocation={userLocation}
                    locationStatus={locationStatus}
                    nearestSafeZone={nearestSafeZone}
                    safeZoneCoordinates={safeZoneCoordinates}
                />

                {/* Search and Filter */}
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by location..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-black/60 backdrop-blur-xl border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 outline-none focus:border-cyan-500/50"
                        />
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => setFilter('all')} className={`px-4 py-3 rounded-lg font-medium text-sm ${filter === 'all' ? 'bg-cyan-600' : 'bg-black/60 hover:bg-white/10'}`}>All</button>
                        <button onClick={() => setFilter('critical')} className={`px-4 py-3 rounded-lg font-medium text-sm ${filter === 'critical' ? 'bg-red-600' : 'bg-black/60 hover:bg-white/10'}`}>Critical</button>
                        <button onClick={() => setFilter('warning')} className={`px-4 py-3 rounded-lg font-medium text-sm ${filter === 'warning' ? 'bg-orange-600' : 'bg-black/60 hover:bg-white/10'}`}>Warning</button>
                        <button onClick={() => setFilter('safe')} className={`px-4 py-3 rounded-lg font-medium text-sm ${filter === 'safe' ? 'bg-green-600' : 'bg-black/60 hover:bg-white/10'}`}>Safe</button>
                    </div>
                </div>

                {/* Alert Feed */}
                <div>
                    <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                        <AlertOctagon size={18} className="text-red-500" /> Live Alerts ({filteredAlerts.length})
                    </h3>

                    <div className="space-y-4">
                        {filteredAlerts.map(alert => (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                key={alert.id}
                                className={`p-5 rounded-xl border border-white/10 shadow-sm bg-black/60 backdrop-blur-md relative overflow-hidden cursor-pointer hover:border-white/30 transition-all`}
                                onClick={() => setSelectedAlert(alert)}
                            >
                                <div className={`absolute top-0 left-0 w-1 h-full ${alert.type === 'critical' ? 'bg-red-500' :
                                    alert.type === 'warning' ? 'bg-orange-400' : 'bg-green-500'
                                    }`}></div>

                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2">
                                        <MapPin size={14} className="text-gray-500" />
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{alert.location}</span>
                                    </div>
                                    <span className="text-xs text-gray-500 bg-white/5 px-2 py-1 rounded-md border border-white/5">{alert.time}</span>
                                </div>

                                {alert.distance && (
                                    <div className="text-xs text-cyan-400 font-mono mb-2">
                                        📍 {alert.distance.toFixed(1)} km from you
                                    </div>
                                )}

                                <p className="text-gray-300 font-medium leading-relaxed mb-3">
                                    {alert.message}
                                </p>

                                {alert.affected > 0 && (
                                    <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
                                        <Users size={12} />
                                        {alert.affected.toLocaleString()} people affected
                                    </div>
                                )}

                                <div className="flex gap-2">
                                    {alert.type !== 'safe' && (
                                        <button className="text-xs bg-blue-500/10 text-blue-400 px-3 py-1.5 rounded-lg font-bold border border-blue-500/20 hover:bg-blue-500/20">
                                            <Home size={12} className="inline mr-1" /> Shelters
                                        </button>
                                    )}
                                    <button className="text-xs bg-white/5 text-gray-400 px-3 py-1.5 rounded-lg font-bold border border-white/10 hover:bg-white/10">
                                        Details
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Alert Detail Modal */}
                <AnimatePresence>
                    {selectedAlert && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedAlert(null)}
                            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        >
                            <motion.div
                                initial={{ scale: 0.9, y: 20 }}
                                animate={{ scale: 1, y: 0 }}
                                exit={{ scale: 0.9, y: 20 }}
                                onClick={(e) => e.stopPropagation()}
                                className="bg-black border border-white/20 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <h2 className="text-2xl font-bold text-white">{selectedAlert.location}</h2>
                                    <button onClick={() => setSelectedAlert(null)} className="text-gray-400 hover:text-white text-2xl">×</button>
                                </div>
                                
                                <div className={`p-4 rounded-lg mb-4 ${selectedAlert.type === 'critical' ? 'bg-red-900/20 border border-red-500/30' : selectedAlert.type === 'warning' ? 'bg-orange-900/20 border border-orange-500/30' : 'bg-green-900/20 border border-green-500/30'}`}>
                                    <p className="text-white">{selectedAlert.message}</p>
                                </div>

                                {selectedAlert.instructions && (
                                    <div className="mb-4">
                                        <h3 className="text-white font-bold mb-2">Safety Instructions:</h3>
                                        <ul className="space-y-2">
                                            {selectedAlert.instructions.map((inst, i) => (
                                                <li key={i} className="flex items-start gap-2 text-gray-300">
                                                    <span className="text-cyan-500">•</span>
                                                    {inst}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {selectedAlert.shelters && selectedAlert.shelters.length > 0 && (
                                    <div className="mb-4">
                                        <h3 className="text-white font-bold mb-2 flex items-center gap-2"><Home size={16} /> Shelters:</h3>
                                        <ul className="space-y-2">
                                            {selectedAlert.shelters.map((shelter, i) => (
                                                <li key={i} className="text-gray-300 bg-white/5 p-2 rounded">{shelter}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {selectedAlert.evacuationRoutes && selectedAlert.evacuationRoutes.length > 0 && (
                                    <div>
                                        <h3 className="text-white font-bold mb-2 flex items-center gap-2"><Navigation size={16} /> Routes:</h3>
                                        <ul className="space-y-2">
                                            {selectedAlert.evacuationRoutes.map((route, i) => (
                                                <li key={i} className="text-gray-300 bg-white/5 p-2 rounded">{route}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
        </div>
    );
};

export default PublicAlertsPage;
