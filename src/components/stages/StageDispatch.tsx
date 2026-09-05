import React, { useEffect, useState } from 'react';
import { CheckCircle2, Loader2, Database, Key, Megaphone, Ticket, ShieldCheck } from 'lucide-react';

interface StageDispatchProps {
  onComplete: () => void;
}

const DISPATCH_STEPS = [
  { id: 1, title: 'ClickHouse Table Update', detail: 'dcp_screen_allocations updated in 1.8ms', icon: Database },
  { id: 2, title: 'SMPTE KDM License Minting', detail: 'Cryptographic AES-128 key signed (KDM-UUID-98124)', icon: Key },
  { id: 3, title: 'Projector Ingestion', detail: 'Certificate delivered to Alamo Domain Dolby server', icon: ShieldCheck },
  { id: 4, title: 'Hyperlocal Ad Spend Boost', detail: '+$4,500 deployed to TikTok & Meta campaigns (ZIP 78758)', icon: Megaphone },
  { id: 5, title: 'POS Ticketing Unlocked', detail: 'Inventory published to Fandango & online POS feeds', icon: Ticket }
];

export const StageDispatch: React.FC<StageDispatchProps> = ({ onComplete }) => {
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStepIndex((prev) => {
        if (prev < DISPATCH_STEPS.length) {
          return prev + 1;
        } else {
          clearInterval(timer);
          setTimeout(onComplete, 600);
          return prev;
        }
      });
    }, 450);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="max-w-xl mx-auto text-center space-y-8">
      <div>
        <h2 className="text-xl font-extrabold text-white tracking-tight">
          Dispatching Autonomous Studio Actions...
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          ClickHouse cluster is executing DDL updates and cryptographic KDM license delivery.
        </p>
      </div>

      <div className="glass-panel p-6 space-y-3.5 text-left">
        {DISPATCH_STEPS.map((step, idx) => {
          const isDone = idx < activeStepIndex;
          const isCurrent = idx === activeStepIndex;
          const Icon = step.icon;

          return (
            <div
              key={step.id}
              className={`p-3.5 rounded-xl border transition-all flex items-center justify-between ${
                isDone
                  ? 'bg-emerald-950/20 border-emerald-500/30'
                  : isCurrent
                  ? 'bg-cyan-950/30 border-cyan-500/40 shadow-lg shadow-cyan-500/10'
                  : 'bg-slate-900/40 border-white/5 opacity-40'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-lg ${
                    isDone
                      ? 'bg-emerald-500/10 text-emerald-400'
                      : isCurrent
                      ? 'bg-cyan-500/20 text-cyan-400'
                      : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">{step.title}</h4>
                  <p className="text-[11px] text-slate-400">{step.detail}</p>
                </div>
              </div>

              <div>
                {isDone ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                ) : isCurrent ? (
                  <Loader2 className="w-5 h-5 text-cyan-400 animate-spin" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-white/10" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
