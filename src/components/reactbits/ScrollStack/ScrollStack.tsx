"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface ScrollStackProps {
  children: React.ReactNode;
  className?: string;
}

export const ScrollStack = ({ children, className }: ScrollStackProps) => {
  return (
    <div className={`space-y-4 p-4 ${className}`}>
      {children}
    </div>
  );
};

export const ScrollStackItem = ({ children, className, onClick }: { children: React.ReactNode, className?: string, onClick?: () => void }) => {
  return (
    <motion.div
      whileHover={{ x: 5 }}
      onClick={onClick}
      className={`relative rounded-2xl p-4 cursor-pointer transition-all border-2 ${className}`}
    >
      {children}
    </motion.div>
  );
};
