'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface RealWorldCTAProps {
  onRestart: () => void;
  onNext?: () => void;
}

const EXAMPLES = [
  {
    icon: '🎬',
    company: 'Netflix',
    title: 'Recommendation Engine',
    description:
      "Netflix uses statistics to learn your preferences from millions of watch patterns, then optimisation to pick exactly which shows to put in front of you.",
    color: '#e50914',
    glowColor: 'rgba(229,9,20,0.35)',
    tag: 'Collaborative Filtering',
  },
  {
    icon: '🚗',
    company: 'Uber & Doordash',
    title: 'Surge Pricing',
    description:
      "Real-time demand statistics power dynamic pricing algorithms that balance supply and demand — optimising revenue while keeping riders moving.",
    color: '#00b4d8',
    glowColor: 'rgba(0,180,216,0.35)',
    tag: 'Dynamic Optimisation',
  },
  {
    icon: '🌾',
    company: 'Precision Agriculture',
    title: 'Crop Yield Optimisation',
    description:
      "Farmers use sensor data and statistical models to optimise irrigation, fertiliser, and planting decisions — maximising yield while reducing waste.",
    color: '#52b788',
    glowColor: 'rgba(82,183,136,0.35)',
    tag: 'Operations Research',
  },
  {
    icon: '🏥',
    company: 'Healthcare',
    title: 'Clinical Trials & Treatment',
    description:
      "Statistics determine which treatments work. Optimisation allocates limited medical resources to save the most lives with what we have.",
    color: '#9d4edd',
    glowColor: 'rgba(157,78,221,0.35)',
    tag: 'Biostatistics',
  },
  {
    icon: '⚡',
    company: 'Power Grid',
    title: 'Energy Distribution',
    description:
      "Statistical forecasting predicts electricity demand; optimisation algorithms then route power across the grid to avoid blackouts and cut costs.",
    color: '#ffd60a',
    glowColor: 'rgba(255,214,10,0.35)',
    tag: 'Systems Optimisation',
  },
  {
    icon: '💰',
    company: 'Finance',
    title: 'Portfolio Optimisation',
    description:
      "Banks and funds use statistical risk models and optimisation to build portfolios that maximise returns for a given level of risk.",
    color: '#06d6a0',
    glowColor: 'rgba(6,214,160,0.35)',
    tag: 'Quantitative Finance',
  },
];

export default function RealWorldCTA({ onRestart, onNext }: RealWorldCTAProps) {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <div className="max-w-2xl lg:max-w-5xl mx-auto px-4 py-6">
      {/* Header */}
      <motion.div
        className="text-center mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-3 text-sm font-bold"
          style={{
            background: 'rgba(0,212,255,0.2)',
            border: '1px solid rgba(0,212,255,0.5)',
            color: '#0369a1',
          }}
        >
          🌍 Real-World Impact
        </div>
        <h2 className="text-2xl md:text-3xl font-black text-[#001E62] mb-2">
          <span className="gradient-text-blue">This is everywhere.</span>
        </h2>
        <p className="text-[#001E62]/80 text-base leading-relaxed">
          The same logic you just used — data → statistics → optimisation — runs the modern world.
        </p>
      </motion.div>

      {/* Example cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
        {EXAMPLES.map((ex, i) => (
          <motion.div
            key={i}
            className="rounded-2xl overflow-hidden cursor-pointer"
            style={{
              background: `${ex.color}12`,
              border: `1px solid ${ex.color}40`,
              boxShadow: expanded === i ? `0 0 20px ${ex.glowColor}` : 'none',
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            onClick={() => setExpanded(expanded === i ? null : i)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{ex.icon}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-black text-base" style={{ color: '#001E62' }}>{ex.company}</p>
                    <span
                      className="text-sm px-2 py-0.5 rounded-full font-bold"
                      style={{ background: `${ex.color}25`, color: ex.color }}
                    >
                      {ex.tag}
                    </span>
                  </div>
                  <p className="text-sm" style={{ color: 'rgba(0,30,98,0.75)' }}>{ex.title}</p>
                </div>
              </div>
              <motion.span
                className="text-lg"
                style={{ color: 'rgba(0,30,98,0.35)' }}
                animate={{ rotate: expanded === i ? 90 : 0 }}
                transition={{ duration: 0.2 }}
              >
                ›
              </motion.span>
            </div>

            <motion.div
              initial={false}
              animate={{ height: expanded === i ? 'auto' : 0, opacity: expanded === i ? 1 : 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              style={{ overflow: 'hidden' }}
            >
              <div
                className="px-4 pb-4 pt-0 text-base leading-relaxed border-t"
                style={{ borderColor: `${ex.color}25`, color: 'rgba(0,30,98,0.80)' }}
              >
                {ex.description}
              </div>
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* Actions */}
      <motion.div
        className="text-center space-y-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        {onNext && (
          <button className="btn-primary w-full justify-center" onClick={onNext}>
            🚀 Future Careers &amp; AI →
          </button>
        )}
        <button className="btn-secondary" onClick={onRestart}>
          🔄 Play Again
        </button>
        <p className="text-[#001E62]/55 text-sm mt-1">
          Share this game with friends! stat-optim-demo.netlify.app
        </p>
      </motion.div>
    </div>
  );
}
