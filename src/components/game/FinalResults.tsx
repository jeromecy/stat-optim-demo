'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Cell,
  ResponsiveContainer,
  Tooltip,
  LabelList,
} from 'recharts';
import AnimatedCounter from '@/components/ui/AnimatedCounter';
import { gradePerformance, simulateRandomStrategy, simulateOptimalStrategy, CUSTOMERS_PER_DAY, PRICE_PER_SCOOP } from '@/lib/gameLogic';

interface FinalResultsProps {
  round1Profit: number;
  round2Profit: number;
  round4Profit: number;
  score: number;
  onRestart: () => void;
  onContinue: () => void;
}

// Confetti piece component
function ConfettiPiece({ style }: { style: React.CSSProperties }) {
  return <div className="confetti-piece" style={style} />;
}

export default function FinalResults({
  round1Profit,
  round2Profit,
  round4Profit,
  score,
  onRestart,
  onContinue,
}: FinalResultsProps) {
  const playerTotal = round1Profit + round2Profit + round4Profit;
  const totalDays = 3 + 5 + 5; // 13 days total

  const [randomProfit] = useState(() => simulateRandomStrategy(totalDays));
  const [optimalProfit] = useState(() => simulateOptimalStrategy(totalDays));
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiPieces] = useState(() =>
    Array.from({ length: 40 }, (_, i) => ({
      id: i,
      style: {
        left: `${Math.random() * 100}%`,
        top: '-20px',
        '--duration': `${2 + Math.random() * 2}s`,
        '--delay': `${Math.random() * 1}s`,
        backgroundColor: ['#ffd60a', '#ff006e', '#06d6a0', '#7c3aed', '#ff6b35', '#00d4ff'][
          Math.floor(Math.random() * 6)
        ],
        width: `${6 + Math.random() * 6}px`,
        height: `${6 + Math.random() * 6}px`,
        borderRadius: Math.random() > 0.5 ? '50%' : '2px',
      } as React.CSSProperties,
    }))
  );

  const grade = gradePerformance(playerTotal, randomProfit, optimalProfit);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(true), 600);
    return () => clearTimeout(timer);
  }, []);

  const chartData = [
    {
      label: '🎲 Random',
      profit: randomProfit,
      color: '#f97316',
      description: 'Pure guessing',
    },
    {
      label: '🧑 You',
      profit: playerTotal,
      color: grade.color,
      description: 'Your strategy',
    },
    {
      label: '🤖 Optimal',
      profit: optimalProfit,
      color: '#06d6a0',
      description: 'Best possible',
    },
  ];

  const maxProfit = Math.max(...chartData.map((d) => d.profit));

  const improvement = randomProfit > 0
    ? Math.round(((playerTotal - randomProfit) / randomProfit) * 100)
    : 0;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Confetti */}
      {showConfetti && confettiPieces.map((p) => (
        <ConfettiPiece key={p.id} style={p.style} />
      ))}

      {/* Header */}
      <motion.div
        className="text-center mb-6"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      >
        <div className="text-6xl mb-3">🏆</div>
        <h2 className="text-3xl md:text-4xl font-black text-white mb-2">
          Game Over!
        </h2>
        <p className="text-white/60">Here&apos;s how you did across all 13 days</p>
      </motion.div>

      {/* Grade card */}
      <motion.div
        className="rounded-2xl p-5 mb-5 text-center"
        style={{
          background: `${grade.color}18`,
          border: `2px solid ${grade.color}55`,
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <motion.div
          className="text-7xl font-black mb-2"
          style={{ color: grade.color }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.4 }}
        >
          {grade.grade}
        </motion.div>
        <p className="font-black text-xl text-white mb-1">{grade.message}</p>
        <div className="flex justify-center gap-6 mt-3">
          <div>
            <p className="text-white/50 text-xs font-semibold">Total Profit</p>
            <AnimatedCounter value={playerTotal} prefix="$" className="text-white font-black text-2xl" duration={1.5} />
          </div>
          <div>
            <p className="text-white/50 text-xs font-semibold">Score</p>
            <AnimatedCounter value={score} className="text-yellow-400 font-black text-2xl" duration={1.5} />
          </div>
        </div>
      </motion.div>

      {/* Comparison chart */}
      <motion.div
        className="glass-card p-5 mb-5"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h3 className="text-white font-black text-base mb-4 text-center">
          📊 Strategy Comparison (13 days)
        </h3>

        {/* Visual bars */}
        <div className="space-y-3 mb-5">
          {chartData.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.15 }}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-sm text-white">{item.label}</span>
                <span className="font-black text-sm" style={{ color: item.color }}>
                  ${item.profit}
                </span>
              </div>
              <div className="h-8 rounded-xl bg-white/10 overflow-hidden relative">
                <motion.div
                  className="h-full rounded-xl"
                  style={{ backgroundColor: item.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${(item.profit / maxProfit) * 100}%` }}
                  transition={{ duration: 1, delay: 0.6 + i * 0.15, ease: 'easeOut' }}
                />
                <span
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-white/80"
                  style={{ textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}
                >
                  {item.description}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Improvement stat */}
        <motion.div
          className="text-center p-3 rounded-xl"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
        >
          {improvement > 0 ? (
            <p className="text-green-300 font-bold text-sm">
              🚀 You earned{' '}
              <span className="text-green-300 font-black text-lg">{improvement}% more</span>{' '}
              than pure random guessing!
            </p>
          ) : (
            <p className="text-orange-300 font-bold text-sm">
              💪 You matched random guessing — better data use next time!
            </p>
          )}
        </motion.div>
      </motion.div>

      {/* Round breakdown */}
      <motion.div
        className="glass-card p-4 mb-5"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <h3 className="text-white/70 font-bold text-sm mb-3">Your journey breakdown:</h3>
        <div className="grid grid-cols-3 gap-3 text-center">
          {[
            { label: 'Round 1\nGuessing', value: round1Profit, emoji: '🎲', color: '#f97316' },
            { label: 'Round 2\nData', value: round2Profit, emoji: '📊', color: '#3b82f6' },
            { label: 'Round 4\nOptimised', value: round4Profit, emoji: '🎯', color: '#06d6a0' },
          ].map((item, i) => (
            <motion.div
              key={i}
              className="rounded-xl p-3"
              style={{ background: `${item.color}15`, border: `1px solid ${item.color}33` }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 + i * 0.1 }}
            >
              <div className="text-xl mb-1">{item.emoji}</div>
              <div className="font-black text-lg" style={{ color: item.color }}>${item.value}</div>
              <div className="text-xs text-white/50 font-semibold whitespace-pre-line">{item.label}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Key insight */}
      <motion.div
        className="rounded-xl p-4 mb-6 text-center"
        style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.4)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0 }}
      >
        <p className="text-purple-200 font-semibold text-sm leading-relaxed">
          🧠 <strong>The secret?</strong> Data-driven optimisation systematically finds the best strategy —
          no guesswork, just smart decisions powered by statistics.
        </p>
      </motion.div>

      {/* Action buttons */}
      <div className="flex flex-col gap-3">
        <motion.button
          className="btn-primary w-full justify-center text-lg"
          onClick={onContinue}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
        >
          🌍 See Real-World Examples →
        </motion.button>
        <motion.button
          className="btn-secondary w-full text-center"
          onClick={onRestart}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          🔄 Play Again
        </motion.button>
      </div>
    </div>
  );
}
