import React from 'react';
import type { AgentThoughtStep, AgentRunResult } from '../lib/agent/supervisor';
import { Bot, Terminal, CheckCircle2, Sparkles, Database, Key, Megaphone } from 'lucide-react';

interface AgentOperationsFeedProps {
  latestRun: AgentRunResult | null;
  isRunning: boolean;
}

export const AgentOperationsFeed: React.FC<AgentOperationsFeedProps> = ({
  latestRun,
  isRunning
}) => {
  return (
    <div className="glass-panel p-5 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-bold text-sm text-white tracking-wide uppercase">
              Autonomous Agent Operations Feed
            </h2>
            <p className="text-[11px] text-slate-400">
              Deterministic Multi-Step Reasoning & ClickHouse MCP Tool Execution Trace
            </p>
          </div>
        </div>

        {latestRun && (
          <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/80 border border-cyan-500/30 px-2.5 py-1 rounded-full">
            {latestRun.runId}
          </span>
        )}
      </div>

      {/* Execution Timeline / Steps Feed */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1 max-h-[420px]">
        {isRunning && (
          <div className="p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-500/40 animate-pulse flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-cyan-400 animate-spin" />
            <div>
              <div className="font-bold text-xs text-cyan-300">
                Supervisor Reasoning in Progress...
              </div>
              <div className="text-[11px] text-slate-300">
                Chaining ClickHouse MCP queries & formulating screen rebalancing strategy.
              </div>
            </div>
          </div>
        )}

        {!latestRun && !isRunning && (
          <div className="text-center py-10 px-4 text-slate-500 border border-dashed border-white/10 rounded-xl">
            <Terminal className="w-8 h-8 mx-auto mb-2 text-slate-600" />
            <p className="text-xs font-medium text-slate-400">
              Autonomous Supervisor is monitoring ClickHouse stream.
            </p>
            <p className="text-[11px] text-slate-500 mt-1">
              Click "Auto-Reallocate Screens" or switch scenarios to trigger an automated optimization cycle.
            </p>
          </div>
        )}

        {latestRun &&
          latestRun.steps.map((step: AgentThoughtStep, idx: number) => {
            const isToolCall = step.type === 'MCP_TOOL_CALL';
            const isDecision = step.type === 'DECISION';
            const isExecution = step.type === 'EXECUTION';

            return (
              <div
                key={idx}
                className={`p-3.5 rounded-xl border text-xs transition-all ${
                  isExecution
                    ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
                    : isDecision
                    ? 'bg-amber-950/20 border-amber-500/40 text-amber-300'
                    : isToolCall
                    ? 'bg-slate-900/90 border-cyan-500/30'
                    : 'bg-slate-900/50 border-white/5 text-slate-300'
                }`}
              >
                {/* Step Header */}
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-mono text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        isExecution
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : isDecision
                          ? 'bg-amber-500/20 text-amber-400'
                          : isToolCall
                          ? 'bg-cyan-500/20 text-cyan-400'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      STEP {step.stepNumber}
                    </span>
                    <span className="font-bold text-white tracking-wide">
                      {step.title}
                    </span>
                  </div>

                  {step.toolDetails && (
                    <span className="text-[10px] text-cyan-400 font-mono flex items-center gap-1">
                      <Database className="w-3 h-3" />
                      {step.toolDetails.latencyMs}ms
                    </span>
                  )}
                </div>

                {/* Step Description */}
                <p className="text-slate-300 leading-relaxed">{step.description}</p>

                {/* If Tool Call: Show SQL snippet & response summary */}
                {step.toolDetails && step.toolDetails.sqlQuery && (
                  <div className="mt-2.5">
                    <div className="text-[10px] uppercase font-bold text-slate-400 mb-1 flex items-center gap-1">
                      <Terminal className="w-3 h-3 text-cyan-400" />
                      ClickHouse SQL Dispatched:
                    </div>
                    <pre className="code-block whitespace-pre-wrap">
                      {step.toolDetails.sqlQuery}
                    </pre>
                  </div>
                )}
              </div>
            );
          })}
      </div>

      {/* Summary Action Card if latestRun exists */}
      {latestRun && (
        <div className="mt-4 pt-3 border-t border-white/10 bg-slate-950/60 p-3 rounded-xl border border-white/5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-white flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Optimization Deployed
            </span>
            <span className="text-cyan-400 font-bold font-mono">
              +${latestRun.reclaimedRevenue.toLocaleString()} Net Gain
            </span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Key className="w-3 h-3 text-amber-400" />
              KDM {latestRun.kdmCert.kdmUuid.substring(0, 14)}...
            </span>
            <span className="flex items-center gap-1">
              <Megaphone className="w-3 h-3 text-purple-400" />
              +${latestRun.adAdjustment.budgetAdjustment} {latestRun.adAdjustment.platform}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
