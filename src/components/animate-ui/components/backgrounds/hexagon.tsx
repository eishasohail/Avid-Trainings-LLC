"use client";

import React from 'react';
import { motion } from 'framer-motion';

export const HexagonBackground = ({ className }: { className?: string }) => {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none opacity-[0.25] ${className}`}>
      <svg width="100%" height="100%">
        <pattern
          id="hexagons"
          width="50"
          height="43.4"
          patternUnits="userSpaceOnUse"
          patternTransform="scale(2)"
        >
          <path
            d="M25 0L50 14.4V43.4L25 57.8L0 43.4V14.4L25 0Z"
            fill="none"
            stroke="#00685f"
            strokeWidth="0.5"
          />
        </pattern>
        <rect width="100%" height="100%" fill="url(#hexagons)" />
      </svg>
      <motion.div 
        animate={{ 
          opacity: [0.1, 0.3, 0.1],
          scale: [1, 1.1, 1]
        }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute inset-0 bg-gradient-to-br from-[#00685f]/5 to-transparent" 
      />
    </div>
  );
};
