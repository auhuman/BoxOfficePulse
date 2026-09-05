import React from 'react';
import { Radio, ArrowRight, TrendingUp, Users, AlertCircle, Building2 } from 'lucide-react';
import type { Movie, Theater } from '../../types';

interface StageSignalProps {
  surgingMovie: Movie;
  theater: Theater;
  onAdvance: () => void;
}

export const StageSignal: React.FC<StageSignalProps> = ({
  surgingMovie,
  theater,
  onAdvance
}) => {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="glass-panel p-8 relative overflow-hidden border border-cyan-500/30 shadow-2xl shadow-cyan-500/5">
        {/* Subtle Ambient Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Anomaly Badge */}
        <div className="flex items-center justify-between mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold uppercase tracking-wider">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            Opening Weekend Demand Spike
          </div>
          <span className="text-xs text-slate-500 font-mono">Live Telemetry Event #9821</span>
        </div>

        {/* Main Headline */}
        <div className="flex items-start gap-5 mb-8">
          <img
            src={surgingMovie.posterUrl}
            alt={surgingMovie.title}
            className="w-20 h-28 object-cover rounded-lg border border-white/10 shadow-lg shrink-0"
          />
          <div>
            <h2 className="text-xl font-extrabold text-white tracking-tight leading-snug">
              Surge Alert: <span className="text-cyan-400">{surgingMovie.title}</span> is turning away moviegoers in {theater.city}
            </h2>
            <p className="text-sm text-slate-400 mt-2 leading-relaxed">
              Real-time POS stream ingested into ClickHouse detected consecutive sold-out showtimes with uncaptured waitlists exceeding theater capacity.
            </p>
          </div>
        </div>

        {/* 3 Calm Focused KPI Chips */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
          <div className="p-4 rounded-xl bg-slate-900/80 border border-white/5">
            <span className="text-xs text-slate-400 flex items-center gap-1.5 font-medium mb-1">
              <TrendingUp className="w-3.5 h-3.5 text-rose-400" />
              P99 Seat Occupancy
            </span>
            <div className="text-2xl font-black text-rose-400 font-mono">
              99.2%
            </div>
            <span className="text-[11px] text-slate-400">Waitlists active</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-white/5">
            <span className="text-xs text-slate-400 flex items-center gap-1.5 font-medium mb-1">
              <Users className="w-3.5 h-3.5 text-cyan-400" />
              Turnaways
            </span>
            <div className="text-2xl font-black text-white font-mono">
              ~420 <span className="text-xs font-normal text-slate-400">/hr</span>
            </div>
            <span className="text-[11px] text-slate-400">Peak demand velocity</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-white/5">
            <span className="text-xs text-slate-400 flex items-center gap-1.5 font-medium mb-1">
              <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
              Demand at Risk
            </span>
            <div className="text-2xl font-black text-amber-400 font-mono">
              $28,400
            </div>
            <span className="text-[11px] text-slate-400">Per showtime window</span>
          </div>
        </div>

        {/* Theater location summary */}
        <div className="p-3 rounded-lg bg-slate-950/60 border border-white/5 flex items-center justify-between mb-8 text-xs text-slate-300">
          <span className="flex items-center gap-2 font-medium">
            <Building2 className="w-4 h-4 text-cyan-400" />
            {theater.name} ({theater.dma})
          </span>
          <span className="font-mono text-slate-400">ZIP {theater.zipCode}</span>
        </div>

        {/* Action Button */}
        <div className="flex justify-end">
          <button
            onClick={onAdvance}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-400/20 hover:scale-[1.02] transition-all"
          >
            <span>Investigate Multiplex Screens</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
