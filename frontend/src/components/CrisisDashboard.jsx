import React, { useState, useEffect } from 'react';
import { AlertTriangle, Activity, Volume2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import LiveIncidentMap from './LiveIncidentMap';
import IncidentChat from './IncidentChat';
import IncidentReport from './IncidentReport';

const CrisisDashboard = () => {
    const { user } = useAuth();
    const [activeCrises, setActiveCrises] = useState([]);
    const [agencies, setAgencies] = useState([]);
    const [userLocation, setUserLocation] = useState(null);
    const [selectedIncident, setSelectedIncident] = useState(null);
    const [viewMode, setViewMode] = useState('dashboard'); // 'dashboard', 'report', 'details'

    // Initial Data Fetch
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => setUserLocation(pos.coords),
                (err) => console.error("Location access denied.")
            );
        }

        fetchActiveCrises();

        const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:8000';
        const ws = new WebSocket(`${wsUrl}/ws/dashboard`);
        ws.onopen = () => console.log('Connected to Crisis Dispatch');
        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'INITIAL_STATE') {
                setActiveCrises(data.active_crises);
                setAgencies(data.agencies);
            } else if (data.type === 'NEW_CRISIS') {
                setActiveCrises(prev => [...prev, data.crisis]);
            } else if (data.type === 'AGENCY_RESPONSE') {
                setActiveCrises(prev => prev.map(c => c.id === data.crisis_id ? data.crisis : c));
            }
        };

        // Listen for internal updates from components
        const handleMessage = (event) => {
            if (event.data === 'incident-reported') {
                fetchActiveCrises();
            }
        };
        window.addEventListener('message', handleMessage);

        return () => {
            ws.close();
            window.removeEventListener('message', handleMessage);
        };
    }, []);

    const fetchActiveCrises = async () => {
        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
            const res = await fetch(`${apiUrl}/api/crisis/active`);
            const data = await res.json();
            setActiveCrises(data.crises || []);
        } catch (e) {
            console.error("Failed to fetch crises", e);
        }
    };

    return (
        <div className="h-full w-full bg-transparent pt-4 pb-8 px-4 md:px-8 overflow-y-auto lg:overflow-hidden flex flex-col pointer-events-auto text-white">
            <div className="flex-1 flex flex-col lg:flex-row gap-4 lg:gap-8 overflow-visible lg:overflow-hidden">

                {/* LEFT PANEL: MAP & INCIDENT LIST */}
                <div className="w-full lg:flex-[2] flex flex-col gap-4 min-h-[500px] lg:min-h-0">
                    {/* Map */}
                    <div className="flex-1 rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative">
                        <LiveIncidentMap
                            incidents={activeCrises}
                            responders={agencies}
                            userLocation={userLocation}
                        />
                        <div className="absolute top-4 right-4 z-[400] bg-black/80 backdrop-blur-md px-3 py-1 rounded border border-white/10 text-[10px] text-cyan-400 font-mono uppercase">
                            Satellite Link: Active
                        </div>
                    </div>

                    {/* Active Incident List */}
                    <div className="h-[200px] bg-gray-900/80 backdrop-blur rounded-xl p-4 border border-white/10 overflow-y-auto custom-scrollbar">
                        <h3 className="text-sm font-bold mb-2 flex items-center gap-2 uppercase tracking-wider text-red-500">
                            <Activity size={16} /> Active Zones ({activeCrises.length})
                        </h3>
                        <div className="grid grid-cols-2 gap-2">
                            {activeCrises.map(c => (
                                <div
                                    key={c.id}
                                    onClick={() => { setSelectedIncident(c); setViewMode('details'); }}
                                    className={`p-3 rounded border cursor-pointer transition-all ${selectedIncident?.id === c.id ? 'bg-red-900/40 border-red-500' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}
                                >
                                    <div className="font-bold text-sm truncate">{c.title}</div>
                                    <div className="text-[10px] text-gray-400 flex justify-between">
                                        <span>{c.type}</span>
                                        <span className={`uppercase font-bold ${c.severity === 'critical' ? 'text-red-500' : 'text-yellow-500'}`}>{c.severity}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* RIGHT PANEL: DETAILS, CHAT, OR REPORT FORM */}
                <div className="flex-1 flex flex-col gap-4 bg-gray-900/90 backdrop-blur rounded-2xl p-4 border border-white/10 shadow-2xl overflow-hidden">

                    {/* Mode Switcher */}
                    <div className="flex border-b border-gray-700 pb-2 mb-2">
                        <button
                            onClick={() => { setSelectedIncident(null); setViewMode('report'); }}
                            className={`flex-1 pb-2 text-sm font-bold uppercase tracking-wider ${viewMode === 'report' ? 'text-red-500 border-b-2 border-red-500' : 'text-gray-500 hover:text-white'}`}
                        >
                            Report Incident
                        </button>
                        <button
                            onClick={() => setViewMode('details')}
                            className={`flex-1 pb-2 text-sm font-bold uppercase tracking-wider ${viewMode === 'details' || selectedIncident ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500 hover:text-white'}`}
                        >
                            Incident Details
                        </button>
                    </div>

                    {viewMode === 'details' && selectedIncident ? (
                        <>
                            <div className="border-b border-gray-700 pb-4">
                                <h2 className="text-xl font-bold text-red-500 mb-1">{selectedIncident.title}</h2>
                                <p className="text-sm text-gray-300 mb-2">{selectedIncident.description}</p>
                                <div className="flex gap-2 text-[10px] font-mono uppercase">
                                    <span className="bg-gray-800 px-2 py-1 rounded text-red-400">Sev: {selectedIncident.severity}</span>
                                    <span className="bg-gray-800 px-2 py-1 rounded text-blue-400">Status: {selectedIncident.status}</span>
                                </div>
                                {selectedIncident.ai_analysis && (
                                    <div className="mt-3 bg-blue-900/20 p-3 rounded border border-blue-500/30 text-sm">
                                        <strong className="text-blue-400 block mb-2 flex items-center gap-2">
                                            <Activity size={14} /> AI Tactical Analysis:
                                        </strong>
                                        <div className="space-y-2">
                                            {selectedIncident.ai_analysis.predicted_peak && (
                                                <div className="text-gray-300">
                                                    <span className="text-gray-500">Predicted Peak:</span> {new Date(selectedIncident.ai_analysis.predicted_peak).toLocaleString()}
                                                </div>
                                            )}
                                            {selectedIncident.ai_analysis.affected_area_km2 && (
                                                <div className="text-gray-300">
                                                    <span className="text-gray-500">Affected Area:</span> {selectedIncident.ai_analysis.affected_area_km2} km²
                                                </div>
                                            )}
                                            {selectedIncident.ai_analysis.population_at_risk && (
                                                <div className="text-gray-300">
                                                    <span className="text-gray-500">Population at Risk:</span> {selectedIncident.ai_analysis.population_at_risk.toLocaleString()} people
                                                </div>
                                            )}
                                            {selectedIncident.ai_analysis.evacuation_priority && (
                                                <div className="text-orange-400 font-bold">
                                                    Evacuation Priority: {selectedIncident.ai_analysis.evacuation_priority.toUpperCase()}
                                                </div>
                                            )}
                                            {selectedIncident.ai_analysis.water_rise_rate_cm_per_hour && (
                                                <div className="text-red-400 font-bold" title="Water level rising at this rate - critical flood indicator">
                                                    💧 Water Rise Rate: {selectedIncident.ai_analysis.water_rise_rate_cm_per_hour} cm/hour
                                                    <span className="text-xs text-gray-400 ml-2">(centimeters per hour)</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* CHAT ROOM */}
                            <div className="flex-1 overflow-hidden flex flex-col">
                                <div className="text-xs font-bold text-gray-500 uppercase mb-2">Secure Channel</div>
                                <IncidentChat incidentId={selectedIncident.id} />
                            </div>
                        </>
                    ) : viewMode === 'report' ? (
                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                            <div className="flex-1 overflow-y-auto custom-scrollbar">
                                <IncidentReport onSuccess={async (newId) => {
                                    // Refresh data
                                    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
                                    const res = await fetch(`${apiUrl}/api/crisis/active`);
                                    const data = await res.json();
                                    const freshList = data.crises || [];
                                    setActiveCrises(freshList);

                                    // Select new incident
                                    if (newId) {
                                        const match = freshList.find(i => i.id === newId);
                                        if (match) setSelectedIncident(match);
                                    }
                                    setViewMode('details');
                                }} />
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-4">
                            <AlertTriangle size={48} className="opacity-20" />
                            <div className="text-center">
                                <p className="font-bold">NO SECTOR SELECTED</p>
                                <p className="text-xs">Select an incident to view details.</p>
                                <button onClick={() => setViewMode('report')} className="mt-4 px-4 py-2 bg-red-600 text-white text-sm font-bold rounded hover:bg-red-500">
                                    REPORT NEW INCIDENT
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CrisisDashboard;