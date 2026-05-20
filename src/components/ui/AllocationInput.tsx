'use client';

import { motion } from 'framer-motion';
import { FLAVORS } from '@/lib/gameLogic';
import type { FlavorId } from '@/lib/types';

const TOTAL_SCOOPS = 20;

interface AllocationInputProps {
  allocation: Record<FlavorId, number>;
  onChange: (allocation: Record<FlavorId, number>) => void;
}

export default function AllocationInput({ allocation, onChange }: AllocationInputProps) {
  const usedScoops = Object.values(allocation).reduce((a, b) => a + b, 0);
  const remaining = TOTAL_SCOOPS - usedScoops;

  const adjust = (id: FlavorId, delta: number) => {
    const current = allocation[id];
    const newVal = current + delta;
    if (newVal < 0) return;
    if (delta > 0 && remaining <= 0) return;
    onChange({ ...allocation, [id]: newVal });
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-white/70 text-sm font-semibold">Scoop allocations:</span>
        <motion.div
          key={remaining}
          animate={{ scale: [1.2, 1] }}
          transition={{ duration: 0.15 }}
          className="font-black text-base px-3 py-1 rounded-full"
          style={{
            background: remaining === 0
              ? 'rgba(6,214,160,0.2)'
              : remaining <= 3
              ? 'rgba(255,214,10,0.2)'
              : 'rgba(0,30,98,0.07)',
            color: remaining === 0 ? '#06d6a0' : remaining <= 3 ? '#c27c00' : 'rgba(0,30,98,0.55)',
            border: `1px solid ${remaining === 0 ? 'rgba(6,214,160,0.5)' : 'rgba(0,30,98,0.15)'}`,
          }}
        >
          {remaining > 0 ? `${remaining} scoops left` : '✓ All 20 allocated!'}
        </motion.div>
      </div>

      {/* Per-flavor rows */}
      <div className="space-y-3">
        {FLAVORS.map((flavor) => {
          const count = allocation[flavor.id];
          const barPct = (count / TOTAL_SCOOPS) * 100;
          const canDecrease = count > 0;
          const canIncrease = remaining > 0;

          return (
            <div key={flavor.id} className="flex items-center gap-3">
              <span className="text-xl w-7 text-center shrink-0">{flavor.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1.5">
                  <span style={{ color: flavor.textColor }} className="text-sm font-bold truncate">
                    {flavor.name}
                  </span>
                  <div className="flex items-center gap-1 shrink-0 ml-2">
                    <motion.button
                      className="w-7 h-7 rounded-lg font-black text-sm flex items-center justify-center select-none"
                      style={{
                        background: canDecrease ? 'rgba(0,30,98,0.12)' : 'rgba(0,30,98,0.04)',
                        color: canDecrease ? '#001E62' : 'rgba(0,30,98,0.22)',
                      }}
                      onClick={() => adjust(flavor.id, -1)}
                      disabled={!canDecrease}
                      whileTap={canDecrease ? { scale: 0.85 } : {}}
                    >
                      −
                    </motion.button>
                    <span className="text-white font-black text-base w-7 text-center tabular-nums">
                      {count}
                    </span>
                    <motion.button
                      className="w-7 h-7 rounded-lg font-black text-sm flex items-center justify-center select-none"
                      style={{
                        background: canIncrease ? 'rgba(0,30,98,0.12)' : 'rgba(0,30,98,0.04)',
                        color: canIncrease ? '#001E62' : 'rgba(0,30,98,0.22)',
                      }}
                      onClick={() => adjust(flavor.id, 1)}
                      disabled={!canIncrease}
                      whileTap={canIncrease ? { scale: 0.85 } : {}}
                    >
                      +
                    </motion.button>
                  </div>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: count > 0 ? flavor.borderColor : 'transparent' }}
                    animate={{ width: `${barPct}%` }}
                    transition={{ duration: 0.18, ease: 'easeOut' }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Total progress bar */}
      <div className="mt-4">
        <div className="h-2.5 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full transition-colors duration-300"
            style={{ background: remaining === 0 ? '#06d6a0' : 'rgba(255,214,10,0.7)' }}
            animate={{ width: `${(usedScoops / TOTAL_SCOOPS) * 100}%` }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
          />
        </div>
        <div className="flex justify-between text-xs text-white/40 font-semibold mt-1">
          <span>0</span>
          <span className="text-white/50">{usedScoops} / 20 scoops used</span>
          <span>20</span>
        </div>
      </div>
    </div>
  );
}
