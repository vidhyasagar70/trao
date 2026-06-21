'use client';

export default function LoadingSpinner({ text = 'Loading…' }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20">
      <div className="relative w-10 h-10">
        <div className="absolute inset-0 border-2 border-[#E5E5E5] rounded-full" />
        <div className="absolute inset-0 border-2 border-[#111111] border-t-transparent rounded-full animate-spin" />
      </div>
      <p className="text-[#666666] text-sm">{text}</p>
    </div>
  );
}
