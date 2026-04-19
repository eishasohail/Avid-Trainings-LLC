"use client";

import { motion } from "framer-motion";

interface FolderProps {
  size?: number;
  color?: string;
  className?: string;
  isOpen?: boolean;
}

export default function Folder({ 
  size = 1.5, 
  color = "#00685f", 
  className = "",
  isOpen = false 
}: FolderProps) {
  return (
    <div 
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: `${size * 24}px`, height: `${size * 24}px` }}
    >
      <motion.svg
        width="100%"
        height="100%"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        animate={{ 
          scale: 1,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {/* Back of the folder */}
        <path
          d="M20 18H4C2.89543 18 2 17.1046 2 16V8C2 6.89543 2.89543 6 4 6H9L11 4H20C21.1046 4 22 4.89543 22 6V16C22 17.1046 21.1046 18 20 18Z"
          fill={color}
          fillOpacity="0.2"
          stroke={color}
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        
        {/* Front flap of the folder */}
        <motion.path
          d="M2 16V9C2 7.89543 2.89543 7 4 7H20C21.1046 7 22 7.89543 22 9V16C22 17.1046 21.1046 18 20 18H4C2.89543 18 2 17.1046 2 16Z"
          fill={color}
          stroke={color}
          strokeWidth="1.5"
          strokeLinejoin="round"
          initial={false}
          animate={{
            d: isOpen 
              ? "M2 16V12C2 10.8954 2.89543 10 4 10H20C21.1046 10 22 10.8954 22 12V16C22 17.1046 21.1046 18 20 18H4C2.89543 18 2 17.1046 2 16Z" 
              : "M2 16V9C2 7.89543 2.89543 7 4 7H20C21.1046 7 22 7.89543 22 9V16C22 17.1046 21.1046 18 20 18H4C2.89543 18 2 17.1046 2 16Z",
            skewX: isOpen ? -5 : 0,
            y: isOpen ? 2 : 0
          }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        />
      </motion.svg>
    </div>
  );
}
