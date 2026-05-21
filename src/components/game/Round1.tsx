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
    <div className="max-w-2xl lg:max-w-4xl mx-auto px-4 py-6">
      <motion.div className="text-center mb-6" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-3 text-sm font-bold"
          style={{ background: 'rgba(239,68,68,0.18)', border: '1px solid rgba(239,68,68,0.5)', color: '#b91c1c' }}
        >
          🎲 Round 1 – Blind Random Guess
        </div>
        <h2 className="text-2xl md:text-3xl font-black text-[#001E62]">
          No Data. No Analysis.{' '}
          <span style={{ color: '#f59e0b' }}>Pure Guess.</span>
        </h2>
        <p className="text-[#001E62]/70 text-sm mt-2">
          You have 20 scoops but <strong className="text-[#001E62]">zero customer data</strong>. The computer randomly assigns flavours — then we run 5 days to see what happens.
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
            <div className="rounded-lg p-3 mb-4" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}>
              <p className="text-red-200 text-sm font-semibold text-center">🎲 This allocation is <em>completely random</em> — no data, no logic, no analysis whatsoever.</p>
            </div>
            <p className="text-white/60 text-xs font-bold mb-3 uppercase tracking-wide">Current random allocation</p>
            <div className="space-y-2 mb-5">
              {FLAVORS.map((flavor) => (
                <div
                  key={flavor.id}
                  className="rounded-lg px-3 py-2 flex items-center justify-between"
                  style={{ background: `${flavor.borderColor}20`, border: `1px solid ${flavor.borderColor}70` }}
                >
                  <span style={{ color: flavor.textColor }} className="font-semibold text-sm">
                    {flavor.emoji} {flavor.name}
                  </span>
                  <span className="font-black text-sm" style={{ color: flavor.textColor }}>{allocation[flavor.id]} scoops</span>
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
