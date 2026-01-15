import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Map, TrendingUp, CloudRain, Droplets, AlertTriangle, Clock, ChevronRight, Activity, MapPin, Wind, Thermometer, Eye, Users } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';
import FloodPredictionMap from '../components/FloodPredictionMap';

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

const historicalData = [
    { year: '2020', floods: 2 },
    { year: '2021', floods: 4 },
    { year: '2022', floods: 3 },
    { year: '2023', floods: 7 },
    { year: '2024', floods: 5 },
    { year: '2025', floods: 9 },
];

const timelineLabels = ['Now', '+6 Hours', '+24 Hours', '+7 Days'];

const timelineData = {
    0: { // Now
        criticalZones: 3,
        highRiskZones: 2,
        affectedPop: 78000,
        rainfall: 48.5,
        soilSat: 92,
        riverLevel: 3.2
    },
    1: { // +6 hours
        criticalZones: 4,
        highRiskZones: 4,
        affectedPop: 139000,
        rainfall: 55.2,
        soilSat: 96,
        riverLevel: 4.1
    },
    2: { // +24 hours
        criticalZones: 6,
        highRiskZones: 5,
        affectedPop: 276000,
        rainfall: 42.0,
        soilSat: 98,
        riverLevel: 5.8
    },
    3: { // +7 days
        criticalZones: 0,
        highRiskZones: 3,
        affectedPop: 45000,
        rainfall: 18.5,
        soilSat: 75,
        riverLevel: 2.1
    }
};

const PredictionPage = () => {
    const [timeline, setTimeline] = useState(0); // 0 = Now, 1 = +6h, 2 = +24h, 3 = +7d
    const [userLocation, setUserLocation] = useState(null);
    const [locationError, setLocationError] = useState(null);
    const [isLoadingLocation, setIsLoadingLocation] = useState(true);
    const [currentData, setCurrentData] = useState(timelineData[0]);

    // Update current data when timeline changes
    useEffect(() => {
        setCurrentData(timelineData[timeline]);
    }, [timeline]);

    // Get user's actual location
    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    });
                    setIsLoadingLocation(false);
                    console.log('User location detected:', position.coords.latitude, position.coords.longitude);
                },
                (error) => {
                    console.error('Geolocation error:', error.message);
                    setLocationError(error.message);
                    // Fallback to Mumbai coordinates (Mithi River area)
                    setUserLocation({ latitude: 19.0760, longitude: 72.8777 });
                    setIsLoadingLocation(false);
                }
            );
        } else {
            setLocationError('Geolocation not supported');
            // Fallback to Mumbai coordinates (Mithi River area)
            setUserLocation({ latitude: 19.0760, longitude: 72.8777 });
            setIsLoadingLocation(false);
        }
    }, []);

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

                {/* Main Map Visualization - FLOOD ZONES */}
                <div className="lg:col-span-2 bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 relative overflow-hidden">
                    <div className="mb-4 flex justify-between items-start">
                        <div>
                            <h3 className="text-white font-bold mb-1 flex items-center gap-2">
                                <Map className="w-5 h-5 text-cyan-500" /> Flood Risk Prediction Map
                            </h3>
                            <p className="text-xs text-gray-400">Color-Coded Risk Zones • {timelineLabels[timeline]}</p>
                        </div>
                        {isLoadingLocation && (
                            <div className="flex items-center gap-2 text-xs text-gray-400">
                                <div className="animate-spin h-3 w-3 border-2 border-cyan-500 border-t-transparent rounded-full"></div>
                                Detecting location...
                            </div>
                        )}
                        {locationError && (
                            <div className="text-xs text-amber-400 flex items-center gap-1">
                                <MapPin className="w-3 h-3" /> Using default location
                            </div>
                        )}
                        {userLocation && !isLoadingLocation && !locationError && (
                            <div className="text-xs text-green-400 flex items-center gap-1">
                                <MapPin className="w-3 h-3 animate-pulse" /> Your location detected
                            </div>
                        )}
                    </div>

                    {/* Flood Prediction Map with Zones */}
                    {userLocation && (
                        <FloodPredictionMap 
                            userLocation={userLocation}
                            timeline={timeline}
                        />
                    )}

                    {/* Timeline Slider below map */}
                    <div className="mt-4 bg-black/90 backdrop-blur-xl border border-white/10 p-4 rounded-xl">
                        <div className="flex justify-between text-xs text-gray-400 mb-2 font-mono uppercase">
                            <span className={timeline === 0 ? 'text-cyan-400 font-bold' : ''}>Now</span>
                            <span className={timeline === 1 ? 'text-cyan-400 font-bold' : ''}>+6 Hours</span>
                            <span className={timeline === 2 ? 'text-cyan-400 font-bold' : ''}>+24 Hours</span>
                            <span className={timeline === 3 ? 'text-cyan-400 font-bold' : ''}>+7 Days</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="3"
                            step="1"
                            value={timeline}
                            onChange={(e) => setTimeline(parseInt(e.target.value))}
                            className="w-full accent-cyan-500 h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer"
                        />
                        <div className="mt-3 text-center text-sm text-white font-bold">
                            Viewing: {timelineLabels[timeline]}
                        </div>
                    </div>
                </div>

                {/* Risk Metrics Column */}
                <div className="space-y-6">

                    {/* Risk Overview Card */}
                    <div className="bg-[#0a0a0a] border border-red-500/30 rounded-2xl p-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <AlertTriangle size={80} className="text-red-500" />
                        </div>
                        <h3 className="text-gray-400 font-mono text-xs uppercase mb-1">Critical Zones</h3>
                        <div className="text-4xl font-bold text-white mb-2">{currentData.criticalZones}</div>
                        <div className="text-red-400 font-bold mb-4">IMMEDIATE THREAT</div>
                        <div className="flex justify-between items-center text-xs mb-2">
                            <span className="text-gray-400">High Risk Zones</span>
                            <span className="text-orange-400 font-mono font-bold">{currentData.highRiskZones}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-gray-400">Affected Population</span>
                            <span className="text-white font-mono font-bold flex items-center gap-1">
                                <Users size={12} /> {(currentData.affectedPop / 1000).toFixed(0)}K
                            </span>
                        </div>
                    </div>

                    {/* Weather Stats */}
                    <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6">
                        <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                            <CloudRain className="w-5 h-5 text-blue-400" /> Weather Telemetry
                        </h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                                <div className="flex items-center gap-2 text-sm text-gray-400">
                                    <Droplets size={14} className="text-blue-400" />
                                    Rainfall Intensity
                                </div>
                                <div className="text-xl font-bold text-blue-400">{currentData.rainfall} mm/h</div>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                                <div className="flex items-center gap-2 text-sm text-gray-400">
                                    <Activity size={14} className="text-amber-400" />
                                    Soil Saturation
                                </div>
                                <div className="text-xl font-bold text-amber-400">{currentData.soilSat}%</div>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                                <div className="flex items-center gap-2 text-sm text-gray-400">
                                    <TrendingUp size={14} className="text-red-400" />
                                    River Level
                                </div>
                                <div className="text-xl font-bold text-red-400">{currentData.riverLevel}m</div>
                            </div>
                        </div>
                    </div>

                    {/* Predictive Chart */}
                    <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 flex flex-col" style={{ minHeight: '250px' }}>
                        <h3 className="text-white font-bold mb-2 flex items-center gap-2 text-sm">
                            <TrendingUp className="w-4 h-4 text-green-400" /> Water Level Forecast (24h)
                        </h3>
                        <div className="flex-1 w-full" style={{ minHeight: '180px' }}>
                            <ResponsiveContainer width="100%" height={180}>
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

                    {/* Historical Pattern Comparison */}
                    <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6">
                        <h3 className="text-white font-bold mb-4 flex items-center gap-2 text-sm">
                            <Clock className="w-4 h-4 text-purple-400" /> Historical Patterns (Annual Floods)
                        </h3>
                        <ResponsiveContainer width="100%" height={150}>
                            <BarChart data={historicalData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                                <XAxis dataKey="year" stroke="#666" fontSize={10} tickLine={false} />
                                <YAxis stroke="#666" fontSize={10} tickLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#000', borderColor: '#333', color: '#fff' }}
                                />
                                <Bar dataKey="floods" fill="#a855f7" radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                        <div className="mt-3 text-xs text-gray-400 text-center">
                            Trend: <span className="text-red-400 font-bold">+80% increase</span> since 2020
                        </div>
                    </div>

                </div>
            </div>

        </div>
    );
};

export default PredictionPage;
