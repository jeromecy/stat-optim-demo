'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid, ReferenceLine } from 'recharts';
import type { Round3Data } from '@/lib/types';

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

// Australia (Southern Hemisphere): summer peaks Dec–Feb, winter trough Jun–Jul
const SEASONAL_INDEX = [1.25, 1.2, 1.05, 0.9, 0.75, 0.68, 0.65, 0.72, 0.82, 0.95, 1.1, 1.28];
const BASE_SALES = 320;

interface Round3Props {
  onComplete: (data: Round3Data) => void;
}

export default function Round3({ onComplete }: Round3Props) {
  const monthlyData = useMemo(
    () => MONTHS.map((month, i) => ({ month, sales: Math.round(BASE_SALES * SEASONAL_INDEX[i]) })),
    []
  );

  const annualTotal = useMemo(() => monthlyData.reduce((s, m) => s + m.sales, 0), [monthlyData]);
  const monthlyAvg = Math.round(annualTotal / 12);
  const peakMonth = monthlyData.reduce((best, m) => (m.sales > best.sales ? m : best));
  const troughMonth = monthlyData.reduce((best, m) => (m.sales < best.sales ? m : best));
  const seasonalSwing = Math.round(((peakMonth.sales - troughMonth.sales) / troughMonth.sales) * 100);

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <motion.div className="text-center mb-6" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-3 text-sm font-bold"
          style={{ background: 'rgba(59,130,246,0.2)', border: '1px solid rgba(59,130,246,0.45)', color: '#1d4ed8' }}
        >
          Round 3 – Time Series Analysis
        </div>
        <h2 className="text-2xl md:text-3xl font-black text-[#001E62]">Annual Sales Patterns</h2>
        <p className="text-[#001E62]/70 text-sm mt-2">How does demand change across the year — and what does that tell us?</p>
        <p className="text-xs text-amber-700/80 mt-2">Simulated data for demonstration purposes.</p>
      </motion.div>

      <motion.div className="space-y-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        {/* Line chart */}
        <div className="glass-card p-4">
          <p className="text-white/55 text-xs font-bold mb-3 uppercase tracking-wide">Monthly sales — national (units)</p>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={monthlyData}>
              <CartesianGrid stroke="rgba(148,163,184,0.18)" strokeDasharray="3 3" />
              <XAxis
                dataKey="month"
                tick={{ fill: 'rgba(0,30,98,0.70)', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: 'rgba(0,30,98,0.55)', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                domain={[150, 440]}
              />
              <Tooltip
                contentStyle={{ background: 'rgba(255,255,255,0.98)', border: '1px solid rgba(0,30,98,0.15)', borderRadius: 8 }}
                labelStyle={{ color: '#001E62', fontWeight: 600, fontSize: 12 }}
                itemStyle={{ color: '#374151', fontSize: 12 }}
                formatter={(v: number) => [`${v}`, 'Units sold']}
              />
              <ReferenceLine
                y={monthlyAvg}
                stroke="rgba(0,30,98,0.25)"
                strokeDasharray="4 4"
                label={{ value: 'monthly avg', fill: 'rgba(0,30,98,0.42)', fontSize: 10, position: 'insideTopRight' }}
              />
              <Line
                type="monotone"
                dataKey="sales"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ r: 4, fill: '#3b82f6', strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Key stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="glass-card p-3 text-center">
            <p className="text-white/50 text-xs mb-1">Annual Total</p>
            <p className="text-2xl font-black text-blue-300">{annualTotal.toLocaleString()}</p>
            <p className="text-white/40 text-xs">units / year</p>
          </div>
          <div className="glass-card p-3 text-center">
            <p className="text-white/50 text-xs mb-1">Peak Month</p>
            <p className="text-2xl font-black text-amber-300">{peakMonth.month}</p>
            <p className="text-white/40 text-xs">{peakMonth.sales} units</p>
          </div>
          <div className="glass-card p-3 text-center">
            <p className="text-white/50 text-xs mb-1">Seasonal Swing</p>
            <p className="text-2xl font-black text-teal-300">+{seasonalSwing}%</p>
            <p className="text-white/40 text-xs">peak vs trough</p>
          </div>
        </div>

        {/* Optimisation question */}
        <div
          className="rounded-xl p-4"
          style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.38)' }}
        >
          <p className="text-amber-700 text-sm font-bold mb-2">💡 The optimisation question</p>
          <p className="text-[#001E62] text-sm">
            If December demand is nearly <strong className="text-amber-800">twice July&apos;s</strong>, how should you
            allocate monthly stock orders to <strong className="text-amber-800">maximise annual profit</strong>?
          </p>
          <p className="text-[#001E62]/70 text-sm mt-2">
            Order too much in winter → unsold stock, waste costs.<br />
            Order too little in summer → missed sales, lost revenue.<br />
            <strong className="text-amber-700">Optimisation models</strong> find the ideal allocation across all
            12 months automatically — balancing holding costs against lost-sales costs to maximise total annual profit.
          </p>
        </div>

        {/* Insights */}
        <div className="glass-card p-4">
          <p className="text-white/70 font-semibold text-sm mb-3">What this tells us</p>
          <ul className="space-y-2 text-white/60 text-sm">
            <li className="flex gap-2">
              <span className="text-blue-400 shrink-0">▸</span>
              Sales follow a clear <strong className="text-white/80">seasonal pattern</strong> — Australia&apos;s summer (Dec–Feb) drives peak demand for ice cream.
            </li>
            <li className="flex gap-2">
              <span className="text-blue-400 shrink-0">▸</span>
              December is nearly twice July&apos;s sales — a {seasonalSwing}% swing between peak and trough.
            </li>
            <li className="flex gap-2">
              <span className="text-blue-400 shrink-0">▸</span>
              Businesses can use these patterns to plan staffing, stock orders, and production schedules well ahead of each peak.
            </li>
            <li className="flex gap-2">
              <span className="text-blue-400 shrink-0">▸</span>
              Statistics provides tools like <em>seasonal decomposition</em> and <em>ARIMA models</em> to automatically extract these patterns from real historical data.
            </li>
          </ul>
        </div>

        <div
          className="rounded-xl p-4"
          style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)' }}
        >
          <p className="text-blue-900 text-sm font-semibold text-center">
            Key insight: time series analysis turns historical sales into actionable seasonal forecasts —
            reducing over-stocking in winter and shortfalls in summer.
          </p>
        </div>

        <button
          className="btn-primary w-full justify-center"
          onClick={() => onComplete({ totalProfit: 0, reallocationIntensity: 0 })}
        >
          Continue to Spatial Analysis →
        </button>
      </motion.div>
    </div>
  );
}
