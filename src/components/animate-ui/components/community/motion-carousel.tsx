"use client";

import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';

interface MotionCarouselProps {
  children: React.ReactNode;
  className?: string;
  gap?: number;
}

export const MotionCarousel = ({ children, className, gap = 20 }: MotionCarouselProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [constraints, setConstraints] = useState({ left: 0, right: 0 });
  const x = useMotionValue(0);

  useEffect(() => {
    if (containerRef.current) {
      const { scrollWidth, offsetWidth } = containerRef.current;
      setConstraints({ left: -(scrollWidth - offsetWidth), right: 0 });
    }
  }, [children]);

  return (
    <div className={`overflow-hidden cursor-grab active:cursor-grabbing ${className}`} ref={containerRef}>
      <motion.div
        drag="x"
        dragConstraints={constraints}
        style={{ x, display: 'flex', gap: `${gap}px` }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {children}
      </motion.div>
    </div>
  );
};
