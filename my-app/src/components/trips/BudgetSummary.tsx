'use client';

import { BudgetBreakdown } from '@/types';

interface BudgetSummaryProps {
  budget: BudgetBreakdown;
  numberOfDays: number;
}

const BUDGET_ITEMS = [
  { key: 'accommodation', label: 'Accommodation', icon: '🏨' },
  { key: 'food', label: 'Food & Dining', icon: '🍽️' },
  { key: 'transportation', label: 'Transportation', icon: '🚌' },
  { key: 'activities', label: 'Activities & Experiences', icon: '🎯' },
] as const;

export default function BudgetSummary({ budget, numberOfDays }: BudgetSummaryProps) {
  const perDay = Math.round(budget.total / Math.max(numberOfDays, 1));

  return (
    <div className="bg-white border border-[#E5E5E5] rounded-2xl overflow-hidden">
      {/* Total header */}
      <div className="p-8 border-b border-[#E5E5E5] bg-[#F8F8F8]">
        <p className="text-xs uppercase tracking-widest text-[#666666] font-medium mb-2">
          Estimated Total
        </p>
        <p className="text-5xl font-bold text-[#111111] tracking-tight">
          {budget.currency} {budget.total.toLocaleString()}
        </p>
        <p className="text-[#666666] text-sm mt-2">
          ≈ {budget.currency} {perDay.toLocaleString()} per day · {numberOfDays}{' '}
          {numberOfDays === 1 ? 'day' : 'days'}
        </p>
      </div>

      {/* Breakdown */}
      <div className="p-6 space-y-5">
        {BUDGET_ITEMS.map(({ key, label, icon }) => {
          const amount = budget[key];
          const percentage =
            budget.total > 0 ? Math.round((amount / budget.total) * 100) : 0;

          return (
            <div key={key}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-sm text-[#111111]">
                  <span className="text-base">{icon}</span>
                  <span className="font-medium">{label}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-[#999999] tabular-nums w-8 text-right">
                    {percentage}%
                  </span>
                  <span className="text-sm font-bold text-[#111111] tabular-nums">
                    {budget.currency} {amount.toLocaleString()}
                  </span>
                </div>
              </div>
              {/* Progress bar */}
              <div className="h-1.5 rounded-full bg-[#F3F3F3] overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#111111] transition-all duration-700 ease-out"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer note */}
      <div className="px-6 pb-6">
        <p className="text-xs text-[#999999] leading-relaxed border-t border-[#F3F3F3] pt-4">
          * AI-generated estimates based on your destination, budget type, and trip length.
          Actual costs may vary. Always carry a safety buffer of 10–15%.
        </p>
      </div>
    </div>
  );
}
