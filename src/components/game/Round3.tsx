'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid, ReferenceArea } from 'recharts';
import AnimatedCounter from '@/components/ui/AnimatedCounter';
import type { Round3Data } from '@/lib/types';

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

const SEASONAL_INDEX = [1.25, 1.2, 1.05, 0.9, 0.75, 0.68, 0.65, 0.72, 0.82, 0.95, 1.1, 1.28];
const BASE_DEMAND = 320;
const BASE_CAPACITY = 320;
const UNIT_PRICE = 3;
const WASTE_COST = 0.9;

interface Round3Props {
  onComplete: (data: Round3Data) => void;
}

type Phase = 'plan' | 'result';

export default function Round3({ onComplete }: Round3Props) {
  const [phase, setPhase] = useState<Phase>('plan');
  const [intensity, setIntensity] = useState(20);

  const monthlyDemand = useMemo(
    () => MONTHS.map((month, i) => ({ month, demand: Math.round(BASE_DEMAND * SEASONAL_INDEX[i]) })),
    []
  );

  const annualResult = useMemo(() => {
    const seasonalSignal = SEASONAL_INDEX.map((v) => v - 1);
    const meanSignal = seasonalSignal.reduce((s, v) => s + v, 0) / seasonalSignal.length;
    const centeredSignal = seasonalSignal.map((v) => v - meanSignal);

    const capacityByMonth = centeredSignal.map((signal) => {
      const moved = signal * intensity * 2.4;
      return Math.max(180, Math.round(BASE_CAPACITY + moved));
    });

    const monthly = monthlyDemand.map((row, i) => {
      const capacity = capacityByMonth[i];
      const sold = Math.min(row.demand, capacity);
      const wasted = Math.max(0, capacity - row.demand);
      const profit = sold * UNIT_PRICE - wasted * WASTE_COST;
      return {
        month: row.month,
        demand: row.demand,
        capacity,
        sold,
        wasted,
        profit,
      };
    });

    const totalProfit = Math.round(monthly.reduce((s, m) => s + m.profit, 0));
    return { monthly, totalProfit };
  }, [intensity, monthlyDemand]);

  const handleRun = () => {
    setPhase('result');
  };

  const handleContinue = () => {
    onComplete({
      totalProfit: annualResult.totalProfit,
      reallocationIntensity: intensity,
    });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <motion.div className="text-center mb-6" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-3 text-sm font-bold"
          style={{ background: 'rgba(59,130,246,0.2)', border: '1px solid rgba(59,130,246,0.45)', color: '#bfdbfe' }}
        >
          Round 3 - Seasonal Time Series (Australia)
        </div>
        <h2 className="text-2xl md:text-3xl font-black text-white">Optimise Resources Across the Year</h2>
        <p className="text-white/60 text-sm mt-2">Use seasonality to shift capacity between high and low demand months.</p>
        <p className="text-xs text-amber-200/90 mt-2">
          Disclaimer: This yearly dataset is simulated for demonstration purposes.
        </p>
      </motion.div>

      <AnimatePresence mode="wait">
        {phase === 'plan' && (
          <motion.div
            key="plan"
            className="space-y-4"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
          >
            <div className="glass-card p-4">
              <p className="text-white/55 text-xs font-bold mb-2 uppercase tracking-wide">National monthly demand pattern</p>
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={monthlyDemand}>
                  <CartesianGrid stroke="rgba(148,163,184,0.18)" strokeDasharray="3 3" />
                  <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.65)', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: 'rgba(255,255,255,0.45)', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(148,163,184,0.25)', borderRadius: 8 }}
                    formatter={(v: number) => [`${v}`, 'Estimated units']}
                  />
                  <ReferenceArea x1="Dec" x2="Feb" ifOverflow="visible" fill="rgba(245,158,11,0.08)" />
                  <Line type="monotone" dataKey="demand" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4, fill: '#f59e0b', strokeWidth: 0 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="glass-card p-5">
              <p className="text-white/70 font-semibold mb-2">Reallocation intensity: {intensity}%</p>
              <input
                type="range"
                min={0}
                max={40}
                step={1}
                value={intensity}
                onChange={(e) => setIntensity(Number(e.target.value))}
                className="w-full"
                style={{
                  background: `linear-gradient(to right, #0f766e 0%, #2563eb ${(intensity / 40) * 100}%, rgba(255,255,255,0.15) ${(intensity / 40) * 100}%, rgba(255,255,255,0.15) 100%)`,
                }}
              />
              <p className="text-xs text-white/55 mt-3">
                0% keeps monthly resources flat. Higher values move capacity from winter into summer peaks.
              </p>
            </div>

            <button className="btn-primary w-full justify-center" onClick={handleRun}>
              Run Annual Optimisation
            </button>
          </motion.div>
        )}

        {phase === 'result' && (
          <motion.div
            key="result"
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="glass-card p-4">
              <p className="text-white/55 text-xs font-bold mb-2 uppercase tracking-wide">Demand vs allocated capacity</p>
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={annualResult.monthly}>
                  <CartesianGrid stroke="rgba(148,163,184,0.18)" strokeDasharray="3 3" />
                  <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.65)', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: 'rgba(255,255,255,0.45)', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(148,163,184,0.25)', borderRadius: 8 }}
                  />
                  <Line type="monotone" dataKey="demand" stroke="#f59e0b" strokeWidth={3} dot={false} name="Demand" />
                  <Line type="monotone" dataKey="capacity" stroke="#14b8a6" strokeWidth={3} dot={false} name="Capacity" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="rounded-xl p-4 text-center" style={{ background: 'rgba(20,184,166,0.12)', border: '1px solid rgba(20,184,166,0.28)' }}>
              <p className="text-white/60 text-sm mb-1">Round 3 annual profit</p>
              <AnimatedCounter value={annualResult.totalProfit} prefix="$" className="text-3xl font-black text-teal-300" />
              <p className="text-xs text-white/50 mt-2">Resource shift intensity used: {intensity}%</p>
            </div>

            <button className="btn-primary w-full justify-center" onClick={handleContinue}>
              Continue to Round 4
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
