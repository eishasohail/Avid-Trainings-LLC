"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface OrbitItem {
  id: number;
  name: string;
  src: string;
}

export const RadialIntro = ({ orbitItems }: { orbitItems: OrbitItem[] }) => {
  return (
    <div className="relative w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] flex items-center justify-center">
      {/* Center Image */}
      <div className="w-20 h-20 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-[#00685f]/20 bg-white shadow-2xl relative z-10 flex items-center justify-center">
        <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-br from-[#00685f] to-[#00bfa5] rounded-full flex items-center justify-center text-white">
           <span className="text-2xl font-black italic">A</span>
        </div>
      </div>

      {/* Orbit Items */}
      {orbitItems.map((item, index) => {
        const angle = (index / orbitItems.length) * 360;
        
        return (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              rotate: [angle, angle + 360],
            }}
            transition={{ 
                opacity: { duration: 0.5, delay: index * 0.1 },
                scale: { duration: 0.5, delay: index * 0.1 },
                rotate: { duration: 30 + index * 5, repeat: Infinity, ease: "linear" }
            }}
            className="absolute w-[240px] h-[240px] sm:w-[400px] sm:h-[400px]"
          >
            <motion.div
              animate={{ rotate: [-angle, -angle - 360] }}
              transition={{ duration: 30 + index * 5, repeat: Infinity, ease: "linear" }}
              className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 group"
            >
                <div className="relative">
                    <img 
                      src={item.src} 
                      alt={item.name} 
                      className="w-10 h-10 sm:w-14 sm:h-14 rounded-full border-2 border-white shadow-lg hover:scale-110 transition-transform cursor-pointer grayscale group-hover:grayscale-0" 
                    />
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-white/80 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] font-black text-[#131b2e] shadow-sm pointer-events-none">
                      {item.name}
                    </div>
                </div>
            </motion.div>
          </motion.div>
        );
      })}

      {/* Orbit Rings */}
      <div className="absolute w-[240px] h-[240px] sm:w-[400px] sm:h-[400px] border border-[#00685f]/10 rounded-full" />
      <div className="absolute w-[360px] h-[360px] sm:w-[500px] sm:h-[500px] border border-[#00685f]/5 rounded-full" />
    </div>
  );
};
