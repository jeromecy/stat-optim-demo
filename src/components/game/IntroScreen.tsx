'use client';

import { motion } from 'framer-motion';

interface IntroScreenProps {
  onStart: () => void;
}

const FLOATING_EMOJIS = [
  { emoji: '🍫', x: '8%', y: '15%', delay: '0s', dur: '3.2s' },
  { emoji: '🍦', x: '85%', y: '10%', delay: '0.5s', dur: '2.8s' },
  { emoji: '🍓', x: '75%', y: '60%', delay: '1.1s', dur: '3.5s' },
  { emoji: '🍵', x: '5%', y: '70%', delay: '0.8s', dur: '2.5s' },
  { emoji: '🌈', x: '90%', y: '35%', delay: '1.5s', dur: '3.8s' },
  { emoji: '💰', x: '15%', y: '40%', delay: '0.3s', dur: '4s' },
  { emoji: '📊', x: '60%', y: '80%', delay: '1.8s', dur: '3.2s' },
  { emoji: '🎯', x: '40%', y: '5%', delay: '0.6s', dur: '2.9s' },
];

export default function IntroScreen({ onStart }: IntroScreenProps) {
  return (
    <div className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Floating background emojis */}
      {FLOATING_EMOJIS.map((item, i) => (
        <div
          key={i}
          className="absolute pointer-events-none select-none emoji-float text-3xl md:text-4xl"
          style={{
            left: item.x,
            top: item.y,
            '--delay': item.delay,
            '--duration': item.dur,
            opacity: 0.25,
          } as React.CSSProperties}
        >
          {item.emoji}
        </div>
      ))}

      {/* Glowing orbs in background */}
      <div
        className="absolute w-64 h-64 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(124,58,237,0.3) 0%, transparent 70%)',
          top: '10%',
          left: '10%',
          filter: 'blur(40px)',
        }}
      />
      <div
        className="absolute w-80 h-80 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(255,0,110,0.25) 0%, transparent 70%)',
          bottom: '5%',
          right: '5%',
          filter: 'blur(50px)',
        }}
      />

      {/* Main card */}
      <motion.div
        className="glass-card max-w-lg w-full mx-4 p-8 text-center relative z-10"
        initial={{ opacity: 0, scale: 0.85, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      >
        {/* Badge */}
        <motion.div
          className="inline-block mb-4 px-3 py-1 rounded-full text-xs font-bold"
          style={{
            background: 'rgba(124,58,237,0.3)',
            border: '1px solid rgba(124,58,237,0.6)',
            color: '#c4b5fd',
          }}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          🎓 Curtin University — Open Day Interactive
        </motion.div>

        {/* Main emoji */}
        <motion.div
          className="text-6xl md:text-7xl mb-4"
          animate={{ rotate: [0, -10, 10, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
        >
          🍦
        </motion.div>

        {/* Title */}
        <motion.h1
          className="text-3xl md:text-4xl font-black mb-3 leading-tight"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Can You Run a{' '}
          <span className="gradient-text">Successful<br />Ice Cream Shop?</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="text-white/70 text-base mb-6 leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Make decisions. Collect data. Discover how{' '}
          <span className="text-yellow-300 font-bold">statistics</span> and{' '}
          <span className="text-cyan-300 font-bold">optimisation</span> help you earn more!
        </motion.p>

        {/* Feature pills */}
        <motion.div
          className="flex flex-wrap justify-center gap-2 mb-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          {[
            { icon: '🎮', text: '~5 min game' },
            { icon: '📊', text: 'Real data science' },
            { icon: '🏆', text: 'Beat the AI' },
          ].map((pill) => (
            <div
              key={pill.text}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold"
              style={{
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
              }}
            >
              <span>{pill.icon}</span>
              <span className="text-white/80">{pill.text}</span>
            </div>
          ))}
        </motion.div>

        {/* CTA Button */}
        <motion.button
          className="btn-primary text-lg w-full justify-center"
          onClick={onStart}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          whileHover={{ scale: 1.04, y: -2 }}
          whileTap={{ scale: 0.96 }}
        >
          🎮 Start the Game!
        </motion.button>

        {/* Sub note */}
        <motion.p
          className="mt-4 text-xs text-white/40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          No sign-up required • Works on any device
        </motion.p>
      </motion.div>
    </div>
  );
}
