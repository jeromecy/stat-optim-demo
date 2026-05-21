'use client';

import { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid, Cell, LabelList } from 'recharts';
import type { Round4Data } from '@/lib/types';

const AustraliaMap = dynamic(() => import('./AustraliaMap'), {
  ssr: false,
  loading: () => (
    <div className="h-56 flex items-center justify-center">
      <p className="text-white/40 text-sm">Loading map…</p>
    </div>
  ),
});

type RegionKey = 'NSW' | 'VIC' | 'QLD' | 'WA' | 'SA' | 'TAS' | 'ACT' | 'NT';

const REGIONS: { key: RegionKey; name: string; demand: number; coordinates: [number, number] }[] = [
  { key: 'NSW', name: 'New South Wales',   demand: 320, coordinates: [151.2, -33.9] },
  { key: 'VIC', name: 'Victoria',          demand: 260, coordinates: [144.9, -37.8] },
  { key: 'QLD', name: 'Queensland',        demand: 200, coordinates: [153.0, -27.5] },
  { key: 'WA',  name: 'W. Australia',      demand: 110, coordinates: [115.9, -31.9] },
  { key: 'SA',  name: 'S. Australia',      demand: 70,  coordinates: [138.6, -34.9] },
  { key: 'TAS', name: 'Tasmania',          demand: 25,  coordinates: [147.3, -42.9] },
  { key: 'ACT', name: 'ACT',              demand: 10,  coordinates: [149.1, -35.3] },
  { key: 'NT',  name: 'N. Territory',      demand: 5,   coordinates: [130.8, -12.5] },
];

const REGION_COLORS = ['#3b82f6','#14b8a6','#f59e0b','#8b5cf6','#ec4899','#06b6d4','#84cc16','#f97316'];
const BASE_MARGIN = 2.50;

const HUB_OPTIONS = [
  {
    id: 'sydney', name: 'Sydney', emoji: '🏙️', color: '#0ea5e9', glow: 'rgba(14,165,233,0.35)',
    coordinates: [151.2, -33.9] as [number, number],
    hint: 'Close to the largest markets',
    costs: { NSW:0.50, VIC:0.70, QLD:0.85, WA:1.40, SA:0.90, TAS:1.10, ACT:0.55, NT:1.45 } as Record<RegionKey, number>,
  },
  {
    id: 'melbourne', name: 'Melbourne', emoji: '🌆', color: '#8b5cf6', glow: 'rgba(139,92,246,0.35)',
    coordinates: [144.9, -37.8] as [number, number],
    hint: 'Strong in the south-east',
    costs: { NSW:0.72, VIC:0.50, QLD:0.98, WA:1.35, SA:0.78, TAS:0.70, ACT:0.68, NT:1.42 } as Record<RegionKey, number>,
  },
  {
    id: 'perth', name: 'Perth', emoji: '🌅', color: '#f59e0b', glow: 'rgba(245,158,11,0.35)',
    coordinates: [115.9, -31.9] as [number, number],
    hint: 'Great for WA — costly to east',
    costs: { NSW:1.50, VIC:1.40, QLD:1.45, WA:0.50, SA:0.92, TAS:1.45, ACT:1.48, NT:1.15 } as Record<RegionKey, number>,
  },
  {
    id: 'darwin', name: 'Darwin', emoji: '🌴', color: '#10b981', glow: 'rgba(16,185,129,0.35)',
    coordinates: [130.8, -12.5] as [number, number],
    hint: 'Remote — very low NT demand',
    costs: { NSW:1.48, VIC:1.45, QLD:1.20, WA:1.15, SA:1.30, TAS:1.50, ACT:1.45, NT:0.50 } as Record<RegionKey, number>,
  },
];

function calcHubProfit(hub: typeof HUB_OPTIONS[0]): number {
  return Math.round(
    REGIONS.reduce((sum, r) => sum + r.demand * (BASE_MARGIN - hub.costs[r.key]), 0)
  );
}

// Pre-compute profits + winner (module-level, stable)
const HUB_PROFITS = HUB_OPTIONS.map(h => ({ id: h.id, profit: calcHubProfit(h) }));
const BEST_HUB_ID = HUB_PROFITS.reduce((best, h) => h.profit > best.profit ? h : best).id;

const EXPLAIN: Record<string, string> = {
  perth:     'Perth saves on WA, but WA is only 11% of demand. High shipping costs to NSW & VIC (58% of demand) wipes out the saving.',
  darwin:    'Darwin cuts NT costs, but NT is barely 0.5% of national demand. Expensive shipping to every eastern city makes it the worst choice.',
  melbourne: 'Melbourne is close — but Sydney sits slightly nearer to NSW (320 units, the biggest market) and QLD (200 units).',
};

interface Round4Props {
  onComplete: (data: Round4Data) => void;
}

export default function Round4({ onComplete }: Round4Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected     = HUB_OPTIONS.find(h => h.id === selectedId) ?? null;
  const bestProfit   = HUB_PROFITS.find(h => h.id === BEST_HUB_ID)!.profit;
  const yourProfit   = selected ? calcHubProfit(selected) : 0;

  const mapRegions = useMemo(() =>
    REGIONS.map((r, i) => ({
      ...r,
      transportCost: selected ? selected.costs[r.key] : 0.70,
      color: REGION_COLORS[i],
    })),
    [selected]
  );

  const comparisonData = HUB_OPTIONS.map(h => ({
    name: h.name,
    profit: calcHubProfit(h),
    color: h.color,
  }));

  const hubCoords = selected?.coordinates ?? [151.2, -33.9] as [number, number];

  return (
    <div className="max-w-3xl lg:max-w-5xl mx-auto px-4 py-6">

      {/* Header */}
      <motion.div className="text-center mb-6" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-3 text-sm font-bold"
          style={{ background: 'rgba(14,165,233,0.2)', border: '1px solid rgba(14,165,233,0.45)', color: '#0369a1' }}
        >
          Round 4 – Spatial Analysis
        </div>
        <h2 className="text-2xl md:text-3xl font-black text-[#001E62]">Where Should Your Hub Be?</h2>
        <p className="text-[#001E62]/70 text-sm mt-2">
          Pick a distribution hub city — transport costs vary by distance. Which location maximises profit?
        </p>
        <p className="text-xs text-amber-700/80 mt-1">Simulated data for demonstration purposes.</p>
      </motion.div>

      <motion.div className="space-y-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>

        {/* Hub selection cards */}
        <div>
          <p className="text-[#001E62] font-black text-sm mb-3 text-center">🎯 Pick your distribution hub city:</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {HUB_OPTIONS.map((hub) => {
              const isSelected = selectedId === hub.id;
              const isBest     = hub.id === BEST_HUB_ID;
              const profit     = calcHubProfit(hub);
              return (
                <motion.button
                  key={hub.id}
                  onClick={() => setSelectedId(hub.id)}
                  className="rounded-2xl p-4 text-left relative overflow-hidden"
                  style={{
                    background: isSelected ? `${hub.color}18` : 'rgba(255,255,255,0.75)',
                    border: isSelected ? `2px solid ${hub.color}` : '1px solid rgba(0,30,98,0.12)',
                    boxShadow: isSelected ? `0 0 22px ${hub.glow}` : 'none',
                  }}
                  whileHover={{ scale: 1.03, boxShadow: `0 6px 20px ${hub.glow}` }}
                  whileTap={{ scale: 0.97 }}
                >
                  {isSelected && isBest && (
                    <div
                      className="absolute top-2 right-2 text-xs font-black px-1.5 py-0.5 rounded-full text-white"
                      style={{ background: hub.color }}
                    >
                      ✓ Best
                    </div>
                  )}
                  <div className="text-3xl mb-2">{hub.emoji}</div>
                  <p className="font-black text-sm text-[#001E62]">{hub.name}</p>
                  <p className="text-xs text-[#001E62]/50 mt-0.5 leading-snug">{hub.hint}</p>
                  <AnimatePresence>
                    {isSelected && (
                      <motion.p
                        className="text-sm font-black mt-2"
                        style={{ color: hub.color }}
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                      >
                        ${profit.toLocaleString()}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Map — hub marker moves on selection */}
        <div className="glass-card p-4">
          <p className="text-white/55 text-xs font-bold mb-1 uppercase tracking-wide">
            Australia — demand & transport costs
            {selected && <span className="text-white/40"> · Hub: {selected.name}</span>}
          </p>
          <div style={{ maxWidth: 500, margin: '0 auto' }}>
            <AustraliaMap regions={mapRegions} hubCoordinates={hubCoords} hubName={selected?.name ?? 'Sydney'} />
          </div>
          <p className="text-xs text-white/40 mt-1 text-center">
            Circle size ∝ demand · Line colour: teal = cheap, red = expensive
          </p>
        </div>

        {/* Demand by region — always visible */}
        <div
          className="rounded-2xl p-4"
          style={{ background: 'rgba(255,255,255,0.85)', border: '1px solid rgba(0,30,98,0.12)' }}
        >
          <p className="text-[#001E62] font-black text-sm mb-3">📊 Annual demand by state (units)</p>
          <ResponsiveContainer width="100%" height={230}>
            <BarChart
              data={REGIONS.map((r, i) => ({ name: r.key, demand: r.demand, color: REGION_COLORS[i] }))}
              layout="vertical"
              margin={{ left: 0, right: 36, top: 0, bottom: 0 }}
            >
              <CartesianGrid stroke="rgba(148,163,184,0.18)" strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" tick={{ fill: 'rgba(0,30,98,0.45)', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fill: 'rgba(0,30,98,0.70)', fontSize: 11, fontWeight: 700 }} axisLine={false} tickLine={false} width={36} />
              <Tooltip
                contentStyle={{ background: 'rgba(255,255,255,0.98)', border: '1px solid rgba(0,30,98,0.15)', borderRadius: 8 }}
                formatter={(v: number) => [`${v} units`, 'Annual demand']}
              />
              <Bar dataKey="demand" radius={[0, 4, 4, 0]}>
                {REGIONS.map((_, i) => (
                  <Cell key={i} fill={REGION_COLORS[i]} fillOpacity={0.80} />
                ))}
                <LabelList dataKey="demand" position="right" style={{ fontSize: 10, fill: 'rgba(0,30,98,0.60)', fontWeight: 600 }} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Results — appear after selection */}
        <AnimatePresence mode="wait">
          {selected ? (
            <motion.div
              key={selected.id}
              className="space-y-3"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
            >
              {/* Profit comparison bar chart */}
              <div
                className="rounded-2xl p-4"
                style={{ background: 'rgba(255,255,255,0.85)', border: '1px solid rgba(0,30,98,0.12)' }}
              >
                <p className="text-[#001E62] font-black text-sm mb-3">Annual profit — all hub locations</p>
                <ResponsiveContainer width="100%" height={150}>
                  <BarChart data={comparisonData} margin={{ left: 0, right: 16, top: 4, bottom: 4 }}>
                    <CartesianGrid stroke="rgba(148,163,184,0.18)" strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" tick={{ fill: 'rgba(0,30,98,0.70)', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: 'rgba(0,30,98,0.50)', fontSize: 10 }} axisLine={false} tickLine={false} width={50} />
                    <Tooltip
                      contentStyle={{ background: 'rgba(255,255,255,0.98)', border: '1px solid rgba(0,30,98,0.15)', borderRadius: 8 }}
                      formatter={(v: number) => [`$${v.toLocaleString()}`, 'Profit']}
                    />
                    <Bar dataKey="profit" radius={[4, 4, 0, 0]}>
                      {comparisonData.map((entry, i) => (
                        <Cell
                          key={i}
                          fill={entry.color}
                          fillOpacity={entry.name === selected.name ? 1 : 0.35}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Result message */}
              <motion.div
                className="rounded-2xl p-4 text-center"
                style={{
                  background: selectedId === BEST_HUB_ID
                    ? 'rgba(16,185,129,0.10)' : 'rgba(245,158,11,0.08)',
                  border: selectedId === BEST_HUB_ID
                    ? '1px solid rgba(16,185,129,0.38)' : '1px solid rgba(245,158,11,0.38)',
                }}
                initial={{ scale: 0.97 }}
                animate={{ scale: 1 }}
              >
                {selectedId === BEST_HUB_ID ? (
                  <>
                    <p className="text-lg font-black text-green-800">🎯 Optimal choice!</p>
                    <p className="text-sm text-green-700 mt-1">
                      Sydney wins because NSW + VIC = 58% of national demand and both sit close by.
                      Minimising cost on <em>high-volume</em> routes is what drives total profit.
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-lg font-black text-amber-800">
                      Not optimal — Sydney beats this by ${(bestProfit - yourProfit).toLocaleString()}
                    </p>
                    <p className="text-sm text-amber-700 mt-1">
                      {EXPLAIN[selectedId ?? ''] ?? ''}
                    </p>
                  </>
                )}
              </motion.div>

              {/* Key insight */}
              <div
                className="rounded-xl p-4"
                style={{ background: 'rgba(14,165,233,0.08)', border: '1px solid rgba(14,165,233,0.28)' }}
              >
                <p className="text-sky-900 text-sm font-semibold text-center">
                  Key insight: don&apos;t minimise cost to the <em>nearest</em> region —
                  minimise <em>demand-weighted</em> cost across all regions. That&apos;s spatial optimisation.
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="placeholder"
              className="rounded-xl p-4 text-center"
              style={{ background: 'rgba(14,165,233,0.06)', border: '1px solid rgba(14,165,233,0.20)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="text-sky-800 text-sm">👆 Pick a hub city above to see the profit impact</p>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          className="btn-primary w-full justify-center"
          onClick={() => onComplete({ allocation: {}, results: [], totalProfit: yourProfit })}
        >
          See Final Results →
        </button>

      </motion.div>
    </div>
  );
}


