import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Polygon, Circle, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Component to update map view when user location changes
function MapUpdater({ userLocation }) {
    const map = useMap();
    useEffect(() => {
        if (userLocation) {
            map.setView([userLocation.latitude, userLocation.longitude], 11);
        }
    }, [userLocation, map]);
    return null;
}

// Flood zone data for different timelines - MUMBAI REALISTIC AREAS
const floodZonesData = {
    0: [ // Now - Current flooding (based on actual Mumbai flood-prone areas)
        {
            id: 'mithi-river-critical',
            name: 'Mithi River - Kurla to Airport',
            risk: 'critical',
            coordinates: [
                [19.088, 72.868], // Kurla East
                [19.082, 72.878], // BKC area
                [19.072, 72.885], // Vakola
                [19.065, 72.875], // Santacruz East
                [19.075, 72.865]  // Back to Kurla
            ],
            population: 125000,
            waterDepth: '3m above danger mark'
        },
        {
            id: 'hindmata-parel-critical',
            name: 'Hindmata-Parel-Dadar Low Areas',
            risk: 'critical',
            coordinates: [
                [19.018, 72.842], // Hindmata
                [19.015, 72.850], // Parel
                [19.022, 72.855], // Lower Parel
                [19.028, 72.848], // Dadar TT
                [19.025, 72.840]  // Back
            ],
            population: 98000,
            waterDepth: '2.8m above danger mark'
        },
        {
            id: 'andheri-subway-high',
            name: 'Andheri Subway & Link Road',
            risk: 'high',
            coordinates: [
                [19.118, 72.846], // Andheri West
                [19.115, 72.855], // Andheri Subway
                [19.108, 72.862], // Jogeshwari
                [19.105, 72.850], // Vile Parle
                [19.112, 72.843]  // Back
            ],
            population: 76000,
            waterDepth: '1.8m waterlogging'
        },
        {
            id: 'sion-king-circle-medium',
            name: 'Sion-King Circle Railway Area',
            risk: 'medium',
            coordinates: [
                [19.043, 72.855], // Sion
                [19.040, 72.862], // King Circle
                [19.035, 72.867], // Matunga
                [19.032, 72.858], // Wadala
                [19.038, 72.852]  // Back
            ],
            population: 52000,
            waterDepth: '0.9m'
        }
    ],
    1: [ // +6 hours - Expanding zones
        {
            id: 'mithi-river-critical-expanded',
            name: 'Entire Mithi River Catchment',
            risk: 'critical',
            coordinates: [
                [19.125, 72.858], // Powai area
                [19.108, 72.878], // Chandivali
                [19.085, 72.890], // BKC to Airport
                [19.058, 72.880], // Santacruz to Kalina
                [19.055, 72.865], // Dharavi
                [19.072, 72.850]  // Back to Powai
            ],
            population: 180000,
            waterDepth: '4.5m above danger mark'
        },
        {
            id: 'bandra-mahim-high',
            name: 'Bandra-Mahim Reclamation',
            risk: 'high',
            coordinates: [
                [19.058, 72.830], // Mahim Causeway
                [19.052, 72.838], // Mahim Fort
                [19.048, 72.842], // Dadar West
                [19.042, 72.835], // Shivaji Park
                [19.050, 72.825]  // Bandra Reclamation
            ],
            population: 65000,
            waterDepth: '2.3m with high tide'
        },
        {
            id: 'malad-link-road-high',
            name: 'Malad-Goregaon Link Road',
            risk: 'high',
            coordinates: [
                [19.188, 72.848], // Malad West
                [19.175, 72.858], // Malad Link Road
                [19.165, 72.865], // Goregaon
                [19.160, 72.852], // Aarey Road
                [19.178, 72.843]  // Back
            ],
            population: 48000,
            waterDepth: '1.9m'
        },
        {
            id: 'chembur-ghatkopar-medium',
            name: 'Chembur-Ghatkopar Low Areas',
            risk: 'medium',
            coordinates: [
                [19.065, 72.898], // Chembur
                [19.075, 72.910], // Ghatkopar West
                [19.085, 72.918], // Vikhroli
                [19.078, 72.905], // LBS Marg
                [19.068, 72.895]  // Back
            ],
            population: 28000,
            waterDepth: '1.1m'
        }
    ],
    2: [ // +24 hours - Peak flooding
        {
            id: 'central-mumbai-extreme',
            name: 'Central Mumbai Widespread',
            risk: 'critical',
            coordinates: [
                [19.135, 72.840], // Andheri North
                [19.105, 72.895], // Powai to BKC
                [19.058, 72.898], // Chembur
                [19.015, 72.868], // Parel-Dadar
                [19.025, 72.835], // Worli-Prabhadevi
                [19.080, 72.825]  // Bandra-Khar
            ],
            population: 276000,
            waterDepth: '5.2m in low areas'
        },
        {
            id: 'south-mumbai-coastal',
            name: 'South Mumbai Coastal Strip',
            risk: 'critical',
            coordinates: [
                [18.928, 72.818], // Colaba
                [18.918, 72.828], // Cuffe Parade
                [18.935, 72.835], // Nariman Point
                [18.948, 72.828], // Marine Drive
                [18.938, 72.815]  // Back
            ],
            population: 42000,
            waterDepth: '3.5m high tide surge'
        },
        {
            id: 'western-express-highway',
            name: 'Western Express Highway Belt',
            risk: 'high',
            coordinates: [
                [19.228, 72.852], // Borivali
                [19.205, 72.865], // Kandivali
                [19.178, 72.855], // Malad
                [19.158, 72.848], // Goregaon
                [19.190, 72.840]  // Back
            ],
            population: 58000,
            waterDepth: '2.1m'
        },
        {
            id: 'thane-creek-area',
            name: 'Thane Creek Mankhurd',
            risk: 'high',
            coordinates: [
                [19.052, 72.928], // Mankhurd
                [19.042, 72.945], // Trombay
                [19.028, 72.940], // Chembur Creek
                [19.035, 72.920], // Govandi
                [19.048, 72.918]  // Back
            ],
            population: 38000,
            waterDepth: '1.8m'
        }
    ],
    3: [ // +7 days - Receding but still dangerous
        {
            id: 'mithi-residual-medium',
            name: 'Mithi River Corridor',
            risk: 'medium',
            coordinates: [
                [19.090, 72.870], // Kurla
                [19.078, 72.882], // BKC
                [19.065, 72.878], // Kalina
                [19.070, 72.865]  // Back
            ],
            population: 45000,
            waterDepth: '0.9m'
        },
        {
            id: 'low-lying-suburbs-medium',
            name: 'Low-Lying Suburban Pockets',
            risk: 'medium',
            coordinates: [
                [19.045, 72.850], // Dadar-Parel
                [19.035, 72.860], // Matunga
                [19.025, 72.855], // Wadala
                [19.030, 72.845]  // Prabhadevi
            ],
            population: 32000,
            waterDepth: '0.7m'
        },
        {
            id: 'recovery-areas-low',
            name: 'Recovery Phase Areas',
            risk: 'low',
            coordinates: [
                [19.175, 72.850], // Malad
                [19.165, 72.860], // Goregaon
                [19.155, 72.855], // Jogeshwari
                [19.165, 72.845]  // Back
            ],
            population: 12000,
            waterDepth: '0.3m'
        }
    ]
};

const FloodPredictionMap = ({ userLocation, timeline = 0 }) => {
    const [currentZones, setCurrentZones] = useState([]);

    useEffect(() => {
        // Update flood zones based on timeline
        const timelineKey = parseInt(timeline);
        setCurrentZones(floodZonesData[timelineKey] || floodZonesData[0]);
    }, [timeline]);

    // Color mapping for risk levels
    const getRiskColor = (risk) => {
        switch (risk) {
            case 'critical':
                return { fillColor: '#dc2626', color: '#b91c1c', fillOpacity: 0.5 };
            case 'high':
                return { fillColor: '#f97316', color: '#ea580c', fillOpacity: 0.4 };
            case 'medium':
                return { fillColor: '#eab308', color: '#ca8a04', fillOpacity: 0.3 };
            case 'low':
                return { fillColor: '#3b82f6', color: '#2563eb', fillOpacity: 0.2 };
            default:
                return { fillColor: '#6b7280', color: '#4b5563', fillOpacity: 0.2 };
        }
    };

    const defaultCenter = [19.0760, 72.8777]; // Mumbai center (Mithi River area)

    return (
        <div className="relative w-full h-[500px] rounded-xl overflow-hidden">
            <MapContainer
                center={userLocation ? [userLocation.latitude, userLocation.longitude] : defaultCenter}
                zoom={11}
                style={{ height: '100%', width: '100%' }}
                zoomControl={true}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                />

                {userLocation && <MapUpdater userLocation={userLocation} />}

                {/* User Location Marker */}
                {userLocation && (
                    <Circle
                        center={[userLocation.latitude, userLocation.longitude]}
                        radius={500}
                        pathOptions={{
                            color: '#06b6d4',
                            fillColor: '#06b6d4',
                            fillOpacity: 0.3,
                            weight: 2
                        }}
                    >
                        <Popup>
                            <div className="text-black">
                                <strong>Your Location</strong>
                                <div className="text-xs">
                                    {userLocation.latitude.toFixed(4)}, {userLocation.longitude.toFixed(4)}
                                </div>
                            </div>
                        </Popup>
                    </Circle>
                )}

                {/* Flood Risk Zones */}
                {currentZones.map((zone) => (
                    <Polygon
                        key={zone.id}
                        positions={zone.coordinates}
                        pathOptions={getRiskColor(zone.risk)}
                    >
                        <Popup>
                            <div className="text-black min-w-[200px]">
                                <div className="font-bold text-sm mb-1">{zone.name}</div>
                                <div className="text-xs space-y-1">
                                    <div className="flex justify-between">
                                        <span className="font-semibold">Risk Level:</span>
                                        <span className={`uppercase font-bold ${
                                            zone.risk === 'critical' ? 'text-red-600' :
                                            zone.risk === 'high' ? 'text-orange-600' :
                                            zone.risk === 'medium' ? 'text-yellow-600' :
                                            'text-blue-600'
                                        }`}>
                                            {zone.risk}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="font-semibold">Water Depth:</span>
                                        <span>{zone.waterDepth}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="font-semibold">Affected:</span>
                                        <span>{zone.population.toLocaleString()} people</span>
                                    </div>
                                </div>
                            </div>
                        </Popup>
                    </Polygon>
                ))}
            </MapContainer>

            {/* Legend */}
            <div className="absolute bottom-4 right-4 bg-black/90 backdrop-blur-xl border border-white/20 rounded-lg p-3 text-xs z-[1000]">
                <div className="font-bold text-white mb-2 text-[10px] uppercase tracking-wide">Risk Levels</div>
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded border-2 border-red-700 bg-red-600/50"></div>
                        <span className="text-white">Critical</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded border-2 border-orange-700 bg-orange-600/40"></div>
                        <span className="text-white">High</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded border-2 border-yellow-700 bg-yellow-600/30"></div>
                        <span className="text-white">Medium</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded border-2 border-blue-700 bg-blue-600/20"></div>
                        <span className="text-white">Low</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FloodPredictionMap;
