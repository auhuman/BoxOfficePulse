import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { WorkflowStepper, type WorkflowStepId } from './components/WorkflowStepper';
import { StageSignal } from './components/stages/StageSignal';
import { StageDiagnose } from './components/stages/StageDiagnose';
import { StageRecommend } from './components/stages/StageRecommend';
import { StageDispatch } from './components/stages/StageDispatch';
import { StageVerified } from './components/stages/StageVerified';
import { KDMModal } from './components/KDMModal';
import { ClickHouseDrawer } from './components/ClickHouseDrawer';
import { clickhouseEngine } from './lib/clickhouse/client';
import { telemetrySimulator, DEMO_SCENARIOS } from './lib/telemetry/simulator';
import type { Theater, Movie, ScenarioPreset } from './types';
import { Film, Database, RefreshCw, Flame } from 'lucide-react';

export const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<WorkflowStepId>(1);
  const [maxCompletedStep, setMaxCompletedStep] = useState<WorkflowStepId>(1);

  const [theaters] = useState<Theater[]>(clickhouseEngine.getTheaters());
  const [movies] = useState<Movie[]>(clickhouseEngine.getMovies());
  const [scenarioIndex, setScenarioIndex] = useState<number>(0);
  const [activeScenario, setActiveScenario] = useState<ScenarioPreset>(DEMO_SCENARIOS[0]);

  // Modals & Drawers
  const [isKdmOpen, setIsKdmOpen] = useState<boolean>(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  // Active Theater & Movie
  const theater = theaters.find(t => t.dma.includes(activeScenario.primaryDma.split(',')[0])) || theaters[0];
  const surgingMovie = movies.find(m => m.id === activeScenario.surgingMovieId) || movies[0];
  const underperformingMovie = movies.find(m => m.id === activeScenario.underperformingMovieId) || movies[1];
  const allocations = clickhouseEngine.getScreenAllocations(theater.id);
  const metrics = clickhouseEngine.getMetrics();

  // Handle Step Progression
  const handleAdvanceToDiagnose = () => {
    setCurrentStep(2);
    setMaxCompletedStep(prev => Math.max(prev, 2) as WorkflowStepId);
  };

  const handleAdvanceToRecommend = () => {
    setCurrentStep(3);
    setMaxCompletedStep(prev => Math.max(prev, 3) as WorkflowStepId);
  };

  const handleApproveReallocation = () => {
    setCurrentStep(4);
    setMaxCompletedStep(prev => Math.max(prev, 4) as WorkflowStepId);
  };

  const handleDispatchComplete = () => {
    // Perform reallocation in ClickHouse engine
    clickhouseEngine.reallocateScreen(theater.id, 4, surgingMovie.id);

    // Fire Confetti
    confetti({
      particleCount: 90,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#00f2fe', '#4facfe', '#10b981', '#ff9f1c']
    });

    setCurrentStep(5);
    setMaxCompletedStep(5);
  };

  const handleNextAnomaly = () => {
    const nextIdx = (scenarioIndex + 1) % DEMO_SCENARIOS.length;
    setScenarioIndex(nextIdx);
    const nextScenario = DEMO_SCENARIOS[nextIdx];
    setActiveScenario(nextScenario);
    telemetrySimulator.setScenario(nextScenario.id);

    // Reset workflow to step 1
    setCurrentStep(1);
    setMaxCompletedStep(1);
  };

  const handleResetWorkflow = () => {
    setCurrentStep(1);
    setMaxCompletedStep(1);
  };

  return (
    <div className="min-h-screen bg-[#06090e] text-slate-100 flex flex-col selection:bg-cyan-400 selection:text-black font-sans">
      {/* Calm, Minimal Studio Header */}
      <header className="border-b border-white/5 bg-[#080c13]/80 backdrop-blur-md px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-400/20 text-slate-950">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight text-white">
                  BOXOFFICE <span className="text-cyan-400">PULSE</span>
                </span>
                <span className="text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  ClickHouse Track
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Autonomous Screen Allocation & Telemetry Workflow
              </p>
            </div>
          </div>

          {/* Right Status & Controls */}
          <div className="flex items-center gap-4 text-xs">
            {/* Reclaimed Yield Pill */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 font-mono">
              <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>+${metrics.reclaimedRevenue.toLocaleString()} Reclaimed</span>
            </div>

            {/* ClickHouse Terminal Button */}
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-white/10 transition-colors"
            >
              <Database className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden md:inline">ClickHouse Terminal</span>
            </button>

            {/* Reset / Scenario Pill */}
            <button
              onClick={handleResetWorkflow}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Reset to Step 1"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Workflow Canvas */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-10 flex flex-col justify-center">
        {/* Progress Stepper */}
        <WorkflowStepper
          currentStep={currentStep}
          onSelectStep={(step) => setCurrentStep(step)}
          maxCompletedStep={maxCompletedStep}
        />

        {/* Dynamic Workflow Stages */}
        <div className="transition-all duration-300">
          {currentStep === 1 && (
            <StageSignal
              surgingMovie={surgingMovie}
              theater={theater}
              onAdvance={handleAdvanceToDiagnose}
            />
          )}

          {currentStep === 2 && (
            <StageDiagnose
              theater={theater}
              allocations={allocations}
              movies={movies}
              onBack={() => setCurrentStep(1)}
              onAdvance={handleAdvanceToRecommend}
            />
          )}

          {currentStep === 3 && (
            <StageRecommend
              theater={theater}
              surgingMovieTitle={surgingMovie.title}
              replacedMovieTitle={underperformingMovie.title}
              targetScreenNumber={4}
              projectedRevenue={27560}
              onBack={() => setCurrentStep(2)}
              onApprove={handleApproveReallocation}
            />
          )}

          {currentStep === 4 && (
            <StageDispatch onComplete={handleDispatchComplete} />
          )}

          {currentStep === 5 && (
            <StageVerified
              theater={theater}
              surgingMovieTitle={surgingMovie.title}
              reclaimedRevenue={27560}
              onOpenKdm={() => setIsKdmOpen(true)}
              onOpenAudit={() => setIsDrawerOpen(true)}
              onNextAnomaly={handleNextAnomaly}
            />
          )}
        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="border-t border-white/5 py-4 px-6 text-center text-xs text-slate-500">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <span>Agentic Cinema: The Blockbuster Hackathon</span>
          <span className="font-mono text-cyan-500/80">ClickHouse MergeTree Engine • Gemini Supervisor</span>
          <span>MIT License</span>
        </div>
      </footer>

      {/* KDM Certificate Modal */}
      <KDMModal
        isOpen={isKdmOpen}
        onClose={() => setIsKdmOpen(false)}
        allocation={allocations[3] || allocations[0]}
        customCert={{
          kdmUuid: 'KDM-UUID-ATX-98124',
          targetDcpUuid: 'DCP-SMPTE-M01-NEON',
          authorizedWindow: '2026-09-05 to 2026-09-12'
        }}
      />

      {/* ClickHouse SQL Drawer */}
      <ClickHouseDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </div>
  );
};

export default App;
