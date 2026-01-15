import React, { useState } from 'react';
import { Shield, MapPin, Radio, AlertOctagon, CheckCircle, Navigation, Search, Menu } from 'lucide-react';
import { motion } from 'framer-motion';

// Mock Alert Data
const alerts = [
    { id: 1, type: 'critical', location: 'Riverside District', message: 'Flash Flood Warning. Evacuate immediately to higher ground.', time: '10 min ago' },
    { id: 2, type: 'warning', location: 'North Bridge Area', message: 'Water levels rising rapidly. Avoid all bridge crossings.', time: '25 min ago' },
    { id: 3, type: 'safe', location: 'City Center', message: 'Zone Verified Safe. Relief camp operational at Central School.', time: '1h ago' },
];

const PublicAlertsPage = () => {
    const [filter, setFilter] = useState('all');

    return (
        <div className="min-h-screen bg-transparent text-white pt-24 pb-20 md:pb-0">

            {/* Mobile-Friendly Header */}
            <div className="bg-black/60 backdrop-blur-xl text-white p-4 sticky top-0 z-50 border-b border-white/10">
                <div className="flex justify-between items-center max-w-2xl mx-auto">
                    <div className="flex items-center gap-2">
                        <Radio className="text-red-500 animate-pulse" />
                        <h1 className="font-bold text-lg tracking-wide">ZYND ALERT NET</h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <select className="bg-white/10 text-xs rounded border border-white/20 px-2 py-1 outline-none text-white">
                            <option value="en" className="text-black">EN</option>
                            <option value="hi" className="text-black">HI</option>
                            <option value="es" className="text-black">ES</option>
                        </select>
                        <button className="p-2 bg-white/10 rounded-full">
                            <Menu size={20} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-2xl mx-auto p-4 md:p-6 space-y-6">

                {/* Safety Check Status Card */}
                <div className="bg-black/60 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-white/10 border-l-4 border-l-green-500">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-green-500/10 rounded-full text-green-500">
                            <CheckCircle size={24} />
                        </div>
                        <div>
                            <h2 className="font-bold text-white text-lg">You are in a SAFE ZONE</h2>
                            <p className="text-gray-400 text-sm mt-1">Based on your GPS location (Accuracy: 15m)</p>
                            <div className="mt-4 flex gap-3">
                                <button className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg font-medium text-sm hover:bg-green-700 transition-colors shadow-green-900/20 shadow-lg">
                                    I'm Safe
                                </button>
                                <button className="flex-1 bg-white/10 text-gray-200 py-2 px-4 rounded-lg font-medium text-sm hover:bg-white/20 transition-colors border border-white/5">
                                    Report Incident
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Live Map Preview */}
                {/* Live Map Preview & Evacuation Routes */}
                <div className="bg-black/80 h-64 rounded-2xl relative overflow-hidden group shadow-md border border-white/10">
                    {/* Background Map */}
                    <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/0,0,2/600x300?access_token=pk.mock')] bg-cover opacity-60 grayscale group-hover:grayscale-0 transition-all duration-700"></div>

                    {/* Canvas/SVG Layer for Routes */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none">
                        {/* Route Path 1 (Danger to Safe) */}
                        <motion.path
                            d="M 100 200 Q 250 150 400 100"
                            fill="transparent"
                            stroke="#22c55e"
                            strokeWidth="4"
                            strokeDasharray="8 8"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 2, repeat: Infinity }}
                        />
                        {/* Start Point (User) */}
                        <circle cx="100" cy="200" r="6" fill="#ef4444" className="animate-pulse" />

                        {/* End Point (Safe Zone) */}
                        <circle cx="400" cy="100" r="12" fill="#22c55e" opacity="0.3" />
                        <circle cx="400" cy="100" r="6" fill="#22c55e" />
                    </svg>

                    {/* Labels */}
                    <div className="absolute top-4 right-4 bg-black/80 backdrop-blur px-3 py-1 rounded-lg text-xs font-bold shadow-sm flex items-center gap-2 border border-white/10 text-green-400">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div> Safe Zone (2.4km)
                    </div>
                    <div className="absolute bottom-4 left-4 bg-red-900/90 text-white backdrop-blur px-3 py-1 rounded-lg text-xs font-bold shadow-sm flex items-center gap-2 border border-red-500/30">
                        <Navigation size={12} /> Evacuation Route Active
                    </div>
                </div>

                {/* Alert Feed */}
                <div>
                    <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                        <AlertOctagon size={18} className="text-red-500" /> Live Alerts ({alerts.length})
                    </h3>

                    <div className="space-y-4">
                        {alerts.map(alert => (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                key={alert.id}
                                className={`p-5 rounded-xl border border-white/10 shadow-sm bg-black/60 backdrop-blur-md relative overflow-hidden`}
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

                                <p className="text-gray-300 font-medium leading-relaxed">
                                    {alert.message}
                                </p>

                                {alert.type === 'critical' && (
                                    <div className="mt-4 flex gap-2">
                                        <button className="text-xs bg-red-500/10 text-red-500 px-3 py-1.5 rounded-lg font-bold border border-red-500/20 hover:bg-red-500/20 transition-colors">
                                            View Shelter
                                        </button>
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default PublicAlertsPage;
