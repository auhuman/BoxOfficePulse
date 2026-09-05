import React, { useState } from 'react';
import { Database, Play, Clock, Check, Sparkles } from 'lucide-react';
import { clickhouseEngine, type ClickHouseQueryResult } from '../lib/clickhouse/client';

const PRESET_QUERIES = [
  {
    name: 'P99 Fill Rate Aggregation',
    description: 'Calculate P95 & P99 quantile seat occupancy by DMA & theater',
    sql: `SELECT 
    theater_id,
    theater_name,
    dma,
    movie_id,
    movie_title,
    avg(fill_rate_pct) AS avg_fill,
    quantileExact(0.99)(fill_rate_pct) AS p99_fill,
    count() AS velocity_tps,
    sum(revenue) AS recent_revenue
FROM ticket_sales_stream
WHERE event_time >= now() - INTERVAL 15 MINUTE
GROUP BY theater_id, theater_name, dma, movie_id, movie_title
HAVING p99_fill >= 90.0
ORDER BY p99_fill DESC;`
  },
  {
    name: 'Screen Cannibalization Candidates',
    description: 'Find screens with low occupancy (<35%) available for blockbuster swap',
    sql: `SELECT 
    theater_id,
    screen_number,
    screen_name,
    format,
    capacity,
    movie_title,
    current_fill_rate_pct,
    revenue_today
FROM dcp_screen_allocations
WHERE current_fill_rate_pct <= 35.0
ORDER BY current_fill_rate_pct ASC;`
  },
  {
    name: 'Real-Time Ticketing Stream',
    description: 'Inspect live ingested POS sales events from multiplex nodes',
    sql: `SELECT 
    event_id,
    timestamp,
    theater_name,
    movie_title,
    ticket_count,
    revenue,
    seat_tier,
    fill_rate_pct
FROM ticket_sales_stream
ORDER BY timestamp DESC
LIMIT 15;`
  },
  {
    name: 'Agent Actions Audit Trail',
    description: 'Review autonomous studio agent DCP reallocations & ad adjustments',
    sql: `SELECT 
    action_id,
    action_time,
    action_type,
    theater_id,
    movie_surging,
    movie_replaced,
    revenue_delta_estimate,
    details
FROM agent_actions_audit
ORDER BY action_time DESC;`
  }
];

export const ClickHouseWorkbench: React.FC = () => {
  const [activeSql, setActiveSql] = useState<string>(PRESET_QUERIES[0].sql);
  const [queryResult, setQueryResult] = useState<ClickHouseQueryResult | null>(null);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);

  const handleExecute = async (sqlToRun?: string) => {
    const query = sqlToRun || activeSql;
    setIsExecuting(true);
    try {
      const res = await clickhouseEngine.executeQuery(query);
      setQueryResult(res);
    } catch (err) {
      console.error('ClickHouse query error:', err);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleSelectPreset = (sql: string) => {
    setActiveSql(sql);
    handleExecute(sql);
  };

  return (
    <div className="glass-panel p-5 mt-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-sm text-white tracking-wide uppercase flex items-center gap-2">
              <span>ClickHouse Analytical SQL Workbench</span>
              <span className="text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded">
                MergeTree & Materialized Views
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Run raw analytical queries against the high-throughput cinema telemetry engine.
            </p>
          </div>
        </div>

        {/* Preset Query Buttons */}
        <div className="flex flex-wrap gap-1.5">
          {PRESET_QUERIES.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectPreset(p.sql)}
              className="text-[11px] font-medium bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/10 hover:border-cyan-500/30 px-2.5 py-1.5 rounded-lg transition-all"
              title={p.description}
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* SQL Editor Box */}
      <div className="relative mb-3">
        <textarea
          value={activeSql}
          onChange={(e) => setActiveSql(e.target.value)}
          rows={5}
          className="w-full bg-[#04070c] border border-white/10 rounded-xl p-3.5 font-mono text-xs text-cyan-300 focus:outline-none focus:border-cyan-400 leading-relaxed resize-y"
          placeholder="SELECT * FROM ticket_sales_stream..."
        />
        <button
          onClick={() => handleExecute()}
          disabled={isExecuting}
          className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs px-3.5 py-1.5 rounded-lg shadow-md shadow-cyan-500/20 transition-all"
        >
          {isExecuting ? (
            <>
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
              <span>Querying...</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-slate-950" />
              <span>Run Query</span>
            </>
          )}
        </button>
      </div>

      {/* Query Stats Bar */}
      {queryResult && (
        <div className="flex items-center justify-between text-xs py-2 px-3 bg-slate-900/60 rounded-lg border border-white/5 mb-3 font-mono">
          <div className="flex items-center gap-4 text-slate-300">
            <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <Check className="w-3.5 h-3.5" />
              {queryResult.rows} rows returned
            </span>
            <span className="text-slate-500">|</span>
            <span className="flex items-center gap-1 text-cyan-400">
              <Clock className="w-3.5 h-3.5" />
              Elapsed: {queryResult.statistics.elapsed.toFixed(1)} ms
            </span>
            <span className="text-slate-500 hidden sm:inline">|</span>
            <span className="text-slate-400 hidden sm:inline">
              Read: {queryResult.statistics.rows_read} rows ({queryResult.statistics.bytes_read} B)
            </span>
          </div>
        </div>
      )}

      {/* Results Table */}
      {queryResult && queryResult.data.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-white/10 bg-[#06090e]">
          <table className="w-full text-left text-xs border-collapse font-mono">
            <thead>
              <tr className="border-b border-white/10 bg-slate-900/90 text-slate-300">
                {Object.keys(queryResult.data[0]).map((key) => (
                  <th key={key} className="py-2.5 px-3.5 font-bold uppercase tracking-wider text-[10px]">
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-200">
              {queryResult.data.map((row, rowIdx) => (
                <tr key={rowIdx} className="hover:bg-slate-800/40 transition-colors">
                  {Object.values(row).map((val: any, colIdx) => (
                    <td key={colIdx} className="py-2 px-3.5 whitespace-nowrap text-xs">
                      {typeof val === 'number'
                        ? val.toLocaleString()
                        : typeof val === 'object'
                        ? JSON.stringify(val)
                        : String(val)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
