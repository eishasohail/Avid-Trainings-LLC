import React from 'react';
import { motion } from 'framer-motion';

interface MagicBentoProps {
  children: React.ReactNode;
  className?: string;
  [key: string]: any;
}

export const MagicBento = ({ children, className, ...props }: MagicBentoProps) => {
  return (
    <div className={className}>
      {children}
    </div>
  );
};

export const MagicCard = ({ children, className, onClick }: { children: React.ReactNode, className?: string, onClick?: () => void }) => {
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`relative rounded-[2.5rem] bg-white border border-slate-100 shadow-xl shadow-slate-200/50 p-6 cursor-pointer overflow-hidden group transition-colors hover:border-[#00685f]/30 ${className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#00685f]/0 to-[#00685f]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="relative z-10 h-full">{children}</div>
    </motion.div>
  );
};
