'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import DayItinerary from '@/components/trips/DayItinerary';
import HotelCard from '@/components/trips/HotelCard';
import BudgetSummary from '@/components/trips/BudgetSummary';
import PackingChecklist from '@/components/trips/PackingChecklist';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Button from '@/components/ui/Button';
import axiosInstance from '@/lib/axios';
import { Trip, DayPlan, ApiResponse } from '@/types';
import { getErrorMessage } from '@/context/AuthContext';

type Tab = 'itinerary' | 'hotels' | 'budget' | 'packing';

const BUDGET_LABELS = {
  budget: 'Budget',
  moderate: 'Moderate',
  luxury: 'Luxury',
};

export default function TripDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('itinerary');
  const [updatingDay, setUpdatingDay] = useState<number | null>(null);
  const [regeneratingDay, setRegeneratingDay] = useState<number | null>(null);

  const fetchTrip = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    setError('');
    try {
      const { data } = await axiosInstance.get<ApiResponse<Trip>>(`/trips/${id}`);
      if (data.success && data.data) {
        setTrip(data.data);
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchTrip();
  }, [fetchTrip]);

  const handleUpdateDay = async (dayNumber: number, dayPlan: DayPlan): Promise<void> => {
    setUpdatingDay(dayNumber);
    try {
      const { data } = await axiosInstance.put<ApiResponse<Trip>>(
        `/trips/${id}/day/${dayNumber}`,
        { dayPlan }
      );
      if (data.success && data.data) setTrip(data.data);
    } catch (err) {
      alert(getErrorMessage(err));
    } finally {
      setUpdatingDay(null);
    }
  };

  const handleRegenerateDay = async (dayNumber: number): Promise<void> => {
    setRegeneratingDay(dayNumber);
    try {
      const { data } = await axiosInstance.post<ApiResponse<Trip>>(
        `/trips/${id}/day/${dayNumber}/regenerate`
      );
      if (data.success && data.data) setTrip(data.data);
    } catch (err) {
      alert(getErrorMessage(err));
    } finally {
      setRegeneratingDay(null);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this trip? This cannot be undone.')) return;
    try {
      await axiosInstance.delete(`/trips/${id}`);
      router.push('/dashboard');
    } catch (err) {
      alert(getErrorMessage(err));
    }
  };

  const TABS: { key: Tab; label: string }[] = [
    { key: 'itinerary', label: 'Itinerary' },
    { key: 'hotels', label: 'Hotels' },
    { key: 'budget', label: 'Budget' },
    { key: 'packing', label: 'Packing' },
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-[calc(100vh-4rem)] bg-[#F8F8F8]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
          {isLoading ? (
            <LoadingSpinner text="Generating your AI itinerary…" />
          ) : error ? (
            <div className="text-center py-16 bg-white border border-[#E5E5E5] rounded-2xl">
              <p className="text-red-600 mb-4 text-sm">{error}</p>
              <div className="flex gap-3 justify-center">
                <Button variant="outline" onClick={fetchTrip}>Retry</Button>
                <Link href="/dashboard">
                  <Button variant="ghost">← Dashboard</Button>
                </Link>
              </div>
            </div>
          ) : trip ? (
            <>
              {/* ── Trip Header ── */}
              <div className="mb-8">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm mb-4">
                  <Link href="/dashboard" className="text-[#666666] hover:text-[#111111] transition-colors">
                    Dashboard
                  </Link>
                  <span className="text-[#D4D4D4]">/</span>
                  <span className="text-[#111111] font-medium">{trip.destination}</span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div>
                    <h1 className="text-4xl font-bold text-[#111111] tracking-tight">
                      {trip.destination}
                    </h1>

                    {/* Meta chips */}
                    <div className="flex flex-wrap items-center gap-2 mt-3">
                      <span className="text-xs px-2.5 py-1 rounded-full bg-[#F3F3F3] border border-[#E5E5E5] text-[#666666]">
                        {trip.numberOfDays} {trip.numberOfDays === 1 ? 'day' : 'days'}
                      </span>
                      <span className="text-xs px-2.5 py-1 rounded-full bg-[#F3F3F3] border border-[#E5E5E5] text-[#666666]">
                        {BUDGET_LABELS[trip.budgetType]}
                      </span>
                      <span className="text-xs px-2.5 py-1 rounded-full bg-[#F0FDF4] border border-[#D1FAE5] text-[#0F766E] font-semibold">
                        ${trip.budget.total.toLocaleString()} est.
                      </span>
                    </div>

                    {/* AI Source Badge */}
                    {trip.generatedBy === 'gemini' ? (
                      <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F0FDF4] border border-[#D1FAE5] text-[#0F766E] text-xs font-medium">
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0F766E] opacity-60" />
                          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#0F766E]" />
                        </span>
                        Generated by Gemini AI
                        <span className="text-[#0F766E]/60 font-normal">({trip.generationModel})</span>
                      </div>
                    ) : (
                      <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FFFBEB] border border-[#FDE68A] text-[#D97706] text-xs font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#D97706] flex-shrink-0" />
                        Rule-Based Engine
                        <span className="text-[#D97706]/60 font-normal">(Gemini unavailable)</span>
                      </div>
                    )}

                    {/* Interest tags */}
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {trip.interests.map((interest) => (
                        <span
                          key={interest}
                          className="text-xs px-2.5 py-0.5 rounded-lg bg-[#F3F3F3] border border-[#E5E5E5] text-[#666666] capitalize"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>

                  <Button variant="danger" size="sm" onClick={handleDelete}>
                    Delete Trip
                  </Button>
                </div>
              </div>

              {/* ── Tabs ── */}
              <div className="flex border-b border-[#E5E5E5] mb-8 gap-0">
                {TABS.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`
                      flex-shrink-0 px-5 py-3 text-sm font-semibold
                      transition-all duration-150 border-b-2 -mb-px
                      ${activeTab === tab.key
                        ? 'text-[#111111] border-[#111111]'
                        : 'text-[#666666] border-transparent hover:text-[#111111] hover:border-[#D4D4D4]'
                      }
                    `}
                  >
                    {tab.label}
                    {tab.key === 'packing' && trip.packingChecklist?.length > 0 && (
                      <span className="ml-2 text-xs bg-[#F3F3F3] text-[#666666] px-1.5 py-0.5 rounded-full border border-[#E5E5E5]">
                        {trip.packingChecklist.length}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* ── Tab Content ── */}
              <div className="animate-in">
                {/* Itinerary Tab */}
                {activeTab === 'itinerary' && (
                  <div className="space-y-3">
                    <p className="text-[#666666] text-sm mb-5 leading-relaxed">
                      AI-generated itinerary for{' '}
                      <span className="text-[#111111] font-medium">{trip.destination}</span>.{' '}
                      Click any day to expand, edit activities, or regenerate with fresh AI ideas.
                    </p>
                    {trip.itinerary.map((day) => (
                      <DayItinerary
                        key={day.day}
                        dayPlan={day}
                        onUpdate={(updated) => handleUpdateDay(day.day, updated)}
                        onRegenerate={() => handleRegenerateDay(day.day)}
                        isUpdating={updatingDay === day.day}
                        isRegenerating={regeneratingDay === day.day}
                      />
                    ))}
                  </div>
                )}

                {/* Hotels Tab */}
                {activeTab === 'hotels' && (
                  <div className="space-y-4">
                    <p className="text-[#666666] text-sm mb-5">
                      Recommended accommodations for your{' '}
                      <span className="font-medium text-[#111111]">{BUDGET_LABELS[trip.budgetType].toLowerCase()}</span> trip to{' '}
                      <span className="font-medium text-[#111111]">{trip.destination}</span>.
                    </p>
                    {trip.hotels.map((hotel, i) => (
                      <HotelCard key={hotel.name} hotel={hotel} isRecommended={i === 0} />
                    ))}
                  </div>
                )}

                {/* Budget Tab */}
                {activeTab === 'budget' && (
                  <BudgetSummary budget={trip.budget} numberOfDays={trip.numberOfDays} />
                )}

                {/* Packing Tab */}
                {activeTab === 'packing' && (
                  <PackingChecklist items={trip.packingChecklist ?? []} />
                )}
              </div>
            </>
          ) : null}
        </div>
      </div>
    </ProtectedRoute>
  );
}
