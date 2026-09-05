import React from 'react';
import { Activity, Database, Film, Play, Pause, Zap, Sparkles } from 'lucide-react';
import { DEMO_SCENARIOS } from '../lib/telemetry/simulator';
import type { ScenarioPreset } from '../types';

interface NavbarProps {
  isStreaming: boolean;
  onToggleStreaming: () => void;
  activeScenario: ScenarioPreset;
  onSelectScenario: (id: string) => void;
  onRunAgentOptimization: () => void;
  isAgentRunning: boolean;
  isClickHouseCloud: boolean;
  queryLatencyMs: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  isStreaming,
  onToggleStreaming,
  activeScenario,
  onSelectScenario,
  onRunAgentOptimization,
  isAgentRunning,
  isClickHouseCloud,
  queryLatencyMs
}) => {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#06090e]/90 backdrop-blur-md px-4 lg:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand Logo & Tag */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Film className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight text-white flex items-center gap-1.5">
                  BOXOFFICE <span className="text-cyan-400">PULSE</span>
                </span>
                <span className="text-[10px] font-bold bg-cyan-950/80 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  ClickHouse MCP Agent
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Real-Time Cinema Telemetry & Autonomous Screen Re-Allocator
              </p>
            </div>
          </div>

          {/* Engine Status Pill */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-white/10 text-xs">
            <Database className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span className="text-slate-300 font-medium">ClickHouse:</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              {isClickHouseCloud ? 'Cloud Cluster' : 'Engine Ready'}
            </span>
            <span className="text-slate-500">|</span>
            <span className="text-cyan-400 font-mono text-[11px]">{queryLatencyMs.toFixed(1)}ms</span>
          </div>
        </div>

        {/* Controls: Scenarios, Streaming Toggle, Agent Optimization Button */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
          {/* Scenario Selector */}
          <div className="flex items-center gap-1.5 bg-slate-900/90 border border-white/10 rounded-lg p-1">
            <span className="text-[11px] font-semibold text-slate-400 px-2 flex items-center gap-1">
              <Activity className="w-3 h-3 text-cyan-400" /> Scenario:
            </span>
            <select
              value={activeScenario.id}
              onChange={(e) => onSelectScenario(e.target.value)}
              className="bg-slate-800 text-white text-xs font-medium rounded-md px-2.5 py-1.5 border border-white/10 focus:outline-none focus:border-cyan-400"
            >
              {DEMO_SCENARIOS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Stream Toggle */}
          <button
            onClick={onToggleStreaming}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              isStreaming
                ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/70'
                : 'bg-slate-800/80 border-white/10 text-slate-400 hover:bg-slate-700'
            }`}
            title={isStreaming ? 'Pause live POS telemetry stream' : 'Resume live POS telemetry stream'}
          >
            {isStreaming ? (
              <>
                <Pause className="w-3.5 h-3.5 text-emerald-400" />
                <span>Live Feed Active</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-slate-400" />
                <span>Stream Paused</span>
              </>
            )}
          </button>

          {/* Autonomous Agent Trigger */}
          <button
            onClick={onRunAgentOptimization}
            disabled={isAgentRunning}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-lg ${
              isAgentRunning
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/50 cursor-not-allowed animate-pulse'
                : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.02]'
            }`}
          >
            {isAgentRunning ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin text-cyan-300" />
                <span>Agent Chaining MCP Tools...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 text-slate-950 fill-slate-950" />
                <span>Auto-Reallocate Screens</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
