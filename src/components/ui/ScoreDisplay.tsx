'use client';

import { motion } from 'framer-motion';
import AnimatedCounter from './AnimatedCounter';

interface ScoreDisplayProps {
  round1Profit: number;
  round2Profit: number;
}

export default function ScoreDisplay({ round1Profit, round2Profit }: ScoreDisplayProps) {
  return (
    <div className="flex items-center justify-center gap-4 px-4 py-2">
      <motion.div
        className="glass-card flex items-center gap-2 px-4 py-2"
        key={`r1-${round1Profit}`}
        animate={{ scale: round1Profit > 0 ? [1, 1.15, 1] : 1 }}
        transition={{ duration: 0.3 }}
      >
        <span className="text-lg">🎲</span>
        <div>
          <div className="text-xs text-white/60 font-semibold leading-none">Round 1</div>
          <AnimatedCounter
            value={round1Profit}
            prefix="$"
            className="text-amber-400 font-black text-lg leading-none"
          />
        </div>
      </motion.div>

      <motion.div
        className="glass-card flex items-center gap-2 px-4 py-2"
        key={`r2-${round2Profit}`}
        animate={{ scale: round2Profit > 0 ? [1, 1.15, 1] : 1 }}
        transition={{ duration: 0.3 }}
      >
        <span className="text-lg">📊</span>
        <div>
          <div className="text-xs text-white/60 font-semibold leading-none">Round 2</div>
          <AnimatedCounter
            value={round2Profit}
            prefix="$"
            className="text-teal-400 font-black text-lg leading-none"
          />
        </div>
      </motion.div>
    </div>
  );
}
