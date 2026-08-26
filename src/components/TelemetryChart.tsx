'use client';

import { useState, useEffect } from 'react';

interface DataPoint {
  time: string;
  latency: number;
  throughput: number;
}

export default function TelemetryChart() {
  const [data, setData] = useState<DataPoint[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().toISOString().split('T')[1].slice(0, 8);
      const newPoint: DataPoint = {
        time: now,
        latency: Number((1.2 + Math.random() * 0.8).toFixed(2)),
        throughput: Math.floor(120000 + Math.random() * 8000),
      };

      setData((prev) => [...prev.slice(-29), newPoint]);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (data.length < 2) {
    return (
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 text-center text-slate-500 text-xs font-mono">
        Buffering metric stream for time-series visualization...
      </div>
    );
  }

  // Generate SVG path for Latency
  const maxLatency = 2.5;
  const minLatency = 0.5;
  const points = data
    .map((d, index) => {
      const x = (index / 29) * 500;
      const y = 120 - ((d.latency - minLatency) / (maxLatency - minLatency)) * 100;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-sm font-semibold text-slate-200 uppercase tracking-wider">
            Real-Time Latency Dynamics (30s Window)
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Current: {data[data.length - 1]?.latency} ms | Max: 2.5 ms
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2.5 py-1 rounded">
          <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
          Live SVG Render
        </div>
      </div>

      {/* Real-time SVG Sparkline */}
      <div className="relative w-full h-36 bg-slate-950/80 rounded-lg p-2 border border-slate-800 overflow-hidden">
        <svg viewBox="0 0 500 130" className="w-full h-full overflow-visible">
          {/* Grid lines */}
          <line x1="0" y1="20" x2="500" y2="20" stroke="#1e293b" strokeDasharray="4" />
          <line x1="0" y1="70" x2="500" y2="70" stroke="#1e293b" strokeDasharray="4" />
          <line x1="0" y1="120" x2="500" y2="120" stroke="#1e293b" strokeDasharray="4" />

          {/* Gradient Fill */}
          <defs>
            <linearGradient id="latencyGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#a855f7" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#a855f7" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          <polygon points={`0,120 ${points} 500,120`} fill="url(#latencyGradient)" />

          {/* Stroke line */}
          <polyline
            fill="none"
            stroke="#c084fc"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={points}
          />
        </svg>
      </div>
    </div>
  );
}