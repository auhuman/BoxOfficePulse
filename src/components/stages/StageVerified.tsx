import { Key, ArrowRight, TrendingUp, CheckCircle, Database } from 'lucide-react';
import type { Theater } from '../../types';

interface StageVerifiedProps {
  theater: Theater;
  surgingMovieTitle: string;
  reclaimedRevenue: number;
  onOpenKdm: () => void;
  onOpenAudit: () => void;
  onNextAnomaly: () => void;
}

export const StageVerified: React.FC<StageVerifiedProps> = ({
  theater,
  surgingMovieTitle,
  reclaimedRevenue,
  onOpenKdm,
  onOpenAudit,
  onNextAnomaly
}) => {
  return (
    <div className="max-w-2xl mx-auto space-y-6 text-center">
      {/* Success Badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
        <CheckCircle className="w-3.5 h-3.5" />
        Screen Reallocation Live & Verified
      </div>

      <div>
        <h2 className="text-2xl font-black text-white tracking-tight">
          Optimization Complete: +${reclaimedRevenue.toLocaleString()} Captured
        </h2>
        <p className="text-sm text-slate-400 mt-2 max-w-lg mx-auto">
          {theater.name} is now running <strong className="text-cyan-400">{surgingMovieTitle}</strong> on Auditorium 4. Online inventory is 98.5% reserved.
        </p>
      </div>

      {/* Outcome Cards */}
      <div className="grid grid-cols-2 gap-4 text-left">
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-white/10">
          <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block mb-1">
            Occupancy Delta
          </span>
          <div className="flex items-center gap-2">
            <span className="text-sm font-mono text-slate-500 line-through">18.2%</span>
            <span className="text-slate-400">→</span>
            <span className="text-2xl font-black font-mono text-emerald-400">98.5%</span>
          </div>
          <span className="text-[11px] text-emerald-400 flex items-center gap-1 mt-1 font-medium">
            <TrendingUp className="w-3 h-3" /> +80.3% Seat Utilization
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/90 border border-white/10">
          <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block mb-1">
            Confirmed Incremental Gross
          </span>
          <div className="text-2xl font-black font-mono text-cyan-400">
            +${reclaimedRevenue.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Across 3 Evening Showtimes
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <button
          onClick={onOpenKdm}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-white/10 transition-colors"
        >
          <Key className="w-3.5 h-3.5 text-cyan-400" />
          <span>Inspect SMPTE KDM Certificate</span>
        </button>

        <button
          onClick={onOpenAudit}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-white/10 transition-colors"
        >
          <Database className="w-3.5 h-3.5 text-emerald-400" />
          <span>ClickHouse Audit Trail</span>
        </button>

        <button
          onClick={onNextAnomaly}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-400/20 hover:scale-[1.02] transition-all"
        >
          <span>Next Anomaly</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
