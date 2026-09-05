import React from 'react';
import type { Theater } from '../types';
import { MapPin, Navigation, TrendingUp } from 'lucide-react';

interface GeospatialTheaterMapProps {
  theaters: Theater[];
  selectedTheaterId: string;
  onSelectTheater: (theaterId: string) => void;
}

export const GeospatialTheaterMap: React.FC<GeospatialTheaterMapProps> = ({
  theaters,
  selectedTheaterId,
  onSelectTheater
}) => {
  // Normalize Coordinates to an SVG ViewBox (US Bounding Box)
  const projectCoords = (lat: number, lng: number) => {
    const minLat = 24.0, maxLat = 50.0;
    const minLng = -125.0, maxLng = -66.0;

    const x = ((lng - minLng) / (maxLng - minLng)) * 800 + 40;
    const y = ((maxLat - lat) / (maxLat - minLat)) * 440 + 30;

    return { x, y };
  };

  const selectedTheater = theaters.find(t => t.id === selectedTheaterId) || theaters[0];

  return (
    <div className="glass-panel p-5 relative overflow-hidden flex flex-col justify-between">
      {/* Map Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Navigation className="w-4 h-4 text-cyan-400" />
          <h2 className="font-bold text-sm text-white tracking-wide uppercase">
            US DMA Telemetry Radar & Theater Grid
          </h2>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1.5 text-slate-400">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
            Surging (&gt;90%)
          </span>
          <span className="flex items-center gap-1.5 text-slate-400">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
            Nominal (70-90%)
          </span>
        </div>
      </div>

      {/* SVG Interactive Map Canvas */}
      <div className="relative w-full h-[280px] bg-[#05080e]/90 rounded-xl border border-white/5 overflow-hidden flex items-center justify-center">
        {/* Stylized US Outline Grid & Radar lines */}
        <svg className="w-full h-full" viewBox="0 0 900 500" preserveAspectRatio="xMidYMid meet">
          <defs>
            <radialGradient id="radarGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#00f2fe" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#00f2fe" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="streamLine" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00f2fe" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#a855f7" stopOpacity="0.2" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <g stroke="rgba(255,255,255,0.04)" strokeWidth="1">
            {Array.from({ length: 9 }).map((_, i) => (
              <line key={`h-${i}`} x1="0" y1={i * 60} x2="900" y2={i * 60} />
            ))}
            {Array.from({ length: 15 }).map((_, i) => (
              <line key={`v-${i}`} x1={i * 60} y1="0" x2={i * 60} y2="500" />
            ))}
          </g>

          {/* Radar Circles */}
          <circle cx="450" cy="250" r="120" fill="none" stroke="rgba(0,242,254,0.06)" strokeWidth="1.5" />
          <circle cx="450" cy="250" r="220" fill="none" stroke="rgba(0,242,254,0.04)" strokeWidth="1.5" />
          <circle cx="450" cy="250" r="320" fill="none" stroke="rgba(0,242,254,0.02)" strokeWidth="1.5" />

          {/* Network Interconnect Lines */}
          {theaters.slice(0, 5).map((t, idx) => {
            const pos1 = projectCoords(t.lat, t.lng);
            const nextT = theaters[(idx + 1) % theaters.length];
            const pos2 = projectCoords(nextT.lat, nextT.lng);
            return (
              <line
                key={`conn-${idx}`}
                x1={pos1.x}
                y1={pos1.y}
                x2={pos2.x}
                y2={pos2.y}
                stroke="url(#streamLine)"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
            );
          })}

          {/* Theater Nodes */}
          {theaters.map((t) => {
            const { x, y } = projectCoords(t.lat, t.lng);
            const isSelected = t.id === selectedTheaterId;
            const isSurging = t.currentOccupancyPct >= 92.0;

            return (
              <g
                key={t.id}
                className="cursor-pointer transition-transform hover:scale-125"
                onClick={() => onSelectTheater(t.id)}
              >
                {/* Pulse Ring for Surging Theaters */}
                {isSurging && (
                  <circle
                    cx={x}
                    cy={y}
                    r={isSelected ? "22" : "16"}
                    fill="none"
                    stroke="#00f2fe"
                    strokeWidth="1.5"
                    className="animate-pulse"
                    opacity="0.75"
                  />
                )}

                {/* Outer Selection Highlight */}
                {isSelected && (
                  <circle
                    cx={x}
                    cy={y}
                    r="12"
                    fill="rgba(0, 242, 254, 0.25)"
                    stroke="#00f2fe"
                    strokeWidth="2"
                  />
                )}

                {/* Core Pin Dot */}
                <circle
                  cx={x}
                  cy={y}
                  r="6"
                  fill={isSurging ? "#00f2fe" : "#ff9f1c"}
                  stroke="#ffffff"
                  strokeWidth="1.5"
                />

                {/* City Label */}
                <text
                  x={x + 10}
                  y={y + 4}
                  fill={isSelected ? "#00f2fe" : "#cbd5e1"}
                  fontSize="11"
                  fontWeight={isSelected ? "bold" : "600"}
                  fontFamily="system-ui, sans-serif"
                >
                  {t.city} ({t.currentOccupancyPct.toFixed(0)}%)
                </text>
              </g>
            );
          })}
        </svg>

        {/* Floating Active Theater Inspector */}
        <div className="absolute bottom-3 left-3 bg-slate-900/95 border border-white/10 rounded-lg p-2.5 backdrop-blur-md flex items-center gap-3 text-xs">
          <div className="p-1.5 rounded-md bg-cyan-500/10 text-cyan-400">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-white flex items-center gap-2">
              <span>{selectedTheater.name}</span>
              <span className="text-[10px] text-slate-400">({selectedTheater.dma})</span>
            </div>
            <div className="text-[11px] text-slate-300 flex items-center gap-3 mt-0.5">
              <span>Screens: <strong>{selectedTheater.totalScreens}</strong></span>
              <span>Seats: <strong>{selectedTheater.totalSeats.toLocaleString()}</strong></span>
              <span className="text-cyan-400 font-semibold flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> Surge: {selectedTheater.surgeFactor}x
              </span>
              {selectedTheater.reallocationsCount > 0 && (
                <span className="text-purple-300 font-bold">
                  {selectedTheater.reallocationsCount} Swaps Executed
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
