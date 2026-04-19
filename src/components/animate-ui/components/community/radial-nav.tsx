"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LucideIcon, Plus } from 'lucide-react';

interface RadialNavItem {
  id: number;
  icon: LucideIcon;
  label: string;
  angle: number;
}

export const RadialNav = ({ items, defaultActiveId = 1 }: { items: RadialNavItem[], defaultActiveId?: number }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeId, setActiveId] = useState(defaultActiveId);

  return (
    <div className="relative w-48 h-48 flex items-center justify-center">
      {/* Center Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full flex items-center justify-center transition-all z-20 shadow-2xl relative overflow-hidden group ${
          isOpen ? 'bg-[#131b2e] scale-110' : 'bg-[#00685f] hover:bg-[#131b2e]'
        }`}
      >
        <motion.div
           animate={{ rotate: isOpen ? 45 : 0 }}
           transition={{ type: "spring", stiffness: 300, damping: 20 }}
           className="text-white relative z-10"
        >
           <Plus className="w-6 h-6" />
        </motion.div>
        
        {/* Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </button>

      {/* Radial Items */}
      <AnimatePresence>
        {isOpen && items.map((item, i) => {
          const radius = 80;
          const radian = (item.angle - 90) * (Math.PI / 180);
          const x = Math.cos(radian) * radius;
          const y = Math.sin(radian) * radius;

          return (
            <motion.button
               key={item.id}
               initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
               animate={{ x, y, opacity: 1, scale: 1 }}
               exit={{ x: 0, y: 0, opacity: 0, scale: 0 }}
               transition={{ 
                 type: "spring", 
                 stiffness: 400, 
                 damping: 25, 
                 delay: i * 0.05 
               }}
               onClick={() => {
                 setActiveId(item.id);
                 setIsOpen(false);
               }}
               className={`absolute w-12 h-12 rounded-xl border flex items-center justify-center transition-all group shadow-sm z-10 ${
                 activeId === item.id 
                  ? 'bg-white border-[#00685f]/20 text-[#00685f] shadow-lg' 
                  : 'bg-white/80 border-[#bcc9c6]/30 text-[#6d7a77] hover:border-[#131b2e] hover:text-[#131b2e]'
               }`}
            >
               <item.icon className="w-5 h-5 transition-transform group-hover:scale-110" />
               
               {/* Tooltip */}
               <div className="absolute top-full mt-2 bg-[#131b2e] text-white text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                 {item.label}
               </div>
            </motion.button>
          );
        })}
      </AnimatePresence>

      {/* Path Line Connectors */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
        <AnimatePresence>
          {isOpen && items.map((item, i) => {
             const radius = 80;
             const radian = (item.angle - 90) * (Math.PI / 180);
             const x2 = radius * Math.cos(radian) + 96; // 96 is center (w-48/2)
             const y2 = radius * Math.sin(radian) + 96;
             
             return (
               <motion.line
                 key={item.id}
                 initial={{ pathLength: 0, opacity: 0 }}
                 animate={{ pathLength: 1, opacity: 0.15 }}
                 exit={{ pathLength: 0, opacity: 0 }}
                 x1="96" y1="96" x2={x2} y2={y2}
                 stroke="#00685f"
                 strokeWidth="1.5"
                 strokeDasharray="4 4"
               />
             );
          })}
        </AnimatePresence>
      </svg>
    </div>
  );
};
