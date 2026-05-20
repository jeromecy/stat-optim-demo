'use client';

import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid, Cell } from 'recharts';
import type { Round4Data } from '@/lib/types';

// Dynamically imported to avoid SSR issues with d3-geo / react-simple-maps
const AustraliaMap = dynamic(() => import('./AustraliaMap'), {
  ssr: false,
  loading: () => (
    <div className="h-56 flex items-center justify-center">
      <p className="text-white/40 text-sm">Loading map…</p>
    </div>
  ),
});

// Geographic coordinates (longitude, latitude) for each capital / major city
const REGIONS = [
  { key: 'NSW', name: 'New South Wales',    demand: 320, transportCost: 0.70, coordinates: [151.2, -33.9] as [number, number] },
  { key: 'VIC', name: 'Victoria',           demand: 260, transportCost: 0.65, coordinates: [144.9, -37.8] as [number, number] },
  { key: 'QLD', name: 'Queensland',         demand: 200, transportCost: 0.90, coordinates: [153.0, -27.5] as [number, number] },
  { key: 'WA',  name: 'Western Australia',  demand: 110, transportCost: 1.20, coordinates: [115.9, -31.9] as [number, number] },
  { key: 'SA',  name: 'South Australia',    demand: 70,  transportCost: 0.80, coordinates: [138.6, -34.9] as [number, number] },
  { key: 'TAS', name: 'Tasmania',           demand: 25,  transportCost: 1.10, coordinates: [147.3, -42.9] as [number, number] },
  { key: 'ACT', name: 'ACT',               demand: 10,  transportCost: 0.68, coordinates: [149.1, -35.3] as [number, number] },
  { key: 'NT',  name: 'Northern Territory', demand: 5,   transportCost: 1.40, coordinates: [130.8, -12.5] as [number, number] },
];

// Hypothetical distribution hub — Sydney (eastern-seaboard business scenario)
const HUB_COORDS: [number, number] = [151.2, -33.9];

const DEMAND_COLORS = ['#3b82f6', '#14b8a6', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16', '#f97316'];

interface Round4Props {
  onComplete: (data: Round4Data) => void;
}

export default function Round4({ onComplete }: Round4Props) {
  const totalDemand = REGIONS.reduce((s, r) => s + r.demand, 0);

  const demandData = REGIONS.map((r) => ({
    key: r.key,
    demand: r.demand,
    share: Math.round((r.demand / totalDemand) * 100),
  }));

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <motion.div className="text-center mb-6" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-3 text-sm font-bold"
          style={{ background: 'rgba(14,165,233,0.2)', border: '1px solid rgba(14,165,233,0.45)', color: '#0369a1' }}
        >
          Round 4 – Spatial Analysis
        </div>
        <h2 className="text-2xl md:text-3xl font-black text-[#001E62]">Demand Variation Across Australia</h2>
        <p className="text-[#001E62]/70 text-sm mt-2">Not every region needs the same — spatial data reveals where demand concentrates.</p>
        <p className="text-xs text-amber-700/80 mt-2">Simulated data for demonstration purposes.</p>
      </motion.div>

      <motion.div className="space-y-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        {/* Australian transport map */}
        <div className="glass-card p-4">
          <p className="text-white/55 text-xs font-bold mb-1 uppercase tracking-wide">Australia — spatial demand &amp; transport network</p>
          <AustraliaMap
            regions={REGIONS.map((r, i) => ({ ...r, color: DEMAND_COLORS[i] }))}
            hubCoordinates={HUB_COORDS}
          />
          <p className="text-xs text-white/45 mt-1 text-center">
            Hypothetical scenario: warehouse hub in Sydney · Circle size ∝ demand · Line colour = transport cost (teal = low cost, red/dashed = high cost)
          </p>
        </div>

        {/* Demand by state */}
        <div className="glass-card p-4">
          <p className="text-white/55 text-xs font-bold mb-3 uppercase tracking-wide">Annual demand by state / territory (units)</p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={demandData} layout="vertical" margin={{ left: 4, right: 24, top: 4, bottom: 4 }}>
              <CartesianGrid stroke="rgba(148,163,184,0.18)" strokeDasharray="3 3" horizontal={false} />
              <XAxis
                type="number"
                tick={{ fill: 'rgba(0,30,98,0.55)', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="key"
                tick={{ fill: 'rgba(0,30,98,0.70)', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={36}
              />
              <Tooltip
                contentStyle={{ background: 'rgba(255,255,255,0.98)', border: '1px solid rgba(0,30,98,0.15)', borderRadius: 8 }}
                labelStyle={{ color: '#001E62', fontWeight: 600, fontSize: 12 }}
                itemStyle={{ color: '#374151', fontSize: 12 }}
                formatter={(v: number, _: string, entry: { payload?: { share: number } }) => [
                  `${v} units (${entry.payload?.share ?? 0}%)`,
                  'Demand',
                ]}
              />
              <Bar dataKey="demand" radius={[0, 4, 4, 0]}>
                {demandData.map((_entry, index) => (
                  <Cell key={index} fill={DEMAND_COLORS[index % DEMAND_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Insights */}
        <div className="glass-card p-4">
          <p className="text-white/70 font-semibold text-sm mb-3">What this tells us</p>
          <ul className="space-y-2 text-white/60 text-sm">
            <li className="flex gap-2">
              <span className="text-sky-400 shrink-0">▸</span>
              NSW and VIC account for over <strong className="text-white/80">58% of national demand</strong> — the eastern seaboard dominates.
            </li>
            <li className="flex gap-2">
              <span className="text-sky-400 shrink-0">▸</span>
              WA and NT have small markets but the <strong className="text-white/80">highest transport costs</strong>, making supply decisions there critical to profitability.
            </li>
            <li className="flex gap-2">
              <span className="text-sky-400 shrink-0">▸</span>
              Spatial statistics helps identify where to locate warehouses, distribution hubs, and service centres.
            </li>
            <li className="flex gap-2">
              <span className="text-sky-400 shrink-0">▸</span>
              Combining spatial and temporal data gives a complete picture for logistics, inventory, and investment planning.
            </li>
          </ul>
        </div>

        <div
          className="rounded-xl p-4"
          style={{ background: 'rgba(14,165,233,0.1)', border: '1px solid rgba(14,165,233,0.3)' }}
        >
          <p className="text-sky-900 text-sm font-semibold text-center">
            Key insight: spatial analysis reveals where to invest resources for maximum reach and efficiency
            across Australia&apos;s diverse geography.
          </p>
        </div>

        <button
          className="btn-primary w-full justify-center"
          onClick={() => onComplete({ allocation: {}, results: [], totalProfit: 0 })}
        >
          See Final Results →
        </button>
      </motion.div>
    </div>
  );
}
