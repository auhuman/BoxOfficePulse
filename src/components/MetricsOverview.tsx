import React from 'react';
import { DollarSign, Flame, Layers, Gauge, Cpu, TrendingUp } from 'lucide-react';
import type { ClickHouseMetrics } from '../types';

interface MetricsOverviewProps {
  metrics: ClickHouseMetrics;
}

export const MetricsOverview: React.FC<MetricsOverviewProps> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
      {/* KPI 1: Real-Time Gross Box Office */}
      <div className="glass-panel p-3.5 flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-400 mb-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider">Gross Box Office</span>
          <DollarSign className="w-4 h-4 text-cyan-400" />
        </div>
        <div>
          <div className="text-lg lg:text-xl font-black text-white font-mono">
            ${(metrics.totalGrossRevenue / 1000000).toFixed(2)}M
          </div>
          <div className="text-[10px] text-emerald-400 flex items-center gap-1 font-medium mt-0.5">
            <TrendingUp className="w-3 h-3" /> Live POS Feed
          </div>
        </div>
      </div>

      {/* KPI 2: Reclaimed Lost Revenue */}
      <div className="glass-panel-glow p-3.5 flex flex-col justify-between bg-gradient-to-b from-cyan-950/20 to-slate-900/80">
        <div className="flex items-center justify-between text-slate-400 mb-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-cyan-300">Reclaimed Yield</span>
          <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
        </div>
        <div>
          <div className="text-lg lg:text-xl font-black text-cyan-300 font-mono">
            +${metrics.reclaimedRevenue.toLocaleString()}
          </div>
          <div className="text-[10px] text-cyan-400 font-medium mt-0.5">
            Via Dynamic Reallocation
          </div>
        </div>
      </div>

      {/* KPI 3: P99 Fill Rate */}
      <div className="glass-panel p-3.5 flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-400 mb-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider">P99 Fill Rate</span>
          <Gauge className="w-4 h-4 text-rose-400" />
        </div>
        <div>
          <div className="text-lg lg:text-xl font-black text-rose-400 font-mono">
            {metrics.p99FillRatePct.toFixed(1)}%
          </div>
          <div className="text-[10px] text-slate-400 font-medium mt-0.5">
            Surging Markets Flagged
          </div>
        </div>
      </div>

      {/* KPI 4: Swapped Screens */}
      <div className="glass-panel p-3.5 flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-400 mb-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider">Active Swaps</span>
          <Layers className="w-4 h-4 text-purple-400" />
        </div>
        <div>
          <div className="text-lg lg:text-xl font-black text-purple-300 font-mono">
            {metrics.swappedScreensCount} Screens
          </div>
          <div className="text-[10px] text-slate-400 font-medium mt-0.5">
            KDMs Minted Today
          </div>
        </div>
      </div>

      {/* KPI 5: Ingestion TPS */}
      <div className="glass-panel p-3.5 flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-400 mb-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider">Stream Events</span>
          <Cpu className="w-4 h-4 text-emerald-400" />
        </div>
        <div>
          <div className="text-lg lg:text-xl font-black text-white font-mono">
            {metrics.totalEventsIngested.toLocaleString()}
          </div>
          <div className="text-[10px] text-emerald-400 font-medium mt-0.5">
            {metrics.ingestionTps} events / sec
          </div>
        </div>
      </div>

      {/* KPI 6: ClickHouse Latency */}
      <div className="glass-panel p-3.5 flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-400 mb-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider">CH Query Speed</span>
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></div>
        </div>
        <div>
          <div className="text-lg lg:text-xl font-black text-emerald-400 font-mono">
            {metrics.queryLatencyMs.toFixed(1)} ms
          </div>
          <div className="text-[10px] text-slate-400 font-medium mt-0.5">
            Sub-10ms Aggregation
          </div>
        </div>
      </div>
    </div>
  );
};
