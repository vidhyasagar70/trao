'use client';

import { Hotel } from '@/types';

interface HotelCardProps {
  hotel: Hotel;
  isRecommended?: boolean;
}

export default function HotelCard({ hotel, isRecommended }: HotelCardProps) {
  return (
    <div
      className={`relative bg-white border rounded-2xl p-6 transition-all duration-200 hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 ${
        isRecommended ? 'border-[#111111]' : 'border-[#E5E5E5]'
      }`}
    >
      {isRecommended && (
        <span className="absolute -top-3 left-5 text-xs font-bold px-3 py-1 bg-[#111111] text-white rounded-full">
          Top Pick
        </span>
      )}

      <div className="flex items-start justify-between gap-3 mb-3 flex-wrap">
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-[#111111] text-lg leading-tight">{hotel.name}</h4>
          {hotel.address && (
            <p className="text-[#666666] text-sm mt-0.5 flex items-center gap-1">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="flex-shrink-0">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              {hotel.address}
            </p>
          )}
        </div>
        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          {/* Star Rating */}
          <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <svg
                key={i}
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill={i < hotel.rating ? '#D97706' : 'none'}
                stroke={i < hotel.rating ? '#D97706' : '#D4D4D4'}
                strokeWidth="2"
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            ))}
          </div>
          {/* Price */}
          {hotel.pricePerNight !== undefined && (
            <span className="text-[#0F766E] font-bold text-sm">
              ${hotel.pricePerNight}
              <span className="text-[#666666] font-normal text-xs">/night</span>
            </span>
          )}
        </div>
      </div>

      <p className="text-[#666666] text-sm mb-4 leading-relaxed">{hotel.description}</p>

      {/* Amenities */}
      {hotel.amenities && hotel.amenities.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {hotel.amenities.map((amenity) => (
            <span
              key={amenity}
              className="text-xs px-2.5 py-0.5 rounded-lg bg-[#F3F3F3] border border-[#E5E5E5] text-[#666666]"
            >
              {amenity}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
