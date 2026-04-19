"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export const Accordion = ({ children, className }: { children: React.ReactNode, className?: string, type?: string, collapsible?: boolean }) => {
  return <div className={className}>{children}</div>;
};

export const AccordionItem = ({ children, value, className }: { children: React.ReactNode, value: string, className?: string }) => {
  return <div className={className}>{children}</div>;
};

export const AccordionTrigger = ({ children, className, onClick }: { children: React.ReactNode, className?: string, onClick?: (e: any) => void }) => {
  return (
    <button className={`w-full flex items-center justify-between transition-all ${className}`} onClick={onClick}>
      {children}
      <ChevronDown className="w-5 h-5 text-slate-400 group-data-[state=open]:rotate-180 transition-transform" />
    </button>
  );
};

export const AccordionPanel = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      className={`overflow-hidden ${className}`}
    >
      {children}
    </motion.div>
  );
};
