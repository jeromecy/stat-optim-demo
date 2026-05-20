'use client';

import { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import IntroScreen from '@/components/game/IntroScreen';
import Round1 from '@/components/game/Round1';
import Round2 from '@/components/game/Round2';
import Round3 from '@/components/game/Round3';
import Round4 from '@/components/game/Round4';
import FinalResults from '@/components/game/FinalResults';
import RealWorldCTA from '@/components/game/RealWorldCTA';
import ProgressBar from '@/components/ui/ProgressBar';
import ScoreDisplay from '@/components/ui/ScoreDisplay';
import { getProgressPercent } from '@/lib/gameLogic';
import type { Screen, Round1Data, Round2Data, Round3Data, Round4Data } from '@/lib/types';

const NAV_ITEMS: { screen: Screen; icon: string; label: string }[] = [
  { screen: 'intro',     icon: '🏠', label: 'Intro'      },
  { screen: 'round1',   icon: '🎲', label: 'R1: Random'  },
  { screen: 'round2',   icon: '📊', label: 'R2: Data'    },
  { screen: 'round3',   icon: '📅', label: 'R3: Seasonal'},
  { screen: 'round4',   icon: '🗺️', label: 'R4: Spatial' },
  { screen: 'final',    icon: '🏆', label: 'Results'     },
  { screen: 'realworld',icon: '🌏', label: 'Real World'  },
];

interface GameState {
  screen: Screen;
  score: number;
  profit: number;
  round1Profit: number;
  round2Profit: number;
  round3Profit: number;
  round4Profit: number;
}

const INITIAL_STATE: GameState = {
  screen: 'intro',
  score: 0,
  profit: 0,
  round1Profit: 0,
  round2Profit: 0,
  round3Profit: 0,
  round4Profit: 0,
};

const pageVariants = {
  initial: { opacity: 0, y: 24, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -24, scale: 0.98 },
};

const pageTransition = {
  type: 'spring' as const,
  stiffness: 220,
  damping: 24,
};

export default function GamePage() {
  const [state, setState] = useState<GameState>(INITIAL_STATE);

  const { screen, score, profit } = state;
  const progress = getProgressPercent(screen);

  const handleStart = useCallback(() => {
    setState((s) => ({ ...s, screen: 'round1' }));
  }, []);

  const handleRound1Complete = useCallback((data: Round1Data) => {
    const earned = data.totalProfit;
    setState((s) => ({
      ...s,
      screen: 'round2',
      round1Profit: earned,
      profit: s.profit + earned,
      score: s.score + earned,
    }));
  }, []);

  const handleRound2Complete = useCallback((data: Round2Data) => {
    const earned = data.totalProfit;
    setState((s) => ({
      ...s,
      screen: 'round3',
      round2Profit: earned,
      profit: s.profit + earned,
      score: s.score + earned,
    }));
  }, []);

  const handleRound3Complete = useCallback((data: Round3Data) => {
    setState((s) => ({
      ...s,
      screen: 'round4',
      round3Profit: data.totalProfit,
      profit: s.profit + data.totalProfit,
      score: s.score + data.totalProfit,
    }));
  }, []);

  const handleRound4Complete = useCallback((data: Round4Data) => {
    const earned = data.totalProfit;
    setState((s) => ({
      ...s,
      screen: 'final',
      round4Profit: earned,
      profit: s.profit + earned,
      score: s.score + earned,
    }));
  }, []);

  const handleGoToRealWorld = useCallback(() => {
    setState((s) => ({ ...s, screen: 'realworld' }));
  }, []);

  const handleRestart = useCallback(() => {
    setState(INITIAL_STATE);
  }, []);

  const navigateTo = useCallback((target: Screen) => {
    setState((s) => ({ ...s, screen: target }));
  }, []);

  const showHUD = screen !== 'intro';

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #eff6ff 46%, #e0f2fe 100%)' }}>
      {showHUD && (
        <motion.div
          className="sticky top-0 z-50"
          style={{
            background: 'rgba(0,15,58,0.90)',
            backdropFilter: 'blur(12px)',
            borderBottom: '1px solid rgba(232,160,0,0.30)',
          }}
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <ProgressBar percent={progress} screen={screen} />
          {/* Navigation chips */}
          <div className="flex justify-center gap-1 px-3 py-1.5 overflow-x-auto scrollbar-none">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.screen}
                onClick={() => navigateTo(item.screen)}
                className="shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold transition-all duration-150"
                style={
                  screen === item.screen
                    ? { background: 'rgba(232,160,0,0.92)', color: '#001E62' }
                    : { background: 'rgba(255,255,255,0.10)', color: 'rgba(255,255,255,0.65)' }
                }
              >
                <span>{item.icon}</span>
                <span className="hidden sm:inline">{item.label}</span>
              </button>
            ))}
          </div>
          <ScoreDisplay round1Profit={state.round1Profit} round2Profit={state.round2Profit} />
        </motion.div>
      )}

      <AnimatePresence mode="wait">
        {screen === 'intro' && (
          <motion.div key="intro" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={pageTransition}>
            <IntroScreen onStart={handleStart} />
          </motion.div>
        )}

        {screen === 'round1' && (
          <motion.div key="round1" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={pageTransition}>
            <Round1 onComplete={handleRound1Complete} />
          </motion.div>
        )}

        {screen === 'round2' && (
          <motion.div key="round2" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={pageTransition}>
            <Round2 round1Profit={state.round1Profit} onComplete={handleRound2Complete} />
          </motion.div>
        )}

        {screen === 'round3' && (
          <motion.div key="round3" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={pageTransition}>
            <Round3 onComplete={handleRound3Complete} />
          </motion.div>
        )}

        {screen === 'round4' && (
          <motion.div key="round4" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={pageTransition}>
            <Round4 onComplete={handleRound4Complete} />
          </motion.div>
        )}

        {screen === 'final' && (
          <motion.div key="final" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={pageTransition}>
            <FinalResults
              round1Profit={state.round1Profit}
              round2Profit={state.round2Profit}
              round3Profit={state.round3Profit}
              round4Profit={state.round4Profit}
              score={score}
              onRestart={handleRestart}
              onContinue={handleGoToRealWorld}
            />
          </motion.div>
        )}

        {screen === 'realworld' && (
          <motion.div key="realworld" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={pageTransition}>
            <RealWorldCTA onRestart={handleRestart} />
          </motion.div>
        )}
      </AnimatePresence>

      <div
        className="fixed pointer-events-none"
        style={{
          top: '15%',
          right: '-5%',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(232,160,0,0.14) 0%, transparent 70%)',
          filter: 'blur(40px)',
          zIndex: 0,
        }}
      />
      <div
        className="fixed pointer-events-none"
        style={{
          bottom: '10%',
          left: '-5%',
          width: '250px',
          height: '250px',
          background: 'radial-gradient(circle, rgba(0,30,98,0.10) 0%, transparent 70%)',
          filter: 'blur(40px)',
          zIndex: 0,
        }}
      />
    </div>
  );
}
