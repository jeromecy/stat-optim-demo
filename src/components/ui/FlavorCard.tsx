'use client';

import { motion } from 'framer-motion';
import type { Flavor } from '@/lib/types';

interface FlavorCardProps {
  flavor: Flavor;
  onClick: () => void;
  selected?: boolean;
  disabled?: boolean;
  showPopularity?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function FlavorCard({
  flavor,
  onClick,
  selected = false,
  disabled = false,
  showPopularity = false,
  size = 'md',
}: FlavorCardProps) {
  const sizeClasses = {
    sm: 'p-3 min-h-[80px]',
    md: 'p-4 min-h-[100px]',
    lg: 'p-5 min-h-[130px]',
  };

  const emojiFontSize = {
    sm: '1.8rem',
    md: '2.4rem',
    lg: '3rem',
  };

  return (
    <motion.button
      className={`flavor-card w-full ${sizeClasses[size]} ${selected ? 'selected' : ''}`}
      style={{
        backgroundColor: selected
          ? `${flavor.bgColor}ee`
          : `${flavor.bgColor}aa`,
        borderColor: flavor.borderColor,
        color: flavor.textColor,
        boxShadow: selected ? `0 0 20px ${flavor.glowColor}` : 'none',
        opacity: disabled ? 0.4 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
      onClick={disabled ? undefined : onClick}
      whileHover={disabled ? {} : { scale: 1.05, y: -4 }}
      whileTap={disabled ? {} : { scale: 0.95 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: disabled ? 0.4 : 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <span style={{ fontSize: emojiFontSize[size] }}>{flavor.emoji}</span>
      <span
        className="font-bold text-center leading-tight"
        style={{
          fontSize: size === 'lg' ? '1rem' : '0.85rem',
          color: flavor.textColor,
        }}
      >
        {flavor.name}
      </span>
      {showPopularity && (
        <div className="w-full mt-1">
          <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: flavor.borderColor }}
              initial={{ width: 0 }}
              animate={{ width: `${flavor.popularity * 100}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
          <span className="text-xs opacity-70 mt-0.5 block text-center">
            {Math.round(flavor.popularity * 100)}% prefer this
          </span>
        </div>
      )}
    </motion.button>
  );
}
