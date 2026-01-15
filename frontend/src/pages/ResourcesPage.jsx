import React, { useState } from 'react';
import { Truck, Users, Package, Navigation, Zap, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const ResourcesPage = () => {
    const [isDeploying, setIsDeploying] = useState(false);
    const [deployed, setDeployed] = useState(false);

    const handleAutoDeploy = () => {
        setIsDeploying(true);
        setTimeout(() => {
            setIsDeploying(false);
            setDeployed(true);
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-transparent text-white pt-24 pb-12 px-6 md:px-12">

            <div className="max-w-7xl mx-auto mb-10">
                <h1 className="text-4xl font-display font-bold mb-2">Resource Coordination</h1>
                <p className="text-gray-400">Autonomous unit deployment and logistics management.</p>
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* 1. Map View */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl h-[500px] relative overflow-hidden group">
                        {/* Fake Map BG */}
                        <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/dark-v10/static/-122.42,37.78,12/1000x600?access_token=pk.mock')] bg-cover opacity-40 grayscale group-hover:grayscale-0 transition-all duration-700"></div>

                        {/* Overlay Controls */}
                        <div className="absolute top-6 left-6 flex flex-col gap-2">
                            <div className="bg-black/90 p-3 rounded-lg border border-white/10 flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse"></div>
                                <span className="text-sm font-bold">12 Active Convoys</span>
                            </div>
                            <div className="bg-black/90 p-3 rounded-lg border border-white/10 flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                                <span className="text-sm font-bold">3 Pending Requests</span>
                            </div>
                        </div>

                        {/* Deployment Route Lines (SVG Overlay) */}
                        {deployed && (
                            <svg className="absolute inset-0 w-full h-full pointer-events-none">
                                <motion.path
                                    d="M 200 400 Q 400 300 600 200"
                                    fill="transparent"
                                    stroke="#3b82f6"
                                    strokeWidth="3"
                                    strokeDasharray="10 10"
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{ duration: 2 }}
                                />
                                <circle cx="200" cy="400" r="8" fill="#ef4444" /> {/* Incident */}
                                <circle cx="600" cy="200" r="8" fill="#3b82f6" /> {/* Hub */}
                            </svg>
                        )}
                    </div>
                </div>

                {/* 2. Command Panel */}
                <div className="space-y-6">

                    {/* Auto Deploy Card */}
                    <div className="bg-[#0a0a0a] border border-blue-500/30 rounded-2xl p-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Zap size={80} className="text-blue-500" />
                        </div>
                        <h3 className="font-bold text-lg mb-2">AI Optimization</h3>
                        <p className="text-sm text-gray-400 mb-6">Calculate optimal routes and verify asset availability.</p>

                        {!deployed ? (
                            <button
                                onClick={handleAutoDeploy}
                                disabled={isDeploying}
                                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all"
                            >
                                {isDeploying ? (
                                    <>
                                        <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        Calculating...
                                    </>
                                ) : (
                                    <>
                                        <Zap size={18} /> AUTO-DEPLOY UNITS
                                    </>
                                )}
                            </button>
                        ) : (
                            <div className="w-full bg-green-600/20 border border-green-500/50 text-green-400 font-bold py-4 rounded-xl flex items-center justify-center gap-2">
                                <CheckCircle size={18} /> DEPLOYMENT AUTHORIZED
                            </div>
                        )}
                    </div>

                    {/* Resources List */}
                    <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6">
                        <h3 className="font-bold text-lg mb-4">Available Assets</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/5">
                                <div className="flex items-center gap-3">
                                    <Truck size={18} className="text-gray-400" />
                                    <span>Amphibious Trucks</span>
                                </div>
                                <span className="font-mono text-cyan-400">14/20</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/5">
                                <div className="flex items-center gap-3">
                                    <Users size={18} className="text-gray-400" />
                                    <span>Rescue Squads</span>
                                </div>
                                <span className="font-mono text-cyan-400">08/12</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/5">
                                <div className="flex items-center gap-3">
                                    <Package size={18} className="text-gray-400" />
                                    <span>Medical Kits</span>
                                </div>
                                <span className="font-mono text-cyan-400">450</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* NEW: Analytics Section for Resources */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">

                {/* 3. Resource Utilization Charts */}
                <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6">
                    <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                        <Zap className="text-yellow-500" size={20} /> Fleet Utilization Efficiency
                    </h3>
                    <div className="h-[250px] w-full">
                        <div className="space-y-6">
                            {[
                                { label: 'Amphibious Trucks', val: 75, color: 'bg-blue-500' },
                                { label: 'Drone Units', val: 40, color: 'bg-purple-500' },
                                { label: 'Rescue Boats', val: 90, color: 'bg-cyan-500' },
                                { label: 'Medical Convoys', val: 60, color: 'bg-green-500' }
                            ].map((item, i) => (
                                <div key={i}>
                                    <div className="flex justify-between text-sm mb-1 text-gray-400">
                                        <span>{item.label}</span>
                                        <span>{item.val}%</span>
                                    </div>
                                    <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
                                        <div className={`h-full ${item.color}`} style={{ width: `${item.val}%` }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 4. Deployment History Timeline */}
                <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6">
                    <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                        <Navigation className="text-gray-400" size={20} /> Deployment Log (Last 24h)
                    </h3>
                    <div className="space-y-6 relative border-l border-white/10 ml-3 pl-8">
                        {[
                            { time: '14:30', event: 'Unit Alpha-1 dispatched to Sector 4', status: 'In Transit' },
                            { time: '12:15', event: 'Medical supplies delivered to Central Camp', status: 'Completed' },
                            { time: '09:45', event: 'Drone swarm query: North Bridge structural integrity', status: 'Completed' },
                            { time: '08:00', event: 'Shift rotation: Team Bravo active', status: 'Scheduled' }
                        ].map((log, i) => (
                            <div key={i} className="relative">
                                {/* Dot */}
                                <div className={`absolute -left-[39px] top-1 h-3 w-3 rounded-full border border-black ${i === 0 ? 'bg-cyan-500 animate-pulse' : 'bg-gray-600'}`}></div>
                                <div className="text-xs text-gray-500 font-mono mb-1">{log.time}</div>
                                <div className="text-sm text-gray-200">{log.event}</div>
                                <div className={`text-[10px] uppercase font-bold mt-1 ${log.status === 'Completed' ? 'text-green-500' :
                                    log.status === 'In Transit' ? 'text-blue-500' : 'text-gray-500'
                                    }`}>
                                    {log.status}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ResourcesPage;
