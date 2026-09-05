import { ClickHouseMcpServer, type McpToolCallResult } from '../clickhouse/mcp-server';
import { clickhouseEngine } from '../clickhouse/client';
import type { AgentAction, ScreenAllocation } from '../../types';

export interface AgentThoughtStep {
  stepNumber: number;
  type: 'THOUGHT' | 'MCP_TOOL_CALL' | 'DECISION' | 'EXECUTION';
  title: string;
  description: string;
  toolDetails?: {
    toolName: string;
    sqlQuery?: string;
    output: any;
    latencyMs: number;
  };
}

export interface AgentRunResult {
  runId: string;
  timestamp: string;
  theaterId: string;
  theaterName: string;
  dma: string;
  surgingMovie: string;
  replacedMovie: string;
  screenNumber: number;
  reclaimedRevenue: number;
  steps: AgentThoughtStep[];
  reallocatedScreen: ScreenAllocation | null;
  kdmCert: {
    kdmUuid: string;
    targetDcpUuid: string;
    screenId: string;
    authorizedWindow: string;
    cryptoThumbprint: string;
  };
  adAdjustment: {
    platform: 'Meta Ads' | 'Google Search' | 'TikTok Campaign';
    targetZip: string;
    budgetAdjustment: number;
  };
}

export class GeminiAutonomousSupervisor {
  private isRunning: boolean = false;
  private listeners: ((result: AgentRunResult) => void)[] = [];

  public onActionExecuted(cb: (result: AgentRunResult) => void) {
    this.listeners.push(cb);
  }

  public async runAutonomousOptimization(targetTheaterId: string = 'T-ATX-01'): Promise<AgentRunResult> {
    if (this.isRunning) {
      throw new Error('Agent optimization cycle already in progress.');
    }

    this.isRunning = true;
    const steps: AgentThoughtStep[] = [];
    const runId = `OP-RUN-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const now = new Date();

    try {
      // 1. Initial Thought: Inspecting live ClickHouse telemetry
      steps.push({
        stepNumber: 1,
        type: 'THOUGHT',
        title: 'Inspecting Live Audience Telemetry in ClickHouse',
        description: `Autonomous Supervisor initiating telemetry scan for opening weekend demand spikes across US multiplex nodes.`
      });

      // 2. Step 1: Call ClickHouse MCP Tool to calculate P99 Fill Rates
      const p99ToolResult: McpToolCallResult = await ClickHouseMcpServer.executeTool('clickhouse_get_p99_fill_rates', {
        lookbackMinutes: 15,
        minThresholdPct: 92.0
      });

      steps.push({
        stepNumber: 2,
        type: 'MCP_TOOL_CALL',
        title: 'ClickHouse MCP: Calculate P99 Fill Rates',
        description: 'Queried ClickHouse stream materialized view for P99 quantile fill rates by theater & movie.',
        toolDetails: {
          toolName: 'clickhouse_get_p99_fill_rates',
          sqlQuery: p99ToolResult.clickhouseSqlExecuted,
          output: p99ToolResult.result,
          latencyMs: p99ToolResult.executionTimeMs
        }
      });

      // Target theater & surging movie extraction
      const surgingItem = p99ToolResult.result.find((r: any) => r.theater_id === targetTheaterId) || p99ToolResult.result[0];
      const theaterId = surgingItem ? surgingItem.theater_id : targetTheaterId;
      const theaterName = surgingItem ? surgingItem.theater_name : 'Austin Alamo Domain Drafthouse';
      const dma = surgingItem ? surgingItem.dma : 'Austin, TX';
      const surgingMovieTitle = surgingItem ? surgingItem.movie_title : 'Neon Odyssey: 2099';
      const surgingMovieId = surgingItem ? surgingItem.movie_id : 'M-01';

      // 3. Step 2: Formulate Hypothesis & Search Cannibalization Candidates
      steps.push({
        stepNumber: 3,
        type: 'THOUGHT',
        title: `Surge Detected: ${surgingMovieTitle} at ${theaterName}`,
        description: `P99 fill rate is 99.2% with active waitlists. Scanning multiplex for screens showing underperforming titles (<30% fill rate) to cannibalize.`
      });

      const cannibalizeToolResult: McpToolCallResult = await ClickHouseMcpServer.executeTool('clickhouse_detect_screen_cannibalization_targets', {
        theaterId: theaterId
      });

      steps.push({
        stepNumber: 4,
        type: 'MCP_TOOL_CALL',
        title: 'ClickHouse MCP: Scan Cannibalization Targets',
        description: `Executed query against dcp_screen_allocations in ClickHouse to locate under-utilized screens.`,
        toolDetails: {
          toolName: 'clickhouse_detect_screen_cannibalization_targets',
          sqlQuery: cannibalizeToolResult.clickhouseSqlExecuted,
          output: cannibalizeToolResult.result,
          latencyMs: cannibalizeToolResult.executionTimeMs
        }
      });

      const targetScreen = cannibalizeToolResult.result[0] || {
        screen_number: 4,
        screen_name: 'Auditorium 4 - Standard',
        movie_title: 'Shadows in the Mist',
        movie_id: 'M-02',
        capacity: 220
      };

      // 4. Step 3: Compute Financial Uplift & Ad Yield in ClickHouse
      const revenueToolResult: McpToolCallResult = await ClickHouseMcpServer.executeTool('clickhouse_get_revenue_attribution_delta', {
        theaterId: theaterId,
        surgingMovieId: surgingMovieId
      });

      steps.push({
        stepNumber: 5,
        type: 'MCP_TOOL_CALL',
        title: 'ClickHouse MCP: Calculate Financial Uplift',
        description: `Projected incremental yield and ROI for dynamic screen reallocation in DMA ${dma}.`,
        toolDetails: {
          toolName: 'clickhouse_get_revenue_attribution_delta',
          sqlQuery: revenueToolResult.clickhouseSqlExecuted,
          output: revenueToolResult.result,
          latencyMs: revenueToolResult.executionTimeMs
        }
      });

      const projectedGain = Math.round(targetScreen.capacity * 22.5 * 3.5); // 3-4 showtimes gained

      // 5. Step 4: Decision Formulation
      steps.push({
        stepNumber: 6,
        type: 'DECISION',
        title: `Decision: Swap Screen ${targetScreen.screen_number} -> ${surgingMovieTitle}`,
        description: `Cannibalizing ${targetScreen.movie_title} on Screen ${targetScreen.screen_number} (${targetScreen.capacity} seats). Minting new Digital Cinema Package KDM cryptographic license & shifting regional TikTok/Meta ad spend.`
      });

      // 6. Step 5: Execute Studio Actions (DCP Key Minting & ClickHouse Reallocation)
      const kdmUuid = `KDM-UUID-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
      const dcpUuid = `DCP-SMPTE-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
      const kdmCert = {
        kdmUuid: kdmUuid,
        targetDcpUuid: dcpUuid,
        screenId: `${theaterId}-SCR-${targetScreen.screen_number}`,
        authorizedWindow: `${now.toISOString().substring(0, 10)} to ${new Date(now.getTime() + 7 * 86400000).toISOString().substring(0, 10)}`,
        cryptoThumbprint: `SHA256:${Math.random().toString(16).substring(2, 14)}...${Math.random().toString(16).substring(2, 8)}`
      };

      const adAdjustment = {
        platform: 'TikTok Campaign' as const,
        targetZip: '78758',
        budgetAdjustment: 4500
      };

      const reallocatedScreen = clickhouseEngine.reallocateScreen(theaterId, targetScreen.screen_number, surgingMovieId);

      // Record Action in ClickHouse Audit Log
      const agentAction: AgentAction = {
        id: `ACT-${Math.random().toString(36).substring(2, 9)}`,
        timestamp: new Date().toLocaleTimeString(),
        type: 'DCP_REALLOCATION',
        theaterId: theaterId,
        theaterName: theaterName,
        dma: dma,
        movieSurging: surgingMovieTitle,
        movieReplaced: targetScreen.movie_title,
        screenNumber: targetScreen.screen_number,
        revenueDeltaEstimate: projectedGain,
        details: `Reallocated Screen ${targetScreen.screen_number} (${targetScreen.capacity} seats) from '${targetScreen.movie_title}' to '${surgingMovieTitle}'. KDM Key ${kdmUuid} minted. +$4,500 programmatic ad spend deployed to ZIP ${adAdjustment.targetZip}.`,
        kdmCertificate: kdmCert,
        adBudgetDelta: adAdjustment
      };

      clickhouseEngine.recordAgentAction(agentAction);

      steps.push({
        stepNumber: 7,
        type: 'EXECUTION',
        title: 'Actions Dispatched & Recorded in ClickHouse',
        description: `KDM Certificate minted. Screen ${targetScreen.screen_number} swapped in ClickHouse dcp_screen_allocations table. Programmatic ad boost of $${adAdjustment.budgetAdjustment} active.`
      });

      const finalResult: AgentRunResult = {
        runId,
        timestamp: new Date().toLocaleTimeString(),
        theaterId,
        theaterName,
        dma,
        surgingMovie: surgingMovieTitle,
        replacedMovie: targetScreen.movie_title,
        screenNumber: targetScreen.screen_number,
        reclaimedRevenue: projectedGain,
        steps,
        reallocatedScreen,
        kdmCert,
        adAdjustment
      };

      this.listeners.forEach(cb => cb(finalResult));
      return finalResult;
    } finally {
      this.isRunning = false;
    }
  }

  public isBusy(): boolean {
    return this.isRunning;
  }
}

export const agentSupervisor = new GeminiAutonomousSupervisor();
