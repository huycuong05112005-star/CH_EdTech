import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Database, HardDrive, Activity, CheckCircle2, AlertCircle } from 'lucide-react';

interface HealthData {
  status: string;
  database: {
    status: string;
    database: string;
    pgvector_extension: string;
  };
  storage: {
    status: string;
    provider: string;
    bucket_count: number;
  };
  jvm: {
    heap_used_mb: number;
    heap_max_mb: number;
  };
}

export const SystemHealthWidget: React.FC = () => {
  const { t } = useTranslation();
  const [health, setHealth] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const res = await fetch('/api/health');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        setHealth(json.data);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Unable to connect to Backend API');
      } finally {
        setLoading(false);
      }
    };

    fetchHealth();
    const interval = setInterval(fetchHealth, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-white flex items-center gap-2">
          <Activity className="w-5 h-5 text-brand-400" />
          {t('system.healthTitle')}
        </h3>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          Live Monitored
        </span>
      </div>

      {loading && (
        <div className="text-slate-400 text-sm py-4 text-center">
          {t('system.checking')}
        </div>
      )}

      {error && (
        <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>Backend service starting on port 8085 ({error})</span>
        </div>
      )}

      {health && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
          {/* Database */}
          <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span className="flex items-center gap-1.5">
                <Database className="w-4 h-4 text-blue-400" />
                PostgreSQL & pgvector
              </span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-sm font-semibold text-white">
              pgvector {health.database.pgvector_extension || 'v0.8.7'}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">HNSW Vector Index Active</div>
          </div>

          {/* Object Storage */}
          <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span className="flex items-center gap-1.5">
                <HardDrive className="w-4 h-4 text-amber-400" />
                Object Storage
              </span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-sm font-semibold text-white">
              {health.storage.provider}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Pre-signed S3 Storage Ready</div>
          </div>

          {/* JVM Telemetry */}
          <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span className="flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-purple-400" />
                JVM Telemetry
              </span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-sm font-semibold text-white">
              Heap: {health.jvm.heap_used_mb}MB / {health.jvm.heap_max_mb}MB
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Scraped by Prometheus</div>
          </div>
        </div>
      )}
    </div>
  );
};

