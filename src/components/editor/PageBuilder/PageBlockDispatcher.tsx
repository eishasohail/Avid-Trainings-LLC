"use client"

import React, { useState } from "react"
import { 
  ChevronDown, 
  Plus, 
  Trash2, 
  PlusCircle, 
  Image as ImageIcon, 
  Video, 
  Music, 
  Check, 
  X, 
  GripVertical, 
  Maximize2,
  CheckCircle2
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  DndContext, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors 
} from '@dnd-kit/core'
import { 
  arrayMove, 
  SortableContext, 
  sortableKeyboardCoordinates, 
  verticalListSortingStrategy, 
  useSortable 
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { EditorContent } from '@tiptap/react'

// Components
import RichTextBlock from '@/components/editor/PageBuilder/blocks/RichTextBlock'
import CrossMatchBlock from '@/components/editor/PageBuilder/blocks/CrossMatchBlock'

export const getVideoEmbed = (url: string) => {
  if (!url) return null
  
  // YouTube
  const ytMatch = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/
  )
  if (ytMatch) {
    return `https://www.youtube.com/embed/${ytMatch[1]}`
  }
  
  // Vimeo
  const vimeoMatch = url.match(
    /vimeo\.com\/(\d+)/
  )
  if (vimeoMatch) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`
  }
  
  // Direct video file
  if (url.match(/\.(mp4|webm|ogg)$/i)) {
    return url
  }
  
  return null
}

function ImageWithPosition({ 
  image, 
  position = 'right',
  children,
  isPreview,
  onImageChange,
  onPositionChange
}: {
  image?: string
  position?: 'left' | 'right' | 'top' | 'bottom'
  children: React.ReactNode
  isPreview: boolean
  onImageChange?: (url: string) => void
  onPositionChange?: (pos: string) => void
}) {
  const isHorizontal = position === 'left' || 
    position === 'right'
  const imageFirst = position === 'left' || 
    position === 'top'

  const imageEl = (image || !isPreview) ? (
    <div className={`
      ${isHorizontal ? 'w-1/3 shrink-0' : 'w-full'}
      relative group/imgwrap
    `}>
      {image ? (
        <div className="relative">
          <img
            src={image}
            className={`
              w-full object-cover rounded-xl
              ${isHorizontal ? 'h-full max-h-64' : 'max-h-48'}
            `}
          />
          {!isPreview && (
            <label className="absolute inset-0 
              bg-black/40 opacity-0 
              group/imgwrap:hover:opacity-100
              flex flex-col items-center 
              justify-center cursor-pointer 
              rounded-xl transition-opacity">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    onImageChange?.(
                      URL.createObjectURL(
                        e.target.files[0]
                      )
                    )
                  }
                }}
              />
              <ImageIcon size={20} 
                className="text-white mb-1" />
              <span className="text-[9px] 
                font-black uppercase text-white 
                tracking-widest">
                Change
              </span>
            </label>
          )}
        </div>
      ) : (
        !isPreview && (
          <label className="flex flex-col 
            items-center justify-center gap-2 
            p-6 border-2 border-dashed 
            border-slate-200 rounded-xl 
            cursor-pointer 
            hover:border-[#00685f]/40 
            transition-colors min-h-[120px]">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  onImageChange?.(
                    URL.createObjectURL(
                      e.target.files[0]
                    )
                  )
                }
              }}
            />
            <ImageIcon size={24} 
              className="text-slate-300" />
            <span className="text-[9px] 
              font-black uppercase 
              text-slate-400 tracking-widest">
              Add Image
            </span>
          </label>
        )
      )}

      {/* Position selector — editor only */}
      {!isPreview && (image || true) && (
        <div className="flex gap-1 mt-2 
          justify-center">
          {[
            { key: 'left', label: 'L' },
            { key: 'right', label: 'R' },
            { key: 'top', label: 'T' },
            { key: 'bottom', label: 'B' },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => onPositionChange?.(key)}
              className={`w-7 h-7 rounded-lg 
                text-[9px] font-black uppercase 
                transition-all
                ${position === key
                  ? 'bg-[#00685f] text-white'
                  : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                }`}
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  ) : null

  if (!image && isPreview) {
    return <>{children}</>
  }

  return (
    <div className={`flex gap-6 ${
      isHorizontal ? 'flex-row items-start' : 'flex-col'
    } ${
      !imageFirst && isHorizontal 
        ? 'flex-row-reverse' : ''
    } ${
      !imageFirst && !isHorizontal 
        ? 'flex-col-reverse' : ''
    }`}>
      {imageEl}
      <div className="flex-1 min-w-0">
        {children}
      </div>
    </div>
  )
}

export function AccordionBlock({ items, onUpdate, isPreview }: any) {
  const [openIds, setOpenIds] = useState<string[]>([])

  const toggleItem = (id: string) => {
    setOpenIds(prev => 
      prev.includes(id) 
        ? prev.filter(i => i !== id)
        : [...prev, id]
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-3">
      {items.map((item: any, idx: number) => {
        const isOpen = openIds.includes(item.id)
        
        return (
          <div 
            key={item.id}
            className="border-2 border-slate-100 
              rounded-2xl overflow-hidden
              hover:border-[#00685f]/20 transition-colors"
          >
            {/* Header */}
            <div 
              className={`flex items-center justify-between 
                p-5 cursor-pointer transition-colors
                ${isOpen 
                  ? 'bg-[#00685f]/5 border-b-2 border-[#00685f]/10' 
                  : 'bg-white hover:bg-slate-50'
                }`}
              onClick={() => toggleItem(item.id)}
            >
              {isPreview ? (
                <h3 className="font-black text-[#131b2e] 
                  text-lg">
                  {item.title || 'Section Title'}
                </h3>
              ) : (
                <input
                  value={item.title}
                  onChange={(e) => {
                    const n = [...items]
                    n[idx].title = e.target.value
                    onUpdate({ items: n })
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className="font-black text-[#131b2e] 
                    text-lg bg-transparent border-none 
                    outline-none flex-1"
                  placeholder="Section title..."
                />
              )}
              
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className={`w-5 h-5 
                  transition-colors
                  ${isOpen 
                    ? 'text-[#00685f]' 
                    : 'text-slate-400'
                  }`} 
                />
              </motion.div>
            </div>

            {/* Content */}
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="p-5 bg-white">
                    <ImageWithPosition
                      image={item.image}
                      position={item.imagePosition || 'right'}
                      isPreview={isPreview}
                      onImageChange={(url) => {
                        const n = [...items]
                        n[idx].image = url
                        onUpdate({ items: n })
                      }}
                      onPositionChange={(pos) => {
                        const n = [...items]
                        n[idx].imagePosition = pos
                        onUpdate({ items: n })
                      }}
                    >
                      <RichTextBlock 
                        content={item.content} 
                        onChange={(html) => { 
                          const n = [...items]
                          n[idx].content = html
                          onUpdate({ items: n })
                        }} 
                        isPreview={isPreview}
                      />
                    </ImageWithPosition>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}

      {/* Add new section — editor only */}
      {!isPreview && (
        <button
          onClick={() => onUpdate({ 
            items: [...items, { 
              id: Date.now().toString(), 
              title: `Section ${items.length + 1}`, 
              content: '' 
            }] 
          })}
          className="flex items-center gap-2 
            text-[#00685f] font-black text-[10px] 
            uppercase tracking-widest mt-4
            hover:opacity-70 transition-opacity"
        >
          <Plus size={16} /> Add Section
        </button>
      )}

      {/* Delete buttons — editor only */}
      {!isPreview && items.length > 1 && (
        <div className="space-y-2 mt-2">
          {items.map((item: any, idx: number) => (
            <button
              key={item.id}
              onClick={() => onUpdate({ 
                items: items.filter(
                  (_: any, i: number) => i !== idx
                ) 
              })}
              className="flex items-center gap-1 
                text-red-400 text-[10px] font-black 
                uppercase hover:text-red-600 
                transition-colors"
            >
              <Trash2 size={12} /> 
              Remove "{item.title}"
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export function TabsBlock({ layout, content, onUpdate, isPreview }: any) {
  const it = (content.items && content.items.length > 0) ? content.items : [{ id: '1', title: 'Tab 1', content: '' }];
  const [at, setAt] = useState(it[0]?.id || '1');
  
  return (
    <div className={`max-w-4xl mx-auto flex ${layout === 'v-tabs' ? 'gap-10' : 'flex-col gap-6'}`}>
      <div className={`flex shrink-0 ${layout === 'v-tabs' ? 'flex-col min-w-[180px]' : 'flex-wrap border-b border-slate-100 pb-2'}`}>
        {it.map((tab:any, idx:any) => (
          <div key={tab.id} className="relative group/tab">
            <button onClick={() => setAt(tab.id)} className={`px-6 py-3 text-[10px] font-black uppercase rounded-xl ${at === tab.id ? 'bg-[#00685f] text-white' : 'text-slate-400'}`}>
              <input value={tab.title} onClick={(e) => e.stopPropagation()} onChange={(e) => { const n = [...it]; n[idx].title = e.target.value; onUpdate({ items: n }); }} className="bg-transparent border-none p-0 outline-none w-20 uppercase font-black" />
            </button>
            <X size={12} className="absolute -top-1 -right-1 opacity-0 group-hover/tab:opacity-100 text-red-500 cursor-pointer" onClick={() => onUpdate({ items: it.filter((t:any) => t.id !== tab.id) })} />
          </div>
        ))}
        <button onClick={() => onUpdate({ items: [...it, { id: Date.now().toString(), title: `New Tab`, content: '' }] })} className="px-4 py-2 text-[#00685f] font-black text-[9px] uppercase">+ Tab</button>
      </div>
      <div className="flex-1 min-h-[300px] bg-slate-50/50 rounded-[2.5rem] p-10">
        {it.map((t:any, idx: number) => t.id === at && (
          <ImageWithPosition
            key={t.id}
            image={t.image}
            position={t.imagePosition || 'right'}
            isPreview={isPreview}
            onImageChange={(url) => {
              const n = [...it]
              n[idx].image = url
              onUpdate({ items: n })
            }}
            onPositionChange={(pos) => {
              const n = [...it]
              n[idx].imagePosition = pos
              onUpdate({ items: n })
            }}
          >
            <RichTextBlock 
              key={t.id} 
              content={t.content} 
              onChange={(html) => { 
                const n = [...it]
                n[idx].content = html
                onUpdate({ items: n })
              }} 
              isPreview={isPreview}
            />
          </ImageWithPosition>
        ))}
      </div>
    </div>
  );
}

export function TrueFalseBlock({ content, onUpdate, isPreview }: any) {
  const qu = content.quiz || { question: '', correct: null, explanation: '' }; 
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  
  if (isPreview) {
    return (
      <div className="max-w-2xl mx-auto space-y-10">
        <div className="w-full text-3xl font-black text-[#131b2e] border-b-4 border-slate-100 pb-6">{qu.question}</div>
        <div className="flex gap-6 mt-4">
          <button onClick={() => !submitted && setSelected('true')} className={`flex-1 py-10 rounded-[2.5rem] font-black text-xl flex items-center justify-center gap-3 transition-all ${submitted && selected === 'true' ? qu.correct === 'true' ? 'bg-green-500 text-white shadow-2xl' : 'bg-red-500 text-white shadow-2xl' : selected === 'true' ? 'bg-[#00685f] text-white shadow-2xl' : 'border-2 border-[#bcc9c6] bg-slate-50 text-slate-400 hover:border-[#00685f]'}`}><Check size={28}/> TRUE</button>
          <button onClick={() => !submitted && setSelected('false')} className={`flex-1 py-10 rounded-[2.5rem] font-black text-xl flex items-center justify-center gap-3 transition-all ${submitted && selected === 'false' ? qu.correct === 'false' ? 'bg-green-500 text-white shadow-2xl' : 'bg-red-500 text-white shadow-2xl' : selected === 'false' ? 'bg-[#00685f] text-white shadow-2xl' : 'border-2 border-[#bcc9c6] bg-slate-50 text-slate-400 hover:border-[#00685f]'}`}><X size={28}/> FALSE</button>
        </div>
        {!submitted && selected && <button onClick={() => setSubmitted(true)} className="w-full mt-3 py-4 bg-[#131b2e] text-teal-400 font-black tracking-widest uppercase text-xs rounded-[2rem]">Submit Answer</button>}
        {submitted && (
          <div className="flex flex-col gap-4 mt-8">
            <p className={`text-center font-bold text-xl ${selected === qu.correct ? 'text-green-500' : 'text-red-500'}`}>{selected === qu.correct ? '✓ Correct!' : '✗ Incorrect. Try again!'}</p>
            {qu.explanation && <div className="bg-slate-50 rounded-[2rem] p-8 text-[#131b2e] font-medium"><p className="text-[10px] uppercase font-black tracking-widest text-[#00685f] mb-2">Explanation</p>{qu.explanation}</div>}
          </div>
        )}
      </div>
    );
  }
  
  return (
    <div className="max-w-2xl mx-auto space-y-10">
      <input value={qu.question} onChange={(e) => onUpdate({ quiz: { ...qu, question: e.target.value } })} placeholder="Enter question..." className="w-full text-3xl font-black text-[#131b2e] border-b-4 border-slate-100 pb-6 outline-none focus:border-[#00685f]/20" />
      <div className="flex gap-6">
        <button onClick={() => onUpdate({ quiz: { ...qu, correct: 'true' } })} className={`flex-1 py-10 rounded-[2.5rem] font-black text-xl flex items-center justify-center gap-3 ${qu.correct === 'true' ? 'bg-[#00685f] text-white shadow-2xl' : 'bg-slate-50 text-slate-400'}`}><Check size={28}/> TRUE</button>
        <button onClick={() => onUpdate({ quiz: { ...qu, correct: 'false' } })} className={`flex-1 py-10 rounded-[2.5rem] font-black text-xl flex items-center justify-center gap-3 ${qu.correct === 'false' ? 'bg-red-500 text-white shadow-2xl' : 'bg-slate-50 text-slate-400'}`}><X size={28}/> FALSE</button>
      </div>
      <div className="bg-slate-50 rounded-[2rem] p-8">
        <label className="text-[9px] font-black uppercase text-slate-400 block mb-3">Explanation</label>
        <textarea value={qu.explanation} onChange={(e) => onUpdate({ quiz: { ...qu, explanation: e.target.value } })} className="w-full bg-transparent border-none outline-none resize-none font-medium" rows={3} />
      </div>
    </div>
  ); 
}

export function MCQuizBlock({ content, onUpdate, isPreview }: any) {
  const qu = content.quiz || { question: '', options: ['', '', '', ''], correct: null, explanation: '' }; 
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  
  if (isPreview) {
    return (
      <div className="max-w-2xl mx-auto space-y-10">
        <div className="w-full text-3xl font-black text-[#131b2e] border-b-4 border-slate-100 pb-6">{qu.question}</div>
        <div className="space-y-4">
          {qu.options.map((opt:any, i:any) => (
            <div key={i} onClick={() => !submitted && setSelected(i)} className={`flex items-center gap-5 p-5 rounded-[2rem] border-2 cursor-pointer transition-all ${submitted && selected === i ? qu.correct === i ? 'border-green-500 bg-green-500/10' : 'border-red-500 bg-red-500/10' : selected === i ? 'border-[#00685f] bg-[#00685f]/5 shadow-xl' : 'border-slate-50 bg-white hover:border-[#00685f]/30'}`}>
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black ${submitted && selected === i ? qu.correct === i ? 'bg-green-500 text-white' : 'bg-red-500 text-white' : selected === i ? 'bg-[#00685f] text-white' : 'bg-slate-100 text-slate-400'}`}>{String.fromCharCode(65+i)}</div>
              <div className="flex-1 font-bold text-[#131b2e]">{opt}</div>
            </div>
          ))}
        </div>
        {!submitted && selected !== null && <button onClick={() => setSubmitted(true)} className="w-full mt-3 py-4 bg-[#131b2e] text-teal-400 font-black tracking-widest uppercase text-xs rounded-[2rem]">Submit Answer</button>}
        {submitted && (
          <div className="flex flex-col gap-4 mt-8">
            <p className={`text-center font-bold text-xl ${selected === qu.correct ? 'text-green-500' : 'text-red-500'}`}>{selected === qu.correct ? '✓ Correct!' : '✗ Incorrect. Try again!'}</p>
            {qu.explanation && <div className="bg-slate-50 rounded-[2rem] p-8 text-[#131b2e] font-medium"><p className="text-[10px] uppercase font-black tracking-widest text-[#00685f] mb-2">Explanation</p>{qu.explanation}</div>}
          </div>
        )}
      </div>
    );
  }
  
  return (
    <div className="max-w-2xl mx-auto space-y-10">
      <input value={qu.question} onChange={(e) => onUpdate({ quiz: { ...qu, question: e.target.value } })} className="w-full text-3xl font-black text-[#131b2e] border-b-4 border-slate-100 pb-6 outline-none" />
      <div className="space-y-4">
        {qu.options.map((opt:any, i:any) => (
          <div key={i} onClick={() => onUpdate({ quiz: { ...qu, correct: i } })} className={`flex items-center gap-5 p-5 rounded-[2rem] border-2 cursor-pointer ${qu.correct === i ? 'border-[#00685f] bg-[#00685f]/5 shadow-xl' : 'border-slate-50'}`}>
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black ${qu.correct === i ? 'bg-[#00685f] text-white' : 'bg-white text-slate-400'}`}>{String.fromCharCode(65+i)}</div>
            <input value={opt} onChange={(e) => { const n = [...qu.options]; n[i] = e.target.value; onUpdate({ quiz: { ...qu, options: n } }); }} onClick={(e) => e.stopPropagation()} className="flex-1 bg-transparent border-none outline-none font-bold" />
          </div>
        ))}
      </div>
      <div className="bg-slate-50 rounded-[2rem] p-8">
        <label className="text-[9px] font-black uppercase text-slate-400 block mb-3">Explanation</label>
        <textarea value={qu.explanation || ''} onChange={(e) => onUpdate({ quiz: { ...qu, explanation: e.target.value } })} className="w-full bg-transparent border-none outline-none resize-none font-medium" rows={3} />
      </div>
    </div>
  ); 
}

export function FlashcardBlock({ content, onUpdate }: any) {
  const fc = content.flashcard || { front: '', back: '' }; 
  const [fl, setFl] = useState(false); 
  
  return (
    <div className="flex flex-col items-center gap-10">
      <div className="grid grid-cols-2 gap-8 w-full max-w-4xl">
        <div>
          <label className="text-[9px] font-black text-slate-400 uppercase">Front</label>
          <textarea value={fc.front} onChange={(e) => onUpdate({ flashcard: { ...fc, front: e.target.value } })} className="w-full h-32 bg-[#fafcfc] border rounded-[2rem] p-6 text-sm font-black outline-none shadow-inner" />
        </div>
        <div>
          <label className="text-[9px] font-black text-slate-400 uppercase">Back</label>
          <textarea value={fc.back} onChange={(e) => onUpdate({ flashcard: { ...fc, back: e.target.value } })} className="w-full h-32 bg-[#fafcfc] border rounded-[2rem] p-6 text-sm outline-none shadow-inner" />
        </div>
      </div>
      <div className="w-full max-w-md">
        <motion.div className="w-full h-64 cursor-pointer" onClick={() => setFl(!fl)} style={{ perspective: 1200 }}>
          <motion.div className="w-full h-full relative" animate={{ rotateY: fl ? 180 : 0 }} transition={{ duration: 0.6 }} style={{ transformStyle: 'preserve-3d' }}>
            <div className="absolute inset-0 bg-[#00685f] rounded-[3rem] flex items-center justify-center p-12 shadow-2xl" style={{ backfaceVisibility: 'hidden' }}>
              <p className="text-white font-black text-2xl text-center leading-tight">{fc.front || 'Prompt'}</p>
            </div>
            <div className="absolute inset-0 bg-[#131b2e] rounded-[3rem] flex items-center justify-center p-12 shadow-2xl" style={{ transform: 'rotateY(180deg)', backfaceVisibility: 'hidden' }}>
              <p className="text-teal-400 font-bold text-center text-lg">{fc.back || 'Answer'}</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export function SortableItem({ id, text, onTextChange, onDelete, isPreview }: any) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = { transform: CSS.Transform.toString(transform), transition, zIndex: isDragging ? 50 : 0 };

  return (
    <div ref={setNodeRef} style={style} className={`flex items-center gap-4 bg-[#fafcfc] border border-slate-100 p-4 rounded-2xl group ${isDragging ? 'shadow-2xl' : ''}`}>
      <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing text-slate-300 hover:text-[#00685f]"><GripVertical size={20}/></div>
      {isPreview ? (
        <div className="flex-1 font-bold text-[#3d4947]">{text}</div>
      ) : (
        <input value={text} onChange={(e) => onTextChange(e.target.value)} className="flex-1 bg-transparent border-none outline-none font-bold text-[#3d4947]" placeholder="Enter step text..." />
      )}
      {!isPreview && <Trash2 size={16} className="text-red-200 hover:text-red-500 cursor-pointer opacity-0 group-hover:opacity-100" onClick={onDelete} />}
    </div>
  );
}

export function SequenceBlock({ content, onUpdate, isPreview }: any) {
  const items = (content.sequenceItems && content.sequenceItems.length > 0) 
    ? content.sequenceItems 
    : [
        { id: '1', text: 'Step 1 — Enter text here' },
        { id: '2', text: 'Step 2 — Enter text here' },
        { id: '3', text: 'Step 3 — Enter text here' },
      ];

  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = items.findIndex((i: any) => i.id === active.id);
      const newIndex = items.findIndex((i: any) => i.id === over.id);
      onUpdate({ sequenceItems: arrayMove(items, oldIndex, newIndex) });
    }
  };

  const [sub, setSub] = useState(false);

  if (isPreview) {
    return (
      <div className="max-w-2xl mx-auto space-y-4">
        <p className="text-xs font-black uppercase text-[#00685f] mb-6 tracking-widest text-center">Arrange in correct order</p>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={items} strategy={verticalListSortingStrategy}>
            {items.map((item: any) => (
              <SortableItem key={item.id} id={item.id} text={item.text} isPreview={true} />
            ))}
          </SortableContext>
        </DndContext>
        {!sub ? (
           <button onClick={() => setSub(true)} className="w-full mt-10 py-4 bg-[#131b2e] hover:bg-[#00685f] text-teal-400 font-black tracking-widest uppercase text-xs rounded-[2rem] transition-colors">Submit Sequence</button>
        ) : (
           <div className="mt-8 p-6 bg-slate-50 text-center rounded-[2rem]">
             <p className="font-bold text-[#00685f]">Sequence submitted for review!</p>
           </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          {items.map((item: any, idx: number) => (
            <SortableItem 
              key={item.id} 
              id={item.id} 
              text={item.text} 
              onTextChange={(val: string) => {
                const n = [...items];
                n[idx].text = val;
                onUpdate({ sequenceItems: n });
              }}
              onDelete={() => onUpdate({ sequenceItems: items.filter((i: any) => i.id !== item.id) })}
            />
          ))}
        </SortableContext>
      </DndContext>
      <button 
        onClick={() => onUpdate({ sequenceItems: [...items, { id: Date.now().toString(), text: '' }] })}
        className="flex items-center gap-2 text-[#00685f] font-black text-[10px] uppercase tracking-widest mt-6"
      >
        <PlusCircle size={18}/> Add Step
      </button>
    </div>
  );
}

export function HotspotBlock({ content, onUpdate, isPreview }: any) {
  const [isAdding, setIsAdding] = useState(false);
  const [selectedSpot, setSelectedSpot] = useState<any>(null);
  const spots = content.hotspots || [];

  const handleImageClick = (e: any) => {
    if (!isAdding) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    const newSpot = { id: Date.now().toString(), x, y, label: '', isCorrect: false };
    onUpdate({ hotspots: [...spots, newSpot] });
    setIsAdding(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onUpdate({ image: URL.createObjectURL(e.target.files[0]) });
    }
  };

  const setDefaultImage = () => {
    onUpdate({ image: 'https://images.unsplash.com/photo-1454165833767-027ffea9e4ae?q=80&w=2070&auto=format&fit=crop' });
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      
      {/* Question input */}
      {!isPreview ? (
        <input 
          value={content.question || ''}
          onChange={(e) => onUpdate({ question: e.target.value })}
          placeholder="Enter your hotspot question..."
          className="w-full text-lg font-semibold outline-none border-b-2 border-[#bcc9c6] pb-2 focus:border-[#00685f]"
        />
      ) : (
        content.question && (
          <h2 className="w-full text-lg font-semibold border-b-2 border-[#bcc9c6] pb-2 text-[#191c1e]">
            {content.question}
          </h2>
        )
      )}

      {/* Image area - fixed height not full screen */}
      <div className="relative w-full h-64 border-2 border-dashed border-[#bcc9c6] rounded-lg overflow-hidden">
        {content.image ? (
          <div className="w-full h-full relative" onClick={handleImageClick}>
            <img src={content.image} className="w-full h-full object-cover" />
            {isAdding && (
              <div className="absolute inset-0 cursor-crosshair bg-transparent" />
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full cursor-pointer" onClick={setDefaultImage}>
            <ImageIcon className="w-8 h-8 text-[#6d7a77] mb-2" />
            <p className="text-sm text-[#6d7a77]">Click to set base image</p>
          </div>
        )}
        
        {spots.map((spot: any, i: number) => (
          <div 
            key={spot.id} 
            onClick={() => { if(isPreview) setSelectedSpot(spot); }}
            style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
            className={`absolute w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold cursor-pointer transform -translate-x-1/2 -translate-y-1/2 shadow-lg transition-transform ${
              isPreview 
                ? selectedSpot?.id === spot.id 
                    ? (spot.isCorrect ? 'bg-green-500 scale-125' : 'bg-red-500 scale-125') 
                    : 'bg-[#131b2e]/80 hover:bg-[#131b2e] shadow-[0_0_0_4px_rgba(255,255,255,0.4)] hover:scale-110'
                : spot.isCorrect ? 'bg-[#00685f]' : 'bg-[#131b2e]'
            }`}
          >
            {i + 1}
          </div>
        ))}
      </div>
      
      {isPreview && selectedSpot && (
        <div className="mt-4 flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-300">
           <p className={`font-bold text-lg ${selectedSpot.isCorrect ? 'text-green-500' : 'text-red-500'}`}>
             {selectedSpot.isCorrect ? '✓ Spot Located Correctly!' : '✗ Incorrect Area'}
           </p>
           {selectedSpot.label && <p className="text-slate-500 mt-1">{selectedSpot.label}</p>}
        </div>
      )}

      {/* Buttons row */}
      {!isPreview && (
        <div className="flex gap-3">
          <label className="flex-1 py-2 border border-[#bcc9c6] rounded-lg text-sm text-center cursor-pointer hover:border-[#00685f] transition-colors">
            <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            Upload Image
          </label>
          <button
            onClick={() => setIsAdding(!isAdding)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
              isAdding 
                ? 'bg-[#00685f] text-white' 
                : 'border border-[#00685f] text-[#00685f]'
            }`}
          >
            {isAdding ? 'Click on image...' : '+ Add Hotspot'}
          </button>
        </div>
      )}

      {/* Hotspot list - fully visible */}
      {!isPreview && (
        <div className="flex flex-col gap-2">
          {spots.map((spot: any, i: number) => (
            <div key={spot.id} className="flex items-center gap-3 p-3 border border-[#bcc9c6] rounded-lg bg-white">
              <span className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ${
                spot.isCorrect ? 'bg-[#00685f]' : 'bg-[#131b2e]'
              }`}>
                {i + 1}
              </span>
              <input
                value={spot.label}
                onChange={(e) => {
                  const n = [...spots];
                  n[i].label = e.target.value;
                  onUpdate({ hotspots: n });
                }}
                placeholder="Hotspot label..."
                className="flex-1 outline-none text-sm text-[#191c1e]"
              />
              <label className="flex items-center gap-1.5 text-xs text-[#6d7a77] cursor-pointer flex-shrink-0">
                <input
                  type="checkbox"
                  checked={spot.isCorrect}
                  onChange={(e) => {
                    const n = [...spots];
                    n[i].isCorrect = e.target.checked;
                    onUpdate({ hotspots: n });
                  }}
                  className="accent-[#00685f]"
                />
                Correct
              </label>
              <button onClick={() => onUpdate({ hotspots: spots.filter((s:any) => s.id !== spot.id) })}>
                <Trash2 className="w-4 h-4 text-red-400" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function PageBlockDispatcher({ layout, content, onUpdate, editor, isPreview }: any) {
  const proseClasses = `prose prose-slate max-w-none 
    prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tighter prose-headings:text-[#131b2e]
    prose-p:text-[#191c1e] prose-p:font-medium prose-p:leading-relaxed prose-p:text-lg
    prose-strong:text-[#131b2e] prose-strong:font-black
    prose-ul:list-disc prose-ul:pl-5
    prose-ol:list-decimal prose-ol:pl-5
    prose-li:text-[#191c1e]
    prose-blockquote:border-l-4 prose-blockquote:border-[#00685f] prose-blockquote:bg-transparent prose-blockquote:px-6 prose-blockquote:py-2 prose-blockquote:my-6 prose-blockquote:font-bold`;

  switch (layout) {
    case 'text-only':
    case 'bullet-points':
      return editor ? (
        <ImageWithPosition
          image={content.image}
          position={content.imagePosition || 'right'}
          isPreview={isPreview}
          onImageChange={(url) => 
            onUpdate({ image: url })}
          onPositionChange={(pos) => 
            onUpdate({ imagePosition: pos })}
        >
          <div className="w-full min-h-[350px]">
            <EditorContent editor={editor} 
              className={`${proseClasses} outline-none 
                min-h-[350px] px-4 py-3 cursor-text`} 
            />
          </div>
        </ImageWithPosition>
      ) : null;
    case 'quote-block':
      return editor ? (
        <ImageWithPosition
          image={content.image}
          position={content.imagePosition || 'left'}
          isPreview={isPreview}
          onImageChange={(url) => 
            onUpdate({ image: url })}
          onPositionChange={(pos) => 
            onUpdate({ imagePosition: pos })}
        >
          <div className="border-l-8 border-[#00685f] 
            pl-10 py-6 max-w-3xl mx-auto">
            <p className="text-7xl text-[#00685f] font-black opacity-20 -mb-8">"</p>
            <EditorContent editor={editor} 
              className="prose prose-p:text-xl prose-p:text-[#131b2e] prose-p:font-bold text-2xl font-bold text-[#131b2e] outline-none" 
            />
            <input placeholder="— Author name" 
              value={content.author || ''} 
              onChange={(e) => onUpdate({ author: e.target.value })} 
              className="mt-8 text-lg text-[#6d7a77] font-black bg-transparent border-none outline-none w-full" 
            />
          </div>
        </ImageWithPosition>
      ) : null;
    case 'key-points':
      return (
        <ImageWithPosition
          image={content.image}
          position={content.imagePosition || 'top'}
          isPreview={isPreview}
          onImageChange={(url) => 
            onUpdate({ image: url })}
          onPositionChange={(pos) => 
            onUpdate({ imagePosition: pos })}
        >
          <div className="max-w-3xl mx-auto">
            <input placeholder="Section Title" 
              value={content.title || ''} 
              onChange={(e) => onUpdate({ title: e.target.value })} 
              className="text-4xl font-black text-[#131b2e] tracking-tighter w-full outline-none mb-10 border-none p-0" 
            />
            <div className="space-y-4">
              {(content.points || ['Key point 1', 'Key point 2']).map((p: any, i: any) => (
                <div key={i} className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl group/item">
                  <CheckCircle2 className="text-[#00685f] w-6 h-6" />
                  <input value={p} 
                    onChange={(e) => { 
                      const n = [...(content.points || [])]
                      n[i] = e.target.value
                      onUpdate({ points: n })
                    }} 
                    className="flex-1 outline-none bg-transparent font-bold text-[#3d4947]" 
                  />
                  <Trash2 className="w-5 h-5 text-red-300 cursor-pointer opacity-0 group-hover/item:opacity-100" 
                    onClick={() => onUpdate({ points: (content.points || []).filter((_: any, idx: any) => idx !== i) })} 
                  />
                </div>
              ))}
              <button onClick={() => onUpdate({ points: [...(content.points || []), ''] })} 
                className="mt-6 flex items-center gap-2 text-[#00685f] font-black uppercase text-[10px] tracking-widest"
              >
                <PlusCircle size={18}/> Add Key Point
              </button>
            </div>
          </div>
        </ImageWithPosition>
      );
    case 'image-text-left':
    case 'image-text-right':
      return editor ? (
        <div className={`flex gap-12 w-full items-center ${layout === 'image-text-right' ? 'flex-row-reverse' : ''}`}>
          <div className="w-1/2 aspect-square border-4 border-dashed border-slate-100 rounded-[3rem] flex flex-col items-center justify-center bg-slate-50/50 cursor-pointer relative overflow-hidden group">
            {content.image ? (
              <>
                <img src={content.image} className="w-full h-full object-cover" />
                {!isPreview && (
                  <label className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => { if(e.target.files?.[0]) onUpdate({ image: URL.createObjectURL(e.target.files[0]) }) }} />
                    <ImageIcon size={32} className="text-white mb-2" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-white">Change Image</span>
                  </label>
                )}
              </>
            ) : (
              <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer">
                <input type="file" accept="image/*" className="hidden" onChange={(e) => { if(e.target.files?.[0]) onUpdate({ image: URL.createObjectURL(e.target.files[0]) }) }} />
                <ImageIcon size={48} className="text-slate-200 mb-4 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-[#00685f] transition-colors">Deploy Image</span>
              </label>
            )}
          </div>
          <div className="flex-1"><EditorContent editor={editor} className={`${proseClasses} outline-none min-h-[350px] px-4 py-3`} /></div>
        </div>
      ) : null;
    case 'image-stacked':
    case 'video-text':
      return editor ? (
        <div className="max-w-4xl mx-auto flex flex-col gap-10">
          <div className="aspect-video w-full bg-slate-50 
            border-4 border-dashed border-slate-100 
            rounded-[3.5rem] overflow-hidden relative">
            
            {(layout === 'video-text' && content.videoUrl && getVideoEmbed(content.videoUrl)) ? (
              // Show embedded video
              content.videoUrl.match(/\.(mp4|webm|ogg)$/i) ? (
                <video 
                  src={content.videoUrl}
                  controls
                  className="w-full h-full object-cover rounded-[3rem]"
                />
              ) : (
                <iframe
                  src={getVideoEmbed(content.videoUrl)!}
                  className="w-full h-full rounded-[3rem]"
                  allowFullScreen
                  allow="accelerometer; autoplay; 
                    clipboard-write; encrypted-media; 
                    gyroscope; picture-in-picture"
                />
              )
            ) : layout === 'video-text' ? (
              // Empty state
              <div className="absolute inset-0 flex flex-col 
                items-center justify-center gap-4">
                <Video size={48} className="text-slate-200" />
                {!isPreview && (
                  <input 
                    placeholder="Paste YouTube, Vimeo or video URL here..."
                    value={content.videoUrl || ''}
                    onChange={(e) => onUpdate({ 
                      videoUrl: e.target.value 
                    })}
                    className="mt-2 px-6 py-3 bg-white 
                      border border-slate-200 rounded-full 
                      text-xs w-80 text-center outline-none
                      focus:border-[#00685f]"
                  />
                )}
              </div>
            ) : (
              // Image Stacked logic
              <>
                {content.image ? (
                  <>
                    <img src={content.image} className="w-full h-full object-cover" />
                    {!isPreview && (
                      <label className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => { if(e.target.files?.[0]) onUpdate({ image: URL.createObjectURL(e.target.files[0]) }) }} />
                        <ImageIcon size={32} className="text-white mb-2" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-white">Change Image</span>
                      </label>
                    )}
                  </>
                ) : (
                  <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer">
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => { if(e.target.files?.[0]) onUpdate({ image: URL.createObjectURL(e.target.files[0]) }) }} />
                    <ImageIcon size={48} className="text-slate-200 mb-4 group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-[#00685f] transition-colors">Deploy Image</span>
                  </label>
                )}
              </>
            )}

            {/* Change video button when video exists */}
            {layout === 'video-text' && content.videoUrl && !isPreview && (
              <button
                onClick={() => onUpdate({ videoUrl: '' })}
                className="absolute top-4 right-4 
                  px-3 py-1.5 bg-white/90 backdrop-blur-sm
                  rounded-xl text-xs font-black text-slate-500
                  hover:text-red-500 border border-slate-200
                  transition-colors shadow-sm"
              >
                Remove Video
              </button>
            )}
          </div>

          <EditorContent 
            editor={editor}
            className={`${proseClasses} outline-none min-h-[200px] px-4 py-3`}
          />

          {/* URL input when video exists - editor only */}
          {layout === 'video-text' && !isPreview && content.videoUrl && (
            <input 
              placeholder="Change video URL..."
              value={content.videoUrl || ''}
              onChange={(e) => onUpdate({ 
                videoUrl: e.target.value 
              })}
              className="px-4 py-2 border border-slate-200 
                rounded-xl text-xs outline-none w-full
                focus:border-[#00685f] text-slate-500"
            />
          )}
        </div>
      ) : null;
    case 'audio-text':
      return editor ? (
        <div className="max-w-3xl mx-auto flex flex-col gap-10">
          
          {/* Audio Player Area */}
          <div className="bg-slate-50 border-2 border-slate-100 
            rounded-[2.5rem] p-8 flex flex-col gap-6 
            items-center relative">
            
            <Music size={36} className="text-[#00685f]" />

            {content.audioUrl ? (
              <>
                {/* Real audio player */}
                <audio 
                  controls
                  src={content.audioUrl}
                  className="w-full"
                />
                
                {/* Remove button */}
                {!isPreview && (
                  <button
                    onClick={() => onUpdate({ audioUrl: '' })}
                    className="text-xs font-black text-red-400 
                      hover:text-red-600 uppercase tracking-widest
                      transition-colors"
                  >
                    Remove Audio
                  </button>
                )}
              </>
            ) : (
              <>
                {/* Empty state waveform */}
                <div className="flex gap-1 items-end h-8">
                  {[3,5,4,7,6,4,8,5,3,6,7,4,5,3,6].map(
                    (h, i) => (
                    <div
                      key={i}
                      className="w-1.5 bg-[#00685f]/20 
                        rounded-full"
                      style={{ height: `${h * 4}px` }}
                    />
                  ))}
                </div>

                <p className="text-[10px] font-black uppercase 
                  tracking-widest text-slate-400">
                  No audio uploaded yet
                </p>

                {/* Upload button */}
                {!isPreview && (
                  <label className="flex items-center gap-2 
                    px-6 py-3 bg-white border-2 
                    border-[#00685f]/20 rounded-2xl 
                    text-xs font-black text-[#00685f] 
                    uppercase tracking-widest cursor-pointer
                    hover:bg-[#00685f]/5 transition-colors">
                    <Music className="w-4 h-4" />
                    Upload Audio File
                    <input
                      type="file"
                      accept="audio/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          onUpdate({
                            audioUrl: URL.createObjectURL(
                              e.target.files[0]
                            )
                          })
                        }
                      }}
                    />
                  </label>
                )}
              </>
            )}
          </div>

          {/* Text Editor Below */}
          <EditorContent
            editor={editor}
            className={`${proseClasses} outline-none min-h-[200px] px-4 py-3 cursor-text text-[#191c1e] font-medium leading-relaxed`}
          />
        </div>
      ) : null;
    case 'accordion': {
      const items = content.items || [
        { id: '1', title: 'Section 1', content: '' }
      ]
      
      return (
        <AccordionBlock
          items={items}
          onUpdate={onUpdate}
          isPreview={isPreview}
        />
      )
    }
    case 'h-tabs':
    case 'v-tabs':
      return <TabsBlock layout={layout} content={content} onUpdate={onUpdate} isPreview={isPreview} />;
    case 'q-a':
      { 
        const pa = (content.pairs && content.pairs.length > 0) ? content.pairs : [{ id: '1', question: 'Question?', answer: '' }]; 
        return (
          <div className="max-w-3xl mx-auto space-y-8">
            {pa.map((pair: any, idx: any) => (
              <div key={pair.id} className="group bg-[#fafcfc] border border-slate-200 rounded-[30px] p-8 hover:border-[#00685f]/30">
                <div className="flex justify-between mb-4">
                  <span className="text-[10px] font-black text-[#00685f] uppercase">Inquiry {idx+1}</span>
                  <Trash2 size={16} className="text-red-300 hover:text-red-500 cursor-pointer" onClick={() => onUpdate({ pairs: pa.filter((p:any) => p.id !== pair.id) })} />
                </div>
                <input 
                  value={pair.question} 
                  onChange={(e) => { const n = [...pa]; n[idx].question = e.target.value; onUpdate({ pairs: n }); }} 
                  className="w-full text-xl font-black text-[#131b2e] border-none p-0 outline-none bg-transparent mb-4" 
                />
                <textarea 
                  value={pair.answer} 
                  onChange={(e) => { const n = [...pa]; n[idx].answer = e.target.value; onUpdate({ pairs: n }); }} 
                  className="w-full text-base font-medium text-slate-500 border-none p-0 outline-none bg-transparent resize-none leading-relaxed" 
                  rows={3} 
                />
              </div>
            ))}
            <button onClick={() => onUpdate({ pairs: [...pa, { id: Date.now().toString(), question: '', answer: '' }] })} className="flex items-center gap-2 text-[#00685f] font-black text-[10px] uppercase">
              <PlusCircle size={20}/> New Q&A
            </button>
          </div>
        ); 
      }
    case 'true-false':
      return <TrueFalseBlock content={content} onUpdate={onUpdate} isPreview={isPreview} />;
    case 'mc-quiz':
      return <MCQuizBlock content={content} onUpdate={onUpdate} isPreview={isPreview} />;
    case 'flashcard':
      return <FlashcardBlock content={content} onUpdate={onUpdate} />;
    case 'sequence':
      return <SequenceBlock content={content} onUpdate={onUpdate} isPreview={isPreview} />;
    case 'cross-match':
      return (
        <CrossMatchBlock
          content={content}
          onUpdate={onUpdate}
          isPreview={isPreview}
        />
      );
    case 'hotspot':
      return <HotspotBlock content={content} onUpdate={onUpdate} isPreview={isPreview} />;
    default:
      return (<div className="w-full min-h-[400px] border-4 border-dashed border-slate-100 rounded-[3rem] flex flex-col items-center justify-center bg-slate-50/20"><div className="w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center text-slate-200 mb-6"><Maximize2 size={32}/></div><p className="text-slate-400 text-sm font-black uppercase tracking-widest opacity-40">Blank Canvas</p></div>);
  }
}
