import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, ScatterChart, Scatter, ZAxis, Legend, LineChart, Line } from 'recharts';
import { BarChart3, TrendingUp, AlertTriangle, FileText, Download, Activity, Users } from 'lucide-react';

// Mock Data
const trendData = [
    { year: '2016', incidents: 400 },
    { year: '2017', incidents: 300 },
    { year: '2018', incidents: 550 },
    { year: '2019', incidents: 450 },
    { year: '2020', incidents: 700 }, // Spike
    { year: '2021', incidents: 600 },
    { year: '2022', incidents: 850 }, // Rising trend
    { year: '2023', incidents: 900 },
    { year: '2024', incidents: 800 },
    { year: '2025', incidents: 1050 }, // Current
];

const severityData = [
    { region: 'North', critical: 20, warning: 45, safe: 100 },
    { region: 'East', critical: 55, warning: 30, safe: 80 },
    { region: 'West', critical: 10, warning: 20, safe: 150 },
    { region: 'South', critical: 80, warning: 50, safe: 40 },
];

const accuracyData = [
    { x: 10, y: 30, z: 200 },
    { x: 20, y: 50, z: 260 },
    { x: 30, y: 45, z: 400 },
    { x: 40, y: 80, z: 280 },
    { x: 50, y: 70, z: 500 },
    { x: 60, y: 90, z: 300 },
];

const AnalyticsPage = () => {
    return (
        <div className="min-h-screen bg-transparent text-white pt-24 pb-12 px-6 md:px-12 overflow-x-hidden">

            <div className="max-w-7xl mx-auto mb-10 flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-display font-bold mb-2">Predictive Analytics</h1>
                    <p className="text-gray-400">Historical trends and system performance metrics.</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors text-sm font-bold text-gray-300">
                    <Download size={16} /> Export CSV
                </button>
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* 1. Flood Trends (Line Chart) - INCIDENTS OVER TIME */}
                <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                    <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                        <TrendingUp className="text-cyan-500" size={20} /> Flood Incidents (Line Chart)
                    </h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={trendData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                                <XAxis dataKey="year" stroke="#666" />
                                <YAxis stroke="#666" />
                                <Tooltip contentStyle={{ backgroundColor: '#000', borderColor: '#333' }} />
                                <Legend />
                                <Line type="monotone" dataKey="incidents" stroke="#06b6d4" strokeWidth={3} activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 2. Population at Risk (Area Chart) */}
                <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6">
                    <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                        <Users className="text-orange-500" size={20} /> Population at Risk (Area Chart)
                    </h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={[
                                { year: '2016', pop: 1.2 },
                                { year: '2018', pop: 1.5 },
                                { year: '2020', pop: 1.1 },
                                { year: '2022', pop: 2.3 },
                                { year: '2024', pop: 2.8 },
                                { year: '2025', pop: 3.5 },
                            ]}>
                                <defs>
                                    <linearGradient id="colorPop" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                                <XAxis dataKey="year" stroke="#666" />
                                <YAxis stroke="#666" />
                                <Tooltip contentStyle={{ backgroundColor: '#000', borderColor: '#333' }} />
                                <Area type="monotone" dataKey="pop" stroke="#f97316" fillOpacity={1} fill="url(#colorPop)" name="Population (Millions)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 2. Regional Severity (Stacked Bar) */}
                <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6">
                    <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                        <AlertTriangle className="text-red-500" size={20} /> Severity by Region
                    </h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={severityData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                                <XAxis dataKey="region" stroke="#666" />
                                <YAxis stroke="#666" />
                                <Tooltip contentStyle={{ backgroundColor: '#000', borderColor: '#333' }} />
                                <Legend />
                                <Bar dataKey="safe" stackId="a" fill="#10b981" />
                                <Bar dataKey="warning" stackId="a" fill="#f59e0b" />
                                <Bar dataKey="critical" stackId="a" fill="#ef4444" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 3. Prediction Accuracy (Scatter) */}
                <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6">
                    <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                        <BarChart3 className="text-purple-500" size={20} /> AI Model Accuracy Verification
                    </h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <ScatterChart>
                                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                                <XAxis type="number" dataKey="x" name="Events" stroke="#666" />
                                <YAxis type="number" dataKey="y" name="Accuracy %" stroke="#666" />
                                <ZAxis type="number" dataKey="z" range={[60, 400]} name="Confidence" />
                                <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: '#000', borderColor: '#333' }} />
                                <Scatter name="AI Confidence" data={accuracyData} fill="#8884d8" shape="star" />
                            </ScatterChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 4. Comparison: Predicted vs Actual */}
                <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6">
                    <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                        <FileText className="text-orange-500" size={20} /> Predicted vs Actual (Last 24h)
                    </h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={[
                                { time: '00:00', predicted: 2.1, actual: 2.2 },
                                { time: '04:00', predicted: 2.4, actual: 2.3 },
                                { time: '08:00', predicted: 2.9, actual: 2.8 },
                                { time: '12:00', predicted: 3.5, actual: 3.6 },
                                { time: '16:00', predicted: 4.1, actual: 4.0 },
                                { time: '20:00', predicted: 4.9, actual: 5.1 },
                            ]}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                                <XAxis dataKey="time" stroke="#666" />
                                <YAxis stroke="#666" />
                                <Tooltip contentStyle={{ backgroundColor: '#000', borderColor: '#333' }} />
                                <Legend />
                                <Line type="monotone" dataKey="predicted" stroke="#8884d8" strokeDasharray="5 5" />
                                <Line type="monotone" dataKey="actual" stroke="#82ca9d" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 5. Seasonal Patterns (Monthly Heatmap Simulation) */}
                <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 lg:col-span-2">
                    <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                        <Activity className="text-green-500" size={20} /> Seasonal Pattern Analysis
                    </h3>
                    <div className="grid grid-cols-12 gap-1 h-32">
                        {Array.from({ length: 12 }).map((_, i) => (
                            <div key={i} className="flex flex-col gap-1 items-center">
                                <div className="w-full bg-gray-800/30 rounded-t h-full relative overflow-hidden group">
                                    <div
                                        className={`absolute bottom-0 w-full hover:opacity-80 transition-opacity ${[5, 6, 7].includes(i) ? 'bg-red-500' : // Monsoon
                                            [8, 9].includes(i) ? 'bg-orange-400' : 'bg-green-500'
                                            }`}
                                        style={{ height: `${[20, 30, 40, 50, 80, 95, 90, 85, 60, 45, 30, 25][i]}%` }}
                                    ></div>
                                </div>
                                <span className="text-[10px] text-gray-500 font-mono">
                                    {['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][i]}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AnalyticsPage;
