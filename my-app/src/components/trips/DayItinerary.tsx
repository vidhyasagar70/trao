'use client';

import { useState } from 'react';
import { DayPlan } from '@/types';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

interface DayItineraryProps {
  dayPlan: DayPlan;
  onUpdate: (updatedDay: DayPlan) => Promise<void>;
  onRegenerate: () => Promise<void>;
  isUpdating: boolean;
  isRegenerating: boolean;
}

type TimeSlot = 'morning' | 'afternoon' | 'evening';

const TIME_SLOTS: {
  key: TimeSlot;
  label: string;
  icon: string;
  bgClass: string;
}[] = [
  { key: 'morning', label: 'Morning', icon: '🌅', bgClass: 'bg-[#FAFAFA] border-[#E5E5E5]' },
  { key: 'afternoon', label: 'Afternoon', icon: '☀️', bgClass: 'bg-[#FAFAFA] border-[#E5E5E5]' },
  { key: 'evening', label: 'Evening', icon: '🌙', bgClass: 'bg-[#FAFAFA] border-[#E5E5E5]' },
];

export default function DayItinerary({
  dayPlan,
  onUpdate,
  onRegenerate,
  isUpdating,
  isRegenerating,
}: DayItineraryProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isOpen, setIsOpen] = useState(dayPlan.day === 1);
  const [editedPlan, setEditedPlan] = useState<DayPlan>(dayPlan);

  const handleSave = async () => {
    await onUpdate(editedPlan);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedPlan(dayPlan);
    setIsEditing(false);
  };

  const updateActivityLine = (slot: TimeSlot, index: number, value: string) => {
    const updated = [...editedPlan[slot]];
    updated[index] = value;
    setEditedPlan({ ...editedPlan, [slot]: updated });
  };

  const addActivityLine = (slot: TimeSlot) => {
    setEditedPlan({ ...editedPlan, [slot]: [...editedPlan[slot], ''] });
  };

  const removeActivityLine = (slot: TimeSlot, index: number) => {
    const updated = editedPlan[slot].filter((_, i) => i !== index);
    setEditedPlan({ ...editedPlan, [slot]: updated });
  };

  const totalActivities =
    dayPlan.morning.length + dayPlan.afternoon.length + dayPlan.evening.length;

  return (
    <div className="bg-white border border-[#E5E5E5] rounded-2xl overflow-hidden transition-shadow duration-200 hover:shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
      {/* ── Day Header ── */}
      <button
        type="button"
        onClick={() => setIsOpen((o) => !o)}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-[#F8F8F8] transition-colors"
      >
        <div className="flex items-center gap-3">
          {/* Day number pill */}
          <span className="w-9 h-9 rounded-xl bg-[#111111] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {dayPlan.day}
          </span>
          <div>
            <h3 className="font-semibold text-[#111111] text-sm sm:text-base leading-tight">
              {dayPlan.title}
            </h3>
            <p className="text-xs text-[#666666] mt-0.5">
              {totalActivities} activities · 3 time slots
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-3 text-xs text-[#999999]">
            <span>🌅 {dayPlan.morning.length}</span>
            <span>☀️ {dayPlan.afternoon.length}</span>
            <span>🌙 {dayPlan.evening.length}</span>
          </div>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className={`text-[#666666] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </button>

      {/* ── Expanded Content ── */}
      {isOpen && (
        <div className="border-t border-[#E5E5E5] p-5">
          {isEditing ? (
            /* ──── EDIT MODE ──── */
            <div className="space-y-5">
              <Input
                label="Day Title"
                value={editedPlan.title}
                onChange={(e) => setEditedPlan({ ...editedPlan, title: e.target.value })}
              />

              {TIME_SLOTS.map(({ key, label, icon }) => (
                <div key={key}>
                  <p className="text-sm font-medium text-[#111111] mb-2">
                    {icon} {label} Activities
                  </p>
                  <div className="space-y-2">
                    {editedPlan[key].map((line, idx) => (
                      <div key={idx} className="flex gap-2">
                        <Input
                          value={line}
                          onChange={(e) => updateActivityLine(key, idx, e.target.value)}
                          placeholder={`${label} activity ${idx + 1}`}
                        />
                        <button
                          type="button"
                          onClick={() => removeActivityLine(key, idx)}
                          className="flex-shrink-0 w-9 h-9 mt-0.5 rounded-lg border border-[#E5E5E5] text-[#666666] hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-colors flex items-center justify-center text-xs"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addActivityLine(key)}
                      className="text-xs text-[#666666] hover:text-[#111111] transition-colors flex items-center gap-1 mt-1 underline underline-offset-2"
                    >
                      + Add {label} Activity
                    </button>
                  </div>
                </div>
              ))}

              <Input
                label="Travel Tips"
                value={editedPlan.tips}
                onChange={(e) => setEditedPlan({ ...editedPlan, tips: e.target.value })}
                hint="A short practical tip for this day"
              />

              <div className="flex gap-3 pt-2">
                <Button variant="primary" onClick={handleSave} isLoading={isUpdating}>
                  Save Changes
                </Button>
                <Button variant="ghost" onClick={handleCancel}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            /* ──── VIEW MODE ──── */
            <div className="space-y-4">
              {/* Time slot grid */}
              <div className="grid sm:grid-cols-3 gap-3">
                {TIME_SLOTS.map(({ key, label, icon, bgClass }) => (
                  <div key={key} className={`rounded-xl border p-4 ${bgClass}`}>
                    <p className="text-xs font-semibold text-[#666666] uppercase tracking-wider mb-3">
                      {icon} {label}
                    </p>
                    {dayPlan[key].length > 0 ? (
                      <ul className="space-y-2">
                        {dayPlan[key].map((activity, i) => (
                          <li key={i} className="flex gap-2 text-sm text-[#111111]">
                            <span className="mt-0.5 flex-shrink-0 w-4 h-4 rounded-full bg-[#F3F3F3] border border-[#E5E5E5] flex items-center justify-center text-[10px] font-bold text-[#666666]">
                              {i + 1}
                            </span>
                            <span className="leading-snug">{activity}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-xs text-[#999999] italic">No activities planned</p>
                    )}
                  </div>
                ))}
              </div>

              {/* Travel Tips */}
              {dayPlan.tips && (
                <div className="flex gap-3 items-start bg-[#FFFBEB] border border-[#FDE68A] rounded-xl p-4">
                  <span className="text-base flex-shrink-0">💡</span>
                  <div>
                    <p className="text-xs font-semibold text-[#D97706] uppercase tracking-wider mb-1">
                      Travel Tip
                    </p>
                    <p className="text-sm text-[#92400E] leading-relaxed">{dayPlan.tips}</p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2 pt-1">
                <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                  Edit Day
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onRegenerate}
                  isLoading={isRegenerating}
                >
                  Regenerate with AI
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
