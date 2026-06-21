'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import TripCard from '@/components/trips/TripCard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Button from '@/components/ui/Button';
import axiosInstance from '@/lib/axios';
import { useAuth } from '@/context/AuthContext';
import { TripListItem, PaginatedResponse } from '@/types';
import { getErrorMessage } from '@/context/AuthContext';

export default function DashboardPage() {
  const { user } = useAuth();
  const [trips, setTrips] = useState<TripListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [total, setTotal] = useState(0);

  const fetchTrips = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const { data } = await axiosInstance.get<PaginatedResponse<TripListItem>>('/trips');
      if (data.success && data.data) {
        setTrips(data.data);
        setTotal(data.total);
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTrips();
  }, [fetchTrips]);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this trip? This action cannot be undone.')) return;
    try {
      await axiosInstance.delete(`/trips/${id}`);
      setTrips((prev) => prev.filter((t) => t._id !== id));
      setTotal((t) => t - 1);
    } catch (err) {
      alert(getErrorMessage(err));
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <ProtectedRoute>
      <div className="min-h-[calc(100vh-4rem)] bg-[#F8F8F8]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-10">

          {/* ── Header ── */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
            <div>
              <p className="text-sm text-[#666666] mb-1">{getGreeting()}</p>
              <h1 className="text-3xl font-bold text-[#111111] tracking-tight">
                {user?.name?.split(' ')[0]}&apos;s Trips
              </h1>
              <p className="text-[#666666] text-sm mt-1.5">
                {total} trip{total !== 1 ? 's' : ''} planned
              </p>
            </div>
            <Link href="/trips/new">
              <Button variant="primary" size="md">
                + Plan New Trip
              </Button>
            </Link>
          </div>

          {/* ── Quick Stats ── */}
          {!isLoading && trips.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
              {[
                { label: 'Total Trips', value: total },
                {
                  label: 'Total Days',
                  value: trips.reduce((s, t) => s + t.numberOfDays, 0),
                },
                {
                  label: 'Destinations',
                  value: new Set(trips.map((t) => t.destination)).size,
                },
                {
                  label: 'Budget Tracked',
                  value: `$${trips.reduce((s, t) => s + t.budget.total, 0).toLocaleString()}`,
                },
              ].map((stat) => (
                <div key={stat.label} className="bg-white border border-[#E5E5E5] rounded-2xl p-5">
                  <p className="text-xl font-bold text-[#111111] tracking-tight">{stat.value}</p>
                  <p className="text-xs text-[#666666] mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
          )}

          {/* ── Content ── */}
          {isLoading ? (
            <LoadingSpinner text="Loading your trips…" />
          ) : error ? (
            <div className="text-center py-16 bg-white border border-[#E5E5E5] rounded-2xl">
              <div className="text-4xl mb-4">⚠</div>
              <p className="text-red-600 mb-4 text-sm">{error}</p>
              <Button variant="outline" onClick={fetchTrips}>
                Try Again
              </Button>
            </div>
          ) : trips.length === 0 ? (
            <div className="text-center py-24 bg-white border border-[#E5E5E5] rounded-2xl">
              <div className="w-16 h-16 bg-[#F3F3F3] rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">🗺</span>
              </div>
              <h2 className="text-xl font-bold text-[#111111] mb-2">No trips yet</h2>
              <p className="text-[#666666] mb-8 max-w-sm mx-auto text-sm">
                Start planning your first AI-powered trip and get a full itinerary in seconds.
              </p>
              <Link href="/trips/new">
                <Button variant="primary" size="md">
                  Plan Your First Trip
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <p className="text-xs uppercase tracking-widest text-[#666666] font-medium mb-4">Your Trips</p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {trips.map((trip) => (
                  <TripCard key={trip._id} trip={trip} onDelete={handleDelete} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
