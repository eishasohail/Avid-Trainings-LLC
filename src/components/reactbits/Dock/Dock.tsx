"use client";

import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface DockItem {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

interface DockProps {
  items: DockItem[];
  panelHeight?: number;
  baseItemSize?: number;
  magnification?: number;
}

export default function Dock({
  items,
  panelHeight = 68,
  baseItemSize = 50,
  magnification = 70
}: DockProps) {
  const mouseX = useMotionValue(Infinity);

  return (
    <motion.div
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className="flex items-center gap-4 px-4 rounded-2xl shadow-xl"
      style={{ height: panelHeight }}
    >
      {items.map((item, i) => (
        <IconContainer
          key={i}
          mouseX={mouseX}
          item={item}
          baseItemSize={baseItemSize}
          magnification={magnification}
        />
      ))}
    </motion.div>
  );
}

function IconContainer({
  mouseX,
  item,
  baseItemSize,
  magnification
}: {
  mouseX: any;
  item: DockItem;
  baseItemSize: number;
  magnification: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const distance = useTransform(mouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const widthTransform = useTransform(distance, [-150, 0, 150], [baseItemSize, magnification, baseItemSize]);
  const heightTransform = useTransform(distance, [-150, 0, 150], [baseItemSize, magnification, baseItemSize]);

  const width = useSpring(widthTransform, {
    mass: 0.1,
    stiffness: 250,
    damping: 15
  });
  const height = useSpring(heightTransform, {
    mass: 0.1,
    stiffness: 250,
    damping: 15
  });

  return (
    <motion.div
      ref={ref}
      style={{ width, height }}
      onClick={item.onClick}
      className="relative flex items-center justify-center rounded-xl hover:bg-slate-100 transition-colors cursor-pointer group"
    >
      <div className="transition-transform duration-300 group-hover:scale-125">
        {item.icon}
      </div>
      <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-[#131b2e] text-white text-[10px] font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
        {item.label}
      </div>
    </motion.div>
  );
}
