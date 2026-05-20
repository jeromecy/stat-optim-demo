'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import FlavorCard from '@/components/ui/FlavorCard';
import AnimatedCounter from '@/components/ui/AnimatedCounter';
import {
  FLAVORS,
  simulateOneDay,
  sampleCustomerPreferences,
  getFlavorById,
} from '@/lib/gameLogic';
import type { FlavorId, DayResult, Round2Data } from '@/lib/types';

const TOTAL_DAYS = 5;

interface Round2Props {
  onComplete: (data: Round2Data) => void;
}

type Phase = 'choosing' | 'collecting' | 'feedback' | 'summary';

export default function Round2({ onComplete }: Round2Props) {
  const [day, setDay] = useState(1);
  const [phase, setPhase] = useState<Phase>('choosing');
  const [results, setResults] = useState<DayResult[]>([]);
  const [lastResult, setLastResult] = useState<DayResult | null>(null);
  const [customerData, setCustomerData] = useState<Record<FlavorId, number>>({
    chocolate: 0,
    vanilla: 0,
    strawberry: 0,
    matcha: 0,
    rainbow: 0,
  });
  const [newDataPoints, setNewDataPoints] = useState<Record<FlavorId, number>>({
    chocolate: 0,
    vanilla: 0,
    strawberry: 0,
    matcha: 0,
    rainbow: 0,
  });
  const [collectingDone, setCollectingDone] = useState(false);

  const totalProfit = results.reduce((s, r) => s + r.revenue, 0);

  const handleFlavorClick = (flavorId: FlavorId) => {
    const result = simulateOneDay(flavorId, day, 2);
    setLastResult(result);
    setResults((prev) => [...prev, result]);

    // Simulate what ALL customers wanted today
    const todayData = sampleCustomerPreferences();
    setNewDataPoints(todayData);
    setCollectingDone(false);
    setPhase('collecting');

    // After collection animation, show feedback
    setTimeout(() => {
      setCustomerData((prev) => {
        const updated = { ...prev };
        for (const key of Object.keys(todayData) as FlavorId[]) {
          updated[key] = (updated[key] ?? 0) + (todayData[key] ?? 0);
        }
        return updated;
      });
      setCollectingDone(true);
      setPhase('feedback');
    }, 2200);
  };

  const handleNextDay = () => {
    if (day >= TOTAL_DAYS) {
      setPhase('summary');
    } else {
      setDay((d) => d + 1);
      setPhase('choosing');
    }
  };

  const handleContinue = () => {
    onComplete({ results, totalProfit, customerData });
  };

  // Chart data from accumulated customer data
  const chartData = FLAVORS.map((f) => ({
    name: f.emoji + ' ' + f.name.split(' ')[0],
    count: customerData[f.id] ?? 0,
    color: f.borderColor,
    id: f.id,
  }));

  const maxCount = Math.max(...chartData.map((d) => d.count), 1);

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
            background: 'rgba(6,214,160,0.2)',
            border: '1px solid rgba(6,214,160,0.5)',
            color: '#06d6a0',
          }}
        >
          📊 Round 2 — Data Collection
        </div>
        <h2 className="text-2xl md:text-3xl font-black text-white">
          {phase !== 'summary' ? (
            <>
              Day <span className="gradient-text-green">{day}</span> of {TOTAL_DAYS}
            </>
          ) : (
            <span className="gradient-text-green">You Collected Real Data!</span>
          )}
        </h2>
      </motion.div>

      <AnimatePresence mode="wait">
        {/* Choosing phase */}
        {phase === 'choosing' && (
          <motion.div
            key="choosing"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ type: 'spring', stiffness: 260, damping: 25 }}
          >
            {/* Data chart (builds over time) */}
            {Object.values(customerData).some((v) => v > 0) && (
              <motion.div
                className="glass-card p-4 mb-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <p className="text-white/60 text-xs font-bold mb-2">
                  📈 Customer preference data collected so far ({day - 1} days):
                </p>
                <ResponsiveContainer width="100%" height={120}>
                  <BarChart data={chartData} barCategoryGap="20%">
                    <XAxis
                      dataKey="name"
                      tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis hide />
                    <Tooltip
                      cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                      contentStyle={{
                        background: 'rgba(15,12,41,0.95)',
                        border: '1px solid rgba(255,255,255,0.15)',
                        borderRadius: 8,
                        color: '#fff',
                      }}
                      formatter={(value: number) => [`${value} customers`, 'Wanted']}
                    />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]} isAnimationActive={true}>
                      {chartData.map((entry) => (
                        <Cell key={entry.id} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </motion.div>
            )}

            {/* Tip */}
            <div
              className="rounded-xl p-3 mb-4 flex items-start gap-2"
              style={{
                background: 'rgba(6,214,160,0.1)',
                border: '1px solid rgba(6,214,160,0.25)',
              }}
            >
              <span className="text-xl">👁️</span>
              <p className="text-green-200 text-sm font-semibold leading-snug">
                Now you can <strong>see what customers prefer</strong> as you pick what to sell each day!
              </p>
            </div>

            {/* Flavor grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {FLAVORS.map((flavor, i) => (
                <motion.div
                  key={flavor.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                >
                  <FlavorCard flavor={flavor} onClick={() => handleFlavorClick(flavor.id)} size="md" />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Collecting phase */}
        {phase === 'collecting' && lastResult && (
          <motion.div
            key="collecting"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="glass-card p-6 text-center">
              <p className="text-2xl mb-3">🔍</p>
              <h3 className="text-white font-black text-xl mb-2">Watching customers...</h3>
              <p className="text-white/60 text-sm mb-5">Recording what each of the 20 customers prefers today</p>

              {/* Animated customer dots */}
              <div className="space-y-2 mb-5">
                {FLAVORS.map((flavor) => {
                  const count = newDataPoints[flavor.id] ?? 0;
                  return (
                    <div key={flavor.id} className="flex items-center gap-2">
                      <span className="text-lg w-6">{flavor.emoji}</span>
                      <div className="flex-1 h-3 rounded-full bg-white/10 overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ backgroundColor: flavor.borderColor }}
                          initial={{ width: 0 }}
                          animate={{ width: `${(count / 20) * 100}%` }}
                          transition={{ duration: 1.5, ease: 'easeOut', delay: 0.2 }}
                        />
                      </div>
                      <motion.span
                        className="text-white/70 text-sm font-bold w-6 text-right"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.5 }}
                      >
                        {count}
                      </motion.span>
                    </div>
                  );
                })}
              </div>

              <motion.p
                className="text-white/40 text-xs"
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                Collecting data...
              </motion.p>
            </div>
          </motion.div>
        )}

        {/* Feedback phase */}
        {phase === 'feedback' && lastResult && collectingDone && (
          <motion.div
            key="feedback"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            <div className="glass-card p-6">
              <div className="text-center mb-4">
                <span className="text-4xl">{getFlavorById(lastResult.chosenFlavor).emoji}</span>
                <p className="text-white font-bold mt-1">
                  You sold <span style={{ color: getFlavorById(lastResult.chosenFlavor).borderColor }}>
                    {getFlavorById(lastResult.chosenFlavor).name}
                  </span>
                </p>
                <div className="flex items-baseline justify-center gap-1 mt-1">
                  <span className="text-white/60 text-sm">Earned:</span>
                  <AnimatedCounter value={lastResult.revenue} prefix="$" className="text-green-400 font-black text-3xl" />
                </div>
              </div>

              {/* Updated chart */}
              <div className="mb-4">
                <p className="text-white/60 text-xs font-bold mb-2 text-center">
                  📊 Updated customer preference data:
                </p>
                <ResponsiveContainer width="100%" height={130}>
                  <BarChart data={chartData} barCategoryGap="20%">
                    <XAxis
                      dataKey="name"
                      tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis hide />
                    <Tooltip
                      cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                      contentStyle={{
                        background: 'rgba(15,12,41,0.95)',
                        border: '1px solid rgba(255,255,255,0.15)',
                        borderRadius: 8,
                        color: '#fff',
                      }}
                      formatter={(value: number) => [`${value} customers`, 'Wanted']}
                    />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]} isAnimationActive>
                      {chartData.map((entry) => (
                        <Cell key={entry.id} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Most popular hint */}
              {day >= 3 && (
                <motion.div
                  className="rounded-xl p-3 mb-4 text-center text-sm"
                  style={{ background: 'rgba(255,214,10,0.1)', border: '1px solid rgba(255,214,10,0.25)' }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <span className="text-yellow-300 font-bold">
                    💡 Can you spot which flavour is most popular?
                  </span>
                </motion.div>
              )}

              <button className="btn-primary w-full justify-center" onClick={handleNextDay}>
                {day >= TOTAL_DAYS ? '🔍 Analyse the Data →' : `Day ${day + 1} →`}
              </button>
            </div>
          </motion.div>
        )}

        {/* Summary phase */}
        {phase === 'summary' && (
          <motion.div
            key="summary"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 22 }}
          >
            <div className="glass-card p-6">
              <div className="text-center mb-5">
                <p className="text-4xl mb-2">📊</p>
                <h3 className="text-xl font-black text-white mb-1">
                  Look what you discovered!
                </h3>
                <p className="text-white/60 text-sm">
                  5 days × 20 customers = <strong className="text-white">100 data points</strong>
                </p>
              </div>

              {/* Big bar chart */}
              <div className="mb-5">
                <ResponsiveContainer width="100%" height={160}>
                  <BarChart data={chartData} barCategoryGap="20%">
                    <XAxis
                      dataKey="name"
                      tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis hide />
                    <Tooltip
                      cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                      contentStyle={{
                        background: 'rgba(15,12,41,0.95)',
                        border: '1px solid rgba(255,255,255,0.15)',
                        borderRadius: 8,
                        color: '#fff',
                      }}
                      formatter={(value: number) => [`${value} customers`, 'Preferred']}
                    />
                    <Bar dataKey="count" radius={[6, 6, 0, 0]} isAnimationActive>
                      {chartData.map((entry) => (
                        <Cell key={entry.id} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>

                {/* Popularity bars with labels */}
                <div className="space-y-1.5 mt-2">
                  {[...chartData]
                    .sort((a, b) => b.count - a.count)
                    .map((entry, i) => (
                      <motion.div
                        key={entry.id}
                        className="flex items-center gap-2"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                      >
                        <span className="text-sm w-16 font-semibold text-white/70 text-right">{entry.name}</span>
                        <div className="flex-1 h-2.5 rounded-full bg-white/10 overflow-hidden">
                          <motion.div
                            className="h-full rounded-full"
                            style={{ backgroundColor: entry.color }}
                            initial={{ width: 0 }}
                            animate={{ width: `${(entry.count / maxCount) * 100}%` }}
                            transition={{ duration: 0.8, delay: i * 0.1 + 0.3, ease: 'easeOut' }}
                          />
                        </div>
                        <span className="text-sm w-8 text-white/70 font-bold">{entry.count}</span>
                      </motion.div>
                    ))}
                </div>
              </div>

              <div
                className="rounded-xl p-3 mb-5 text-center"
                style={{ background: 'rgba(6,214,160,0.12)', border: '1px solid rgba(6,214,160,0.3)' }}
              >
                <p className="text-green-200 text-sm leading-relaxed font-semibold">
                  🧠 This is what <strong>statistics</strong> does — it finds patterns
                  in data that your gut alone can&apos;t easily see!
                </p>
              </div>

              <button className="btn-primary w-full justify-center" onClick={handleContinue}>
                🧠 Test Your Insight →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
