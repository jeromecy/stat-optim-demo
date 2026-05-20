'use client';

import { motion } from 'framer-motion';
import AnimatedCounter from './AnimatedCounter';

interface ScoreDisplayProps {
  score: number;
  profit: number;
}

export default function ScoreDisplay({ score, profit }: ScoreDisplayProps) {
  return (
    <div className="flex items-center justify-center gap-4 px-4 py-2">
      <motion.div
        className="glass-card flex items-center gap-2 px-4 py-2"
        key={`score-${score}`}
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 0.3 }}
      >
        <span className="text-yellow-400 text-lg">⭐</span>
        <div>
          <div className="text-xs text-white/60 font-semibold leading-none">Score</div>
          <AnimatedCounter
            value={score}
            className="text-yellow-400 font-black text-lg leading-none"
          />
        </div>
      </motion.div>

      <motion.div
        className="glass-card flex items-center gap-2 px-4 py-2"
        key={`profit-${profit}`}
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 0.3 }}
      >
        <span className="text-green-400 text-lg">💰</span>
        <div>
          <div className="text-xs text-white/60 font-semibold leading-none">Profit</div>
          <AnimatedCounter
            value={profit}
            prefix="$"
            className="text-green-400 font-black text-lg leading-none"
          />
        </div>
      </motion.div>
    </div>
  );
}
