'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FlavorCard from '@/components/ui/FlavorCard';
import AnimatedCounter from '@/components/ui/AnimatedCounter';
import { FLAVORS, simulateOneDay, getFlavorById } from '@/lib/gameLogic';
import type { FlavorId, DayResult, Round1Data } from '@/lib/types';

const TOTAL_DAYS = 3;

interface Round1Props {
  onComplete: (data: Round1Data) => void;
}

type Phase = 'choosing' | 'feedback' | 'summary';

export default function Round1({ onComplete }: Round1Props) {
  const [day, setDay] = useState(1);
  const [phase, setPhase] = useState<Phase>('choosing');
  const [results, setResults] = useState<DayResult[]>([]);
  const [lastResult, setLastResult] = useState<DayResult | null>(null);
  const [pendingFlavor, setPendingFlavor] = useState<FlavorId | null>(null);
  // Guard against accidental click-through during page-transition animation
  // useRef so the flag is set synchronously before React re-renders.
  const readyRef = useRef(false);
  const readyTimerRef = useRef<ReturnType<typeof setTimeout>>();
  useEffect(() => {
    readyRef.current = false;
    clearTimeout(readyTimerRef.current);
    readyTimerRef.current = setTimeout(() => { readyRef.current = true; }, 550);
    return () => clearTimeout(readyTimerRef.current);
  }, []);

  const totalProfit = results.reduce((s, r) => s + r.revenue, 0);

  const handleFlavorClick = (flavorId: FlavorId) => {
    if (!readyRef.current) return;
    const result = simulateOneDay(flavorId, day, 1);
    setPendingFlavor(flavorId);
    setLastResult(result);
    setResults((prev) => [...prev, result]);
    setPhase('feedback');
  };

  const handleNextDay = () => {
    // Reset the click guard synchronously before state update so the
    // render that shows 'choosing' already has readyRef.current === false.
    readyRef.current = false;
    clearTimeout(readyTimerRef.current);
    readyTimerRef.current = setTimeout(() => { readyRef.current = true; }, 550);
    if (day >= TOTAL_DAYS) {
      setPhase('summary');
    } else {
      setDay((d) => d + 1);
      setPendingFlavor(null);
      setPhase('choosing');
    }
  };

  const handleContinue = () => {
    onComplete({ results, totalProfit });
  };

  const getMoodEmoji = (revenue: number) => {
    if (revenue >= 18) return { emoji: '🎉', msg: 'Amazing day!', color: '#ffd60a' };
    if (revenue >= 12) return { emoji: '😊', msg: 'Pretty good!', color: '#06d6a0' };
    if (revenue >= 6) return { emoji: '😐', msg: 'Average day', color: '#3b82f6' };
    return { emoji: '😕', msg: 'Tough day...', color: '#f97316' };
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Header */}
      <motion.div
        className="text-center mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-3 text-sm font-bold"
          style={{ background: 'rgba(255,107,53,0.2)', border: '1px solid rgba(255,107,53,0.5)', color: '#ff6b35' }}>
          🎲 Round 1 — Gut Feeling
        </div>
        <h2 className="text-2xl md:text-3xl font-black text-white">
          {phase !== 'summary' ? (
            <>Day <span className="gradient-text">{day}</span> of {TOTAL_DAYS}</>
          ) : (
            <span className="gradient-text">Round 1 Summary</span>
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
            <div className="glass-card p-5 mb-5">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">🏪</span>
                <div>
                  <p className="font-bold text-white text-lg">Your ice cream truck is ready!</p>
                  <p className="text-white/60 text-sm">
                    Pick ONE flavour to sell today — <span className="text-yellow-300">trust your gut!</span>
                  </p>
                </div>
              </div>

              {/* Day dots */}
              <div className="flex gap-2 justify-center">
                {Array.from({ length: TOTAL_DAYS }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                      i < day - 1 ? 'bg-green-400' : i === day - 1 ? 'bg-yellow-400' : 'bg-white/20'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Running profit */}
            {totalProfit > 0 && (
              <motion.div
                className="glass-card p-3 mb-4 flex items-center justify-between"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <span className="text-white/70 text-sm font-semibold">Running profit:</span>
                <AnimatedCounter value={totalProfit} prefix="$" className="text-green-400 font-black text-xl" />
              </motion.div>
            )}

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

        {/* Feedback phase */}
        {phase === 'feedback' && lastResult && (
          <motion.div
            key="feedback"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            <div className="glass-card p-6 text-center">
              {/* Chosen flavor */}
              <div className="flex items-center justify-center gap-3 mb-4">
                <span className="text-4xl">{getFlavorById(lastResult.chosenFlavor).emoji}</span>
                <div className="text-left">
                  <p className="text-white/60 text-sm">You chose</p>
                  <p className="font-black text-xl text-white">{getFlavorById(lastResult.chosenFlavor).name}</p>
                </div>
              </div>

              {/* Customer animation */}
              <motion.div
                className="bg-white/5 rounded-xl p-4 mb-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex justify-center gap-0.5 flex-wrap mb-2">
                  {Array.from({ length: 20 }).map((_, i) => (
                    <motion.span
                      key={i}
                      className="text-lg"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 + i * 0.04, type: 'spring' }}
                    >
                      {i < lastResult.customersServed ? '🧑' : '👤'}
                    </motion.span>
                  ))}
                </div>
                <motion.p
                  className="text-white font-bold text-base"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 + 20 * 0.04 }}
                >
                  <span className="text-green-400">{lastResult.customersServed}</span> out of 20 customers
                  bought your <span style={{ color: getFlavorById(lastResult.chosenFlavor).borderColor }}>{getFlavorById(lastResult.chosenFlavor).name}</span>!
                </motion.p>
              </motion.div>

              {/* Revenue */}
              <motion.div
                className="mb-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
              >
                {(() => {
                  const mood = getMoodEmoji(lastResult.revenue);
                  return (
                    <div>
                      <p className="text-5xl mb-2">{mood.emoji}</p>
                      <p className="font-bold text-lg mb-1" style={{ color: mood.color }}>{mood.msg}</p>
                      <div className="flex items-baseline justify-center gap-1">
                        <span className="text-white/60">Revenue:</span>
                        <AnimatedCounter
                          value={lastResult.revenue}
                          prefix="$"
                          className="font-black text-3xl text-green-400"
                          duration={0.8}
                        />
                      </div>
                    </div>
                  );
                })()}
              </motion.div>

              {/* Running total */}
              <motion.div
                className="flex items-center justify-between glass-card p-3 mb-5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
              >
                <span className="text-white/60 text-sm font-semibold">Total so far:</span>
                <AnimatedCounter value={totalProfit} prefix="$" className="font-black text-xl text-yellow-400" />
              </motion.div>

              <motion.button
                className="btn-primary w-full justify-center"
                onClick={handleNextDay}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.8 }}
              >
                {day >= TOTAL_DAYS ? '📋 See Summary' : `Day ${day + 1} →`}
              </motion.button>
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
                <p className="text-4xl mb-2">🤔</p>
                <h3 className="text-xl font-black text-white mb-1">Guessing results:</h3>
                <p className="text-white/60 text-sm">Let&apos;s see how your gut instinct did...</p>
              </div>

              {/* Day breakdown */}
              <div className="space-y-2 mb-5">
                {results.map((result, i) => {
                  const flavor = getFlavorById(result.chosenFlavor);
                  return (
                    <motion.div
                      key={i}
                      className="flex items-center justify-between p-3 rounded-xl"
                      style={{ background: `${flavor.bgColor}88`, border: `1px solid ${flavor.borderColor}55` }}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.12 }}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{flavor.emoji}</span>
                        <span className="text-white font-bold text-sm">Day {result.day}: {flavor.name}</span>
                      </div>
                      <span className="text-green-400 font-black">${result.revenue}</span>
                    </motion.div>
                  );
                })}
              </div>

              {/* Total */}
              <motion.div
                className="text-center p-4 rounded-xl mb-5"
                style={{ background: 'rgba(255,214,10,0.1)', border: '1px solid rgba(255,214,10,0.3)' }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
              >
                <p className="text-white/60 font-semibold mb-1">Your 3-day total:</p>
                <AnimatedCounter value={totalProfit} prefix="$" className="text-yellow-400 font-black text-4xl" duration={1} />
              </motion.div>

              {/* Message */}
              <motion.div
                className="rounded-xl p-4 mb-5 text-center"
                style={{ background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <p className="text-blue-200 text-sm leading-relaxed">
                  💡 <strong>Not bad, but inconsistent!</strong> Without knowing what customers actually want,
                  it&apos;s hard to make great decisions every day.{' '}
                  <span className="text-yellow-300 font-bold">What if we collected some data?</span>
                </p>
              </motion.div>

              <motion.button
                className="btn-primary w-full justify-center"
                onClick={handleContinue}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 }}
              >
                📊 Collect Customer Data →
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
