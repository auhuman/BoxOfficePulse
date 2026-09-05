import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Database, ChevronDown, ChevronUp, Check, AlertTriangle, Sparkles } from 'lucide-react';
import type { ScreenAllocation, Movie, Theater } from '../../types';

interface StageDiagnoseProps {
  theater: Theater;
  allocations: ScreenAllocation[];
  movies: Movie[];
  onBack: () => void;
  onAdvance: () => void;
}

export const StageDiagnose: React.FC<StageDiagnoseProps> = ({
  theater,
  allocations,
  onBack,
  onAdvance
}) => {
  const [showSql, setShowSql] = useState<boolean>(false);

  const surgingScreen = allocations.find(a => a.currentFillRatePct > 95) || allocations[0];
  const underperformingScreen = allocations.find(a => a.currentFillRatePct < 30) || allocations[3] || allocations[1];

  const clickhouseSql = `SELECT 
    theater_id,
    screen_number,
    movie_title,
    capacity,
    current_fill_rate_pct,
    quantileExact(0.99)(fill_rate_pct) AS p99_fill
FROM dcp_screen_allocations
JOIN ticket_sales_stream USING (theater_id, screen_number)
WHERE theater_id = '${theater.id}'
GROUP BY theater_id, screen_number, movie_title, capacity, current_fill_rate_pct
ORDER BY current_fill_rate_pct DESC;`;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto">
        <h2 className="text-xl font-extrabold text-white tracking-tight">
          Multiplex Diagnosis: {theater.name}
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          ClickHouse analytical query isolated an acute imbalance between sold-out blockbuster demand and dormant auditorium capacity.
        </p>
      </div>

      {/* Side-by-Side Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card 1: Surging Bottleneck Screen */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-cyan-500/30 relative overflow-hidden flex flex-col justify-between shadow-xl shadow-cyan-500/5">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[11px] font-bold uppercase tracking-wider bg-rose-500/10 text-rose-400 border border-rose-500/30 px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
              Screen Bottleneck
            </span>
            <span className="text-xs font-mono text-cyan-400 font-bold">
              Auditorium {surgingScreen.screenNumber} ({surgingScreen.format})
            </span>
          </div>

          <div>
            <h3 className="text-lg font-black text-white">{surgingScreen.movieTitle}</h3>
            <p className="text-xs text-slate-400 mt-1">
              Max capacity reached. 4 of 4 showtimes 100% reserved.
            </p>

            <div className="my-5 p-3.5 rounded-xl bg-slate-950/70 border border-white/5 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Current Occupancy:</span>
                <span className="text-rose-400 font-bold font-mono">
                  {surgingScreen.currentFillRatePct.toFixed(1)}% (Sold Out)
                </span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-rose-500 rounded-full" style={{ width: '99%' }} />
              </div>
              <div className="flex justify-between text-[11px] text-slate-400 pt-1">
                <span>Capacity: {surgingScreen.capacity} seats</span>
                <span className="text-amber-400 font-medium">Turnaways: +420 patrons</span>
              </div>
            </div>
          </div>

          <div className="text-xs text-slate-400 flex items-center gap-2 pt-2 border-t border-white/5">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>Highest-grossing title in DMA today</span>
          </div>
        </div>

        {/* Card 2: Underperforming Screen (Opportunity) */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-amber-500/30 relative overflow-hidden flex flex-col justify-between shadow-xl shadow-amber-500/5">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[11px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" />
              Cannibalization Candidate
            </span>
            <span className="text-xs font-mono text-slate-300 font-bold">
              Auditorium {underperformingScreen.screenNumber} ({underperformingScreen.format})
            </span>
          </div>

          <div>
            <h3 className="text-lg font-black text-white">{underperformingScreen.movieTitle}</h3>
            <p className="text-xs text-slate-400 mt-1">
              Severe underperformance. Auditoriums burning empty seat hours.
            </p>

            <div className="my-5 p-3.5 rounded-xl bg-slate-950/70 border border-white/5 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Current Occupancy:</span>
                <span className="text-amber-400 font-bold font-mono">
                  {underperformingScreen.currentFillRatePct.toFixed(1)}%
                </span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full"
                  style={{ width: `${underperformingScreen.currentFillRatePct}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-slate-400 pt-1">
                <span>Capacity: {underperformingScreen.capacity} seats</span>
                <span className="text-slate-400">Unused: {Math.round(underperformingScreen.capacity * 0.82)} seats</span>
              </div>
            </div>
          </div>

          <div className="text-xs text-slate-400 flex items-center gap-2 pt-2 border-t border-white/5">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Eligible for instant Digital Cinema Package re-allocation</span>
          </div>
        </div>
      </div>

      {/* Expandable ClickHouse Query Verification Proof */}
      <div className="glass-panel overflow-hidden">
        <button
          onClick={() => setShowSql(!showSql)}
          className="w-full px-4 py-3 flex items-center justify-between text-xs text-slate-300 hover:text-white transition-colors"
        >
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-cyan-400" />
            <span className="font-semibold">Inspect ClickHouse Analytical Query Proof</span>
            <span className="text-[10px] text-emerald-400 font-mono bg-emerald-950 px-2 py-0.5 rounded">
              Executed in 2.1 ms
            </span>
          </div>
          {showSql ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showSql && (
          <div className="p-4 border-t border-white/10 bg-[#04070c]">
            <pre className="code-block whitespace-pre-wrap">{clickhouseSql}</pre>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Signal</span>
        </button>

        <button
          onClick={onAdvance}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-400/20 hover:scale-[1.02] transition-all"
        >
          <span>Review Agent Recommendation</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
