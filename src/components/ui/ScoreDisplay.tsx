'use client';

import { motion } from 'framer-motion';
import AnimatedCounter from './AnimatedCounter';

interface ScoreDisplayProps {
  round1Profit: number;
  round2Profit: number;
  round3Intensity: number;
  round4HubName: string;
}

export default function ScoreDisplay({ round1Profit, round2Profit, round3Intensity, round4HubName }: ScoreDisplayProps) {
  const intensityPct = Math.round(round3Intensity * 100);

  return (
    <div className="flex items-center justify-center gap-3 px-4 py-2 flex-wrap">
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

      <motion.div
        className="glass-card flex items-center gap-2 px-4 py-2"
        key={`r3-${intensityPct}`}
        animate={{ scale: intensityPct > 0 ? [1, 1.1, 1] : 1 }}
        transition={{ duration: 0.3 }}
      >
        <span className="text-lg">📅</span>
        <div>
          <div className="text-xs text-white/60 font-semibold leading-none">Round 3</div>
          <div className="text-cyan-300 font-black text-lg leading-none">{intensityPct}%</div>
        </div>
      </motion.div>

      <motion.div
        className="glass-card flex items-center gap-2 px-4 py-2"
        key={`r4-${round4HubName}`}
        animate={{ scale: round4HubName !== 'Not selected' ? [1, 1.1, 1] : 1 }}
        transition={{ duration: 0.3 }}
      >
        <span className="text-lg">🗺️</span>
        <div>
          <div className="text-xs text-white/60 font-semibold leading-none">Round 4 Hub</div>
          <div className="text-indigo-300 font-black text-sm leading-none mt-0.5">{round4HubName}</div>
        </div>
      </motion.div>
    </div>
  );
}
