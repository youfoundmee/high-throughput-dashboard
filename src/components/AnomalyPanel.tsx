'use client';

import { useState, useEffect } from 'react';
import { AlertTriangle, ShieldCheck, BellRing, CheckCircle2 } from 'lucide-react';

interface AnomalyEvent {
  id: string;
  timestamp: string;
  type: 'CRITICAL' | 'WARNING';
  message: string;
  nodeId: string;
  acknowledged: boolean;
}

export default function AnomalyPanel() {
  const [alerts, setAlerts] = useState<AnomalyEvent[]>([]);

  useEffect(() => {
    // Simulates dynamic stream anomaly detection (latency spikes & error surges)
    const interval = setInterval(() => {
      const isAnomaly = Math.random() > 0.75;
      if (!isAnomaly) return;

      const isCritical = Math.random() > 0.6;
      const targetNode = `node-us-east-${Math.floor(Math.random() * 8) + 1}`;
      const latencyValue = (2.1 + Math.random() * 1.8).toFixed(2);

      const newAlert: AnomalyEvent = {
        id: Math.random().toString(36).substring(2, 9),
        timestamp: new Date().toISOString().split('T')[1].slice(0, 8),
        type: isCritical ? 'CRITICAL' : 'WARNING',
        message: isCritical
          ? `High drop rate detected on ingestion pipeline (${(Math.random() * 12 + 8).toFixed(1)}% packet loss)`
          : `Latency threshold exceeded: ${latencyValue} ms (Limit: 2.0 ms)`,
        nodeId: targetNode,
        acknowledged: false,
      };

      setAlerts((prev) => [newAlert, ...prev].slice(0, 10));
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  const acknowledgeAlert = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, acknowledged: true } : a))
    );
  };

  const activeAlertCount = alerts.filter((a) => !a.acknowledged).length;

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-4">
      <div className="flex justify-between items-center border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <BellRing className="w-4 h-4 text-amber-400 animate-bounce" />
          <h2 className="text-sm font-semibold text-slate-200 uppercase tracking-wider">
            Active Stream Anomaly Feed
          </h2>
        </div>
        <div className="flex items-center gap-2">
          {activeAlertCount > 0 ? (
            <span className="bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs px-2.5 py-0.5 rounded-full font-mono font-medium">
              {activeAlertCount} Unresolved
            </span>
          ) : (
            <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs px-2.5 py-0.5 rounded-full font-mono flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" /> All Nodes Nominal
            </span>
          )}
        </div>
      </div>

      <div className="space-y-2.5">
        {alerts.length === 0 ? (
          <div className="p-6 text-center text-slate-500 text-xs font-mono">
            Stream engine monitoring packet thresholds... Zero anomalies flagged.
          </div>
        ) : (
          alerts.map((alert) => (
            <div
              key={alert.id}
              className={`flex flex-wrap items-center justify-between p-3 rounded-lg border text-xs font-mono transition-all ${
                alert.acknowledged
                  ? 'bg-slate-950/40 border-slate-800/40 opacity-50'
                  : alert.type === 'CRITICAL'
                  ? 'bg-rose-500/10 border-rose-500/30 text-rose-200'
                  : 'bg-amber-500/10 border-amber-500/30 text-amber-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <AlertTriangle
                  className={`w-4 h-4 shrink-0 ${
                    alert.type === 'CRITICAL' ? 'text-rose-400' : 'text-amber-400'
                  }`}
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-100">{alert.nodeId}</span>
                    <span className="text-[10px] text-slate-400">[{alert.timestamp}]</span>
                  </div>
                  <p className="mt-0.5 text-slate-300">{alert.message}</p>
                </div>
              </div>

              {!alert.acknowledged ? (
                <button
                  onClick={() => acknowledgeAlert(alert.id)}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors text-[11px] font-sans"
                >
                  Acknowledge
                </button>
              ) : (
                <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-sans">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Resolved
                </span>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}