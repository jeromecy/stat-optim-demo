'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedCounter from '@/components/ui/AnimatedCounter';
import { FLAVORS, randomAllocation, simulateAllocationStrategy } from '@/lib/gameLogic';
import type { FlavorId, Round1Data } from '@/lib/types';

const TOTAL_DAYS = 5;

type Phase = 'setup' | 'results';

interface Round1Props {
  onComplete: (data: Round1Data) => void;
}

export default function Round1({ onComplete }: Round1Props) {
  const [phase, setPhase] = useState<Phase>('setup');
  const [allocation, setAllocation] = useState<Record<FlavorId, number>>(() => randomAllocation(20));
  const [profitResults, setProfitResults] = useState<Round1Data['results']>([]);

  const totalProfit = useMemo(
    () => profitResults.reduce((sum, r) => sum + r.revenue, 0),
    [profitResults]
  );

  const handleReallocate = () => {
    setAllocation(randomAllocation(20));
  };

  const handleRun = () => {
    const results = simulateAllocationStrategy(allocation, TOTAL_DAYS, 1);
    setProfitResults(results);
    setPhase('results');
  };

  const handleContinue = () => {
    onComplete({
      allocation,
      results: profitResults,
      totalProfit,
    });
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <motion.div className="text-center mb-6" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-3 text-sm font-bold"
          style={{ background: 'rgba(245,158,11,0.2)', border: '1px solid rgba(245,158,11,0.45)', color: '#fcd34d' }}
        >
          Round 1 - Random Guess
        </div>
        <h2 className="text-2xl md:text-3xl font-black text-white">
          Start With Zero Data
        </h2>
        <p className="text-white/60 text-sm mt-2">
          Randomly allocate 20 scoops, then run a 5-day simulation.
        </p>
      </motion.div>

      <AnimatePresence mode="wait">
        {phase === 'setup' && (
          <motion.div
            key="setup"
            className="glass-card p-5"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
          >
            <p className="text-white/60 text-xs font-bold mb-3 uppercase tracking-wide">Current random allocation</p>
            <div className="space-y-2 mb-5">
              {FLAVORS.map((flavor) => (
                <div
                  key={flavor.id}
                  className="rounded-lg px-3 py-2 flex items-center justify-between"
                  style={{ background: `${flavor.bgColor}80`, border: `1px solid ${flavor.borderColor}40` }}
                >
                  <span style={{ color: flavor.textColor }} className="font-semibold text-sm">
                    {flavor.emoji} {flavor.name}
                  </span>
                  <span className="text-white font-black">{allocation[flavor.id]} scoops</span>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button className="btn-secondary flex-1" onClick={handleReallocate}>
                Re-allocate Randomly
              </button>
              <button className="btn-primary flex-1 justify-center" onClick={handleRun}>
                Next Step: Run 5 Days
              </button>
            </div>
          </motion.div>
        )}

        {phase === 'results' && (
          <motion.div
            key="results"
            className="glass-card p-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3 className="text-white font-black text-lg mb-3 text-center">5-Day Guessing Outcome</h3>
            <div className="space-y-2 mb-4">
              {profitResults.map((r) => (
                <div key={r.day} className="rounded-lg p-3 bg-white/5 border border-white/10 flex justify-between">
                  <span className="text-white/70">Day {r.day}</span>
                  <span className="text-green-300 font-black">${r.revenue}</span>
                </div>
              ))}
            </div>

            <div className="rounded-xl p-4 text-center mb-4" style={{ background: 'rgba(20,184,166,0.12)', border: '1px solid rgba(20,184,166,0.28)' }}>
              <p className="text-white/60 text-sm mb-1">Round 1 profit</p>
              <AnimatedCounter value={totalProfit} prefix="$" className="text-3xl font-black text-teal-300" />
            </div>

            <p className="text-center text-sm text-white/70 mb-4">
              This is your baseline from a random guess.
            </p>

            <button className="btn-primary w-full justify-center" onClick={handleContinue}>
              Continue to Round 2
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
