"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Trash2, GripVertical, Check, X, RefreshCw
} from 'lucide-react';
import { 
  DndContext, 
  closestCenter, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragOverlay
} from '@dnd-kit/core';
import { useDraggable, useDroppable } from '@dnd-kit/core';

interface MatchPair {
  id: string;
  term: string;
  definition: string;
}

interface CrossMatchProps {
  content: {
    question?: string;
    pairs?: MatchPair[];
  };
  onUpdate: (updates: any) => void;
  isPreview?: boolean;
}

function DraggableTerm({ id, text, isMatched, isCorrect, submitted }: { 
  id: string; text: string; isMatched?: boolean; isCorrect?: boolean; submitted?: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id });
  
  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`
        flex items-center gap-3 p-4 rounded-2xl border-2 cursor-grab active:cursor-grabbing
        transition-all duration-200 select-none
        ${isDragging ? 'opacity-50 shadow-2xl scale-105' : ''}
        ${isMatched && submitted && isCorrect ? 'border-[#00685f] bg-[#00685f]/10 cursor-default' : ''}
        ${isMatched && submitted && !isCorrect ? 'border-red-400 bg-red-50 cursor-default' : ''}
        ${isMatched && !submitted ? 'border-[#00685f]/40 bg-white' : ''}
        ${!isMatched ? 'border-slate-200 bg-white hover:border-[#00685f]/40 hover:shadow-md' : ''}
      `}
    >
      <GripVertical className="w-4 h-4 text-slate-300 shrink-0" />
      <span className="font-bold text-[#131b2e] text-sm">{text}</span>
      {isMatched && submitted && isCorrect && <Check className="w-4 h-4 text-[#00685f] ml-auto shrink-0" />}
      {isMatched && submitted && !isCorrect && <X className="w-4 h-4 text-red-400 ml-auto shrink-0" />}
    </div>
  );
}

function DroppableDefinition({ id, text, isOccupied, matchedTerm, isCorrect, submitted }: {
  id: string; text: string; isOccupied?: boolean; matchedTerm?: string; isCorrect?: boolean; submitted?: boolean;
}) {
  const { isOver, setNodeRef } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`
        p-4 rounded-2xl border-2 min-h-[60px] transition-all duration-200
        ${isOver ? 'border-[#00685f] bg-[#00685f]/5 scale-[1.02]' : ''}
        ${isOccupied && submitted && isCorrect ? 'border-[#00685f] bg-[#00685f]/10' : ''}
        ${isOccupied && submitted && !isCorrect ? 'border-red-400 bg-red-50' : ''}
        ${isOccupied && !submitted ? 'border-[#00685f]/40 bg-white' : ''}
        ${!isOccupied && !isOver ? 'border-dashed border-slate-200 bg-slate-50/50' : ''}
      `}
    >
      {isOccupied && matchedTerm ? (
        <div className="flex items-center gap-2">
          <span className="text-xs font-black text-[#00685f] uppercase tracking-widest">
            {matchedTerm}
          </span>
          <span className="text-slate-300 mx-1">→</span>
          <span className="font-medium text-[#131b2e] text-sm">{text}</span>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <span className={`text-sm font-medium ${isOver ? 'text-[#00685f]' : 'text-slate-500'}`}>
            {text}
          </span>
          {!isOccupied && (
            <span className="text-[10px] text-slate-300 ml-auto font-black uppercase">
              Drop here
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export default function CrossMatchBlock({ content, onUpdate, isPreview }: CrossMatchProps) {
  const pairs: MatchPair[] = content.pairs || [
    { id: '1', term: 'ISO 27001', definition: 'Information Security Management' },
    { id: '2', term: 'ISO 9001', definition: 'Quality Management Systems' },
    { id: '3', term: 'ISO 45001', definition: 'Occupational Health & Safety' },
  ];

  const [matches, setMatches] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [activeDragId, setActiveDragId] = useState<string | null>(null);
  const [score, setScore] = useState<number | null>(null);

  const sensors = useSensors(useSensor(PointerSensor));

  // Shuffle definitions for preview mode
  const [shuffledDefs] = useState(() => 
    isPreview ? [...pairs].sort(() => Math.random() - 0.5) : pairs
  );

  const handleDragStart = (event: any) => {
    setActiveDragId(event.active.id);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    setActiveDragId(null);
    if (!over) return;
    
    const termId = active.id as string;
    const defId = over.id as string;
    
    setMatches(prev => ({ ...prev, [termId]: defId }));
  };

  const handleSubmit = () => {
    let correct = 0;
    pairs.forEach(pair => {
      if (matches[pair.id] === pair.id) correct++;
    });
    setScore(correct);
    setSubmitted(true);
  };

  const handleReset = () => {
    setMatches({});
    setSubmitted(false);
    setScore(null);
  };

  const isTermMatched = (termId: string) => termId in matches;
  const isMatchCorrect = (termId: string) => matches[termId] === termId;

  // EDITOR MODE
  if (!isPreview) {
    return (
      <div className="max-w-3xl mx-auto space-y-8">
        <input
          value={content.question || ''}
          onChange={(e) => onUpdate({ question: e.target.value })}
          placeholder="Enter matching question..."
          className="w-full text-2xl font-black text-[#131b2e] border-b-4 
            border-slate-100 pb-4 outline-none focus:border-[#00685f]/30 
            bg-transparent"
        />

        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest 
              text-[#00685f] mb-4">Terms</p>
            <div className="space-y-3">
              {pairs.map((pair, idx) => (
                <div key={pair.id} className="flex items-center gap-3 
                  bg-slate-50 p-3 rounded-2xl group">
                  <GripVertical className="w-4 h-4 text-slate-300" />
                  <input
                    value={pair.term}
                    onChange={(e) => {
                      const n = [...pairs];
                      n[idx].term = e.target.value;
                      onUpdate({ pairs: n });
                    }}
                    className="flex-1 bg-transparent outline-none font-bold 
                      text-[#131b2e] text-sm"
                    placeholder="Term..."
                  />
                  <Trash2
                    className="w-4 h-4 text-red-300 opacity-0 
                      group-hover:opacity-100 cursor-pointer"
                    onClick={() => onUpdate({ 
                      pairs: pairs.filter((_, i) => i !== idx) 
                    })}
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[10px] font-black uppercase tracking-widest 
              text-slate-400 mb-4">Definitions</p>
            <div className="space-y-3">
              {pairs.map((pair, idx) => (
                <div key={pair.id} className="flex items-center gap-3 
                  bg-slate-50 p-3 rounded-2xl border-2 border-dashed 
                  border-slate-200">
                  <input
                    value={pair.definition}
                    onChange={(e) => {
                      const n = [...pairs];
                      n[idx].definition = e.target.value;
                      onUpdate({ pairs: n });
                    }}
                    className="flex-1 bg-transparent outline-none 
                      text-slate-500 text-sm font-medium"
                    placeholder="Definition..."
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={() => onUpdate({ 
            pairs: [...pairs, { 
              id: Date.now().toString(), 
              term: '', 
              definition: '' 
            }] 
          })}
          className="flex items-center gap-2 text-[#00685f] font-black 
            text-[10px] uppercase tracking-widest"
        >
          <Plus size={16} /> Add Pair
        </button>

        <div className="bg-[#ebfaf8] rounded-2xl p-6 border border-[#00685f]/10">
          <p className="text-[10px] font-black uppercase text-[#00685f] mb-1">
            Preview
          </p>
          <p className="text-sm text-slate-500 font-medium">
            Learners will drag terms from the left and drop them onto 
            the correct definitions on the right.
          </p>
        </div>
      </div>
    );
  }

  // PREVIEW/LEARNER MODE
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {content.question && (
        <h2 className="text-2xl font-black text-[#131b2e]">
          {content.question}
        </h2>
      )}

      <p className="text-[10px] font-black uppercase tracking-widest 
        text-slate-400">
        Drag each term and drop it on the correct definition
      </p>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-2 gap-8">
          {/* Left — Terms */}
          <div className="space-y-3">
            <p className="text-[10px] font-black uppercase tracking-widest 
              text-[#00685f]">Terms</p>
            {pairs.map((pair) => (
              !isTermMatched(pair.id) || !submitted ? (
                <DraggableTerm
                  key={pair.id}
                  id={pair.id}
                  text={pair.term}
                  isMatched={isTermMatched(pair.id)}
                  isCorrect={submitted ? isMatchCorrect(pair.id) : undefined}
                  submitted={submitted}
                />
              ) : null
            ))}
          </div>

          {/* Right — Definitions (shuffled) */}
          <div className="space-y-3">
            <p className="text-[10px] font-black uppercase tracking-widest 
              text-slate-400">Definitions</p>
            {shuffledDefs.map((pair) => {
              const matchedTermId = Object.entries(matches)
                .find(([_, defId]) => defId === pair.id)?.[0];
              const matchedTerm = matchedTermId 
                ? pairs.find(p => p.id === matchedTermId)?.term 
                : undefined;
              
              return (
                <DroppableDefinition
                  key={pair.id}
                  id={pair.id}
                  text={pair.definition}
                  isOccupied={!!matchedTermId}
                  matchedTerm={matchedTerm}
                  isCorrect={submitted 
                    ? matchedTermId === pair.id 
                    : undefined}
                  submitted={submitted}
                />
              );
            })}
          </div>
        </div>

        <DragOverlay>
          {activeDragId ? (
            <div className="p-4 rounded-2xl border-2 border-[#00685f] 
              bg-white shadow-2xl opacity-90">
              <span className="font-bold text-[#131b2e] text-sm">
                {pairs.find(p => p.id === activeDragId)?.term}
              </span>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Submit / Reset */}
      {!submitted ? (
        <button
          onClick={handleSubmit}
          disabled={Object.keys(matches).length < pairs.length}
          className="w-full py-4 bg-[#131b2e] text-teal-400 font-black 
            uppercase text-xs tracking-widest rounded-[2rem] 
            disabled:opacity-40 hover:bg-[#00685f] transition-colors"
        >
          Submit Matches
        </button>
      ) : (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className={`p-6 rounded-2xl text-center ${
              score === pairs.length 
                ? 'bg-[#00685f]/10 border-2 border-[#00685f]' 
                : 'bg-red-50 border-2 border-red-200'
            }`}>
              <p className={`text-2xl font-black ${
                score === pairs.length 
                  ? 'text-[#00685f]' 
                  : 'text-red-500'
              }`}>
                {score === pairs.length 
                  ? '✓ Perfect Match!' 
                  : `${score}/${pairs.length} Correct`}
              </p>
              {score !== pairs.length && (
                <p className="text-sm text-slate-500 mt-2">
                  Review and try again
                </p>
              )}
            </div>
            <button
              onClick={handleReset}
              className="w-full flex items-center justify-center gap-2 
                py-3 border-2 border-slate-200 rounded-2xl text-slate-500 
                font-black text-xs uppercase tracking-widest 
                hover:border-[#00685f] hover:text-[#00685f] transition-colors"
            >
              <RefreshCw size={14} /> Try Again
            </button>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
