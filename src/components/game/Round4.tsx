'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedCounter from '@/components/ui/AnimatedCounter';
import type { Round4Data, RegionAllocationResult } from '@/lib/types';

const TOTAL_STOCK = 100;
const UNIT_REVENUE = 4.2;

const REGIONS = [
  { key: 'WA', name: 'Western Australia', demand: 18, transportCost: 1.0, x: 20, y: 50 },
  { key: 'SA', name: 'South Australia', demand: 14, transportCost: 0.8, x: 43, y: 58 },
  { key: 'QLD', name: 'Queensland', demand: 25, transportCost: 0.9, x: 66, y: 33 },
  { key: 'NSW', name: 'New South Wales', demand: 23, transportCost: 0.7, x: 68, y: 58 },
  { key: 'VIC', name: 'Victoria', demand: 20, transportCost: 0.65, x: 60, y: 72 },
];

type AllocationMap = Record<string, number>;
type Phase = 'allocate' | 'result';

interface Round4Props {
  onComplete: (data: Round4Data) => void;
}

function clampAllocation(allocation: AllocationMap): AllocationMap {
  const clean: AllocationMap = {};
  REGIONS.forEach((r) => {
    clean[r.key] = Math.max(0, allocation[r.key] ?? 0);
  });
  return clean;
}

function computeRegionResults(allocation: AllocationMap): RegionAllocationResult[] {
  return REGIONS.map((region) => {
    const alloc = allocation[region.key] ?? 0;
    const sold = Math.min(alloc, region.demand);
    const netProfit = sold * UNIT_REVENUE - alloc * region.transportCost;
    return {
      region: region.key,
      allocation: alloc,
      demand: region.demand,
      sold,
      transportCost: region.transportCost,
      netProfit: Math.round(netProfit),
    };
  });
}

function buildSuggestedAllocation(): AllocationMap {
  const result: AllocationMap = {};
  const weighted = REGIONS.map((r) => ({ ...r, score: UNIT_REVENUE - r.transportCost }));
  const denom = weighted.reduce((s, w) => s + Math.max(0.25, w.score) * w.demand, 0);

  let used = 0;
  weighted.forEach((w) => {
    const raw = (Math.max(0.25, w.score) * w.demand / denom) * TOTAL_STOCK;
    const v = Math.floor(raw);
    result[w.key] = v;
    used += v;
  });

  let remaining = TOTAL_STOCK - used;
  const ranked = [...weighted].sort((a, b) => (b.score * b.demand) - (a.score * a.demand));
  let i = 0;
  while (remaining > 0) {
    result[ranked[i % ranked.length].key] += 1;
    remaining -= 1;
    i += 1;
  }

  return result;
}

export default function Round4({ onComplete }: Round4Props) {
  const [phase, setPhase] = useState<Phase>('allocate');
  const [allocation, setAllocation] = useState<AllocationMap>(() => buildSuggestedAllocation());

  const totalAllocated = useMemo(
    () => Object.values(allocation).reduce((sum, v) => sum + v, 0),
    [allocation]
  );

  const results = useMemo(() => computeRegionResults(clampAllocation(allocation)), [allocation]);
  const totalProfit = useMemo(() => results.reduce((sum, r) => sum + r.netProfit, 0), [results]);

  const adjust = (key: string, delta: number) => {
    const next = { ...allocation };
    if (delta > 0 && totalAllocated >= TOTAL_STOCK) return;
    next[key] = Math.max(0, (next[key] ?? 0) + delta);
    setAllocation(next);
  };

  const runOptimisationView = () => {
    if (totalAllocated !== TOTAL_STOCK) return;
    setPhase('result');
  };

  const handleContinue = () => {
    onComplete({
      allocation,
      results,
      totalProfit,
    });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <motion.div className="text-center mb-6" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-3 text-sm font-bold"
          style={{ background: 'rgba(14,165,233,0.2)', border: '1px solid rgba(14,165,233,0.45)', color: '#bae6fd' }}
        >
          Round 4 - Spatial Allocation Optimisation
        </div>
        <h2 className="text-2xl md:text-3xl font-black text-white">Allocate Stock Across Australia</h2>
        <p className="text-white/60 text-sm mt-2">Maximise net profit by balancing regional demand and transport costs.</p>
      </motion.div>

      <AnimatePresence mode="wait">
        {phase === 'allocate' && (
          <motion.div
            key="allocate"
            className="space-y-4"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
          >
            <div className="glass-card p-4">
              <p className="text-white/55 text-xs font-bold mb-2 uppercase tracking-wide">Schematic map (not to scale)</p>
              <div className="rounded-xl bg-slate-900/60 border border-slate-600/40 p-2">
                <svg viewBox="0 0 100 90" className="w-full h-52">
                  <path d="M10 20 L35 12 L52 18 L72 24 L82 40 L79 58 L66 76 L42 81 L22 70 L11 52 Z" fill="rgba(30,41,59,0.85)" stroke="rgba(148,163,184,0.45)" strokeWidth="1.2" />
                  {REGIONS.map((r) => (
                    <g key={r.key}>
                      <circle cx={r.x} cy={r.y} r={4.2} fill="rgba(20,184,166,0.9)" />
                      <text x={r.x + 5} y={r.y + 1} fill="#e2e8f0" fontSize="4.5" fontWeight="700">{r.key}</text>
                    </g>
                  ))}
                </svg>
              </div>
            </div>

            <div className="glass-card p-4">
              <div className="flex justify-between text-sm font-semibold mb-3">
                <span className="text-white/65">Regional allocation</span>
                <span className={totalAllocated === TOTAL_STOCK ? 'text-teal-300' : 'text-amber-300'}>
                  {totalAllocated}/{TOTAL_STOCK} units
                </span>
              </div>

              <div className="space-y-2">
                {REGIONS.map((r) => (
                  <div key={r.key} className="rounded-lg p-2 bg-white/5 border border-white/10">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-white text-sm font-semibold">{r.key} · {r.name}</span>
                      <span className="text-xs text-white/55">Demand {r.demand} · Cost ${r.transportCost.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="w-8 h-8 rounded-md bg-white/10 text-white font-black" onClick={() => adjust(r.key, -1)}>-</button>
                      <div className="flex-1 rounded-md py-1 text-center bg-slate-800/70 border border-slate-600/40 text-white font-black">
                        {allocation[r.key] ?? 0}
                      </div>
                      <button className="w-8 h-8 rounded-md bg-white/10 text-white font-black" onClick={() => adjust(r.key, 1)}>+</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              className={`btn-primary w-full justify-center ${totalAllocated !== TOTAL_STOCK ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={runOptimisationView}
              disabled={totalAllocated !== TOTAL_STOCK}
            >
              Evaluate Spatial Optimisation
            </button>
          </motion.div>
        )}

        {phase === 'result' && (
          <motion.div
            key="result"
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="glass-card p-4">
              <p className="text-white/55 text-xs font-bold mb-2 uppercase tracking-wide">Net contribution by region</p>
              <div className="space-y-2">
                {results.map((r) => (
                  <div key={r.region} className="rounded-lg p-3 bg-white/5 border border-white/10 flex justify-between items-center">
                    <div>
                      <p className="text-white font-semibold">{r.region}</p>
                      <p className="text-xs text-white/55">Alloc {r.allocation}, Sold {r.sold}, Demand {r.demand}</p>
                    </div>
                    <p className={`font-black ${r.netProfit >= 0 ? 'text-teal-300' : 'text-orange-300'}`}>${r.netProfit}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl p-4 text-center" style={{ background: 'rgba(14,165,233,0.12)', border: '1px solid rgba(14,165,233,0.3)' }}>
              <p className="text-white/60 text-sm mb-1">Round 4 total net profit</p>
              <AnimatedCounter value={totalProfit} prefix="$" className="text-3xl font-black text-sky-300" />
            </div>

            <button className="btn-primary w-full justify-center" onClick={handleContinue}>
              See Final Results
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
