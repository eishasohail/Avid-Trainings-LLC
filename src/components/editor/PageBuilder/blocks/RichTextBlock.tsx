"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import StarterKit from "@tiptap/starter-kit";
import { Underline } from "@tiptap/extension-underline";
import { Link } from "@tiptap/extension-link";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { Highlight } from "@tiptap/extension-highlight";
import { TextAlign } from "@tiptap/extension-text-align";

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
  Image as ImageIcon
} from "lucide-react";

interface RichTextBlockProps {
  content: string;
  onChange: (html: string) => void;
  isPreview?: boolean;
}

export default function RichTextBlock({ content, onChange, isPreview = false }: RichTextBlockProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({ openOnClick: false }),
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content: content || "<p>Start typing your content here...</p>",
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editable: !isPreview,
    immediatelyRender: false,
  });

  if (!editor) return null;

  return (
    <div className="relative group/editor">
      {editor && !isPreview && (
        <BubbleMenu editor={editor}>
          <div className="flex bg-[#131b2e] text-white p-1 rounded-xl shadow-2xl border border-white/10 items-center gap-0.5 overflow-hidden ring-1 ring-white/20">
            {/* Formatting Group */}
            <div className="flex items-center">
              <button
                onMouseDown={e => e.preventDefault()}
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={`p-2 hover:bg-white/10 rounded-lg transition-colors ${editor.isActive('bold') ? 'text-[#00685f]' : ''}`}
                title="Bold"
              >
                <Bold className="w-4 h-4" />
              </button>
              <button
                onMouseDown={e => e.preventDefault()}
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={`p-2 hover:bg-white/10 rounded-lg transition-colors ${editor.isActive('italic') ? 'text-[#00685f]' : ''}`}
                title="Italic"
              >
                <Italic className="w-4 h-4" />
              </button>
              <button
                onMouseDown={e => e.preventDefault()}
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                className={`p-2 hover:bg-white/10 rounded-lg transition-colors ${editor.isActive('underline') ? 'text-[#00685f]' : ''}`}
                title="Underline"
              >
                <UnderlineIcon className="w-4 h-4" />
              </button>
              <button
                onMouseDown={e => e.preventDefault()}
                onClick={() => editor.chain().focus().toggleStrike().run()}
                className={`p-2 hover:bg-white/10 rounded-lg transition-colors ${editor.isActive('strike') ? 'text-[#00685f]' : ''}`}
                title="Strike"
              >
                <Strikethrough className="w-4 h-4" />
              </button>
            </div>

            <div className="w-px h-4 bg-white/10 mx-1 shrink-0" />

            {/* Headings Group */}
            <div className="flex items-center">
              {[1, 2, 3].map(level => (
                <button
                  key={level}
                  onMouseDown={e => e.preventDefault()}
                  onClick={() => editor.chain().focus().toggleHeading({ level: level as any }).run()}
                  className={`p-2 hover:bg-white/10 rounded-lg transition-colors text-xs font-black ${editor.isActive('heading', { level }) ? 'text-[#00685f]' : ''}`}
                >
                  H{level}
                </button>
              ))}
            </div>

            <div className="w-px h-4 bg-white/10 mx-1 shrink-0" />

            {/* Lists & Quote */}
            <div className="flex items-center">
              <button
                onMouseDown={e => e.preventDefault()}
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={`p-2 hover:bg-white/10 rounded-lg transition-colors ${editor.isActive('bulletList') ? 'text-[#00685f]' : ''}`}
                title="Bullet List"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onMouseDown={e => e.preventDefault()}
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={`p-2 hover:bg-white/10 rounded-lg transition-colors ${editor.isActive('orderedList') ? 'text-[#00685f]' : ''}`}
                title="Ordered List"
              >
                <ListOrdered className="w-4 h-4" />
              </button>
              <button
                onMouseDown={e => e.preventDefault()}
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={`p-2 hover:bg-white/10 rounded-lg transition-colors ${editor.isActive('blockquote') ? 'text-[#00685f]' : ''}`}
                title="Quote"
              >
                <Quote className="w-4 h-4" />
              </button>
            </div>

            <div className="w-px h-4 bg-white/10 mx-1 shrink-0" />

            {/* Alignment Group */}
            <div className="flex items-center">
              <button
                onMouseDown={e => e.preventDefault()}
                onClick={() => editor.chain().focus().setTextAlign('left').run()}
                className={`p-2 hover:bg-white/10 rounded-lg transition-colors ${editor.isActive({ textAlign: 'left' }) ? 'text-[#00685f]' : ''}`}
                title="Align Left"
              >
                <AlignLeft className="w-4 h-4" />
              </button>
              <button
                onMouseDown={e => e.preventDefault()}
                onClick={() => editor.chain().focus().setTextAlign('center').run()}
                className={`p-2 hover:bg-white/10 rounded-lg transition-colors ${editor.isActive({ textAlign: 'center' }) ? 'text-[#00685f]' : ''}`}
                title="Align Center"
              >
                <AlignCenter className="w-4 h-4" />
              </button>
              <button
                onMouseDown={e => e.preventDefault()}
                onClick={() => editor.chain().focus().setTextAlign('right').run()}
                className={`p-2 hover:bg-white/10 rounded-lg transition-colors ${editor.isActive({ textAlign: 'right' }) ? 'text-[#00685f]' : ''}`}
                title="Align Right"
              >
                <AlignRight className="w-4 h-4" />
              </button>
            </div>

            <div className="w-px h-4 bg-white/10 mx-1 shrink-0" />

            {/* Link & Misc */}
            <div className="flex items-center">
              <button
                onMouseDown={e => e.preventDefault()}
                onClick={() => {
                  const url = window.prompt('URL', editor.getAttributes('link').href);
                  if (url) editor.chain().focus().setLink({ href: url }).run();
                }}
                className={`p-2 hover:bg-white/10 rounded-lg transition-colors ${editor.isActive('link') ? 'text-[#00685f]' : 'text-white/40'}`}
                title="Link"
              >
                <LinkIcon className="w-4 h-4" />
              </button>
              <button
                onMouseDown={e => e.preventDefault()}
                onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
                className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-white/40 hover:text-red-500"
                title="Clear Formatting"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </BubbleMenu>
      )}

      <EditorContent 
        editor={editor} 
        className={`prose prose-slate max-w-none 
          prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tighter prose-headings:text-[#131b2e]
          prose-p:text-[#6d7a77] prose-p:font-bold prose-p:leading-relaxed prose-p:text-lg
          prose-strong:text-[#131b2e] prose-strong:font-black
          prose-ul:list-disc prose-ul:pl-5
          prose-li:text-[#6d7a77]
          prose-blockquote:border-l-4 prose-blockquote:border-[#00685f] prose-blockquote:bg-transparent prose-blockquote:px-6 prose-blockquote:py-2 prose-blockquote:my-6 prose-blockquote:italic prose-blockquote:font-bold
          ${!isPreview ? 'min-h-[100px] cursor-text outline-none' : ''}`}
      />
    </div>
  );
}
