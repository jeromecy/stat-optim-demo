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
import type { Screen, FlavorId, Round1Data, Round2Data, Round3Data, Round4Data } from '@/lib/types';

// ─── Game State ───────────────────────────────────────────────────────────────

interface GameState {
  screen: Screen;
  score: number;
  profit: number;
  round1Profit: number;
  round2Profit: number;
  round4Profit: number;
  customerData: Record<FlavorId, number>;
}

const INITIAL_STATE: GameState = {
  screen: 'intro',
  score: 0,
  profit: 0,
  round1Profit: 0,
  round2Profit: 0,
  round4Profit: 0,
  customerData: { chocolate: 0, vanilla: 0, strawberry: 0, matcha: 0, rainbow: 0 },
};

// ─── Page Transition ──────────────────────────────────────────────────────────

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

// ─── Component ────────────────────────────────────────────────────────────────

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
      customerData: data.customerData,
    }));
  }, []);

  const handleRound3Complete = useCallback((data: Round3Data) => {
    setState((s) => ({
      ...s,
      screen: 'round4',
      score: s.score + data.scoreEarned,
    }));
  }, []);

  const handleRound4Complete = useCallback((data: Round4Data) => {
    const earned = data.totalProfit;
    // Bonus for low exploration (smart exploitation)
    const exploitBonus = data.explorationRate <= 30 ? 150 : data.explorationRate <= 60 ? 75 : 0;
    setState((s) => ({
      ...s,
      screen: 'final',
      round4Profit: earned,
      profit: s.profit + earned,
      score: s.score + earned + exploitBonus,
    }));
  }, []);

  const handleGoToRealWorld = useCallback(() => {
    setState((s) => ({ ...s, screen: 'realworld' }));
  }, []);

  const handleRestart = useCallback(() => {
    setState(INITIAL_STATE);
  }, []);

  const showHUD = screen !== 'intro';

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)' }}>
      {/* Fixed header HUD */}
      {showHUD && (
        <motion.div
          className="sticky top-0 z-50"
          style={{
            background: 'rgba(15,12,41,0.85)',
            backdropFilter: 'blur(12px)',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
          }}
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <ProgressBar percent={progress} screen={screen} />
          <ScoreDisplay score={score} profit={profit} />
        </motion.div>
      )}

      {/* Main content with screen transitions */}
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
            <Round2 onComplete={handleRound2Complete} />
          </motion.div>
        )}

        {screen === 'round3' && (
          <motion.div key="round3" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={pageTransition}>
            <Round3
              customerData={state.customerData}
              onComplete={handleRound3Complete}
            />
          </motion.div>
        )}

        {screen === 'round4' && (
          <motion.div key="round4" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={pageTransition}>
            <Round4
              customerData={state.customerData}
              onComplete={handleRound4Complete}
            />
          </motion.div>
        )}

        {screen === 'final' && (
          <motion.div key="final" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={pageTransition}>
            <FinalResults
              round1Profit={state.round1Profit}
              round2Profit={state.round2Profit}
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

      {/* Decorative background orbs */}
      <div
        className="fixed pointer-events-none"
        style={{
          top: '15%',
          right: '-5%',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)',
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
          background: 'radial-gradient(circle, rgba(255,0,110,0.1) 0%, transparent 70%)',
          filter: 'blur(40px)',
          zIndex: 0,
        }}
      />
    </div>
  );
}
