'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ComposedChart, Bar, Line, XAxis, YAxis,
  ResponsiveContainer, Tooltip, CartesianGrid,
} from 'recharts';
import type { Round3Data } from '@/lib/types';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const SEASONAL_INDEX = [1.25,1.2,1.05,0.9,0.75,0.68,0.65,0.72,0.82,0.95,1.1,1.28];
const BASE_SALES = 320;
const PRICE = 3;
const UNIT_COST = 1;
const WASTE_PENALTY = 0.5;

function calcAnnualProfit(intensity: number, demands: number[]): number {
  const flat = demands.reduce((s, d) => s + d, 0) / 12;
  return Math.round(
    demands.reduce((sum, demand) => {
      const alloc = flat * (1 - intensity) + demand * intensity;
      const sold  = Math.min(alloc, demand);
      const waste = Math.max(0, alloc - demand);
      return sum + sold * PRICE - alloc * UNIT_COST - waste * WASTE_PENALTY;
    }, 0)
  );
}

interface Round3Props {
  onComplete: (data: Round3Data) => void;
}

export default function Round3({ onComplete }: Round3Props) {
  const [sliderValue, setSliderValue]       = useState(0);
  const [hasInteracted, setHasInteracted]   = useState(false);

  const monthlyData = useMemo(
    () => MONTHS.map((month, i) => ({ month, demand: Math.round(BASE_SALES * SEASONAL_INDEX[i]) })),
    []
  );
  const demands      = useMemo(() => monthlyData.map(m => m.demand), [monthlyData]);
  const annualDemand = useMemo(() => demands.reduce((s, d) => s + d, 0), [demands]);
  const flatAlloc    = annualDemand / 12;

  const intensity     = sliderValue / 100;
  const flatProfit    = useMemo(() => calcAnnualProfit(0, demands), [demands]);
  const optimalProfit = useMemo(() => calcAnnualProfit(1, demands), [demands]);
  const yourProfit    = calcAnnualProfit(intensity, demands);
  const profitDiff    = yourProfit - flatProfit;
  const maxGain       = optimalProfit - flatProfit;

  const peakMonth   = monthlyData.reduce((b, m) => m.demand > b.demand ? m : b);
  const troughMonth = monthlyData.reduce((b, m) => m.demand < b.demand ? m : b);
  const swing       = Math.round(((peakMonth.demand - troughMonth.demand) / troughMonth.demand) * 100);

  // Live chart: bars = your allocation, line = demand
  const chartData = monthlyData.map(({ month, demand }) => ({
    month,
    demand,
    allocation: Math.round(flatAlloc * (1 - intensity) + demand * intensity),
  }));

  return (
    <div className="max-w-3xl lg:max-w-5xl mx-auto px-4 py-6">

      {/* Header */}
      <motion.div className="text-center mb-6" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-3 text-sm font-bold"
          style={{ background: 'rgba(59,130,246,0.2)', border: '1px solid rgba(59,130,246,0.45)', color: '#1d4ed8' }}
        >
          Round 3 – Time Series Analysis
        </div>
        <h2 className="text-2xl md:text-3xl font-black text-[#001E62]">Seasonal Stock Allocation</h2>
        <p className="text-[#001E62]/70 text-sm mt-2">
          Demand peaks in summer — should you order the same stock every month?
        </p>
      </motion.div>

      <motion.div className="space-y-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="glass-card p-3 text-center">
            <p className="text-white/50 text-xs mb-1">Annual Demand</p>
            <p className="text-2xl font-black text-blue-300">{annualDemand.toLocaleString()}</p>
            <p className="text-white/40 text-xs">units / year</p>
          </div>
          <div className="glass-card p-3 text-center">
            <p className="text-white/50 text-xs mb-1">Peak Month</p>
            <p className="text-2xl font-black text-amber-300">{peakMonth.month}</p>
            <p className="text-white/40 text-xs">{peakMonth.demand} units</p>
          </div>
          <div className="glass-card p-3 text-center">
            <p className="text-white/50 text-xs mb-1">Seasonal Swing</p>
            <p className="text-2xl font-black text-teal-300">+{swing}%</p>
            <p className="text-white/40 text-xs">peak vs trough</p>
          </div>
        </div>

        {/* Live chart — bars reshape as slider moves */}
        <div className="glass-card p-4">
          <p className="text-white/55 text-xs font-bold mb-1 uppercase tracking-wide">
            Your orders (bars) vs customer demand (line) — updates live
          </p>
          <ResponsiveContainer width="100%" height={200}>
            <ComposedChart data={chartData} margin={{ top: 4, right: 8, bottom: 0, left: -8 }}>
              <CartesianGrid stroke="rgba(148,163,184,0.18)" strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fill: 'rgba(0,30,98,0.65)', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(0,30,98,0.50)', fontSize: 9 }} axisLine={false} tickLine={false} domain={[100, 460]} />
              <Tooltip
                contentStyle={{ background: 'rgba(255,255,255,0.98)', border: '1px solid rgba(0,30,98,0.15)', borderRadius: 8 }}
                labelStyle={{ color: '#001E62', fontWeight: 700, fontSize: 11 }}
                itemStyle={{ fontSize: 11 }}
              />
              <Bar dataKey="allocation" name="Your orders" fill="#3b82f6" fillOpacity={0.65} radius={[3, 3, 0, 0]} isAnimationActive={false} />
              <Line dataKey="demand" name="Demand" stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 3, fill: '#f59e0b', strokeWidth: 0 }} type="monotone" isAnimationActive={false} />
            </ComposedChart>
          </ResponsiveContainer>
          <div className="flex items-center justify-center gap-5 mt-1 text-xs text-[#001E62]/55">
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-3 h-3 rounded bg-blue-400/65"></span>Your orders
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-5 h-0.5 bg-amber-400 rounded"></span>Customer demand
            </span>
          </div>
        </div>

        {/* Slider interaction */}
        <div
          className="rounded-2xl p-5"
          style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.25)' }}
        >
          <p className="text-[#001E62] font-black text-base mb-1">
            🎯 Your call: how seasonal should your stock orders be?
          </p>
          <p className="text-[#001E62]/55 text-xs mb-4">
            Drag right to follow the seasonal curve — watch the chart and profits update live.
          </p>

          <div className="flex justify-between text-xs font-bold text-[#001E62]/55 mb-1.5">
            <span>📦 Flat (same every month)</span>
            <span>📈 Seasonal (match the curve)</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={sliderValue}
            onChange={(e) => {
              setSliderValue(Number(e.target.value));
              if (!hasInteracted) setHasInteracted(true);
            }}
            className="w-full h-3 rounded-full appearance-none cursor-pointer accent-blue-500"
            style={{
              background: `linear-gradient(to right, #3b82f6 ${sliderValue}%, rgba(59,130,246,0.18) ${sliderValue}%)`,
            }}
          />
          <div className="flex justify-between text-xs text-[#001E62]/35 mt-1 mb-4">
            <span>0%</span>
            <span className="font-bold text-blue-600">{sliderValue}% seasonal</span>
            <span>100%</span>
          </div>

          {/* Three-way profit comparison */}
          <div className="grid grid-cols-3 gap-3">
            <div
              className="rounded-xl p-3 text-center"
              style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.28)' }}
            >
              <p className="text-xs text-[#001E62]/50 mb-1">Flat strategy</p>
              <p className="text-lg font-black" style={{ color: '#b45309' }}>${flatProfit.toLocaleString()}</p>
              <p className="text-xs text-[#001E62]/38">baseline</p>
            </div>

            <div
              className="rounded-xl p-3 text-center"
              style={{
                background: !hasInteracted ? 'rgba(59,130,246,0.06)'
                  : profitDiff >= 0 ? 'rgba(16,185,129,0.10)' : 'rgba(239,68,68,0.07)',
                border: !hasInteracted ? '1px solid rgba(59,130,246,0.20)'
                  : profitDiff >= 0 ? '1px solid rgba(16,185,129,0.35)' : '1px solid rgba(239,68,68,0.28)',
              }}
            >
              <p className="text-xs text-[#001E62]/50 mb-1">Your strategy</p>
              <motion.p
                key={yourProfit}
                className="text-lg font-black"
                style={{ color: !hasInteracted ? '#3b82f6' : profitDiff >= 0 ? '#059669' : '#dc2626' }}
                initial={{ scale: 1.12 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.12 }}
              >
                ${yourProfit.toLocaleString()}
              </motion.p>
              <p
                className="text-xs font-bold"
                style={{ color: !hasInteracted ? 'rgba(0,30,98,0.35)' : profitDiff >= 0 ? '#059669' : '#dc2626' }}
              >
                {!hasInteracted ? '← drag slider'
                  : profitDiff === 0 ? 'same as flat'
                  : profitDiff > 0 ? `+$${profitDiff.toLocaleString()}` : `-$${Math.abs(profitDiff).toLocaleString()}`}
              </p>
            </div>

            <div
              className="rounded-xl p-3 text-center"
              style={{ background: 'rgba(20,184,166,0.08)', border: '1px solid rgba(20,184,166,0.28)' }}
            >
              <p className="text-xs text-[#001E62]/50 mb-1">Perfect seasonal</p>
              <p className="text-lg font-black" style={{ color: '#0d9488' }}>${optimalProfit.toLocaleString()}</p>
              <p className="text-xs text-[#001E62]/38">maximum</p>
            </div>
          </div>

          {/* Progress bar towards optimal */}
          <AnimatePresence>
            {hasInteracted && maxGain > 0 && (
              <motion.div
                className="mt-4"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <div className="flex justify-between text-xs text-[#001E62]/50 mb-1">
                  <span>Progress towards optimal</span>
                  <span className="font-bold">{Math.round(Math.max(0, (profitDiff / maxGain)) * 100)}%</span>
                </div>
                <div className="h-2.5 rounded-full overflow-hidden" style={{ background: 'rgba(0,30,98,0.10)' }}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: 'linear-gradient(90deg, #3b82f6, #10b981)' }}
                    animate={{ width: `${Math.max(0, Math.min(100, (profitDiff / maxGain) * 100))}%` }}
                    transition={{ duration: 0.25 }}
                  />
                </div>
                {sliderValue === 100 && (
                  <motion.p
                    className="text-center text-sm font-black text-teal-700 mt-2"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    🎯 Perfect match! +{Math.round((maxGain / flatProfit) * 100)}% more profit than flat ordering.
                  </motion.p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Key insight */}
        <div
          className="rounded-xl p-4"
          style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.28)' }}
        >
          <p className="text-blue-900 text-sm font-semibold text-center">
            Key insight: following seasonal patterns eliminates winter waste and summer shortfalls —
            every step toward the demand curve improves annual profit.
          </p>
        </div>

        <button
          className="btn-primary w-full justify-center"
          onClick={() => onComplete({ totalProfit: yourProfit, reallocationIntensity: intensity })}
        >
          Continue to Spatial Analysis →
        </button>

      </motion.div>
    </div>
  );
}

