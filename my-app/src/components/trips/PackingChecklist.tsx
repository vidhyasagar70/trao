'use client';

import { useState } from 'react';

interface PackingChecklistProps {
  items: string[];
}

export default function PackingChecklist({ items }: PackingChecklistProps) {
  const [checked, setChecked] = useState<Set<number>>(new Set());

  const toggle = (idx: number) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  const checkedCount = checked.size;
  const progress = items.length > 0 ? Math.round((checkedCount / items.length) * 100) : 0;

  return (
    <div className="bg-white border border-[#E5E5E5] rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-[#E5E5E5] bg-[#F8F8F8] flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-[#111111]">Packing Checklist</h2>
          <p className="text-[#666666] text-sm mt-0.5">
            {checkedCount} of {items.length} items packed
          </p>
        </div>
        <div className="flex items-center gap-4">
          {/* Circular progress */}
          <div className="relative w-12 h-12">
            <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="15.9" fill="none" stroke="#F3F3F3" strokeWidth="2.5" />
              <circle
                cx="18" cy="18" r="15.9"
                fill="none"
                stroke={progress === 100 ? '#0F766E' : '#111111'}
                strokeWidth="2.5"
                strokeDasharray={`${progress} 100`}
                strokeLinecap="round"
                className="transition-all duration-500"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-[#111111]">
              {progress}%
            </span>
          </div>
          {checkedCount > 0 && (
            <button
              onClick={() => setChecked(new Set())}
              className="text-xs text-[#666666] hover:text-[#111111] transition-colors underline underline-offset-2"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Complete banner */}
      {progress === 100 && (
        <div className="flex items-center gap-3 bg-[#F0FDF4] border-b border-[#D1FAE5] px-6 py-3 text-sm text-[#0F766E] font-medium">
          <span>✓</span>
          You&apos;re all packed and ready to go!
        </div>
      )}

      {/* Checklist items */}
      <div className="p-4">
        <ul className="space-y-1.5">
          {items.map((item, idx) => {
            const isDone = checked.has(idx);
            return (
              <li key={idx}>
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all duration-150 ${
                    isDone
                      ? 'bg-[#F8F8F8] text-[#999999]'
                      : 'bg-white border border-[#E5E5E5] text-[#111111] hover:bg-[#F3F3F3] hover:border-[#D4D4D4]'
                  }`}
                >
                  <span
                    className={`flex-shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-150 ${
                      isDone
                        ? 'bg-[#111111] border-[#111111]'
                        : 'border-[#D4D4D4]'
                    }`}
                  >
                    {isDone && (
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </span>
                  <span className={`text-sm leading-snug ${isDone ? 'line-through' : ''}`}>
                    {item}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        {items.length === 0 && (
          <p className="text-[#999999] text-sm text-center py-8">
            No packing checklist was generated for this trip.
          </p>
        )}
      </div>
    </div>
  );
}
