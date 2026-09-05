import React from 'react';
import { Check, Radio, BarChart3, Bot, Zap, Award } from 'lucide-react';

export type WorkflowStepId = 1 | 2 | 3 | 4 | 5;

interface WorkflowStepperProps {
  currentStep: WorkflowStepId;
  onSelectStep: (step: WorkflowStepId) => void;
  maxCompletedStep: WorkflowStepId;
}

const STEPS = [
  { id: 1, label: 'Signal', icon: Radio, sub: 'Surge Alert' },
  { id: 2, label: 'Diagnose', icon: BarChart3, sub: 'ClickHouse Data' },
  { id: 3, label: 'Recommend', icon: Bot, sub: 'Agent Strategy' },
  { id: 4, label: 'Dispatch', icon: Zap, sub: 'KDM & Ad Shift' },
  { id: 5, label: 'Outcome', icon: Award, sub: 'Verified Yield' }
];

export const WorkflowStepper: React.FC<WorkflowStepperProps> = ({
  currentStep,
  onSelectStep,
  maxCompletedStep
}) => {
  return (
    <div className="w-full max-w-3xl mx-auto mb-8">
      <div className="flex items-center justify-between relative">
        {/* Connecting track line */}
        <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-0.5 bg-white/10 -z-0">
          <div
            className="h-full bg-cyan-400 transition-all duration-500"
            style={{
              width: `${((Math.min(maxCompletedStep, currentStep) - 1) / (STEPS.length - 1)) * 100}%`
            }}
          />
        </div>

        {STEPS.map((step) => {
          const isCurrent = step.id === currentStep;
          const isDone = step.id < currentStep || step.id <= maxCompletedStep;
          const isClickable = step.id <= maxCompletedStep + 1;
          const Icon = step.icon;

          return (
            <button
              key={step.id}
              onClick={() => isClickable && onSelectStep(step.id as WorkflowStepId)}
              disabled={!isClickable}
              className={`relative z-10 flex flex-col items-center group transition-all ${
                isClickable ? 'cursor-pointer' : 'cursor-not-allowed opacity-40'
              }`}
            >
              {/* Step Circle */}
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                  isCurrent
                    ? 'bg-cyan-400 text-slate-950 ring-4 ring-cyan-400/20 shadow-lg shadow-cyan-400/30 scale-110'
                    : isDone
                    ? 'bg-slate-800 text-cyan-300 border border-cyan-500/40 group-hover:border-cyan-400'
                    : 'bg-slate-900 text-slate-500 border border-white/10'
                }`}
              >
                {isDone && !isCurrent ? (
                  <Check className="w-4 h-4 text-cyan-400 stroke-[3]" />
                ) : (
                  <Icon className="w-4 h-4" />
                )}
              </div>

              {/* Step Labels */}
              <div className="text-center mt-2">
                <span
                  className={`block text-xs font-semibold tracking-wide transition-colors ${
                    isCurrent
                      ? 'text-white font-bold'
                      : isDone
                      ? 'text-slate-300'
                      : 'text-slate-500'
                  }`}
                >
                  {step.label}
                </span>
                <span className="block text-[10px] text-slate-400">
                  {step.sub}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
