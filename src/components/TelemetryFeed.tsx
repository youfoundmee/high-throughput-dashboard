'use client';

import { useState, useEffect, useMemo } from 'react';
import * as ReactWindow from 'react-window';
import { Pause, Play, Filter, Download, Terminal, X, Server } from 'lucide-react';

const List = ReactWindow.FixedSizeList || (ReactWindow as any).default?.FixedSizeList;

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
  const [isPaused, setIsPaused] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedNode, setSelectedNode] = useState<TelemetryPacket | null>(null);

  useEffect(() => {
    if (isPaused) return;

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
  }, [isPaused]);

  const filteredLogs = useMemo(() => {
    if (statusFilter === 'ALL') return logs;
    return logs.filter((log) => log.status === statusFilter);
  }, [logs, statusFilter]);

  // Export buffer as CSV
  const exportCSV = () => {
    const headers = ['Timestamp,Node ID,Status,Latency (ms),Payload Size\n'];
    const rows = filteredLogs.map(
      (l) => `${l.timestamp},${l.nodeId},${l.status},${l.latency},${l.payloadSize}`
    );
    const blob = new Blob([...headers, rows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `telemetry-dump-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const item = filteredLogs[index];
    if (!item) return null;

    const statusColors = {
      SUCCESS: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      WARN: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      ERROR: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
    };

    return (
      <div
        style={style}
        onClick={() => setSelectedNode(item)}
        className="flex items-center justify-between px-4 text-xs border-b border-slate-800/60 hover:bg-slate-800/60 cursor-pointer font-mono transition-colors"
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
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-4 relative">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h2 className="text-sm font-semibold text-slate-200 uppercase tracking-wider">
            Live Ingestion Stream ({filteredLogs.length.toLocaleString()} events)
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            {isPaused ? 'Stream paused' : 'Click any row to inspect edge node diagnostics'}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={exportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-blue-400" />
            Export CSV
          </button>

          <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-xs text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="ALL" className="bg-slate-900">All Statuses</option>
              <option value="SUCCESS" className="bg-slate-900 text-emerald-400">SUCCESS</option>
              <option value="WARN" className="bg-slate-900 text-amber-400">WARN</option>
              <option value="ERROR" className="bg-slate-900 text-rose-400">ERROR</option>
            </select>
          </div>

          <button
            onClick={() => setIsPaused(!isPaused)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              isPaused
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30'
                : 'bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30'
            }`}
          >
            {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
            {isPaused ? 'Resume' : 'Pause'}
          </button>
        </div>
      </div>

      <div className="border border-slate-800 rounded-lg overflow-hidden bg-slate-950/80">
        <div className="flex justify-between px-4 py-2 bg-slate-900 text-[11px] font-semibold text-slate-400 border-b border-slate-800 uppercase tracking-wider font-mono">
          <span className="w-24">Timestamp</span>
          <span className="w-32">Node</span>
          <span className="w-20 text-center">Status</span>
          <span className="w-20 text-right">Latency</span>
          <span className="w-20 text-right">Payload</span>
        </div>
        {filteredLogs.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs font-mono">
            No telemetry records matching criteria...
          </div>
        ) : (
          List && (
            <List height={360} itemCount={filteredLogs.length} itemSize={36} width="100%">
              {Row}
            </List>
          )
        )}
      </div>

      {/* Node Diagnostic Modal */}
      {selectedNode && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-lg w-full space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <Server className="w-5 h-5 text-purple-400" />
                <h3 className="text-base font-bold text-white font-mono">
                  {selectedNode.nodeId} Diagnostic Dump
                </h3>
              </div>
              <button
                onClick={() => setSelectedNode(null)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <span className="text-slate-500 block text-[10px]">EVENT ID</span>
                <span className="text-slate-200 font-bold">{selectedNode.id}</span>
              </div>
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <span className="text-slate-500 block text-[10px]">TIMESTAMP</span>
                <span className="text-slate-200 font-bold">{selectedNode.timestamp}</span>
              </div>
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <span className="text-slate-500 block text-[10px]">INGESTION LATENCY</span>
                <span className="text-purple-400 font-bold">{selectedNode.latency} ms</span>
              </div>
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <span className="text-slate-500 block text-[10px]">PAYLOAD SIZE</span>
                <span className="text-slate-200 font-bold">{selectedNode.payloadSize}</span>
              </div>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 text-xs font-mono space-y-1">
              <div className="flex items-center gap-2 text-slate-400 border-b border-slate-800 pb-1.5 mb-2">
                <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                <span>Simulated Spatial Payload Header</span>
              </div>
              <p className="text-slate-300">{`{`}</p>
              <p className="text-slate-400 pl-4">{`"sector_id": "construction_zone_floor_4",`}</p>
              <p className="text-slate-400 pl-4">{`"lidar_points_ingested": 48209,`}</p>
              <p className="text-slate-400 pl-4">{`"edge_status": "${selectedNode.status}"`}</p>
              <p className="text-slate-300">{`}`}</p>
            </div>

            <button
              onClick={() => setSelectedNode(null)}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold border border-slate-700 transition-colors"
            >
              Close Diagnostic Panel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}