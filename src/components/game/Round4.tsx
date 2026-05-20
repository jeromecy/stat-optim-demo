'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import AnimatedCounter from '@/components/ui/AnimatedCounter';
import { FLAVORS, simulateEpsilonGreedy, getFlavorById, PRICE_PER_SCOOP, CUSTOMERS_PER_DAY } from '@/lib/gameLogic';
import type { FlavorId, DayResult, Round4Data } from '@/lib/types';

const TOTAL_DAYS = 5;
const OPTIMAL_DAILY = Math.round(0.40 * CUSTOMERS_PER_DAY) * PRICE_PER_SCOOP; // ~$24

interface Round4Props {
  customerData: Record<FlavorId, number>;
  onComplete: (data: Round4Data) => void;
}

type Phase = 'setup' | 'running' | 'result';

export default function Round4({ customerData, onComplete }: Round4Props) {
  const [phase, setPhase] = useState<Phase>('setup');
  const [explorationPct, setExplorationPct] = useState(30);
  const [results, setResults] = useState<DayResult[]>([]);
  const [visibleResults, setVisibleResults] = useState<DayResult[]>([]);
  const animRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const expectedDaily =
    (1 - explorationPct / 100) * OPTIMAL_DAILY +
    (explorationPct / 100) * (OPTIMAL_DAILY * 0.5);

  const expectedTotal = Math.round(expectedDaily * TOTAL_DAYS);

  const handleRun = () => {
    const simResults = simulateEpsilonGreedy(TOTAL_DAYS, explorationPct, customerData);
    setResults(simResults);
    setVisibleResults([]);
    setPhase('running');

    // Animate results appearing one by one
    simResults.forEach((_, i) => {
      const timeout = setTimeout(() => {
        setVisibleResults((prev) => [...prev, simResults[i]]);
        if (i === simResults.length - 1) {
          setTimeout(() => setPhase('result'), 800);
        }
      }, i * 700 + 300);
      animRef.current = timeout;
    });
  };

  useEffect(() => {
    return () => {
      if (animRef.current) clearTimeout(animRef.current);
    };
  }, []);

  const cumulativeProfit = visibleResults.reduce((acc, r, i) => {
    const prev = i > 0 ? acc[i - 1].cumulative : 0;
    acc.push({ day: r.day, cumulative: prev + r.revenue, revenue: r.revenue });
    return acc;
  }, [] as { day: number; cumulative: number; revenue: number }[]);

  const totalProfit = results.reduce((s, r) => s + r.revenue, 0);

  const handleContinue = () => {
    onComplete({ explorationRate: explorationPct, results, totalProfit });
  };

  // Slider label
  const getSliderLabel = () => {
    if (explorationPct <= 10) return { text: 'Pure Exploitation', sub: 'Always sell your best known flavour', color: '#06d6a0' };
    if (explorationPct <= 30) return { text: 'Smart Balance ✨', sub: 'Mostly exploit with occasional exploration', color: '#ffd60a' };
    if (explorationPct <= 60) return { text: 'Mixed Strategy', sub: 'Equal parts trying old and new', color: '#3b82f6' };
    if (explorationPct <= 85) return { text: 'Heavy Exploration', sub: 'Trying lots of different things', color: '#f97316' };
    return { text: 'Pure Exploration', sub: 'Always trying random flavours', color: '#ff006e' };
  };

  const label = getSliderLabel();

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Header */}
      <motion.div
        className="text-center mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-3 text-sm font-bold"
          style={{
            background: 'rgba(255,214,10,0.2)',
            border: '1px solid rgba(255,214,10,0.5)',
            color: '#ffd60a',
          }}
        >
          🎯 Round 4 — Optimisation
        </div>
        <h2 className="text-2xl md:text-3xl font-black text-white">
          <span className="gradient-text">Maximise Your Profit!</span>
        </h2>
      </motion.div>

      <AnimatePresence mode="wait">
        {/* Setup phase */}
        {phase === 'setup' && (
          <motion.div
            key="setup"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ type: 'spring', stiffness: 260, damping: 25 }}
          >
            {/* Explainer */}
            <div className="glass-card p-5 mb-4">
              <h3 className="text-white font-black text-base mb-3">
                ⚖️ The Explore vs Exploit Tradeoff
              </h3>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="rounded-xl p-3 text-sm" style={{ background: 'rgba(6,214,160,0.12)', border: '1px solid rgba(6,214,160,0.3)' }}>
                  <div className="font-black text-green-300 mb-1">EXPLOIT 🎯</div>
                  <p className="text-white/70">Sell Choc Fudge — your best known choice</p>
                  <p className="text-green-300 font-bold mt-1">Safe, consistent</p>
                </div>
                <div className="rounded-xl p-3 text-sm" style={{ background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.3)' }}>
                  <div className="font-black text-purple-300 mb-1">EXPLORE 🔍</div>
                  <p className="text-white/70">Try different flavours to discover surprises</p>
                  <p className="text-purple-300 font-bold mt-1">Risky but learning</p>
                </div>
              </div>
              <p className="text-white/60 text-xs text-center">
                In the real world, finding the right balance is key! Netflix, Google Ads, and Uber all use this.
              </p>
            </div>

            {/* Slider */}
            <div className="glass-card p-5 mb-4">
              <div className="flex justify-between text-xs font-bold mb-3 text-white/60">
                <span>🎯 Exploit</span>
                <span>🔍 Explore</span>
              </div>

              <input
                type="range"
                min={0}
                max={100}
                step={5}
                value={explorationPct}
                onChange={(e) => setExplorationPct(Number(e.target.value))}
                className="w-full mb-3"
                style={{
                  background: `linear-gradient(to right, #06d6a0 0%, #ffd60a ${explorationPct}%, rgba(255,255,255,0.15) ${explorationPct}%, rgba(255,255,255,0.15) 100%)`,
                }}
              />

              <motion.div
                className="text-center"
                key={explorationPct}
                animate={{ scale: [0.97, 1] }}
                transition={{ duration: 0.15 }}
              >
                <p className="font-black text-lg" style={{ color: label.color }}>
                  {label.text}
                </p>
                <p className="text-white/60 text-sm">{label.sub}</p>
                <div className="flex justify-center gap-4 mt-2 text-sm font-bold">
                  <span className="text-green-300">{100 - explorationPct}% Exploit</span>
                  <span className="text-purple-300">{explorationPct}% Explore</span>
                </div>
              </motion.div>
            </div>

            {/* Expected profit preview */}
            <motion.div
              className="rounded-xl p-4 mb-5 text-center"
              key={explorationPct}
              style={{ background: 'rgba(255,214,10,0.1)', border: '1px solid rgba(255,214,10,0.3)' }}
              animate={{ opacity: [0.7, 1] }}
              transition={{ duration: 0.2 }}
            >
              <p className="text-white/60 text-sm font-semibold mb-1">
                📈 Expected profit for 5 days:
              </p>
              <p className="text-yellow-400 font-black text-3xl">~${expectedTotal}</p>
              <p className="text-white/40 text-xs mt-1">Optimal possible: ${OPTIMAL_DAILY * TOTAL_DAYS}</p>
            </motion.div>

            <motion.button
              className="btn-primary w-full justify-center text-xl"
              onClick={handleRun}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
            >
              🚀 Run 5 Days!
            </motion.button>
          </motion.div>
        )}

        {/* Running phase */}
        {phase === 'running' && (
          <motion.div
            key="running"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="glass-card p-5">
              <h3 className="text-white font-black text-center text-lg mb-4">
                🏃 Simulating {TOTAL_DAYS} days...
              </h3>

              {/* Day results */}
              <div className="space-y-2 mb-5 min-h-[200px]">
                {visibleResults.map((result, i) => {
                  const flavor = getFlavorById(result.chosenFlavor);
                  return (
                    <motion.div
                      key={i}
                      className="flex items-center justify-between p-3 rounded-xl"
                      style={{
                        background: `${flavor.bgColor}88`,
                        border: `1px solid ${flavor.borderColor}55`,
                      }}
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{flavor.emoji}</span>
                        <div>
                          <span className="text-white font-bold text-sm">Day {result.day}</span>
                          <span className="text-white/50 text-xs ml-2">→ {flavor.name}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-green-400 font-black">${result.revenue}</span>
                        <span className="text-white/40 text-xs ml-1">({result.customersServed} sold)</span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Cumulative profit line */}
              {cumulativeProfit.length > 0 && (
                <div>
                  <p className="text-white/60 text-xs font-bold mb-2">Cumulative profit:</p>
                  <ResponsiveContainer width="100%" height={100}>
                    <LineChart data={cumulativeProfit}>
                      <XAxis dataKey="day" hide />
                      <YAxis hide domain={[0, OPTIMAL_DAILY * TOTAL_DAYS + 10]} />
                      <Line
                        type="monotone"
                        dataKey="cumulative"
                        stroke="#ffd60a"
                        strokeWidth={3}
                        dot={{ r: 5, fill: '#ffd60a', strokeWidth: 0 }}
                        isAnimationActive={false}
                      />
                      <ReferenceLine
                        y={OPTIMAL_DAILY * TOTAL_DAYS}
                        stroke="rgba(6,214,160,0.5)"
                        strokeDasharray="4 4"
                        label={{ value: 'Optimal', fill: '#06d6a0', fontSize: 10, position: 'right' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Result phase */}
        {phase === 'result' && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 22 }}
          >
            <div className="glass-card p-5 mb-4">
              <div className="text-center mb-4">
                <p className="text-4xl mb-2">📈</p>
                <h3 className="text-white font-black text-xl">Your Optimised Results:</h3>
                <p className="text-white/60 text-sm">
                  Using <strong style={{ color: label.color }}>{explorationPct}% Exploration</strong> strategy
                </p>
              </div>

              {/* All day results */}
              <div className="space-y-2 mb-4">
                {results.map((result, i) => {
                  const flavor = getFlavorById(result.chosenFlavor);
                  return (
                    <motion.div
                      key={i}
                      className="flex items-center justify-between p-2.5 rounded-xl"
                      style={{
                        background: `${flavor.bgColor}77`,
                        border: `1px solid ${flavor.borderColor}44`,
                      }}
                      initial={{ opacity: 0, x: -15 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08 }}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{flavor.emoji}</span>
                        <span className="text-white font-bold text-sm">
                          Day {result.day}: {flavor.name}
                        </span>
                      </div>
                      <span className="text-green-400 font-black">${result.revenue}</span>
                    </motion.div>
                  );
                })}
              </div>

              {/* Profit chart */}
              <div className="mb-4">
                <ResponsiveContainer width="100%" height={120}>
                  <LineChart
                    data={results.map((r, i) => ({
                      day: r.day,
                      cumulative: results.slice(0, i + 1).reduce((s, x) => s + x.revenue, 0),
                    }))}
                  >
                    <XAxis
                      dataKey="day"
                      tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                      label={{ value: 'Day', position: 'insideBottomRight', fill: 'rgba(255,255,255,0.4)', fontSize: 10 }}
                    />
                    <YAxis hide domain={[0, OPTIMAL_DAILY * TOTAL_DAYS + 10]} />
                    <Tooltip
                      contentStyle={{
                        background: 'rgba(15,12,41,0.95)',
                        border: '1px solid rgba(255,255,255,0.15)',
                        borderRadius: 8,
                        color: '#fff',
                      }}
                      formatter={(value: number) => [`$${value}`, 'Cumulative Profit']}
                    />
                    <ReferenceLine
                      y={OPTIMAL_DAILY * TOTAL_DAYS}
                      stroke="rgba(6,214,160,0.5)"
                      strokeDasharray="4 4"
                    />
                    <Line
                      type="monotone"
                      dataKey="cumulative"
                      stroke="#ffd60a"
                      strokeWidth={3}
                      dot={{ r: 5, fill: '#ffd60a', strokeWidth: 0 }}
                      isAnimationActive
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Total */}
              <div
                className="rounded-xl p-4 text-center mb-5"
                style={{ background: 'rgba(255,214,10,0.12)', border: '1px solid rgba(255,214,10,0.35)' }}
              >
                <p className="text-white/60 text-sm font-semibold mb-1">Round 4 profit:</p>
                <AnimatedCounter value={totalProfit} prefix="$" className="text-yellow-400 font-black text-4xl" duration={1} />
                <p className="text-white/40 text-xs mt-1">
                  vs Optimal: ${OPTIMAL_DAILY * TOTAL_DAYS} • vs Random: ~${Math.round(OPTIMAL_DAILY * 0.5 * TOTAL_DAYS)}
                </p>
              </div>
            </div>

            <button className="btn-primary w-full justify-center" onClick={handleContinue}>
              🏆 See Final Results →
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
