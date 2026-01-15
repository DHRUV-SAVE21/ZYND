import React, { useState, useEffect } from 'react';
import { AlertTriangle, Clock, Radio, ShieldAlert, Activity, BarChart3, Zap, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const EarlyWarningPanel = () => {
    const [timeLeft, setTimeLeft] = useState(14400); // 4 hours in seconds
    const [phase, setPhase] = useState('WARNING'); // MONITORING, WARNING, EVACUATION
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => prev > 0 ? prev - 1 : 0);
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 md:left-auto md:top-auto md:bottom-6 md:right-6 z-50 pointer-events-none flex justify-center md:block">
            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 50 }}
                        className="bg-black/90 backdrop-blur-xl border border-red-500/50 p-6 rounded-2xl shadow-[0_0_30px_rgba(239,68,68,0.2)] w-80 pointer-events-auto"
                    >
                        {/* Header */}
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-2">
                                <span className="relative flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                                </span>
                                <h3 className="text-white font-bold font-display tracking-wide">EARLY WARNING</h3>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="bg-red-500/20 text-red-400 text-[10px] font-bold px-2 py-0.5 rounded border border-red-500/30">
                                    LEVEL 3
                                </span>
                                <button 
                                    onClick={() => setIsVisible(false)}
                                    className="text-gray-400 hover:text-white transition-colors p-1 hover:bg-white/10 rounded"
                                    title="Close"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        </div>

                {/* Countdown */}
                <div className="text-center py-4 border-y border-white/10 mb-4 bg-red-950/20 rounded-lg">
                    <div className="text-xs text-red-300 uppercase tracking-widest mb-1 flex items-center justify-center gap-2">
                        <Clock size={12} /> Time to Impact
                    </div>
                    <div className="text-4xl font-mono font-bold text-white tabular-nums">
                        {formatTime(timeLeft)}
                    </div>
                </div>

                {/* Status List */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Status</span>
                        <span className="text-orange-400 font-bold uppercase">Evacuation Prep</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Comms</span>
                        <span className="text-green-400 font-bold uppercase flex items-center gap-1">
                            <Radio size={12} /> Active
                        </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Units</span>
                        <span className="text-blue-400 font-bold uppercase">Mobilizing</span>
                    </div>
                </div>

                {/* Action Button */}
                <button className="w-full mt-6 bg-red-600 hover:bg-red-500 text-white font-bold py-3 rounded-lg uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(220,38,38,0.4)] mb-4">
                    <ShieldAlert size={16} /> Broadcast Alert
                </button>

                {/* Quick Navigation Hub */}
                <div className="grid grid-cols-4 gap-2 pt-4 border-t border-white/10">
                    <a href="/prediction" title="Prediction" className="flex flex-col items-center gap-1 group cursor-pointer hover:bg-white/5 p-2 rounded transition-colors">
                        <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/50 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                            <Activity size={14} />
                        </div>
                        <span className="text-[9px] text-gray-400 uppercase font-bold">Risk</span>
                    </a>
                    <a href="/public-alerts" title="Public Alerts" className="flex flex-col items-center gap-1 group cursor-pointer hover:bg-white/5 p-2 rounded transition-colors">
                        <div className="w-8 h-8 rounded-lg bg-green-500/20 border border-green-500/50 flex items-center justify-center text-green-400 group-hover:scale-110 transition-transform">
                            <Radio size={14} />
                        </div>
                        <span className="text-[9px] text-gray-400 uppercase font-bold">Alert</span>
                    </a>
                    <a href="/analytics" title="Analytics" className="flex flex-col items-center gap-1 group cursor-pointer hover:bg-white/5 p-2 rounded transition-colors">
                        <div className="w-8 h-8 rounded-lg bg-orange-500/20 border border-orange-500/50 flex items-center justify-center text-orange-400 group-hover:scale-110 transition-transform">
                            <BarChart3 size={14} />
                        </div>
                        <span className="text-[9px] text-gray-400 uppercase font-bold">Data</span>
                    </a>
                    <a href="/resources" title="Resources" className="flex flex-col items-center gap-1 group cursor-pointer hover:bg-white/5 p-2 rounded transition-colors">
                        <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-500/50 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                            <Zap size={14} />
                        </div>
                        <span className="text-[9px] text-gray-400 uppercase font-bold">Units</span>
                    </a>
                    </div>

                </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default EarlyWarningPanel;
