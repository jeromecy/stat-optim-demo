'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip } from 'recharts';
import AllocationInput from '@/components/ui/AllocationInput';
import AnimatedCounter from '@/components/ui/AnimatedCounter';
import { FLAVORS, simulateAllocationStrategy } from '@/lib/gameLogic';
import type { FlavorId, Round2Data } from '@/lib/types';

const TOTAL_DAYS = 5;
const BASELINE_PREF: Record<FlavorId, number> = {
  chocolate: 40,
  vanilla: 28,
  strawberry: 18,
  matcha: 9,
  rainbow: 5,
};

const DEFAULT_ALLOCATION: Record<FlavorId, number> = {
  chocolate: 8,
  vanilla: 5,
  strawberry: 4,
  matcha: 2,
  rainbow: 1,
};

type Phase = 'allocate' | 'results';

interface Round2Props {
  round1Profit: number;
  onComplete: (data: Round2Data) => void;
}

export default function Round2({ round1Profit, onComplete }: Round2Props) {
  const [phase, setPhase] = useState<Phase>('allocate');
  const [allocation, setAllocation] = useState<Record<FlavorId, number>>({ ...DEFAULT_ALLOCATION });
  const [results, setResults] = useState<Round2Data['results']>([]);

  const usedScoops = Object.values(allocation).reduce((sum, v) => sum + v, 0);
  const totalProfit = useMemo(() => results.reduce((sum, r) => sum + r.revenue, 0), [results]);

  const demandChart = FLAVORS.map((f) => ({
    id: f.id,
    label: `${f.emoji} ${f.name.split(' ')[0]}`,
    pct: BASELINE_PREF[f.id],
    color: f.borderColor,
  }));

  const handleSimulate = () => {
    if (usedScoops !== 20) return;
    const run = simulateAllocationStrategy(allocation, TOTAL_DAYS, 2);
    setResults(run);
    setPhase('results');
  };

  const handleContinue = () => {
    onComplete({
      allocation,
      results,
      totalProfit,
    });
  };

  const profitDiff = totalProfit - round1Profit;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <motion.div className="text-center mb-6" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-3 text-sm font-bold"
          style={{ background: 'rgba(20,184,166,0.2)', border: '1px solid rgba(20,184,166,0.45)', color: '#99f6e4' }}
        >
          Round 2 - Data-Guided Allocation
        </div>
        <h2 className="text-2xl md:text-3xl font-black text-white">Allocate Using Customer Data</h2>
        <p className="text-white/60 text-sm mt-2">Use this preference dataset, lock an allocation, and run another 5-day simulation.</p>
      </motion.div>

      <AnimatePresence mode="wait">
        {phase === 'allocate' && (
          <motion.div
            key="allocate"
            className="space-y-4"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
          >
            <div className="glass-card p-4">
              <p className="text-white/55 text-xs font-bold mb-2 uppercase tracking-wide">Observed customer preference sample</p>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={demandChart}>
                  <XAxis dataKey="label" tick={{ fill: 'rgba(255,255,255,0.65)', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis unit="%" tick={{ fill: 'rgba(255,255,255,0.45)', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(148,163,184,0.25)', borderRadius: 8 }}
                    formatter={(v: number) => [`${v}%`, 'Preference share']}
                  />
                  <Bar dataKey="pct" radius={[6, 6, 0, 0]}>
                    {demandChart.map((d) => (
                      <Cell key={d.id} fill={d.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <p className="text-xs text-white/50 mt-2">Tip: Higher demand flavors should receive more scoops.</p>
            </div>

            <div className="glass-card p-5">
              <AllocationInput allocation={allocation} onChange={setAllocation} />
            </div>

            <button
              className={`btn-primary w-full justify-center ${usedScoops !== 20 ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={handleSimulate}
              disabled={usedScoops !== 20}
            >
              Run 5-Day Simulation
            </button>
          </motion.div>
        )}

        {phase === 'results' && (
          <motion.div
            key="results"
            className="glass-card p-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3 className="text-white font-black text-lg text-center mb-3">Round 2 Results</h3>
            <div className="space-y-2 mb-4">
              {results.map((r) => (
                <div key={r.day} className="rounded-lg p-3 bg-white/5 border border-white/10 flex justify-between">
                  <span className="text-white/70">Day {r.day}</span>
                  <span className="text-green-300 font-black">${r.revenue}</span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="rounded-xl p-3 text-center" style={{ background: 'rgba(15,118,110,0.12)', border: '1px solid rgba(20,184,166,0.28)' }}>
                <p className="text-white/60 text-xs mb-1">Round 1 random</p>
                <AnimatedCounter value={round1Profit} prefix="$" className="text-xl font-black text-orange-300" />
              </div>
              <div className="rounded-xl p-3 text-center" style={{ background: 'rgba(20,184,166,0.12)', border: '1px solid rgba(20,184,166,0.28)' }}>
                <p className="text-white/60 text-xs mb-1">Round 2 data-driven</p>
                <AnimatedCounter value={totalProfit} prefix="$" className="text-xl font-black text-teal-300" />
              </div>
            </div>

            <div className="rounded-xl p-3 mb-4 text-center" style={{ background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.28)' }}>
              {profitDiff >= 0 ? (
                <p className="text-sky-200 text-sm font-semibold">Data beat random guessing by ${profitDiff} over 5 days.</p>
              ) : (
                <p className="text-orange-200 text-sm font-semibold">Random did better this run by ${Math.abs(profitDiff)}. Over many runs, data usually wins.</p>
              )}
            </div>

            <button className="btn-primary w-full justify-center" onClick={handleContinue}>
              Continue to Round 3
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
