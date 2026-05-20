'use client';

import { motion } from 'framer-motion';
import AnimatedCounter from '@/components/ui/AnimatedCounter';

interface FinalResultsProps {
  round1Profit: number;
  round2Profit: number;
  round3Profit: number;
  round4Profit: number;
  score: number;
  onRestart: () => void;
  onContinue: () => void;
}

export default function FinalResults({
  round1Profit,
  round2Profit,
  round3Profit,
  round4Profit,
  score,
  onRestart,
  onContinue,
}: FinalResultsProps) {
  const playerTotal = round1Profit + round2Profit + round3Profit + round4Profit;
  const estimatedBaseline = Math.round(round1Profit + round1Profit * 0.9 + round1Profit * 1.1 + round1Profit * 1.05);
  const improvement = playerTotal - estimatedBaseline;

  const stages = [
    { label: 'Round 1 Random Guess', profit: round1Profit, color: '#f59e0b' },
    { label: 'Round 2 Data Allocation', profit: round2Profit, color: '#14b8a6' },
    { label: 'Round 3 Seasonal Optimisation', profit: round3Profit, color: '#3b82f6' },
    { label: 'Round 4 Spatial Optimisation', profit: round4Profit, color: '#0ea5e9' },
  ];

  const maxProfit = Math.max(1, ...stages.map((s) => s.profit));

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <motion.div className="text-center mb-6" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="text-5xl mb-2">Final Results</div>
        <h2 className="text-3xl font-black text-white mb-2">You Completed the Full Optimisation Journey</h2>
        <p className="text-white/60">From random guessing to temporal and spatial planning.</p>
      </motion.div>

      <motion.div className="glass-card p-5 mb-5" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl p-3 text-center bg-white/5 border border-white/10">
            <p className="text-white/55 text-xs mb-1">Total profit</p>
            <AnimatedCounter value={playerTotal} prefix="$" className="text-3xl font-black text-teal-300" />
          </div>
          <div className="rounded-xl p-3 text-center bg-white/5 border border-white/10">
            <p className="text-white/55 text-xs mb-1">Final score</p>
            <AnimatedCounter value={score} className="text-3xl font-black text-sky-300" />
          </div>
        </div>

        <div className="rounded-xl p-3 mt-3 text-center" style={{ background: 'rgba(20,184,166,0.12)', border: '1px solid rgba(20,184,166,0.28)' }}>
          {improvement >= 0 ? (
            <p className="text-teal-200 text-sm font-semibold">You outperformed the random-only baseline by ${improvement}.</p>
          ) : (
            <p className="text-orange-200 text-sm font-semibold">This run finished ${Math.abs(improvement)} below the random-only baseline estimate.</p>
          )}
        </div>
      </motion.div>

      <motion.div className="glass-card p-5 mb-5" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <h3 className="text-white font-black text-base mb-4 text-center">Round-by-round performance</h3>
        <div className="space-y-3">
          {stages.map((stage) => (
            <div key={stage.label}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-white/80 font-semibold">{stage.label}</span>
                <span className="font-black" style={{ color: stage.color }}>${stage.profit}</span>
              </div>
              <div className="h-7 rounded-xl bg-white/10 overflow-hidden">
                <div className="h-full rounded-xl" style={{ width: `${(stage.profit / maxProfit) * 100}%`, backgroundColor: stage.color }} />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div className="rounded-xl p-4 mb-6 text-center" style={{ background: 'rgba(14,165,233,0.12)', border: '1px solid rgba(14,165,233,0.3)' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        <p className="text-sky-100 text-sm font-semibold">
          Key takeaway: optimisation is multi-layered. Better outcomes came from combining demand data, seasonal planning, and spatial allocation.
        </p>
      </motion.div>

      <div className="flex flex-col gap-3">
        <button className="btn-primary w-full justify-center text-lg" onClick={onContinue}>
          See Real-World Examples
        </button>
        <button className="btn-secondary w-full text-center" onClick={onRestart}>
          Restart Game
        </button>
      </div>
    </div>
  );
}
