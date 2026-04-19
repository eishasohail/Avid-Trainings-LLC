"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface RadialMenuItem {
  id: number | string;
  label: string;
  icon: LucideIcon;
}

interface RadialMenuProps {
  menuItems: RadialMenuItem[];
  onSelect: (item: RadialMenuItem) => void;
  children: React.ReactNode;
}

export const RadialMenu = ({ menuItems, onSelect, children }: RadialMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setPosition({ x: e.clientX, y: e.clientY });
    setIsOpen(true);
  };

  const handleClose = () => setIsOpen(false);

  return (
    <div onContextMenu={handleContextMenu} className="relative w-full h-full">
      {children}
      
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[9999]">
            <div className="absolute inset-0 bg-black/5" onClick={handleClose} />
            <div 
              className="absolute" 
              style={{ left: position.x, top: position.y }}
            >
              {menuItems.map((item, index) => {
                const angle = (index / menuItems.length) * 2 * Math.PI - Math.PI / 2;
                const radius = 90;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;

                return (
                  <motion.button
                    key={item.id}
                    initial={{ scale: 0, opacity: 0, x: 0, y: 0 }}
                    animate={{ scale: 1, opacity: 1, x, y }}
                    exit={{ scale: 0, opacity: 0, x: 0, y: 0 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelect(item);
                      handleClose();
                    }}
                    className="absolute w-14 h-14 -translate-x-1/2 -translate-y-1/2 bg-[#131b2e] text-white rounded-full flex flex-col items-center justify-center shadow-2xl hover:bg-[#00685f] hover:scale-110 transition-all group border border-white/10"
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-[#131b2e] text-white text-[8px] font-black uppercase tracking-tighter rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {item.label}
                    </span>
                  </motion.button>
                );
              })}
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-4 h-4 -translate-x-1/2 -translate-y-1/2 bg-[#00685f] rounded-full blur-sm"
              />
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
