'use client';

import { useState, useEffect } from 'react';
import { Activity, Cpu, Database, Server } from 'lucide-react';
import TelemetryFeed from '@/components/TelemetryFeed';
import TelemetryChart from '@/components/TelemetryChart';
import AnomalyPanel from '@/components/AnomalyPanel';

export default function DashboardPage() {
  const [metrics, setMetrics] = useState({
    throughput: 124800,
    latency: 1.42,
    activeStreams: 1024,
    health: 99.98,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics({
        throughput: Math.floor(124000 + Math.random() * 1600),
        latency: Number((1.35 + Math.random() * 0.25).toFixed(2)),
        activeStreams: Math.floor(1020 + Math.random() * 8),
        health: Number((99.95 + Math.random() * 0.04).toFixed(2)),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="p-8 max-w-7xl mx-auto space-y-6">
      <header className="flex justify-between items-center pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wide">
            High-Throughput Telemetry Stream
          </h1>
          <p className="text-sm text-slate-400">
            Real-time metric ingestion and virtualized view
          </p>
        </div>
        <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full text-emerald-400 text-xs font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          Live Engine Active
        </div>
      </header>

      {/* Dynamic Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard
          icon={<Activity className="text-blue-400" />}
          title="Throughput"
          value={`${metrics.throughput.toLocaleString()} req/s`}
        />
        <MetricCard
          icon={<Cpu className="text-purple-400" />}
          title="Avg Latency"
          value={`${metrics.latency} ms`}
        />
        <MetricCard
          icon={<Database className="text-emerald-400" />}
          title="Active Streams"
          value={`${metrics.activeStreams.toLocaleString()}`}
        />
        <MetricCard
          icon={<Server className="text-amber-400" />}
          title="Node Health"
          value={`${metrics.health}%`}
        />
      </div>

      {/* Real-time SVG Sparkline Chart */}
      <TelemetryChart />

      {/* Real-time Anomaly Detection & System Alert Panel */}
      <AnomalyPanel />

      {/* Virtualized Telemetry Feed */}
      <TelemetryFeed />
    </main>
  );
}

function MetricCard({ icon, title, value }: { icon: React.ReactNode; title: string; value: string }) {
  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 flex items-center gap-4">
      <div className="p-3 bg-slate-800/80 rounded-lg">{icon}</div>
      <div>
        <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{title}</p>
        <p className="text-xl font-bold text-slate-100 mt-0.5">{value}</p>
      </div>
    </div>
  );
}