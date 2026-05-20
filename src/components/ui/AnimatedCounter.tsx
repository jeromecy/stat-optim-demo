'use client';

import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';

interface AnimatedCounterProps {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
}

export default function AnimatedCounter({
  value,
  prefix = '',
  suffix = '',
  duration = 0.6,
  className = '',
}: AnimatedCounterProps) {
  const motionVal = useMotionValue(0);
  const rounded = useTransform(motionVal, (v) => Math.round(v));
  const displayRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const controls = animate(motionVal, value, { duration, ease: 'easeOut' });
    return controls.stop;
  }, [value, duration, motionVal]);

  useEffect(() => {
    const unsubscribe = rounded.on('change', (v) => {
      if (displayRef.current) {
        // Only update the number part; prefix/suffix are rendered in JSX
        displayRef.current.textContent = String(Math.round(v));
      }
    });
    return unsubscribe;
  }, [rounded]);

  return (
    <motion.span className={className}>
      {prefix}<span ref={displayRef}>{Math.round(value)}</span>{suffix}
    </motion.span>
  );
}
