"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, AlertTriangle } from "lucide-react";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

export default function DeleteConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message 
}: DeleteConfirmModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#131b2e]/80 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md bg-white rounded-[40px] shadow-3xl p-10 overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-2 bg-red-500" />
            
            <div className="space-y-8">
              <div className="flex flex-col items-center text-center space-y-6">
                <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-red-500 shadow-inner">
                  <AlertTriangle className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-[#191c1e] tracking-tight uppercase">{title}</h3>
                  <p className="text-sm font-medium text-[#6d7a77] leading-relaxed">
                    {message}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={onConfirm}
                  className="w-full py-5 bg-red-500 hover:bg-red-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all shadow-xl shadow-red-500/20 active:scale-95 flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" /> Delete Course
                </button>
                <button
                  onClick={onClose}
                  className="w-full py-5 bg-white border border-[#bcc9c6]/30 text-[#6d7a77] hover:text-[#191c1e] hover:bg-[#f7f9fb] rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all active:scale-95"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
