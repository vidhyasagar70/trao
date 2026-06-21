import type { Metadata } from 'next';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import TripForm from '@/components/trips/TripForm';

export const metadata: Metadata = {
  title: 'Plan New Trip — Trao',
  description: 'Create a new AI-generated travel itinerary tailored to your preferences.',
};

export default function NewTripPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-[calc(100vh-4rem)] bg-[#F8F8F8]">
        <div className="max-w-2xl mx-auto px-4 py-12">
          {/* Header */}
          <div className="mb-8">
            <p className="text-xs uppercase tracking-widest text-[#666666] font-medium mb-3">
              AI Travel Planning
            </p>
            <h1 className="text-3xl font-bold text-[#111111] tracking-tight">
              Plan your next adventure
            </h1>
            <p className="text-[#666666] text-sm mt-2 leading-relaxed">
              Tell us about your dream trip and our AI will create a personalized itinerary in seconds.
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white border border-[#E5E5E5] rounded-2xl p-8 shadow-sm">
            <TripForm />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
