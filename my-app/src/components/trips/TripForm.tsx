'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/lib/axios';
import { BudgetType, CreateTripPayload, ApiResponse, Trip } from '@/types';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { getErrorMessage } from '@/context/AuthContext';

const INTEREST_OPTIONS = [
  { value: 'culture', label: 'Culture', desc: 'Museums & heritage' },
  { value: 'food', label: 'Food', desc: 'Culinary experiences' },
  { value: 'adventure', label: 'Adventure', desc: 'Outdoor thrills' },
  { value: 'nature', label: 'Nature', desc: 'Wildlife & landscapes' },
  { value: 'shopping', label: 'Shopping', desc: 'Markets & boutiques' },
  { value: 'relaxation', label: 'Relaxation', desc: 'Spa & wellness' },
];

const BUDGET_OPTIONS: { value: BudgetType; label: string; desc: string }[] = [
  {
    value: 'budget',
    label: 'Budget',
    desc: 'Hostels, street food & public transit',
  },
  {
    value: 'moderate',
    label: 'Moderate',
    desc: '4-star hotels, restaurants & taxis',
  },
  {
    value: 'luxury',
    label: 'Luxury',
    desc: '5-star resorts, fine dining & private transfers',
  },
];

export default function TripForm() {
  const router = useRouter();
  const [destination, setDestination] = useState('');
  const [numberOfDays, setNumberOfDays] = useState(5);
  const [budgetType, setBudgetType] = useState<BudgetType>('moderate');
  const [interests, setInterests] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Tick elapsed seconds while the AI is generating
  useEffect(() => {
    if (isLoading) {
      setElapsed(0);
      timerRef.current = setInterval(() => setElapsed((s) => s + 1), 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isLoading]);

  const toggleInterest = (value: string) => {
    setInterests((prev) =>
      prev.includes(value) ? prev.filter((i) => i !== value) : [...prev, value]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!destination.trim()) {
      setError('Please enter a destination');
      return;
    }
    if (interests.length === 0) {
      setError('Please select at least one interest');
      return;
    }

    setIsLoading(true);
    try {
      const payload: CreateTripPayload = {
        destination: destination.trim(),
        numberOfDays,
        budgetType,
        interests,
      };
      const { data } = await axiosInstance.post<ApiResponse<Trip>>('/trips', payload);
      if (data.success && data.data) {
        router.push(`/trips/${data.data._id}`);
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8" noValidate>
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-600 text-sm">
          ⚠ {error}
        </div>
      )}

      {/* Destination */}
      <div>
        <Input
          id="trip-destination"
          label="Destination"
          type="text"
          placeholder="e.g. Tokyo, Japan"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          required
          hint="Enter a city, country, or region"
        />
      </div>

      {/* Number of Days */}
      <div>
        <label className="text-sm font-medium text-[#111111] block mb-3">
          Number of Days
        </label>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setNumberOfDays((d) => Math.max(1, d - 1))}
            className="w-10 h-10 rounded-xl border border-[#E5E5E5] bg-white text-[#111111] hover:bg-[#F3F3F3] transition-colors text-xl font-bold flex items-center justify-center"
          >
            −
          </button>
          <span className="text-3xl font-bold text-[#111111] w-16 text-center tabular-nums">
            {numberOfDays}
          </span>
          <button
            type="button"
            onClick={() => setNumberOfDays((d) => Math.min(30, d + 1))}
            className="w-10 h-10 rounded-xl border border-[#E5E5E5] bg-white text-[#111111] hover:bg-[#F3F3F3] transition-colors text-xl font-bold flex items-center justify-center"
          >
            +
          </button>
          <span className="text-[#666666] text-sm">days (max 30)</span>
        </div>
        <input
          type="range"
          id="trip-days-slider"
          min={1}
          max={30}
          value={numberOfDays}
          onChange={(e) => setNumberOfDays(parseInt(e.target.value, 10))}
          className="w-full mt-4"
        />
      </div>

      {/* Budget Type */}
      <div>
        <label className="text-sm font-medium text-[#111111] block mb-3">
          Budget Type
        </label>
        {/* Segmented control */}
        <div className="flex rounded-xl border border-[#E5E5E5] bg-[#F8F8F8] p-1 gap-1">
          {BUDGET_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setBudgetType(opt.value)}
              className={`
                flex-1 py-2 px-3 rounded-lg text-sm font-semibold transition-all duration-200
                ${budgetType === opt.value
                  ? 'bg-[#111111] text-white shadow-sm'
                  : 'text-[#666666] hover:text-[#111111]'
                }
              `}
            >
              {opt.label}
            </button>
          ))}
        </div>
        {/* Description of selected */}
        <p className="text-xs text-[#666666] mt-2">
          {BUDGET_OPTIONS.find((o) => o.value === budgetType)?.desc}
        </p>
      </div>

      {/* Interests */}
      <div>
        <label className="text-sm font-medium text-[#111111] block mb-1">
          Interests
        </label>
        <p className="text-xs text-[#666666] mb-3">Select all that apply</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {INTEREST_OPTIONS.map((opt) => {
            const isSelected = interests.includes(opt.value);
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => toggleInterest(opt.value)}
                className={`
                  p-3 rounded-xl border-2 text-left transition-all duration-150
                  ${isSelected
                    ? 'border-[#111111] bg-[#111111] text-white'
                    : 'border-[#E5E5E5] bg-white text-[#666666] hover:border-[#D4D4D4] hover:bg-[#F3F3F3]'
                  }
                `}
                aria-pressed={isSelected}
              >
                <div className="font-semibold text-sm">{opt.label}</div>
                <div className={`text-xs mt-0.5 ${isSelected ? 'text-white/70' : 'text-[#999999]'}`}>
                  {opt.desc}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Submit */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        isLoading={isLoading}
        className="w-full"
      >
        {isLoading ? 'Generating Your Itinerary…' : 'Generate AI Itinerary →'}
      </Button>

      {/* AI status indicator — visible during generation */}
      {isLoading && (
        <div className="flex flex-col items-center gap-2 py-2 animate-pulse">
          <div className="flex items-center gap-2 text-[#666666] text-sm">
            <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-ping" />
            <span>AI is crafting your itinerary… ({elapsed}s)</span>
          </div>
          <p className="text-xs text-[#999999]">
            This usually takes 10–30 seconds. Please don&apos;t close the page.
          </p>
        </div>
      )}
    </form>
  );
}
