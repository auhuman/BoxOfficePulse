export type CinemaFormat = 'IMAX 70mm' | 'Dolby Cinema' | 'Laser 4K' | 'Standard Digital';

export interface Movie {
  id: string;
  title: string;
  genre: string;
  runtimeMins: number;
  distributor: string;
  posterUrl: string;
  targetDemographic: string;
  nationalGrossToday: number;
  surgeStatus: 'SURGING' | 'STABLE' | 'UNDERPERFORMING';
  colorAccent: string;
}

export interface Theater {
  id: string;
  name: string;
  chain: string;
  dma: string; // Designated Market Area e.g. Los Angeles, New York, Austin
  city: string;
  state: string;
  zipCode: string;
  lat: number;
  lng: number;
  totalScreens: number;
  totalSeats: number;
  currentOccupancyPct: number;
  surgeFactor: number;
  reallocationsCount: number;
}

export interface ScreenAllocation {
  theaterId: string;
  screenNumber: number;
  screenName: string;
  format: CinemaFormat;
  capacity: number;
  movieId: string;
  movieTitle: string;
  currentFillRatePct: number;
  ticketsSoldToday: number;
  revenueToday: number;
  dcpLicenseKey: string;
  kdmExpiresAt: string;
  status: 'ACTIVE' | 'SWAPPING' | 'REALLOCATED';
  previousMovieId?: string;
}

export interface TicketSaleEvent {
  eventId: string;
  timestamp: string;
  theaterId: string;
  theaterName: string;
  dma: string;
  screenNumber: number;
  movieId: string;
  movieTitle: string;
  ticketCount: number;
  revenue: number;
  seatTier: 'VIP Recliner' | 'Standard' | 'Balcony';
  ageGroup: '18-24' | '25-34' | '35-49' | '50+';
  fillRatePct: number;
}

export interface AgentAction {
  id: string;
  timestamp: string;
  type: 'DCP_REALLOCATION' | 'AD_SPEND_REBALANCE' | 'DISTRIBUTION_ALERT' | 'CLICKHOUSE_QUERY';
  theaterId?: string;
  theaterName?: string;
  dma?: string;
  movieSurging?: string;
  movieReplaced?: string;
  screenNumber?: number;
  revenueDeltaEstimate: number;
  details: string;
  kdmCertificate?: {
    kdmUuid: string;
    targetDcpUuid: string;
    screenId: string;
    authorizedWindow: string;
    cryptoThumbprint: string;
  };
  adBudgetDelta?: {
    platform: 'Meta Ads' | 'Google Search' | 'TikTok Campaign';
    targetZip: string;
    budgetAdjustment: number;
  };
  sqlQuery?: string;
}

export interface ClickHouseMetrics {
  totalEventsIngested: number;
  queryLatencyMs: number;
  ingestionTps: number;
  p99FillRatePct: number;
  p95FillRatePct: number;
  totalGrossRevenue: number;
  reclaimedRevenue: number;
  activeTheatersCount: number;
  swappedScreensCount: number;
}

export interface ScenarioPreset {
  id: string;
  name: string;
  tagline: string;
  description: string;
  surgingMovieId: string;
  underperformingMovieId: string;
  primaryDma: string;
}
