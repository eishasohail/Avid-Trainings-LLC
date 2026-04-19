"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { 
  Home, 
  Layers, 
  Eye, 
  Save, 
  Settings, 
  LayoutTemplate,
  Monitor
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef } from "react";

interface DockItemProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  mouseX: any;
}

function DockItem({ icon, label, onClick, mouseX }: DockItemProps) {
  const ref = useRef<HTMLButtonElement>(null);

  const distance = useTransform(mouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const widthSync = useTransform(distance, [-150, 0, 150], [50, 80, 50]);
  const width = useSpring(widthSync, { mass: 0.1, stiffness: 150, damping: 12 });

  return (
    <motion.button
      ref={ref}
      style={{ width }}
      onClick={onClick}
      className="aspect-square bg-white border border-[#bcc9c6]/30 rounded-2xl flex items-center justify-center relative group transition-colors hover:border-[#00685f]/50 hover:bg-[#ebfaf8]"
    >
      <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1 bg-[#131b2e] text-white text-[9px] font-black uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap shadow-xl">
         {label}
      </div>
      <div className="text-[#6d7a77] group-hover:text-[#00685f] group-hover:scale-110 transition-all">
        {icon}
      </div>
    </motion.button>
  );
}

interface BottomDockProps {
  courseId: string;
  lectureId: string;
  onPreview: () => void;
  onSave: () => void;
}

export default function BottomDock({ courseId, lectureId, onPreview, onSave }: BottomDockProps) {
  const router = useRouter();
  const mouseX = useMotionValue(Infinity);

  const items = [
    { icon: <Home className="w-5 h-5" />, label: 'Dashboard', onClick: () => router.push('/dashboard') },
    { icon: <Layers className="w-5 h-5" />, label: 'Structure', onClick: () => router.push(`/dashboard/editor/${courseId}`) },
    { icon: <Eye className="w-5 h-5" />, label: 'Preview Mode', onClick: onPreview },
    { icon: <Save className="w-5 h-5" />, label: 'Save Page', onClick: onSave },
    { icon: <Settings className="w-5 h-5" />, label: 'Settings', onClick: () => {} },
  ];

  return (
    <motion.div 
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="flex items-end gap-3 px-4 py-3 bg-white/80 backdrop-blur-xl border border-[#bcc9c6]/20 rounded-[32px] shadow-2xl"
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
    >
      {items.map((item, i) => (
        <DockItem 
          key={i} 
          {...item} 
          mouseX={mouseX} 
        />
      ))}
    </motion.div>
  );
}
