'use client';

import { motion } from 'framer-motion';

interface ProgressBarProps {
  percent: number;
  screen: string;
}

const STAGES = [
  { label: 'Intro', pct: 0 },
  { label: 'Day 1-3', pct: 15 },
  { label: 'Data', pct: 38 },
  { label: 'Insight', pct: 57 },
  { label: 'Optimise', pct: 76 },
  { label: 'Results', pct: 92 },
  { label: 'Real World', pct: 100 },
];

export default function ProgressBar({ percent }: ProgressBarProps) {
  return (
    <div className="w-full px-4 py-3">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between text-xs text-white/50 mb-1 font-semibold">
          <span>Progress</span>
          <span>{Math.round(percent)}%</span>
        </div>
        <div className="relative h-3 rounded-full bg-white/10 overflow-hidden">
          <motion.div
            className="absolute left-0 top-0 h-full rounded-full progress-glow"
            style={{
              background: 'linear-gradient(90deg, #0f766e, #2563eb, #f59e0b)',
            }}
            initial={{ width: 0 }}
            animate={{ width: `${percent}%` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
          {/* Shimmer */}
          <motion.div
            className="absolute top-0 h-full w-8 opacity-50"
            style={{
              background:
                'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)',
            }}
            animate={{ x: ['-32px', '600px'] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear', repeatDelay: 1 }}
          />
        </div>
        {/* Stage dots */}
        <div className="relative mt-1">
          {STAGES.map((stage) => (
            <div
              key={stage.label}
              className="absolute transform -translate-x-1/2"
              style={{ left: `${stage.pct}%`, top: 0 }}
            >
              <div
                className={`w-2 h-2 rounded-full mt-[-1px] ${
                  percent >= stage.pct ? 'bg-teal-400' : 'bg-white/20'
                }`}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
