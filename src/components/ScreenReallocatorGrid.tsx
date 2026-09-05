import React from 'react';
import type { ScreenAllocation, Movie } from '../types';
import { Sparkles, Key, ArrowRight } from 'lucide-react';

interface ScreenReallocatorGridProps {
  allocations: ScreenAllocation[];
  movies: Movie[];
  onOpenKdmModal: (allocation: ScreenAllocation) => void;
}

export const ScreenReallocatorGrid: React.FC<ScreenReallocatorGridProps> = ({
  allocations,
  movies,
  onOpenKdmModal
}) => {
  const getMovie = (movieId: string) => {
    return movies.find(m => m.id === movieId);
  };

  return (
    <div className="glass-panel p-5">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
        <div>
          <h2 className="font-bold text-sm text-white tracking-wide uppercase flex items-center gap-2">
            <span>Multiplex Screen Allocation Matrix</span>
            <span className="text-xs bg-cyan-950 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded">
              DCP & KDM Control Plane
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time screen occupancy, format distribution, and autonomous re-allocation state.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {allocations.map((screen) => {
          const movie = getMovie(screen.movieId);
          const isReallocated = screen.status === 'REALLOCATED';
          const isSurging = screen.currentFillRatePct >= 90.0;
          const isUnderperforming = screen.currentFillRatePct <= 35.0;

          return (
            <div
              key={`${screen.theaterId}-${screen.screenNumber}`}
              className={`p-4 rounded-xl border transition-all flex flex-col justify-between relative overflow-hidden ${
                isReallocated
                  ? 'bg-gradient-to-br from-cyan-950/40 via-slate-900/90 to-slate-900 border-cyan-500/50 shadow-lg shadow-cyan-500/10'
                  : isSurging
                  ? 'bg-slate-900/80 border-cyan-500/20'
                  : 'bg-slate-900/50 border-white/5'
              }`}
            >
              {/* Dynamic Reallocation Ribbon */}
              {isReallocated && (
                <div className="absolute top-0 right-0 bg-gradient-to-l from-cyan-500 to-blue-600 text-black font-extrabold text-[9px] uppercase px-3 py-0.5 rounded-bl-lg tracking-wider flex items-center gap-1 shadow-sm">
                  <Sparkles className="w-2.5 h-2.5 fill-black" />
                  Auto-Reallocated
                </div>
              )}

              {/* Screen Top Header */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-cyan-400 bg-cyan-950/60 border border-cyan-500/20 px-2 py-0.5 rounded">
                      SCR {screen.screenNumber}
                    </span>
                    <span className="text-xs font-semibold text-slate-300">
                      {screen.format}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {screen.capacity} Seats
                  </span>
                </div>

                {/* Movie Title & Details */}
                <div className="flex items-start gap-3 my-2.5">
                  <div className="w-12 h-16 rounded-md bg-slate-800 overflow-hidden shrink-0 border border-white/10 relative">
                    <img
                      src={movie?.posterUrl || 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=200'}
                      alt={screen.movieTitle}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-white truncate leading-tight">
                      {screen.movieTitle}
                    </h3>
                    <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1.5">
                      <span>{movie?.genre || 'Action'}</span>
                      <span>•</span>
                      <span>{movie?.runtimeMins}m</span>
                    </div>

                    {/* Previous title if reallocated */}
                    {screen.previousMovieId && (
                      <div className="text-[10px] text-amber-400/90 mt-1 flex items-center gap-1">
                        <ArrowRight className="w-2.5 h-2.5" /> Replaced underperforming screen
                      </div>
                    )}
                  </div>
                </div>

                {/* Occupancy Fill Rate Progress Bar */}
                <div className="my-2">
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="text-slate-400 font-medium">Occupancy Fill Rate:</span>
                    <span
                      className={`font-mono font-bold ${
                        isSurging
                          ? 'text-cyan-400'
                          : isUnderperforming
                          ? 'text-rose-400'
                          : 'text-amber-400'
                      }`}
                    >
                      {screen.currentFillRatePct.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-700 ${
                        isSurging
                          ? 'bg-gradient-to-r from-cyan-500 to-blue-500'
                          : isUnderperforming
                          ? 'bg-rose-500'
                          : 'bg-amber-500'
                      }`}
                      style={{ width: `${Math.min(100, screen.currentFillRatePct)}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Screen Footer: Today's Revenue & KDM Inspector Button */}
              <div className="pt-2 mt-2 border-t border-white/5 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Today's Gross</span>
                  <span className="font-mono font-bold text-white text-xs">
                    ${screen.revenueToday.toLocaleString()}
                  </span>
                </div>

                <button
                  onClick={() => onOpenKdmModal(screen)}
                  className="flex items-center gap-1 text-[11px] font-semibold text-cyan-400 hover:text-cyan-300 bg-cyan-950/40 hover:bg-cyan-900/50 border border-cyan-500/30 px-2 py-1 rounded-md transition-all"
                >
                  <Key className="w-3 h-3" />
                  <span>KDM Key</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
