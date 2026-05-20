'use client';

import { motion } from 'framer-motion';

interface FinalResultsProps {
  round1Profit: number;
  round2Profit: number;
  round3Profit: number;
  round4Profit: number;
  score: number;
  onRestart: () => void;
  onContinue: () => void;
}

/* ─── Mini SVG Visuals ────────────────────────────────────────────── */

function BellCurveSVG() {
  return (
    <svg viewBox="0 0 80 40" className="w-full h-12" fill="none">
      <path d="M4,36 C12,36 18,34 24,26 C30,18 34,4 40,4 C46,4 50,18 56,26 C62,34 68,36 76,36"
        stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="40" y1="36" x2="40" y2="6" stroke="#6366f1" strokeWidth="1" strokeDasharray="3 2" strokeOpacity="0.45" />
      <line x1="4" y1="36" x2="76" y2="36" stroke="#6366f1" strokeWidth="1.5" strokeOpacity="0.3" />
    </svg>
  );
}

function FeasibleRegionSVG() {
  return (
    <svg viewBox="0 0 80 44" className="w-full h-12" fill="none">
      <line x1="8" y1="36" x2="75" y2="36" stroke="#10b981" strokeWidth="1.5" strokeOpacity="0.4" />
      <line x1="8" y1="4"  x2="8"  y2="36" stroke="#10b981" strokeWidth="1.5" strokeOpacity="0.4" />
      <polygon points="8,36 52,36 52,14 8,14" fill="#10b981" fillOpacity="0.18" />
      <line x1="8" y1="14" x2="52" y2="14" stroke="#10b981" strokeWidth="1.8" strokeDasharray="3 2" />
      <line x1="52" y1="4" x2="52" y2="36" stroke="#f59e0b" strokeWidth="1.8" strokeDasharray="3 2" />
      <circle cx="52" cy="14" r="4" fill="#f59e0b" fillOpacity="0.9" />
      <text x="55" y="12" fontSize="7" fill="#b45309" fontWeight="700">opt</text>
    </svg>
  );
}

function SineWaveSVG() {
  return (
    <svg viewBox="0 0 90 40" className="w-full h-12" fill="none">
      <path d="M0,20 C10,5 20,35 30,20 C40,5 50,35 60,20 C70,5 80,35 90,20"
        stroke="#0ea5e9" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="50" cy="35" r="3.5" fill="#f59e0b" fillOpacity="0.9" />
      <text x="38" y="42" fontSize="7" fill="#b45309" fontWeight="700">Summer ↑</text>
    </svg>
  );
}

function SpatialDotsSVG() {
  const dots = [
    { x: 62, y: 26, r: 9,   color: '#3b82f6' },
    { x: 58, y: 34, r: 7,   color: '#6366f1' },
    { x: 18, y: 20, r: 4.5, color: '#14b8a6' },
    { x: 35, y: 30, r: 3.5, color: '#10b981' },
    { x: 50, y: 18, r: 2.5, color: '#8b5cf6' },
    { x: 65, y: 12, r: 2,   color: '#f59e0b' },
  ];
  return (
    <svg viewBox="0 0 80 44" className="w-full h-12" fill="none">
      <path d="M10,12 L25,8 L45,10 L58,8 L70,14 L74,24 L70,36 L60,40 L50,38 L42,42 L35,38 L20,36 L10,28 Z"
        fill="rgba(59,130,246,0.08)" stroke="rgba(59,130,246,0.25)" strokeWidth="1" />
      {dots.map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r={d.r} fill={d.color} fillOpacity="0.85" />
      ))}
    </svg>
  );
}

/* ─── Static data ────────────────────────────────────────────────── */

const TECHNIQUE_CARDS = [
  {
    title: 'Probability',
    subtitle: 'Demand modelling',
    formula: 'E[X] = Σ x · P(X=x)',
    desc: 'Models uncertain customer demand as a distribution — quantifies risk and expected profit.',
    color: '#6366f1',
    bg: 'rgba(99,102,241,0.07)',
    border: 'rgba(99,102,241,0.22)',
    Visual: BellCurveSVG,
  },
  {
    title: 'Linear Programming',
    subtitle: 'Resource allocation',
    formula: 'max cᵀx  s.t. Ax ≤ b',
    desc: 'Finds the globally optimal allocation of limited resources subject to constraints.',
    color: '#10b981',
    bg: 'rgba(16,185,129,0.07)',
    border: 'rgba(16,185,129,0.22)',
    Visual: FeasibleRegionSVG,
  },
  {
    title: 'Time Series',
    subtitle: 'Seasonal forecasting',
    formula: 'Yₜ = Tₜ + Sₜ + εₜ',
    desc: 'Decomposes sales into trend, seasonality, and noise — enabling accurate forward planning.',
    color: '#0ea5e9',
    bg: 'rgba(14,165,233,0.07)',
    border: 'rgba(14,165,233,0.22)',
    Visual: SineWaveSVG,
  },
  {
    title: 'Spatial Statistics',
    subtitle: 'Geographic demand',
    formula: 'Ẑ(s) = Σ λᵢ Z(sᵢ)',
    desc: 'Maps demand and cost patterns geographically — identifying where to invest for maximum reach.',
    color: '#3b82f6',
    bg: 'rgba(59,130,246,0.07)',
    border: 'rgba(59,130,246,0.22)',
    Visual: SpatialDotsSVG,
  },
];

const IMPACT_STATS = [
  { stat: '35%',   label: "of Amazon's revenue",     detail: 'driven by statistical recommendation algorithms', icon: '🛒', color: '#f59e0b' },
  { stat: '100M+', label: 'miles saved per year',     detail: 'by UPS through optimised routing models',         icon: '🚚', color: '#10b981' },
  { stat: '$500B', label: 'global analytics market',  detail: 'for optimisation & analytics software by 2030',   icon: '📈', color: '#6366f1' },
];

const ROUND_JOURNEY = [
  {
    round: 'R1', icon: '🎲', title: 'Random Guess',    tech: 'Baseline',
    insight: 'No data = pure luck. Sets your benchmark.',
    color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.28)', profitKey: 'r1',
  },
  {
    round: 'R2', icon: '📊', title: 'Data-Driven',     tech: 'Statistics',
    insight: 'Demand data shifts allocations — and profit.',
    color: '#14b8a6', bg: 'rgba(20,184,166,0.08)', border: 'rgba(20,184,166,0.28)', profitKey: 'r2',
  },
  {
    round: 'R3', icon: '📅', title: 'Seasonal Trends', tech: 'Time Series',
    insight: 'Dec ≈ 2× July — seasonal swings are plannable.',
    color: '#0ea5e9', bg: 'rgba(14,165,233,0.08)', border: 'rgba(14,165,233,0.28)', badge: '+45% swing',
  },
  {
    round: 'R4', icon: '🗺️', title: 'Spatial Demand',  tech: 'Spatial Stats',
    insight: 'NSW + VIC = 58% of national demand.',
    color: '#6366f1', bg: 'rgba(99,102,241,0.08)', border: 'rgba(99,102,241,0.28)', badge: '58% eastern',
  },
] as const;

/* ─── Component ──────────────────────────────────────────────────── */

export default function FinalResults({ round1Profit, round2Profit, score, onRestart, onContinue }: FinalResultsProps) {
  const profitByKey: Record<string, number> = { r1: round1Profit, r2: round2Profit };
  const maxProfit = Math.max(1, round1Profit, round2Profit);
  const profitDiff = round2Profit - round1Profit;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">

      {/* Header */}
      <motion.div className="text-center" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="text-6xl mb-2">🎉</div>
        <h2 className="text-3xl font-black text-[#001E62] mb-1">Journey Complete!</h2>
        <p className="text-[#001E62]/65 text-sm">You explored 4 layers of data science — from random guessing to spatial optimisation.</p>
        {score > 0 && (
          <div className="inline-flex items-center gap-2 mt-3 px-5 py-2 rounded-full font-black text-xl"
            style={{ background: 'rgba(232,160,0,0.12)', border: '1px solid rgba(232,160,0,0.35)', color: '#b45309' }}>
            🏆 Total score: ${score.toLocaleString()}
          </div>
        )}
      </motion.div>

      {/* Round Journey 2×2 */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <h3 className="text-[#001E62] font-black text-sm mb-3 text-center uppercase tracking-wide">The 4-Round Journey</h3>
        <div className="grid grid-cols-2 gap-3">
          {ROUND_JOURNEY.map((r) => (
            <div key={r.round} className="rounded-xl p-3" style={{ background: r.bg, border: `1px solid ${r.border}` }}>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xl">{r.icon}</span>
                <span className="text-xs font-black px-1.5 py-0.5 rounded-full text-white" style={{ background: r.color }}>{r.round}</span>
                <span className="text-xs font-semibold text-[#001E62]/50">{r.tech}</span>
              </div>
              <p className="text-sm font-black text-[#001E62] mb-1">{r.title}</p>
              <p className="text-xs text-[#001E62]/65 leading-snug">{r.insight}</p>
              {'profitKey' in r && profitByKey[r.profitKey] > 0 && (
                <p className="text-sm font-black mt-1.5" style={{ color: r.color }}>
                  ${profitByKey[r.profitKey]}
                </p>
              )}
              {'badge' in r && (
                <span className="inline-block mt-1.5 text-xs font-bold px-2 py-0.5 rounded-full"
                  style={{ background: `${r.color}22`, color: r.color }}>{r.badge}</span>
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Performance bar chart */}
      <motion.div className="glass-card p-5" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.10 }}>
        <h3 className="text-white font-black text-base mb-4 text-center">Game Performance (R1 vs R2)</h3>
        <div className="space-y-3">
          {[
            { label: 'Round 1 – Random Guess',  profit: round1Profit, color: '#f59e0b' },
            { label: 'Round 2 – Data-Driven',   profit: round2Profit, color: '#14b8a6' },
          ].map((s) => (
            <div key={s.label}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-white/80 font-semibold">{s.label}</span>
                <span className="font-black" style={{ color: s.color }}>${s.profit}</span>
              </div>
              <div className="h-6 rounded-xl bg-white/10 overflow-hidden">
                <motion.div className="h-full rounded-xl" style={{ backgroundColor: s.color }}
                  initial={{ width: 0 }} animate={{ width: `${(s.profit / maxProfit) * 100}%` }}
                  transition={{ duration: 0.7, ease: 'easeOut' }} />
              </div>
            </div>
          ))}
        </div>
        {profitDiff !== 0 && (
          <p className="text-center text-sm font-semibold mt-3" style={{ color: profitDiff > 0 ? '#14b8a6' : '#f59e0b' }}>
            {profitDiff > 0
              ? `📈 Data-driven beat guessing by $${profitDiff} — that's statistics at work.`
              : `🎯 Random got lucky by $${Math.abs(profitDiff)} this run — over many runs, data wins.`}
          </p>
        )}
      </motion.div>

      {/* The Maths Behind It */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <h3 className="text-[#001E62] font-black text-sm mb-3 text-center uppercase tracking-wide">The Maths That Powered This</h3>
        <div className="grid grid-cols-2 gap-3">
          {TECHNIQUE_CARDS.map((t) => (
            <div key={t.title} className="rounded-xl p-3" style={{ background: t.bg, border: `1px solid ${t.border}` }}>
              <t.Visual />
              <p className="font-black text-sm mt-1" style={{ color: t.color }}>{t.title}</p>
              <p className="text-xs text-[#001E62]/50 font-semibold mb-1">{t.subtitle}</p>
              <code className="block text-xs font-mono font-bold px-1.5 py-0.5 rounded mb-1.5 break-all"
                style={{ background: `${t.color}18`, color: t.color }}>{t.formula}</code>
              <p className="text-xs text-[#001E62]/65 leading-snug">{t.desc}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Real-World Impact */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.20 }}>
        <h3 className="text-[#001E62] font-black text-sm mb-3 text-center uppercase tracking-wide">Real-World Scale</h3>
        <div className="grid grid-cols-3 gap-3">
          {IMPACT_STATS.map((s) => (
            <div key={s.stat} className="glass-card p-3 text-center">
              <div className="text-2xl mb-1">{s.icon}</div>
              <div className="text-xl font-black" style={{ color: s.color }}>{s.stat}</div>
              <div className="text-xs font-black text-white/80 leading-tight">{s.label}</div>
              <div className="text-xs text-white/50 mt-1 leading-tight">{s.detail}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Industries */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }}>
        <h3 className="text-[#001E62] font-black text-sm mb-3 text-center uppercase tracking-wide">Who Uses This Every Day</h3>
        <div className="grid grid-cols-3 gap-2">
          {[
            { icon: '🏥', name: 'Healthcare',    detail: 'Trial design & allocation' },
            { icon: '✈️', name: 'Aviation',      detail: 'Route & crew scheduling'  },
            { icon: '⚡', name: 'Energy',        detail: 'Grid demand forecasting'   },
            { icon: '🏦', name: 'Finance',       detail: 'Portfolio & risk models'   },
            { icon: '🌾', name: 'Agriculture',   detail: 'Yield & irrigation opt.'   },
            { icon: '🚚', name: 'Logistics',     detail: 'Last-mile delivery routing' },
          ].map((ind) => (
            <div key={ind.name} className="rounded-xl p-2.5 text-center"
              style={{ background: 'rgba(0,30,98,0.05)', border: '1px solid rgba(0,30,98,0.10)' }}>
              <div className="text-2xl mb-0.5">{ind.icon}</div>
              <div className="text-xs font-black text-[#001E62]">{ind.name}</div>
              <div className="text-xs text-[#001E62]/55 leading-tight mt-0.5">{ind.detail}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Study at Curtin */}
      <motion.div className="rounded-xl p-4 text-center"
        style={{ background: 'linear-gradient(135deg, rgba(0,30,98,0.06) 0%, rgba(232,160,0,0.08) 100%)', border: '1px solid rgba(232,160,0,0.28)' }}
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.26 }}>
        <div className="text-3xl mb-2">🎓</div>
        <p className="font-black text-[#001E62] text-base mb-1">Study This at Curtin University</p>
        <p className="text-[#001E62]/65 text-sm mb-3">These techniques are core to Curtin's mathematics, statistics and data science programs.</p>
        <div className="flex flex-wrap justify-center gap-2">
          {['B.Sc. Statistics', 'B.Sc. Mathematics', 'Data Science', 'Operations Research', 'Actuarial Science'].map((prog) => (
            <span key={prog} className="text-xs font-bold px-3 py-1 rounded-full"
              style={{ background: 'rgba(0,30,98,0.08)', border: '1px solid rgba(0,30,98,0.15)', color: '#001E62' }}>
              {prog}
            </span>
          ))}
        </div>
      </motion.div>

      {/* CTAs */}
      <motion.div className="flex flex-col gap-3 pb-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.30 }}>
        <button className="btn-primary w-full justify-center text-lg" onClick={onContinue}>
          See Real-World Examples 🌏
        </button>
        <button className="btn-secondary w-full text-center" onClick={onRestart}>
          Play Again
        </button>
      </motion.div>

    </div>
  );
}
