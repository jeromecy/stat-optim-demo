'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Cell,
  ResponsiveContainer,
  ReferenceLine,
  Tooltip,
} from 'recharts';
import { FLAVORS, getFlavorById, getMostPopularFlavor } from '@/lib/gameLogic';
import type { FlavorId, Round3Data } from '@/lib/types';

interface Round3Props {
  customerData: Record<FlavorId, number>;
  onComplete: (data: Round3Data) => void;
}

type Phase = 'quiz' | 'revealing' | 'result';

export default function Round3({ customerData, onComplete }: Round3Props) {
  const [phase, setPhase] = useState<Phase>('quiz');
  const [guess, setGuess] = useState<FlavorId | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const readyRef = useRef(false);
  useEffect(() => { const t = setTimeout(() => { readyRef.current = true; }, 600); return () => clearTimeout(t); }, []);

  const correctAnswer = getMostPopularFlavor(customerData);
  const isCorrect = guess === correctAnswer;
  const scoreEarned = isCorrect ? 200 : 50;

  const totalCustomers = Object.values(customerData).reduce((a, b) => a + b, 0);

  const chartData = FLAVORS.map((f) => ({
    name: f.emoji + ' ' + f.name.split(' ')[0],
    count: customerData[f.id] ?? 0,
    color: f.borderColor,
    id: f.id,
    pct: totalCustomers > 0 ? Math.round(((customerData[f.id] ?? 0) / totalCustomers) * 100) : 0,
  })).sort((a, b) => b.count - a.count);

  const maxCount = Math.max(...chartData.map((d) => d.count), 1);

  const handleGuess = (flavorId: FlavorId) => {
    if (!readyRef.current || confirmed) return;
    setGuess(flavorId);
  };

  const handleSubmit = () => {
    if (!guess) return;
    setConfirmed(true);
    setPhase('revealing');
    setTimeout(() => setPhase('result'), 2200);
  };

  const handleContinue = () => {
    onComplete({ guess: guess!, correct: isCorrect, scoreEarned });
  };

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
            background: 'rgba(59,130,246,0.2)',
            border: '1px solid rgba(59,130,246,0.5)',
            color: '#93c5fd',
          }}
        >
          🧠 Round 3 — Statistical Insight
        </div>
        <h2 className="text-2xl md:text-3xl font-black text-white">
          <span className="gradient-text-blue">What does the data say?</span>
        </h2>
      </motion.div>

      <AnimatePresence mode="wait">
        {/* Quiz phase */}
        {phase === 'quiz' && (
          <motion.div
            key="quiz"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ type: 'spring', stiffness: 260, damping: 25 }}
          >
            <div className="glass-card p-5 mb-4">
              <p className="text-white/60 text-sm font-bold mb-3 text-center">
                📊 Your collected data ({totalCustomers} customer preferences):
              </p>

              {/* Simple horizontal bar chart */}
              <div className="space-y-2">
                {chartData.map((entry, i) => (
                  <motion.div
                    key={entry.id}
                    className="flex items-center gap-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <span className="text-sm w-20 text-right text-white/70 font-semibold shrink-0">
                      {entry.name}
                    </span>
                    <div className="flex-1 h-6 rounded-lg bg-white/10 overflow-hidden relative">
                      <motion.div
                        className="h-full rounded-lg"
                        style={{ backgroundColor: entry.color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${(entry.count / maxCount) * 100}%` }}
                        transition={{ duration: 0.7, delay: i * 0.1 + 0.3, ease: 'easeOut' }}
                      />
                      <span
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold text-white/80"
                        style={{ textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}
                      >
                        {entry.count}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Question */}
            <motion.div
              className="glass-card p-5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="text-white font-black text-lg mb-1 text-center">
                🤔 Based on this data...
              </h3>
              <p className="text-white/60 text-sm text-center mb-4">
                Which flavour do customers prefer most?
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-5">
                {FLAVORS.map((flavor) => (
                  <motion.button
                    key={flavor.id}
                    className="rounded-xl p-3 text-center border-2 transition-all font-bold text-sm flex flex-col items-center gap-1"
                    style={{
                      backgroundColor: guess === flavor.id ? `${flavor.bgColor}dd` : `${flavor.bgColor}55`,
                      borderColor: guess === flavor.id ? flavor.borderColor : `${flavor.borderColor}44`,
                      color: flavor.textColor,
                      boxShadow: guess === flavor.id ? `0 0 16px ${flavor.glowColor}` : 'none',
                      transform: guess === flavor.id ? 'scale(1.05)' : 'scale(1)',
                    }}
                    onClick={() => handleGuess(flavor.id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="text-2xl">{flavor.emoji}</span>
                    <span>{flavor.name}</span>
                  </motion.button>
                ))}
              </div>

              <motion.button
                className={`btn-primary w-full justify-center ${!guess ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={handleSubmit}
                disabled={!guess}
                whileHover={guess ? { scale: 1.03 } : {}}
                whileTap={guess ? { scale: 0.97 } : {}}
              >
                Submit My Answer →
              </motion.button>
            </motion.div>
          </motion.div>
        )}

        {/* Revealing phase */}
        {phase === 'revealing' && (
          <motion.div
            key="revealing"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="glass-card p-6 text-center">
              <p className="text-3xl mb-3">🔎</p>
              <h3 className="text-white font-black text-xl mb-2">Analysing the data...</h3>
              <div className="space-y-2 mt-4">
                {chartData.map((entry, i) => (
                  <motion.div
                    key={entry.id}
                    className="flex items-center gap-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.2 }}
                  >
                    <span className="text-lg w-6">{entry.name.charAt(0)}</span>
                    <div className="flex-1 h-4 rounded-full bg-white/10 overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: entry.color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${entry.pct}%` }}
                        transition={{ duration: 0.8, delay: i * 0.2 + 0.3, ease: 'easeOut' }}
                      />
                    </div>
                    <motion.span
                      className="text-sm w-10 text-right text-white font-bold"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.2 + 1.0 }}
                    >
                      {entry.pct}%
                    </motion.span>
                  </motion.div>
                ))}
              </div>
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
            {/* Correct/Wrong banner */}
            <motion.div
              className="rounded-2xl p-5 mb-4 text-center"
              style={{
                background: isCorrect
                  ? 'rgba(6,214,160,0.15)'
                  : 'rgba(249,115,22,0.15)',
                border: `1px solid ${isCorrect ? 'rgba(6,214,160,0.4)' : 'rgba(249,115,22,0.4)'}`,
              }}
              animate={{ scale: [0.9, 1.05, 1] }}
              transition={{ duration: 0.4 }}
            >
              <p className="text-4xl mb-2">{isCorrect ? '🎉' : '🤔'}</p>
              <h3
                className="font-black text-2xl mb-1"
                style={{ color: isCorrect ? '#06d6a0' : '#f97316' }}
              >
                {isCorrect ? 'Correct!' : 'Not quite!'}
              </h3>
              <p className="text-white/80 text-sm leading-relaxed">
                {isCorrect
                  ? `Great analysis! ${getFlavorById(correctAnswer).emoji} ${getFlavorById(correctAnswer).name} is indeed the most popular!`
                  : `The data clearly shows ${getFlavorById(correctAnswer).emoji} ${getFlavorById(correctAnswer).name} is the most preferred flavour!`}
              </p>
              <div
                className="inline-block mt-2 px-4 py-1 rounded-full font-black text-sm"
                style={{
                  background: isCorrect ? 'rgba(6,214,160,0.3)' : 'rgba(249,115,22,0.3)',
                  color: isCorrect ? '#06d6a0' : '#f97316',
                }}
              >
                +{scoreEarned} points!
              </div>
            </motion.div>

            {/* Final distribution reveal */}
            <div className="glass-card p-5 mb-4">
              <p className="text-white/60 text-sm font-bold mb-3 text-center">
                📊 Actual customer preferences revealed:
              </p>
              <div className="space-y-2">
                {chartData.map((entry, i) => {
                  const isWinner = entry.id === correctAnswer;
                  const isUserGuess = entry.id === guess;
                  return (
                    <motion.div
                      key={entry.id}
                      className="flex items-center gap-2"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08 }}
                    >
                      <span className="text-sm w-20 text-right font-semibold shrink-0"
                        style={{ color: isWinner ? entry.color : 'rgba(255,255,255,0.6)' }}>
                        {entry.name}
                        {isWinner ? ' 👑' : isUserGuess && !isWinner ? ' ← you' : ''}
                      </span>
                      <div className="flex-1 h-7 rounded-lg bg-white/10 overflow-hidden relative">
                        <motion.div
                          className="h-full rounded-lg"
                          style={{
                            backgroundColor: entry.color,
                            opacity: isWinner ? 1 : 0.55,
                          }}
                          initial={{ width: 0 }}
                          animate={{ width: `${entry.pct}%` }}
                          transition={{ duration: 0.8, delay: i * 0.08 + 0.2, ease: 'easeOut' }}
                        />
                        <span
                          className="absolute left-2 top-1/2 -translate-y-1/2 text-xs font-bold"
                          style={{
                            color: isWinner ? '#fff' : 'rgba(255,255,255,0.7)',
                            textShadow: '0 1px 3px rgba(0,0,0,0.8)',
                          }}
                        >
                          {entry.pct}%
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Lesson */}
            <div
              className="rounded-xl p-4 mb-5 text-center"
              style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.4)' }}
            >
              <p className="text-purple-200 font-semibold text-sm leading-relaxed">
                📐 <strong>Statistics</strong> transforms raw data into reliable insights.
                Instead of guessing, you can now <em>know</em> what works!
              </p>
            </div>

            <button className="btn-primary w-full justify-center" onClick={handleContinue}>
              🎯 Use This to Optimise →
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
