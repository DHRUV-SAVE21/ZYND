import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Navigation, MapPin, AlertTriangle, CheckCircle } from 'lucide-react';

// Component to handle route fetching and display
const RoutingLayer = ({ userLocation, safeZone, onRouteCalculated }) => {
    const map = useMap();
    const [routeCoordinates, setRouteCoordinates] = useState([]);
    const [routeInstructions, setRouteInstructions] = useState([]);
    const [distance, setDistance] = useState(null);
    const [duration, setDuration] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!userLocation || !safeZone) return;

        const fetchRoute = async () => {
            setLoading(true);
            try {
                // Using OSRM (Open Source Routing Machine) - free routing service
                const response = await fetch(
                    `https://router.project-osrm.org/route/v1/driving/${userLocation.lon},${userLocation.lat};${safeZone.lon},${safeZone.lat}?overview=full&geometries=geojson&steps=true`
                );
                const data = await response.json();

                if (data.code === 'Ok' && data.routes && data.routes[0]) {
                    const route = data.routes[0];
                    
                    // Extract coordinates
                    const coords = route.geometry.coordinates.map(coord => [coord[1], coord[0]]);
                    setRouteCoordinates(coords);

                    // Extract instructions
                    const steps = route.legs[0].steps.map(step => ({
                        instruction: step.maneuver.type === 'depart' ? 'Start your journey' :
                                   step.maneuver.type === 'arrive' ? 'You have arrived at safe zone' :
                                   step.name || 'Continue',
                        distance: (step.distance / 1000).toFixed(1) + ' km',
                        direction: step.maneuver.modifier || ''
                    }));
                    setRouteInstructions(steps);

                    // Distance and duration
                    setDistance((route.distance / 1000).toFixed(1));
                    setDuration(Math.round(route.duration / 60));

                    // Fit map to route bounds
                    const bounds = L.latLngBounds(coords);
                    map.fitBounds(bounds, { padding: [50, 50] });

                    if (onRouteCalculated) {
                        onRouteCalculated({ steps, distance: route.distance / 1000, duration: route.duration / 60 });
                    }
                }
            } catch (error) {
                console.error('Routing error:', error);
                // Fallback to straight line if routing fails
                setRouteCoordinates([
                    [userLocation.lat, userLocation.lon],
                    [safeZone.lat, safeZone.lon]
                ]);
            } finally {
                setLoading(false);
            }
        };

        fetchRoute();
    }, [userLocation, safeZone, map]);

    if (routeCoordinates.length === 0) return null;

    return (
        <>
            {/* Animated route line */}
            <Polyline
                positions={routeCoordinates}
                pathOptions={{
                    color: '#22c55e',
                    weight: 5,
                    opacity: 0.8,
                    dashArray: '10, 10',
                    className: 'animated-route'
                }}
            />
            {/* Thicker background for better visibility */}
            <Polyline
                positions={routeCoordinates}
                pathOptions={{
                    color: '#000000',
                    weight: 7,
                    opacity: 0.3
                }}
            />
        </>
    );
};

const EvacuationRouteMap = ({ userLocation, locationStatus, nearestSafeZone, safeZoneCoordinates }) => {
    const [routeDetails, setRouteDetails] = useState(null);
    const isDangerZone = locationStatus === 'critical' || locationStatus === 'warning';

    // Custom icons
    const userIcon = new L.DivIcon({
        html: `<div style="background: ${locationStatus === 'critical' ? '#ef4444' : locationStatus === 'warning' ? '#f97316' : '#22c55e'}; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.5);"></div>`,
        className: 'custom-div-icon',
        iconSize: [20, 20],
        iconAnchor: [10, 10]
    });

    const safeZoneIcon = new L.DivIcon({
        html: `<div style="background: #22c55e; width: 30px; height: 30px; border-radius: 50%; border: 4px solid white; box-shadow: 0 0 15px rgba(34, 197, 94, 0.6); display: flex; align-items: center; justify-content: center; font-size: 16px;">✓</div>`,
        className: 'custom-div-icon',
        iconSize: [30, 30],
        iconAnchor: [15, 15]
    });

    return (
        <div className="bg-black/80 h-[500px] rounded-2xl relative overflow-hidden shadow-md border border-white/10">
            {userLocation ? (
                <>
                    {isDangerZone && safeZoneCoordinates ? (
                        <>
                            <MapContainer
                                center={[userLocation.lat, userLocation.lon]}
                                zoom={13}
                                style={{ height: '100%', width: '100%' }}
                                zoomControl={true}
                            >
                                <TileLayer
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    attribution='&copy; OpenStreetMap'
                                />

                                {/* User Location Marker */}
                                <Marker
                                    position={[userLocation.lat, userLocation.lon]}
                                    icon={userIcon}
                                >
                                    <Popup>
                                        <div className="text-center">
                                            <strong className="text-red-600">⚠️ Your Location</strong><br />
                                            <span className="text-xs">Status: {locationStatus.toUpperCase()}</span><br />
                                            <span className="text-xs font-bold text-orange-600">EVACUATE NOW</span>
                                        </div>
                                    </Popup>
                                </Marker>

                                {/* Safe Zone Marker */}
                                <Marker
                                    position={[safeZoneCoordinates.lat, safeZoneCoordinates.lon]}
                                    icon={safeZoneIcon}
                                >
                                    <Popup>
                                        <div className="text-center">
                                            <strong className="text-green-600">✅ Safe Zone</strong><br />
                                            <span className="text-xs">{nearestSafeZone}</span>
                                        </div>
                                    </Popup>
                                </Marker>

                                {/* Routing Layer */}
                                <RoutingLayer
                                    userLocation={userLocation}
                                    safeZone={safeZoneCoordinates}
                                    onRouteCalculated={setRouteDetails}
                                />

                                {/* Danger radius indicator */}
                                <Circle
                                    center={[userLocation.lat, userLocation.lon]}
                                    radius={300}
                                    pathOptions={{
                                        color: locationStatus === 'critical' ? '#ef4444' : '#f97316',
                                        fillColor: locationStatus === 'critical' ? '#ef4444' : '#f97316',
                                        fillOpacity: 0.1,
                                        weight: 2,
                                        dashArray: '5, 5'
                                    }}
                                />
                            </MapContainer>

                            {/* Route Information Overlay */}
                            {routeDetails && (
                                <div className="absolute top-4 left-4 bg-black/95 backdrop-blur px-4 py-3 rounded-lg border border-red-500/50 z-[1000] max-w-xs">
                                    <div className="flex items-center gap-2 text-red-400 font-bold mb-2">
                                        <AlertTriangle size={16} />
                                        <span>EVACUATION ROUTE</span>
                                    </div>
                                    <div className="text-xs space-y-1 text-gray-300">
                                        <div className="flex justify-between">
                                            <span>Distance:</span>
                                            <span className="font-bold text-white">{routeDetails.distance?.toFixed(1)} km</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Est. Time:</span>
                                            <span className="font-bold text-white">{Math.round(routeDetails.duration)} min</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span>Destination:</span>
                                            <CheckCircle size={12} className="text-green-400" />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Turn-by-Turn Directions Panel */}
                            {routeDetails && routeDetails.steps && routeDetails.steps.length > 0 && (
                                <div className="absolute bottom-4 left-4 bg-black/95 backdrop-blur px-4 py-3 rounded-lg border border-white/10 z-[1000] max-w-sm max-h-48 overflow-y-auto">
                                    <div className="flex items-center gap-2 text-green-400 font-bold mb-2 text-xs">
                                        <Navigation size={14} />
                                        <span>TURN-BY-TURN DIRECTIONS</span>
                                    </div>
                                    <div className="space-y-2">
                                        {routeDetails.steps.slice(0, 5).map((step, idx) => (
                                            <div key={idx} className="flex gap-2 text-xs text-gray-300">
                                                <span className="text-green-400 font-bold">{idx + 1}.</span>
                                                <div>
                                                    <div className="font-medium text-white">{step.instruction}</div>
                                                    <div className="text-[10px] text-gray-500">{step.distance}</div>
                                                </div>
                                            </div>
                                        ))}
                                        {routeDetails.steps.length > 5 && (
                                            <div className="text-[10px] text-gray-500 text-center pt-1 border-t border-white/10">
                                                +{routeDetails.steps.length - 5} more steps
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Animated Route Legend */}
                            <div className="absolute bottom-4 right-4 bg-black/95 backdrop-blur px-4 py-3 rounded-lg text-xs font-bold shadow-sm border border-white/10 z-[1000]">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-green-400">
                                        <div className="w-8 h-1 bg-green-500 rounded" style={{ borderTop: '2px dashed' }}></div>
                                        <span>Evacuation Route</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-red-400">
                                        <div className="w-4 h-4 rounded-full bg-red-500 border-2 border-white"></div>
                                        <span>Your Location</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-green-400">
                                        <div className="w-4 h-4 rounded-full bg-green-500 border-2 border-white flex items-center justify-center text-[8px]">✓</div>
                                        <span>Safe Zone</span>
                                    </div>
                                </div>
                            </div>

                            {/* Emergency Warning Banner */}
                            <div className="absolute top-4 right-4 bg-red-600 text-white px-4 py-2 rounded-lg font-bold text-sm shadow-lg animate-pulse z-[1000] flex items-center gap-2 border border-red-400">
                                <AlertTriangle size={16} />
                                <span>EVACUATE IMMEDIATELY</span>
                            </div>
                        </>
                    ) : (
                        // Safe Zone - Show reassurance
                        <div className="flex flex-col items-center justify-center h-full text-center px-6">
                            <div className="bg-green-900/30 border border-green-500/50 rounded-full p-8 mb-4">
                                <CheckCircle size={64} className="text-green-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-green-400 mb-2">You Are Safe</h3>
                            <p className="text-gray-300 text-sm mb-4">
                                Your current location is in a designated safe zone.
                            </p>
                            <div className="bg-black/60 backdrop-blur px-6 py-3 rounded-lg border border-green-500/30">
                                <p className="text-xs text-gray-400">No evacuation needed at this time.</p>
                                <p className="text-xs text-gray-400 mt-1">Continue monitoring alerts for updates.</p>
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                    <div className="text-center">
                        <MapPin size={48} className="mx-auto mb-2 animate-pulse" />
                        <p>Enable location to see evacuation routes</p>
                        <p className="text-xs mt-2 text-gray-500">GPS required for route planning</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EvacuationRouteMap;
