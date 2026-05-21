'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface FutureCareersProps {
  onRestart: () => void;
}

/* ─── Data ─────────────────────────────────────────────────────────── */

const AI_BULLETS = [
  'Analyse huge datasets instantly',
  'Run models and predictions',
  'Automate repetitive tasks',
  'Generate reports',
];

const HUMAN_BULLETS = [
  'Decide what problem matters',
  'Interpret results',
  'Make trade-offs',
  'Take responsibility',
];

const CAREER_CARDS = [
  {
    emoji: '🤖',
    title: 'Data Scientist',
    desc: 'Predict what will happen next',
    salary: '$100k–$150k+',
    color: '#6366f1',
    glow: 'rgba(99,102,241,0.3)',
  },
  {
    emoji: '📊',
    title: 'Data Analyst',
    desc: 'Answer questions using data',
    salary: '$90k–$120k',
    color: '#0ea5e9',
    glow: 'rgba(14,165,233,0.3)',
  },
  {
    emoji: '📐',
    title: 'Statistician',
    desc: 'Model uncertainty and risk',
    salary: '$100k–$160k',
    color: '#14b8a6',
    glow: 'rgba(20,184,166,0.3)',
  },
  {
    emoji: '⚙️',
    title: 'Optimisation Specialist',
    desc: 'Decide the best strategy',
    salary: 'High demand',
    color: '#f59e0b',
    glow: 'rgba(245,158,11,0.3)',
  },
  {
    emoji: '💼',
    title: 'Business Analyst',
    desc: 'Turn data into decisions',
    salary: '$90k+',
    color: '#10b981',
    glow: 'rgba(16,185,129,0.3)',
  },
  {
    emoji: '💰',
    title: 'Quant / Finance',
    desc: 'Optimise investment decisions',
    salary: '$120k–$200k+',
    color: '#f43f5e',
    glow: 'rgba(244,63,94,0.3)',
  },
];

/* ─── Helpers ───────────────────────────────────────────────────────── */

function FadeUp({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, ease: 'easeOut', delay }}
    >
      {children}
    </motion.div>
  );
}

/* ─── Component ─────────────────────────────────────────────────────── */

export default function FutureCareers({ onRestart }: FutureCareersProps) {
  return (
    <div className="max-w-2xl lg:max-w-5xl mx-auto px-4 py-8 pb-16">   

      {/* ── SECTION 2: Career cards ──────────────────────────────────── */}
      <FadeUp delay={0.05}>
        <div className="mb-10">
          <h2 className="text-lg font-black text-[#001E62] text-center mb-1">
            🚀 Future Careers
          </h2>
          <p className="text-center text-[#001E62]/50 text-xs mb-4">
            Roles that need people who think like you just did
          </p>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            {CAREER_CARDS.map((card, i) => (
              <motion.div
                key={card.title}
                className="rounded-2xl p-4"
                style={{
                  background: `${card.color}10`,
                  border: `1px solid ${card.color}35`,
                }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ delay: i * 0.07, duration: 0.45 }}
                whileHover={{
                  scale: 1.03,
                  boxShadow: `0 8px 28px ${card.glow}`,
                }}
                whileTap={{ scale: 0.97 }}
              >
                <div className="text-2xl mb-1.5">{card.emoji}</div>
                <p
                  className="font-black text-sm mb-0.5"
                  style={{ color: '#001E62' }}
                >
                  {card.title}
                </p>
                <p className="text-xs text-[#001E62]/55 mb-2 leading-snug">{card.desc}</p>
                <p
                  className="text-xs font-black"
                  style={{ color: card.color }}
                >
                  💰 {card.salary}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </FadeUp>

      {/* ── SECTION 3: AI vs Human ───────────────────────────────────── */}
      <FadeUp delay={0.05}>
        <div className="mb-10">
          <h2 className="text-lg font-black text-[#001E62] text-center mb-4">
            ⚔️ AI vs Human
          </h2>

          <div className="grid grid-cols-2 gap-3 mb-4">
            {/* AI side */}
            <motion.div
              className="rounded-2xl p-4"
              style={{
                background: 'rgba(99,102,241,0.08)',
                border: '1px solid rgba(99,102,241,0.25)',
              }}
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-3xl mb-2">🤖</div>
              <p className="font-black text-sm text-[#001E62] mb-3">What AI does well</p>
              <ul className="space-y-1.5">
                {AI_BULLETS.map((b) => (
                  <li key={b} className="text-xs text-[#001E62]/65 flex items-start gap-1.5">
                    <span className="mt-0.5 text-[#6366f1]">▸</span>
                    {b}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Human side */}
            <motion.div
              className="rounded-2xl p-4"
              style={{
                background: 'rgba(20,184,166,0.08)',
                border: '1px solid rgba(20,184,166,0.25)',
              }}
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-3xl mb-2">🧠</div>
              <p className="font-black text-sm text-[#001E62] mb-3">What YOU do</p>
              <ul className="space-y-1.5">
                {HUMAN_BULLETS.map((b) => (
                  <li key={b} className="text-xs text-[#001E62]/65 flex items-start gap-1.5">
                    <span className="mt-0.5 text-[#14b8a6]">▸</span>
                    {b}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Dividing insight */}
          <motion.div
            className="rounded-xl px-5 py-3 text-center text-sm font-bold"
            style={{
              background: 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(20,184,166,0.12))',
              border: '1px solid rgba(99,102,241,0.25)',
              color: '#001E62',
            }}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            &ldquo;AI finds patterns.{' '}
            <span
              style={{
                background: 'linear-gradient(135deg,#6366f1,#14b8a6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Humans decide what they mean.
            </span>
            &rdquo;
          </motion.div>
        </div>
      </FadeUp>

      {/* ── SECTION 4: Link back to game ─────────────────────────────── */}
      <FadeUp delay={0.05}>
        <div className="mb-10">
          <motion.div
            className="rounded-2xl p-5"
            style={{
              background: 'rgba(245,158,11,0.08)',
              border: '1px solid rgba(245,158,11,0.35)',
              boxShadow: '0 0 30px rgba(245,158,11,0.12)',
            }}
            whileHover={{ boxShadow: '0 0 40px rgba(245,158,11,0.22)' }}
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🍦</span>
              <h3 className="font-black text-[#001E62] text-base">You already did this.</h3>
              <span
                className="ml-auto text-xs px-2.5 py-1 rounded-full font-bold shrink-0"
                style={{ background: 'rgba(245,158,11,0.2)', color: '#b45309' }}
              >
                Optimisation in action
              </span>
            </div>
            <p className="text-[#001E62]/65 text-sm mb-3 leading-relaxed">In the game, you:</p>
            <ul className="space-y-1.5 mb-0">
              {[
                'Chose how to allocate resources',
                'Made decisions under uncertainty',
                'Balanced risk vs reward',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-[#001E62]/75">
                  <span className="text-amber-500 font-bold mt-0.5">•</span>
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-[#001E62]/55 text-xs mt-3 italic">
              That&apos;s exactly what professionals do.
            </p>
          </motion.div>
        </div>
      </FadeUp>

      {/* ── SECTION 5: Future demand ─────────────────────────────────── */}
      <FadeUp delay={0.05}>
        <div className="mb-10">
          <div
            className="rounded-2xl p-5"
            style={{
              background: 'rgba(14,165,233,0.07)',
              border: '1px solid rgba(14,165,233,0.25)',
            }}
          >
            <h2 className="text-base font-black text-[#001E62] mb-4">
              📈 These skills are in demand
            </h2>

            <div className="space-y-3 mb-4">
              {[
                {
                  icon: '🤖',
                  text: 'Increasing use of AI → MORE need for data experts',
                  color: '#6366f1',
                },
                {
                  icon: '🔄',
                  text: 'Jobs shifting, not disappearing',
                  color: '#0ea5e9',
                },
                {
                  icon: '✨',
                  text: 'New roles emerging every year',
                  color: '#14b8a6',
                },
              ].map((item) => (
                <div key={item.text} className="flex items-start gap-3">
                  <span className="text-lg shrink-0 mt-0.5">{item.icon}</span>
                  <p className="text-sm text-[#001E62]/70 leading-snug">{item.text}</p>
                </div>
              ))}
            </div>

            <motion.div
              className="rounded-xl px-4 py-3 text-center text-sm font-bold leading-relaxed"
              style={{
                background: 'rgba(14,165,233,0.12)',
                border: '1px solid rgba(14,165,233,0.3)',
                color: '#001E62',
              }}
              whileInView={{ opacity: [0, 1] }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              &ldquo;People who understand data will{' '}
              <span className="gradient-text-blue">design AI.</span>
              <br />
              People who don&apos;t will just use it.&rdquo;
            </motion.div>
          </div>
        </div>
      </FadeUp>

      {/* ── SECTION 6: Final impact ──────────────────────────────────── */}
      <FadeUp delay={0.05}>
        <div className="mb-10 text-center">
          <motion.div
            className="rounded-2xl px-6 py-8"
            style={{
              background: 'linear-gradient(135deg, rgba(0,30,98,0.07), rgba(99,102,241,0.09))',
              border: '1px solid rgba(99,102,241,0.2)',
            }}
            whileInView={{ scale: [0.97, 1] }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-2xl md:text-3xl font-black text-[#001E62] leading-snug mb-2">
              You didn&apos;t just play a game.
            </p>
            <p className="text-2xl md:text-3xl font-black leading-snug">
              <span className="gradient-text-blue">You thought like a data scientist.</span>
            </p>
          </motion.div>
        </div>
      </FadeUp>

      {/* ── SECTION 7: CTA ───────────────────────────────────────────── */}
      <FadeUp delay={0.05}>
        <div className="text-center space-y-3">
          <button className="btn-primary w-full justify-center" onClick={onRestart}>
            🔄 Try again and improve your strategy
          </button>

          <a
            href="https://www.curtin.edu.au/study/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary block"
          >
            🎓 Explore Curtin University
          </a>

          <a
            href="https://www.curtin.edu.au/about/learning-teaching/science-engineering/school-of-electrical-engineering-computing-and-mathematical-sciences/our-people/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary block"
          >
            👥 Meet Our People (EECMS)
          </a>

          <p className="text-[#001E62]/35 text-xs pt-1">
            Learn this at Curtin University
          </p>
        </div>
      </FadeUp>
    </div>
  );
}
