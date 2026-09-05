import { clickhouseEngine } from '../clickhouse/client';
import type { TicketSaleEvent, ScenarioPreset } from '../../types';

export const DEMO_SCENARIOS: ScenarioPreset[] = [
  {
    id: 'midnight-blockbuster-surge',
    name: 'Midnight Blockbuster Frenzy',
    tagline: 'Neon Odyssey: 2099 sellout crisis in Austin & SoCal',
    description: 'Demand for opening night IMAX & standard screens spikes past 99% occupancy. Turnaway queues exceed 400 patrons per hour. Agent must detect surge and cannibalize empty screen.',
    surgingMovieId: 'M-01',
    underperformingMovieId: 'M-02',
    primaryDma: 'Austin, TX'
  },
  {
    id: 'flop-cannibalization',
    name: 'Indie Screen Swap & Yield Max',
    tagline: 'Cannibalize empty art-house screens for sold-out sci-fi',
    description: 'Midweek screening of "The Silent Meadow" averaging 14% fill rate. Agent redirects screen capacity to high-margin blockbuster.',
    surgingMovieId: 'M-01',
    underperformingMovieId: 'M-05',
    primaryDma: 'Los Angeles, CA'
  },
  {
    id: 'viral-tiktok-surge',
    name: 'Viral TikTok Campaign Surge',
    tagline: 'Gen-Z demographic surge requiring instant ad spend rebalancing',
    description: 'Ticketing velocity in Atlanta and New York surges 340% following viral social media trend. Agent reallocates screen format & boots local Meta/TikTok ad budget.',
    surgingMovieId: 'M-03',
    underperformingMovieId: 'M-02',
    primaryDma: 'New York, NY'
  }
];

export class TelemetrySimulator {
  private timer: any = null;
  private isStreaming: boolean = true;
  private currentScenario: ScenarioPreset = DEMO_SCENARIOS[0];
  private listeners: ((event: TicketSaleEvent) => void)[] = [];

  constructor() {
    this.startStreaming();
  }

  public onEvent(cb: (event: TicketSaleEvent) => void) {
    this.listeners.push(cb);
  }

  public startStreaming(intervalMs: number = 1200) {
    if (this.timer) clearInterval(this.timer);
    this.isStreaming = true;

    this.timer = setInterval(() => {
      this.generateTick();
    }, intervalMs);
  }

  public stopStreaming() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    this.isStreaming = false;
  }

  public toggleStreaming(): boolean {
    if (this.isStreaming) {
      this.stopStreaming();
    } else {
      this.startStreaming();
    }
    return this.isStreaming;
  }

  public getStreamingStatus(): boolean {
    return this.isStreaming;
  }

  public setScenario(scenarioId: string) {
    const found = DEMO_SCENARIOS.find(s => s.id === scenarioId);
    if (found) {
      this.currentScenario = found;
      for (let i = 0; i < 5; i++) {
        this.generateTick(true);
      }
    }
  }

  public getActiveScenario(): ScenarioPreset {
    return this.currentScenario;
  }

  private generateTick(isBurst: boolean = false) {
    const theaters = clickhouseEngine.getTheaters();
    const movies = clickhouseEngine.getMovies();

    const scenarioTheater = theaters.find(t => t.dma.includes(this.currentScenario.primaryDma.split(',')[0])) || theaters[0];
    const theater = Math.random() > 0.35 ? scenarioTheater : theaters[Math.floor(Math.random() * theaters.length)];

    const surgingMovie = movies.find(m => m.id === this.currentScenario.surgingMovieId) || movies[0];
    const movie = Math.random() > 0.4 ? surgingMovie : movies[Math.floor(Math.random() * movies.length)];

    const isSurgeMovie = movie.id === this.currentScenario.surgingMovieId;
    const fillRate = isSurgeMovie 
      ? Math.min(100, 91.5 + Math.random() * 8.5) 
      : 12 + Math.random() * 60;

    const count = isBurst ? Math.floor(4 + Math.random() * 8) : Math.floor(1 + Math.random() * 6);
    const pricePerTicket = movie.id === 'M-01' ? 22.5 : (movie.id === 'M-03' ? 18.0 : 15.0);

    const event: TicketSaleEvent = {
      eventId: `EVT-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      timestamp: new Date().toLocaleTimeString(),
      theaterId: theater.id,
      theaterName: theater.name,
      dma: theater.dma,
      screenNumber: Math.floor(1 + Math.random() * 6),
      movieId: movie.id,
      movieTitle: movie.title,
      ticketCount: count,
      revenue: count * pricePerTicket,
      seatTier: Math.random() > 0.6 ? 'VIP Recliner' : 'Standard',
      ageGroup: isSurgeMovie ? (Math.random() > 0.5 ? '18-24' : '25-34') : (Math.random() > 0.5 ? '35-49' : '50+'),
      fillRatePct: parseFloat(fillRate.toFixed(1))
    };

    clickhouseEngine.ingestEvent(event);
    this.listeners.forEach(cb => cb(event));
  }
}

export const telemetrySimulator = new TelemetrySimulator();
