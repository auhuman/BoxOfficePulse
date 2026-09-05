import React from 'react';
import { ArrowLeft, Zap, Bot, Key, Megaphone, Repeat, DollarSign } from 'lucide-react';
import type { Theater } from '../../types';

interface StageRecommendProps {
  theater: Theater;
  surgingMovieTitle: string;
  replacedMovieTitle: string;
  targetScreenNumber: number;
  projectedRevenue: number;
  onBack: () => void;
  onApprove: () => void;
}

export const StageRecommend: React.FC<StageRecommendProps> = ({
  theater,
  surgingMovieTitle,
  replacedMovieTitle,
  targetScreenNumber,
  projectedRevenue,
  onBack,
  onApprove
}) => {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Agent Banner Header */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/50 via-slate-900/90 to-purple-950/40 border border-cyan-500/30 flex items-center justify-between shadow-xl shadow-cyan-500/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-400 text-slate-950 flex items-center justify-center font-bold shadow-md shadow-cyan-400/20">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/20">
              Autonomous Studio Supervisor
            </span>
            <h2 className="text-base font-extrabold text-white mt-0.5">
              3-Step Real-Time Optimization Strategy
            </h2>
          </div>
        </div>

        <div className="hidden sm:block text-right">
          <span className="text-[10px] text-slate-400 block uppercase font-mono">Projected Net Gain</span>
          <span className="text-lg font-black text-cyan-400 font-mono">
            +${projectedRevenue.toLocaleString()}
          </span>
        </div>
      </div>

      {/* 3 Step Action Plan */}
      <div className="space-y-3">
        {/* Action 1: Screen Cannibalization */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-white/10 flex items-start gap-4">
          <div className="p-2.5 rounded-lg bg-purple-500/10 text-purple-400 shrink-0">
            <Repeat className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">
                1. Cannibalize Auditorium {targetScreenNumber}
              </h3>
              <span className="text-xs text-purple-300 font-mono font-semibold">+3 Showtimes</span>
            </div>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Evict low-demand screening of <strong className="text-slate-300">{replacedMovieTitle}</strong> (18% occupancy) on Screen {targetScreenNumber} (220 seats) and immediately schedule <strong className="text-cyan-300">{surgingMovieTitle}</strong> for peak evening showtimes.
            </p>
          </div>
        </div>

        {/* Action 2: Mint SMPTE KDM Security Key */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-white/10 flex items-start gap-4">
          <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-400 shrink-0">
            <Key className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">
                2. Mint & Sign SMPTE-Compliant KDM License
              </h3>
              <span className="text-xs text-amber-300 font-mono font-semibold">AES-128 GCM</span>
            </div>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Cryptographically mint Digital Cinema Package (DCP) authorization key for {theater.name}. Automatically transmit signed certificate to the theater's playback server valid for 7 days.
            </p>
          </div>
        </div>

        {/* Action 3: Programmatic Ad Budget Boost */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-white/10 flex items-start gap-4">
          <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0">
            <Megaphone className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">
                3. Hyperlocal Programmatic Ad Boost
              </h3>
              <span className="text-xs text-emerald-300 font-mono font-semibold">+$4,500 Budget</span>
            </div>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Shift digital marketing budget into TikTok & Meta campaigns targeted within an 8-mile radius of ZIP {theater.zipCode} to announce new available ticket inventory and drive instant sellouts.
            </p>
          </div>
        </div>
      </div>

      {/* Financial ROI Summary Card */}
      <div className="p-5 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-cyan-400 text-slate-950">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Financial Impact Analysis</span>
            <div className="text-xl font-black text-white">
              +$27,560 Net Revenue Uplift
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6 text-xs font-mono">
          <div>
            <span className="text-slate-500 block text-[10px]">AD COST</span>
            <span className="text-slate-300 font-bold">-$4,500</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px]">TICKET GROSS</span>
            <span className="text-emerald-400 font-bold">+$32,060</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px]">NET ROI</span>
            <span className="text-cyan-400 font-bold">6.1x</span>
          </div>
        </div>
      </div>

      {/* Navigation & Action */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Diagnosis</span>
        </button>

        <button
          onClick={onApprove}
          className="flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-black text-sm shadow-xl shadow-cyan-400/25 hover:scale-[1.02] transition-all cursor-pointer"
        >
          <Zap className="w-4 h-4 fill-slate-950" />
          <span>Approve & Dispatch Reallocation</span>
        </button>
      </div>
    </div>
  );
};
