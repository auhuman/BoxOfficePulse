import React from 'react';
import { X, Database, Play, Check, Clock, Sparkles } from 'lucide-react';
import { clickhouseEngine, type ClickHouseQueryResult } from '../lib/clickhouse/client';

interface ClickHouseDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_QUERIES = [
  {
    name: 'P99 Fill Rate Aggregation',
    sql: `SELECT 
    theater_id,
    theater_name,
    dma,
    movie_title,
    quantileExact(0.99)(fill_rate_pct) AS p99_fill,
    sum(revenue) AS recent_revenue
FROM ticket_sales_stream
WHERE event_time >= now() - INTERVAL 15 MINUTE
GROUP BY theater_id, theater_name, dma, movie_title
HAVING p99_fill >= 90.0
ORDER BY p99_fill DESC;`
  },
  {
    name: 'Screen Allocations',
    sql: `SELECT 
    theater_id,
    screen_number,
    screen_name,
    movie_title,
    current_fill_rate_pct,
    status
FROM dcp_screen_allocations
ORDER BY theater_id, screen_number;`
  },
  {
    name: 'Live Telemetry Stream',
    sql: `SELECT 
    event_id,
    timestamp,
    theater_name,
    movie_title,
    ticket_count,
    revenue,
    fill_rate_pct
FROM ticket_sales_stream
ORDER BY timestamp DESC
LIMIT 10;`
  }
];

export const ClickHouseDrawer: React.FC<ClickHouseDrawerProps> = ({ isOpen, onClose }) => {
  const [activeSql, setActiveSql] = React.useState<string>(PRESET_QUERIES[0].sql);
  const [queryResult, setQueryResult] = React.useState<ClickHouseQueryResult | null>(null);
  const [isExecuting, setIsExecuting] = React.useState<boolean>(false);

  if (!isOpen) return null;

  const handleExecute = async (sqlToRun?: string) => {
    const sql = sqlToRun || activeSql;
    setIsExecuting(true);
    try {
      const res = await clickhouseEngine.executeQuery(sql);
      setQueryResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-2xl bg-[#080c13] border-l border-white/10 h-full flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">ClickHouse SQL Terminal & Schema</h3>
              <p className="text-[11px] text-slate-400">MergeTree Engine & Analytical Workbench</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4">
          {/* Preset Buttons */}
          <div className="flex flex-wrap gap-1.5">
            {PRESET_QUERIES.map((p, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setActiveSql(p.sql);
                  handleExecute(p.sql);
                }}
                className="text-xs bg-slate-900 hover:bg-slate-800 text-slate-300 border border-white/10 px-2.5 py-1 rounded-md transition-colors"
              >
                {p.name}
              </button>
            ))}
          </div>

          {/* Editor */}
          <div className="relative">
            <textarea
              value={activeSql}
              onChange={(e) => setActiveSql(e.target.value)}
              rows={6}
              className="w-full bg-[#04070c] border border-white/10 rounded-xl p-3 font-mono text-xs text-cyan-300 focus:outline-none focus:border-cyan-400 resize-y"
            />
            <button
              onClick={() => handleExecute()}
              disabled={isExecuting}
              className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs px-3 py-1.5 rounded-lg transition-all"
            >
              {isExecuting ? <Sparkles className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5 fill-slate-950" />}
              <span>Execute SQL</span>
            </button>
          </div>

          {/* Stats */}
          {queryResult && (
            <div className="flex items-center gap-4 text-xs font-mono text-slate-300 py-1.5 px-3 bg-slate-900/60 rounded-lg border border-white/5">
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> {queryResult.rows} rows
              </span>
              <span>|</span>
              <span className="text-cyan-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> {queryResult.statistics.elapsed.toFixed(1)} ms
              </span>
            </div>
          )}

          {/* Results Table */}
          {queryResult && queryResult.data.length > 0 && (
            <div className="overflow-x-auto rounded-xl border border-white/10 bg-[#04070c]">
              <table className="w-full text-left text-xs border-collapse font-mono">
                <thead>
                  <tr className="border-b border-white/10 bg-slate-900/90 text-slate-300">
                    {Object.keys(queryResult.data[0]).map((k) => (
                      <th key={k} className="py-2 px-3 text-[10px] uppercase font-bold tracking-wider">
                        {k}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-200">
                  {queryResult.data.map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-slate-800/40">
                      {Object.values(row).map((v: any, cIdx) => (
                        <td key={cIdx} className="py-1.5 px-3 whitespace-nowrap text-xs">
                          {typeof v === 'number' ? v.toLocaleString() : String(v)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
