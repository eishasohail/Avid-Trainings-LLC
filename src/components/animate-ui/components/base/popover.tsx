"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const Popover = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="relative inline-block">
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          if ((child.type as any).displayName === 'PopoverTrigger') {
            return React.cloneElement(child as any, { onClick: () => setIsOpen(!isOpen) });
          }
          if ((child.type as any).displayName === 'PopoverPanel') {
            return isOpen ? child : null;
          }
        }
        return child;
      })}
    </div>
  );
};

export const PopoverTrigger = ({ children, onClick, className }: { children: React.ReactNode, onClick?: () => void, className?: string }) => {
  return <button className={className} onClick={onClick}>{children}</button>;
};
PopoverTrigger.displayName = 'PopoverTrigger';

export const PopoverPanel = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 10 }}
      className={`absolute z-50 mt-4 rounded-3xl shadow-2xl ${className}`}
    >
      {children}
    </motion.div>
  );
};
PopoverPanel.displayName = 'PopoverPanel';
