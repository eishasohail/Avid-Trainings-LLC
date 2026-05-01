"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { useEditor, EditorContent } from "@tiptap/react";
import { BubbleMenu, FloatingMenu } from "@tiptap/react/menus";
import StarterKit from "@tiptap/starter-kit";
import { Underline } from "@tiptap/extension-underline";
import { Link } from "@tiptap/extension-link";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { Highlight } from "@tiptap/extension-highlight";
import { TextAlign } from "@tiptap/extension-text-align";
import { Table } from '@tiptap/extension-table'
import { TableRow } from '@tiptap/extension-table-row'
import { TableCell } from '@tiptap/extension-table-cell'
import { TableHeader } from '@tiptap/extension-table-header'
import { Placeholder } from '@tiptap/extension-placeholder'

import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Type,
  List,
  ListOrdered,
  Quote,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Highlighter,
  Link as LinkIcon,
  Trash2,
  ChevronDown,
  Image as ImageIcon,
  Table as TableIcon,
  Columns,
  Rows,
  PlusSquare,
  MinusSquare,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight
} from "lucide-react";

interface RichTextBlockProps {
  content: string;
  onChange: (html: string) => void;
  isPreview?: boolean;
  placeholder?: string;
  className?: string;
  compact?: boolean;
}

export default function RichTextBlock({ 
  content, 
  onChange, 
  isPreview = false, 
  placeholder = "Type something...",
  className = "",
  compact = false
}: RichTextBlockProps) {
  const [showTableConfirm, setShowTableConfirm] = useState(false);
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({ openOnClick: false }),
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Table.configure({
        HTMLAttributes: { class: 'avid-table' },
      }),
      TableRow,
      TableCell,
      TableHeader,
      Placeholder.configure({
        placeholder: placeholder || 'Start typing your content here...',
        emptyEditorClass: 'is-editor-empty',
      }),
    ],
    content: content || "",
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editable: !isPreview,
    immediatelyRender: false,
  });

  if (!editor) return null;

  return (
    <div className="relative group/editor w-full">
      {editor && !isPreview && (
        <FloatingMenu 
          editor={editor} 
          {...({ 
            tippyOptions: { 
              duration: 100, 
              placement: 'left-start', 
              offset: [-10, 20] 
            } 
          } as any)}
          shouldShow={({ state }: any) => {
            const { selection } = state;
            const { $from } = selection;
            return $from.parent.content.size === 0;
          }}
        >
          <div className="flex bg-[#131b2e] text-white p-1 rounded-2xl shadow-2xl border border-white/10 items-center gap-0.5 ring-1 ring-white/20 animate-fade-in">
             <button
              onMouseDown={e => e.preventDefault()}
              onClick={() => setShowTableConfirm(!showTableConfirm)}
              className={`p-2.5 hover:bg-white/10 rounded-xl transition-colors ${showTableConfirm ? 'text-[#00685f]' : 'text-white/60 hover:text-[#00685f]'}`}
              title="Table Options"
            >
              <TableIcon className="w-4 h-4" />
            </button>

            <AnimatePresence>
              {showTableConfirm && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex gap-1 items-center bg-white/5 p-1 rounded-xl mx-1"
                >
                  <button
                    onMouseDown={e => e.preventDefault()}
                    onClick={() => {
                      editor.chain().focus().insertTable({ rows: 2, cols: 2, withHeaderRow: true }).run();
                      setShowTableConfirm(false);
                    }}
                    className="px-2 py-1 bg-white/10 text-white rounded-lg text-[8px] font-black uppercase hover:bg-white/20 transition-all"
                  >
                    2x2
                  </button>
                  <button
                    onMouseDown={e => e.preventDefault()}
                    onClick={() => {
                      editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
                      setShowTableConfirm(false);
                    }}
                    className="px-2 py-1 bg-[#00685f] text-white rounded-lg text-[8px] font-black uppercase hover:bg-[#00685f]/80 transition-all shadow-lg"
                  >
                    3x3
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
            <div className="w-px h-4 bg-white/10 mx-1 shrink-0" />
            <button
              onMouseDown={e => e.preventDefault()}
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={`p-2.5 hover:bg-white/10 rounded-xl transition-colors ${editor.isActive('bulletList') ? 'text-[#00685f]' : 'text-white/60'}`}
              title="Bullet List"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onMouseDown={e => e.preventDefault()}
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={`p-2.5 hover:bg-white/10 rounded-xl transition-colors ${editor.isActive('orderedList') ? 'text-[#00685f]' : 'text-white/60'}`}
              title="Ordered List"
            >
              <ListOrdered className="w-4 h-4" />
            </button>
            <div className="w-px h-4 bg-white/10 mx-1 shrink-0" />
            <button
              onMouseDown={e => e.preventDefault()}
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              className={`p-2.5 hover:bg-white/10 rounded-xl transition-colors text-[10px] font-black ${editor.isActive('heading', { level: 2 }) ? 'text-[#00685f]' : 'text-white/60'}`}
              title="Heading 2"
            >
              H2
            </button>
          </div>
        </FloatingMenu>
      )}

      {editor && !isPreview && (
        <BubbleMenu editor={editor}>
          <div className="flex bg-[#131b2e] text-white p-1 rounded-xl shadow-2xl border border-white/10 items-center gap-0.5 overflow-hidden ring-1 ring-white/20">
            <div className="flex items-center gap-0.5 px-1">
              <button
                onMouseDown={e => e.preventDefault()}
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={`p-2 hover:bg-white/10 rounded-lg transition-colors ${editor.isActive('bold') ? 'text-[#00685f]' : ''}`}
              >
                <Bold className="w-4 h-4" />
              </button>
              <button
                onMouseDown={e => e.preventDefault()}
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={`p-2 hover:bg-white/10 rounded-lg transition-colors ${editor.isActive('italic') ? 'text-[#00685f]' : ''}`}
              >
                <Italic className="w-4 h-4" />
              </button>
              <button
                onMouseDown={e => e.preventDefault()}
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                className={`p-2 hover:bg-white/10 rounded-lg transition-colors ${editor.isActive('underline') ? 'text-[#00685f]' : ''}`}
              >
                <UnderlineIcon className="w-4 h-4" />
              </button>
            </div>
            
            <div className="w-px h-4 bg-white/10 mx-1 shrink-0" />
            
            <div className="flex items-center gap-0.5">
              <button
                onMouseDown={e => e.preventDefault()}
                onClick={() => editor.chain().focus().setTextAlign('left').run()}
                className={`p-2 hover:bg-white/10 rounded-lg transition-colors ${editor.isActive({ textAlign: 'left' }) ? 'text-[#00685f]' : ''}`}
              >
                <AlignLeft className="w-4 h-4" />
              </button>
              <button
                onMouseDown={e => e.preventDefault()}
                onClick={() => editor.chain().focus().setTextAlign('center').run()}
                className={`p-2 hover:bg-white/10 rounded-lg transition-colors ${editor.isActive({ textAlign: 'center' }) ? 'text-[#00685f]' : ''}`}
              >
                <AlignCenter className="w-4 h-4" />
              </button>
            </div>

            <div className="w-px h-4 bg-white/10 mx-1 shrink-0" />
            
            <button
              onMouseDown={e => e.preventDefault()}
              onClick={() => {
                const url = window.prompt('URL', editor.getAttributes('link').href);
                if (url) editor.chain().focus().setLink({ href: url }).run();
              }}
              className={`p-2 hover:bg-white/10 rounded-lg transition-colors ${editor.isActive('link') ? 'text-[#00685f]' : 'text-white/40'}`}
            >
              <LinkIcon className="w-4 h-4" />
            </button>
            
            <button
              onMouseDown={e => e.preventDefault()}
              onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
              className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-white/40 hover:text-red-500"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </BubbleMenu>
      )}

      {/* Table Controls (Contextual) */}
      {editor && !isPreview && editor.isActive('table') && (
        <div className="flex flex-wrap items-center gap-2 mb-4 p-3 bg-slate-50 border border-slate-200 rounded-2xl animate-fade-in-up">
          <div className="flex items-center gap-1 border-r border-slate-200 pr-2">
            <button
              onClick={() => editor.chain().focus().addColumnBefore().run()}
              title="Add Left"
              className="p-2 hover:bg-white hover:shadow-sm rounded-xl transition-all text-[#00685f] group flex flex-col items-center gap-0.5"
            >
              <div className="flex items-center">
                <ArrowLeft size={14} />
                <PlusSquare size={14} />
              </div>
              <span className="text-[8px] font-bold uppercase tracking-tighter">Left</span>
            </button>
            <button
              onClick={() => editor.chain().focus().addColumnAfter().run()}
              title="Add Right"
              className="p-2 hover:bg-white hover:shadow-sm rounded-xl transition-all text-[#00685f] group flex flex-col items-center gap-0.5"
            >
              <div className="flex items-center">
                <PlusSquare size={14} />
                <ArrowRight size={14} />
              </div>
              <span className="text-[8px] font-bold uppercase tracking-tighter">Right</span>
            </button>
            <button
              onClick={() => editor.chain().focus().deleteColumn().run()}
              title="Delete Col"
              className="p-2 hover:bg-red-50 text-red-500 rounded-xl transition-all group flex flex-col items-center gap-0.5"
            >
              <MinusSquare size={14} />
              <span className="text-[8px] font-bold uppercase tracking-tighter">Col</span>
            </button>
          </div>

          <div className="flex items-center gap-1 border-r border-slate-200 pr-2">
            <button
              onClick={() => editor.chain().focus().addRowBefore().run()}
              title="Add Above"
              className="p-2 hover:bg-white hover:shadow-sm rounded-xl transition-all text-[#00685f] group flex flex-col items-center gap-0.5"
            >
              <div className="flex flex-col items-center gap-0">
                <ArrowUp size={14} className="-mb-1" />
                <PlusSquare size={14} />
              </div>
              <span className="text-[8px] font-bold uppercase tracking-tighter">Above</span>
            </button>
            <button
              onClick={() => editor.chain().focus().addRowAfter().run()}
              title="Add Below"
              className="p-2 hover:bg-white hover:shadow-sm rounded-xl transition-all text-[#00685f] group flex flex-col items-center gap-0.5"
            >
              <div className="flex flex-col items-center gap-0">
                <PlusSquare size={14} />
                <ArrowDown size={14} className="-mt-1" />
              </div>
              <span className="text-[8px] font-bold uppercase tracking-tighter">Below</span>
            </button>
            <button
              onClick={() => editor.chain().focus().deleteRow().run()}
              title="Delete Row"
              className="p-2 hover:bg-red-50 text-red-500 rounded-xl transition-all group flex flex-col items-center gap-0.5"
            >
              <MinusSquare size={14} />
              <span className="text-[8px] font-bold uppercase tracking-tighter">Row</span>
            </button>
          </div>

          <button
            onClick={() => {
              if (window.confirm('Delete this table?')) {
                editor.chain().focus().deleteTable().run();
              }
            }}
            className="flex items-center gap-2 px-3 py-1.5 bg-red-50 hover:bg-red-500 text-red-500 hover:text-white rounded-xl transition-all text-[10px] font-black uppercase tracking-widest"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete Table
          </button>
        </div>
      )}

      <EditorContent
        editor={editor}
        className={`prose prose-slate max-w-none ${className} [&_p]:m-0
          prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tighter prose-headings:text-[#131b2e]
          prose-p:text-[#374151] prose-p:font-medium prose-p:leading-snug prose-p:text-lg prose-p:!my-0
          prose-strong:text-[#131b2e] prose-strong:font-black
          prose-ul:list-disc prose-ul:pl-5
          prose-li:text-[#374151]
          prose-blockquote:border-l-4 prose-blockquote:border-[#00685f] prose-blockquote:bg-transparent prose-blockquote:px-6 prose-blockquote:py-2 prose-blockquote:my-6 prose-blockquote:font-bold
          ${!isPreview ? `${compact ? 'min-h-[1px]' : 'min-h-[100px]'} cursor-text outline-none` : ''}`}
      />
    </div>
  );
}
