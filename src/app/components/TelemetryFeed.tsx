'use client';

import { useState, useEffect } from 'react';
import { FixedSizeList as List } from 'react-window';

interface TelemetryPacket {
  id: number;
  timestamp: string;
  nodeId: string;
  status: 'SUCCESS' | 'WARN' | 'ERROR';
  latency: number;
  payloadSize: string;
}

export default function TelemetryFeed() {
  const [logs, setLogs] = useState<TelemetryPacket[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newLog: TelemetryPacket = {
        id: Date.now(),
        timestamp: new Date().toISOString().split('T')[1].slice(0, 8),
        nodeId: `node-us-east-${Math.floor(Math.random() * 8) + 1}`,
        status: Math.random() > 0.88 ? 'ERROR' : Math.random() > 0.7 ? 'WARN' : 'SUCCESS',
        latency: Number((Math.random() * 4 + 0.5).toFixed(2)),
        payloadSize: `${(Math.random() * 50 + 10).toFixed(1)} KB`,
      };

      setLogs((prev) => [newLog, ...prev].slice(0, 5000));
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const item = logs[index];
    if (!item) return null;

    const statusColors = {
      SUCCESS: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      WARN: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      ERROR: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
    };

    return (
      <div
        style={style}
        className="flex items-center justify-between px-4 text-xs border-b border-slate-800/60 hover:bg-slate-800/40 font-mono transition-colors"
      >
        <span className="text-slate-400 w-24">{item.timestamp}</span>
        <span className="text-slate-300 font-semibold w-32">{item.nodeId}</span>
        <span className={`px-2 py-0.5 rounded border text-[10px] font-bold w-20 text-center ${statusColors[item.status]}`}>
          {item.status}
        </span>
        <span className="text-slate-400 w-20 text-right">{item.latency} ms</span>
        <span className="text-slate-500 w-20 text-right">{item.payloadSize}</span>
      </div>
    );
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-sm font-semibold text-slate-200 uppercase tracking-wider">
          Live Ingestion Stream ({logs.length.toLocaleString()} buffered events)
        </h2>
        <span className="text-xs text-slate-400 font-mono">Rate: 10 pkts/sec</span>
      </div>

      <div className="border border-slate-800 rounded-lg overflow-hidden bg-slate-950/80">
        <div className="flex justify-between px-4 py-2 bg-slate-900 text-[11px] font-semibold text-slate-400 border-b border-slate-800 uppercase tracking-wider font-mono">
          <span className="w-24">Timestamp</span>
          <span className="w-32">Node</span>
          <span className="w-20 text-center">Status</span>
          <span className="w-20 text-right">Latency</span>
          <span className="w-20 text-right">Payload</span>
        </div>
        {logs.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs font-mono">
            Initializing high-throughput stream...
          </div>
        ) : (
          <List height={360} itemCount={logs.length} itemSize={36} width="100%">
            {Row}
          </List>
        )}
      </div>
    </div>
  );
}