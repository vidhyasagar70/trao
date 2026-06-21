'use client';

import Link from 'next/link';
import { TripListItem } from '@/types';

interface TripCardProps {
  trip: TripListItem;
  onDelete?: (id: string) => void;
}

const budgetConfig = {
  budget: {
    label: 'Budget',
    className: 'bg-[#F0FDF4] text-[#0F766E] border-[#D1FAE5]',
  },
  moderate: {
    label: 'Moderate',
    className: 'bg-[#FFFBEB] text-[#D97706] border-[#FDE68A]',
  },
  luxury: {
    label: 'Luxury',
    className: 'bg-[#F3F3F3] text-[#111111] border-[#E5E5E5]',
  },
};

export default function TripCard({ trip, onDelete }: TripCardProps) {
  const createdDate = new Date(trip.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const cfg = budgetConfig[trip.budgetType];

  return (
    <div className="group bg-white border border-[#E5E5E5] rounded-2xl p-6 hover:border-[#D4D4D4] transition-all duration-200 hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)] hover:-translate-y-0.5">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0 pr-3">
          <h3 className="text-lg font-bold text-[#111111] leading-tight truncate">
            {trip.destination}
          </h3>
          <p className="text-[#666666] text-xs mt-1">Created {createdDate}</p>
        </div>
        <span
          className={`flex-shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full border ${cfg.className}`}
        >
          {cfg.label}
        </span>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-1.5 text-[#666666] text-sm">
          <span className="text-base">📅</span>
          <span>{trip.numberOfDays} {trip.numberOfDays === 1 ? 'day' : 'days'}</span>
        </div>
        <div className="flex items-center gap-1.5 text-[#666666] text-sm">
          <span className="text-base">💰</span>
          <span>${trip.budget.total.toLocaleString()} est.</span>
        </div>
      </div>

      {/* Interests */}
      <div className="flex flex-wrap gap-1.5 mb-5">
        {trip.interests.slice(0, 4).map((interest) => (
          <span
            key={interest}
            className="text-xs px-2.5 py-0.5 rounded-lg bg-[#F3F3F3] border border-[#E5E5E5] text-[#666666] capitalize"
          >
            {interest}
          </span>
        ))}
        {trip.interests.length > 4 && (
          <span className="text-xs px-2.5 py-0.5 rounded-lg bg-[#F3F3F3] border border-[#E5E5E5] text-[#666666]">
            +{trip.interests.length - 4} more
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-4 border-t border-[#E5E5E5]">
        <Link
          href={`/trips/${trip._id}`}
          className="flex-1 text-center py-2 rounded-xl text-sm font-semibold bg-[#111111] text-white hover:opacity-85 transition-opacity"
        >
          View Itinerary →
        </Link>
        {onDelete && (
          <button
            onClick={() => onDelete(trip._id)}
            className="p-2 rounded-xl border border-[#E5E5E5] text-[#666666] hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-all duration-200"
            aria-label={`Delete trip to ${trip.destination}`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
              <path d="M10 11v6M14 11v6" />
              <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
