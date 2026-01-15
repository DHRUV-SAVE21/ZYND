import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Map, TrendingUp, CloudRain, Droplets, AlertTriangle, Clock, ChevronRight, Activity } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

// Mock Data for Charts
const floodData = [
    { time: '00:00', level: 2.1, rain: 12 },
    { time: '04:00', level: 2.3, rain: 15 },
    { time: '08:00', level: 2.8, rain: 25 },
    { time: '12:00', level: 3.5, rain: 45 },
    { time: '16:00', level: 4.2, rain: 30 },
    { time: '20:00', level: 4.8, rain: 10 },
    { time: '24:00', level: 5.1, rain: 5 },
];

const PredictionPage = () => {
    const [timeline, setTimeline] = useState(0); // 0 = Now, 1 = +6h, etc.

    return (
        <div className="min-h-screen bg-transparent text-white pt-24 pb-12 px-4 md:px-8 overflow-x-hidden">

            {/* Header */}
            <div className="max-w-7xl mx-auto mb-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                    <div>
                        <div className="flex items-center gap-2 text-cyan-500 font-mono text-xs uppercase tracking-widest mb-2">
                            <Activity className="w-4 h-4" /> Predictive Intelligence
                        </div>
                        <h1 className="text-3xl md:text-5xl font-display font-bold">Flood Prediction Engine</h1>
                        <p className="text-gray-400 mt-2 max-w-xl">
                            AI-driven forecasting using real-time satellite telemetry and sensor fusion.
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <div className="text-sm text-gray-400">Next Update</div>
                            <div className="font-mono text-cyan-400">00:14:59</div>
                        </div>
                        <button className="bg-cyan-900/20 border border-cyan-500/50 text-cyan-400 px-4 py-2 rounded-lg font-bold hover:bg-cyan-900/40 transition-colors">
                            Export Report
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Main Map Visualization (Mock) */}
                <div className="lg:col-span-2 bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-1 relative overflow-hidden h-[400px] md:h-[500px] group">
                    <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/dark-v10/static/0,0,2/800x600?access_token=pk.mock')] bg-cover opacity-50"></div>
                    {/* Custom CSS Grid for "Map" feel if image fails */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]"></div>

                    <div className="absolute top-6 left-6 bg-black/80 backdrop-blur-md border border-white/10 p-4 rounded-xl z-10">
                        <h3 className="text-white font-bold mb-1 flex items-center gap-2">
                            <Map className="w-4 h-4 text-cyan-500" /> Regional Risk Map
                        </h3>
                        <p className="text-xs text-gray-400">Interactive Zones • Live</p>
                    </div>

                    {/* Heatmap Risk Zones Overlay */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-60 mix-blend-screen">
                        {/* Critical Zone (Red) */}
                        <motion.circle
                            cx="70%" cy="40%" r="15%"
                            fill="url(#gradRed)"
                            animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
                            transition={{ duration: 3, repeat: Infinity }}
                        />
                        {/* Warning Zone (Orange) */}
                        <circle cx="40%" cy="60%" r="20%" fill="url(#gradOrange)" opacity="0.4" />
                        {/* Safe Zone (Green) */}
                        <circle cx="20%" cy="30%" r="12%" fill="url(#gradGreen)" opacity="0.3" />

                        <defs>
                            <radialGradient id="gradRed">
                                <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8" />
                                <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
                            </radialGradient>
                            <radialGradient id="gradOrange">
                                <stop offset="0%" stopColor="#f97316" stopOpacity="0.6" />
                                <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
                            </radialGradient>
                            <radialGradient id="gradGreen">
                                <stop offset="0%" stopColor="#22c55e" stopOpacity="0.4" />
                                <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
                            </radialGradient>
                        </defs>
                    </svg>

                    <div className="absolute bottom-6 left-6 right-6 bg-black/90 backdrop-blur-xl border border-white/10 p-4 rounded-xl">
                        <div className="flex justify-between text-xs text-gray-400 mb-2 font-mono uppercase">
                            <span>Now</span>
                            <span>+12 Hours</span>
                            <span>+24 Hours</span>
                            <span>+7 Days</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="3"
                            step="1"
                            value={timeline}
                            onChange={(e) => setTimeline(e.target.value)}
                            className="w-full accent-cyan-500 h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer"
                        />
                    </div>
                </div>

                {/* Risk Metrics Column */}
                <div className="space-y-6">

                    {/* Risk Card 1 */}
                    <div className="bg-[#0a0a0a] border border-red-500/30 rounded-2xl p-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <AlertTriangle size={100} className="text-red-500" />
                        </div>
                        <h3 className="text-gray-400 font-mono text-xs uppercase mb-1">Critical Alert</h3>
                        <div className="text-3xl font-bold text-white mb-2">Sector 4 (North)</div>
                        <div className="text-red-400 font-bold mb-4">98% Overflow Probability</div>
                        <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden mb-4">
                            <div className="h-full bg-red-500 w-[98%]"></div>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-gray-400">Affected Population</span>
                            <span className="text-white font-mono font-bold">1.2M Citizens</span>
                        </div>
                    </div>

                    {/* Weather Stats */}
                    <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6">
                        <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                            <CloudRain className="w-5 h-5 text-blue-400" /> Weather Telemetry
                        </h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                                <div className="text-sm text-gray-400">Rainfall Intensity</div>
                                <div className="text-xl font-bold text-blue-400">45 mm/h</div>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                                <div className="text-sm text-gray-400">Soil Saturation</div>
                                <div className="text-xl font-bold text-amber-400">92%</div>
                            </div>
                        </div>
                    </div>

                    {/* Predictive Chart */}
                    <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 h-[250px] flex flex-col">
                        <h3 className="text-white font-bold mb-2 flex items-center gap-2 text-sm">
                            <TrendingUp className="w-4 h-4 text-green-400" /> Water Level Forecast
                        </h3>
                        <div className="flex-1 w-full min-h-0">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={floodData}>
                                    <defs>
                                        <linearGradient id="colorLevel" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                                    <XAxis dataKey="time" stroke="#666" fontSize={10} tickLine={false} />
                                    <YAxis stroke="#666" fontSize={10} tickLine={false} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#000', borderColor: '#333', color: '#fff' }}
                                        itemStyle={{ color: '#06b6d4' }}
                                    />
                                    <Area type="monotone" dataKey="level" stroke="#06b6d4" fillOpacity={1} fill="url(#colorLevel)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                </div>
            </div>

        </div>
    );
};

export default PredictionPage;
