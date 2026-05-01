"use client";

import { FileText, Trash2, ChevronRight } from "lucide-react";
import Link from "next/link";

interface PageRowProps {
  id: string;
  courseId: string;
  lectureId: string;
  index: number;
  title: string;
  onDelete: () => void;
}

export default function PageRow({ id, courseId, lectureId, index, title, onDelete }: PageRowProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-white border border-[#bcc9c6]/20 rounded-xl hover:border-[#00685f]/30 transition-all group/page">
      <div className="flex items-center gap-4">
        <div className="w-8 h-8 rounded-lg bg-[#f7f9fb] flex items-center justify-center text-[10px] font-black text-[#6d7a77]">
          {index + 1}
        </div>
        <div className="flex items-center gap-3">
          <FileText className="w-4 h-4 text-[#bcc9c6] group-hover/page:text-[#00685f] transition-colors" />
          <p className="text-sm font-bold text-[#191c1e] whitespace-normal break-words">{title}</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="w-12 h-10 bg-[#f0f4f4] rounded-lg border border-[#bcc9c6]/10 flex items-center justify-center overflow-hidden">
           <div className="w-full h-full bg-[#bcc9c6]/20" />
        </div>
        <Link 
          href={`/dashboard/editor/${courseId}/${lectureId}/${id}`}
          className="px-4 py-2 bg-[#ebfaf8] border border-[#00685f]/10 text-[#00685f] hover:bg-[#00685f] hover:text-white rounded-lg text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-2"
        >
          EDIT <ChevronRight className="w-3 h-3" />
        </Link>
        <button 
          onClick={onDelete}
          className="p-2 text-[#bcc9c6] hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
