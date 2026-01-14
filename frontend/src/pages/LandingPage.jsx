import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Activity, Globe, Zap, Users, BarChart3, AlertTriangle, CheckCircle, Radio, ArrowRight, Server, Database, Layers, Satellite } from 'lucide-react';
import CardSwap, { Card } from '../components/CardSwap';
import { motion, useMotionValue, useMotionTemplate } from 'framer-motion';

const LandingPage = ({ onSystemInitialize }) => {
    const navigate = useNavigate();
    return (
        <div className="w-full text-white font-sans selection:bg-cyan-500/30">
            {/* Hero Spacer - Strictly Left Aligned */}
            <div className="min-h-screen w-full flex pointer-events-none relative z-10">



                {/* Left Content Zone - 55% Width with Gradient backing */}
                <div className="w-full md:w-[60%] h-full flex flex-col justify-center px-6 md:px-24 bg-gradient-to-r from-black/80 via-black/80 to-transparent pointer-events-auto py-20 mt-10 md:mt-0 relative z-10">

                    <div className="inline-flex items-center gap-3 px-4 py-1.5 w-fit border border-cyan-500/20 bg-cyan-950/10 rounded-full text-cyan-400 text-xs font-mono mb-8 backdrop-blur-md">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                        </span>
                        SYSTEM ONLINE // ZYND.AI
                    </div>

                    <h1 className="font-display text-5xl md:text-8xl font-bold tracking-tight mb-6 text-white leading-[0.95] uppercase">
                        Planetary <br />
                        <span className="text-cyan-400">Resilience</span>
                    </h1>

                    <h2 className="text-xl md:text-2xl text-white font-medium mb-6 tracking-wide">
                        AI-powered global flood prediction and emergency coordination system
                    </h2>

                    <p className="text-base md:text-lg text-gray-400 max-w-xl font-normal mb-10 leading-relaxed border-l-2 border-cyan-500/20 pl-6">
                        Advanced crisis coordination and real-time planetary monitoring for next-generation disaster response. Predict floods early, deploy resources intelligently, and protect lives with verified AI agents.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-5">
                        <button
                            onClick={onSystemInitialize}
                            className="group px-8 py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-bold tracking-widest uppercase text-sm rounded-sm transition-all shadow-[0_0_20px_rgba(6,182,212,0.2)] hover:shadow-[0_0_40px_rgba(6,182,212,0.4)] flex items-center justify-center gap-3"
                        >
                            Initialize System
                            <Zap size={18} className="fill-current" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Content Sections */}
            <div className="relative z-20 bg-[#050505] border-t border-white/5 shadow-[0_-50px_100px_rgba(0,0,0,1)]">

                {/* 1. AGENT WORKFLOW (Replacing Floating Labels) */}
                <section className="py-24 px-6 md:px-20 max-w-[1400px] mx-auto border-b border-white/5">
                    <div className="mb-16">
                        <h3 className="text-cyan-500 font-mono text-xs tracking-[0.2em] uppercase mb-4">System Architecture</h3>
                        <h2 className="font-display text-4xl font-bold text-white mb-2">Autonomous Agent Workflow</h2>
                        <p className="text-gray-400 max-w-2xl">Distributed intelligence pipeline for verified decision making.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-12 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-900/0 via-cyan-900/50 to-cyan-900/0 z-0"></div>

                        {[
                            {
                                title: "Prediction Agent",
                                subtitle: "Flood forecasting & anomaly detection",
                                icon: Activity,
                                color: "text-cyan-400"
                            },
                            {
                                title: "Verification Agent",
                                subtitle: "Cross-checks data, reduces false alarms",
                                icon: Shield,
                                color: "text-purple-400"
                            },
                            {
                                title: "Coordination Agent",
                                subtitle: "Connects authorities, NGOs, responders",
                                icon: Users,
                                color: "text-indigo-400"
                            },
                            {
                                title: "Resource Agent",
                                subtitle: "Deploys teams, shelters, aid",
                                icon: Layers,
                                color: "text-blue-400"
                            },
                            {
                                title: "Community Agent",
                                subtitle: "Sends trusted, location-based warnings",
                                icon: Radio,
                                color: "text-amber-400"
                            },
                        ].map((agent, i) => (
                            <div key={i} className="relative z-10 group">
                                <div className="h-24 flex items-end mb-6 pl-4 pb-2">
                                    <div className={`p-3 rounded-lg bg-[#0a0a0a] border border-white/10 group-hover:border-cyan-500/50 transition-colors shadow-lg`}>
                                        <agent.icon className={agent.color} size={24} />
                                    </div>
                                </div>
                                <div className="px-4 border-l border-white/10 group-hover:border-white/30 transition-colors h-full">
                                    <h4 className="font-bold text-lg mb-2 text-gray-100">{agent.title}</h4>
                                    <p className="text-sm text-gray-500 leading-relaxed">{agent.subtitle}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 2. TACTICAL INTELLIGENCE (Split Layout) */}
                <section className="py-24 px-6 md:px-20 max-w-[1400px] mx-auto flex flex-col lg:flex-row items-center gap-16">

                    {/* Left Column: Static Content */}
                    <div className="w-full lg:w-1/2 space-y-10">
                        <div>
                            <h2 className="font-display text-6xl font-bold text-white mb-6 leading-[0.9]">
                                TACTICAL <br />
                                INTELLIGENCE
                            </h2>
                            <p className="text-gray-400 text-lg leading-relaxed max-w-lg border-l-2 border-white/10 pl-6">
                                SankatSaathi unifies global data streams into a single command interface. Deploy assets, analyze risks, and coordinate responses with military-grade precision.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            <div className="bg-[#0a0a0a] border border-white/10 p-6 rounded-xl flex items-start gap-4 hover:border-white/20 transition-colors">
                                <Globe className="text-white mt-1" size={24} />
                                <div>
                                    <h4 className="text-white font-bold mb-1">Global Coverage</h4>
                                    <p className="text-sm text-gray-500">Satellite-linked monitoring spanning 190+ countries.</p>
                                </div>
                            </div>
                            <div className="bg-[#0a0a0a] border border-white/10 p-6 rounded-xl flex items-start gap-4 hover:border-white/20 transition-colors">
                                <Activity className="text-red-500 mt-1" size={24} />
                                <div>
                                    <h4 className="text-white font-bold mb-1">Live Telemetry</h4>
                                    <p className="text-sm text-gray-500">Sub-second latency on incident reporting.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Interactive CardSwap */}
                    <div className="w-full lg:w-1/2 h-[600px] flex items-center justify-center">
                        <CardSwap delay={6000}>
                            {/* Card 1: Threat Prediction */}
                            <Card className="flex flex-col bg-[#050505] p-8 border border-white/10">
                                <div className="mb-8">
                                    <span className="text-xs font-mono text-red-500 uppercase tracking-widest mb-2 block">Module 01</span>
                                    <h3 className="text-4xl font-display font-bold text-white mb-4">Threat Prediction</h3>
                                    <p className="text-gray-400 leading-relaxed text-lg">
                                        AI-driven algorithms forecast potential crisis escalation before it happens.
                                    </p>
                                </div>
                                <div className="mt-auto">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); navigate('/prediction'); }}
                                        className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-white hover:text-red-500 transition-colors group"
                                    >
                                        Analyze Data <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </Card>

                            {/* Card 2: Resource Allocation */}
                            <Card className="flex flex-col bg-[#050505] p-8 border border-white/10">
                                <div className="mb-8">
                                    <span className="text-xs font-mono text-blue-500 uppercase tracking-widest mb-2 block">Module 02</span>
                                    <h3 className="text-4xl font-display font-bold text-white mb-4">Resource Grid</h3>
                                    <p className="text-gray-400 leading-relaxed text-lg">
                                        Optimize fleet deployment with real-time route analysis and asset tracking.
                                    </p>
                                </div>
                                <div className="mt-auto">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); navigate('/coordination'); }}
                                        className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-white hover:text-blue-500 transition-colors group"
                                    >
                                        Deploy Units <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </Card>

                            {/* Card 3: Community Alert */}
                            <Card className="flex flex-col bg-[#050505] p-8 border border-white/10">
                                <div className="mb-8">
                                    <span className="text-xs font-mono text-amber-500 uppercase tracking-widest mb-2 block">Module 03</span>
                                    <h3 className="text-4xl font-display font-bold text-white mb-4">Broadcast Net</h3>
                                    <p className="text-gray-400 leading-relaxed text-lg">
                                        Mass-communication protocols for rapid civilian evacuation warnings.
                                    </p>
                                </div>
                                <div className="mt-auto">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); navigate('/public-alerts'); }}
                                        className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-white hover:text-amber-500 transition-colors group"
                                    >
                                        Send Alert <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </Card>
                        </CardSwap>
                    </div>
                </section>

                {/* 3. THE UNIFIED GRID (Architecture) */}
                <section className="py-24 px-6 md:px-20 max-w-[1400px] mx-auto">
                    <div className="mb-20 text-center">
                        <span className="text-red-600 font-mono text-xs tracking-[0.3em] uppercase block mb-4">Architecture</span>
                        <h2 className="font-display text-5xl md:text-6xl font-bold text-white mb-6 uppercase">The Unified Grid</h2>
                        <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
                            Seamless integration between ground units, command centers, and AI infrastructure.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Card 1: Detection */}
                        <SpotlightCard spotlightColor="rgba(6, 182, 212, 0.2)" className="rounded-3xl p-10 bg-[#080808]">
                            <div className="mb-8 text-white group-hover:text-cyan-400 transition-colors bg-white/5 p-4 rounded-full w-fit group-hover:bg-cyan-500/10 relative z-10">
                                <Satellite size={32} />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-3 relative z-10">Detection Layer</h3>
                            <p className="text-gray-500 leading-relaxed text-sm relative z-10">
                                IoT sensors, satellite imagery, and public reports fuse to identify threats instantly.
                            </p>
                        </SpotlightCard>

                        {/* Card 2: Analysis (Highlighted) */}
                        <SpotlightCard spotlightColor="rgba(220, 38, 38, 0.25)" className="rounded-3xl p-10 bg-[#0f0505] border-red-900/30 shadow-[0_0_50px_rgba(220,38,38,0.1)]">
                            <div className="absolute inset-0 bg-gradient-to-br from-red-900/10 to-transparent opacity-50 z-0"></div>
                            <div className="relative z-10">
                                <div className="mb-8 text-red-500 p-3 bg-red-500/10 rounded-full w-fit">
                                    <Activity size={32} />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-3">Analysis Engine</h3>
                                <p className="text-gray-400 leading-relaxed text-sm">
                                    AI algorithms process severity and recommend optimal response strategies.
                                </p>
                            </div>
                        </SpotlightCard>

                        {/* Card 3: Response */}
                        <SpotlightCard spotlightColor="rgba(16, 185, 129, 0.2)" className="rounded-3xl p-10 bg-[#080808]">
                            <div className="mb-8 text-white group-hover:text-emerald-400 transition-colors bg-white/5 p-4 rounded-full w-fit group-hover:bg-emerald-500/10 relative z-10">
                                <Globe size={32} />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-3 relative z-10">Response Grid</h3>
                            <p className="text-gray-500 leading-relaxed text-sm relative z-10">
                                Autonomous assignment of nearest responders and resource tracking.
                            </p>
                        </SpotlightCard>
                    </div>
                </section>



                {/* Footer */}
                <footer className="border-t border-white/10 bg-black py-12 px-6 text-center">
                    <div className="flex justify-center items-center gap-2 mb-4 opacity-50">
                        <Shield size={14} />
                        <span className="text-xs font-mono tracking-widest text-gray-400">VERIFIED BY ZYND.AI AGENTS</span>
                    </div>
                    <p className="text-xs text-gray-600">&copy; 2026 Flood Resilience Network. Mission Critical Interface.</p>
                </footer>
            </div>
        </div>
    );
};

// Icon adjustment for generic Truck usage
const TruckIcon = (props) => (
    <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M10 17h4V5H2v12h3" />
        <path d="M20 17h2v-3.34a4 4 0 0 0-1.17-2.83L19 9h-5" />
        <path d="M14 17h1" />
        <circle cx="7.5" cy="17.5" r="2.5" />
        <circle cx="17.5" cy="17.5" r="2.5" />
    </svg>
);

// Spotlight Card Component Helper
function SpotlightCard({ children, className = "", spotlightColor = "rgba(255, 255, 255, 0.1)" }) {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    function handleMouseMove({ currentTarget, clientX, clientY }) {
        const { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    }

    return (
        <div
            className={`group relative border border-white/5 overflow-hidden ${className}`}
            onMouseMove={handleMouseMove}
        >
            <motion.div
                className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100 z-0"
                style={{
                    background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              ${spotlightColor},
              transparent 80%
            )
          `,
                }}
            />
            {children}
        </div>
    );
}

export default LandingPage;
