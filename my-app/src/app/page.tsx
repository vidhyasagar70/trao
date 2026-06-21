import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Trao — AI-Powered Trip Planning',
  description:
    'Plan unforgettable trips with AI-generated itineraries, personalized hotel recommendations, and smart budget breakdowns.',
};

const FEATURES = [
  {
    icon: '◈',
    title: 'AI Itinerary Generation',
    desc: 'Get personalized day-by-day itineraries crafted by AI based on your interests and travel style.',
  },
  {
    icon: '⬡',
    title: 'Hotel Recommendations',
    desc: 'Curated accommodation options across budget, moderate, and luxury tiers for your destination.',
  },
  {
    icon: '◻',
    title: 'Smart Budget Planning',
    desc: 'Detailed budget breakdowns with per-category estimates to keep your trip financially on track.',
  },
  {
    icon: '◈',
    title: 'Editable Itineraries',
    desc: "Customize any day's activities, meals, and timings to perfectly match your preferences.",
  },
  {
    icon: '↻',
    title: 'Regenerate Any Day',
    desc: "Not satisfied? Regenerate a specific day's plan with a single click for fresh ideas.",
  },
  {
    icon: '◻',
    title: 'Secure & Private',
    desc: 'Your trips are private and isolated. JWT-secured accounts ensure only you can access your data.',
  },
];

const DESTINATIONS = [
  { name: 'Tokyo', flag: '🇯🇵', desc: 'Culture & Tech' },
  { name: 'Paris', flag: '🇫🇷', desc: 'Romance & Art' },
  { name: 'Bali', flag: '🇮🇩', desc: 'Nature & Zen' },
  { name: 'New York', flag: '🇺🇸', desc: 'Urban & Exciting' },
  { name: 'Rome', flag: '🇮🇹', desc: 'History & Food' },
  { name: 'Santorini', flag: '🇬🇷', desc: 'Views & Luxury' },
];

const STATS = [
  { value: '50K+', label: 'Trips Planned' },
  { value: '120+', label: 'Destinations' },
  { value: '4.9★', label: 'Avg. Rating' },
  { value: '2 min', label: 'To Generate' },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">

      {/* ── Hero ── */}
      <section className="px-4 pt-24 pb-20 max-w-[1280px] mx-auto">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-[#F3F3F3] border border-[#E5E5E5] rounded-full px-4 py-1.5 text-sm text-[#666666] mb-8 animate-in">
            <span className="w-1.5 h-1.5 bg-[#0F766E] rounded-full" />
            AI-Powered Travel Planning
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.08] tracking-tight text-[#111111] mb-6 animate-in">
            Plan your perfect
            <br />
            trip with AI
          </h1>

          <p className="text-lg sm:text-xl text-[#666666] max-w-xl mx-auto mb-10 leading-relaxed animate-in">
            Generate personalized itineraries, discover top hotels, and plan your budget — all powered by AI in seconds.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center animate-in">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-white bg-[#111111] hover:opacity-85 transition-opacity text-sm"
            >
              Start Planning for Free →
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-[#111111] bg-white border border-[#E5E5E5] hover:bg-[#F3F3F3] transition-colors text-sm"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-2 sm:grid-cols-4 gap-px bg-[#E5E5E5] border border-[#E5E5E5] rounded-2xl overflow-hidden max-w-3xl mx-auto">
          {STATS.map((stat) => (
            <div key={stat.label} className="bg-white px-6 py-5 text-center">
              <p className="text-2xl font-bold text-[#111111] tracking-tight">{stat.value}</p>
              <p className="text-xs text-[#666666] mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Popular Destinations ── */}
      <section className="px-4 py-16 bg-[#F8F8F8] border-y border-[#E5E5E5]">
        <div className="max-w-[1280px] mx-auto">
          <p className="text-center text-[#666666] text-xs uppercase tracking-widest mb-8 font-medium">
            Popular Destinations
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {DESTINATIONS.map((dest) => (
              <div
                key={dest.name}
                className="bg-white border border-[#E5E5E5] rounded-xl p-4 text-center hover:bg-[#F3F3F3] hover:border-[#D4D4D4] transition-all duration-200 cursor-default group"
              >
                <div className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-200">
                  {dest.flag}
                </div>
                <p className="font-semibold text-[#111111] text-sm">{dest.name}</p>
                <p className="text-xs text-[#666666] mt-0.5">{dest.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="px-4 py-24">
        <div className="max-w-[1280px] mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs uppercase tracking-widest text-[#666666] font-medium mb-4">Features</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#111111] tracking-tight mb-4">
              Everything you need to plan
              <br />a perfect trip
            </h2>
            <p className="text-[#666666] text-base max-w-lg mx-auto">
              From first click to airport departure — we&apos;ve got your travel planning covered.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((feat) => (
              <div
                key={feat.title}
                className="bg-white border border-[#E5E5E5] rounded-2xl p-6 hover:bg-[#F8F8F8] hover:border-[#D4D4D4] transition-all duration-200 group"
              >
                <div className="w-10 h-10 rounded-xl bg-[#F3F3F3] flex items-center justify-center mb-5 text-[#111111] font-bold text-lg group-hover:bg-[#111111] group-hover:text-white transition-colors duration-200">
                  {feat.icon}
                </div>
                <h3 className="text-base font-semibold text-[#111111] mb-2">{feat.title}</h3>
                <p className="text-[#666666] text-sm leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="px-4 py-20 bg-[#F8F8F8] border-y border-[#E5E5E5]">
        <div className="max-w-[1280px] mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-widest text-[#666666] font-medium mb-3">How it works</p>
            <h2 className="text-3xl font-bold text-[#111111] tracking-tight">Plan a trip in 3 steps</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[
              { step: '01', title: 'Set your destination', desc: 'Tell us where you want to go, how many days, your budget, and interests.' },
              { step: '02', title: 'AI generates your plan', desc: 'Our AI creates a full day-by-day itinerary with hotel picks and budget breakdown.' },
              { step: '03', title: 'Customize & explore', desc: 'Edit any activity, regenerate days, and export your finalized travel plan.' },
            ].map((item) => (
              <div key={item.step} className="bg-white border border-[#E5E5E5] rounded-2xl p-6">
                <span className="text-xs font-bold text-[#666666] tracking-widest">{item.step}</span>
                <h3 className="text-base font-semibold text-[#111111] mt-3 mb-2">{item.title}</h3>
                <p className="text-sm text-[#666666] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="px-4 py-24">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-[#111111] rounded-2xl p-12 sm:p-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight">
              Ready for your next adventure?
            </h2>
            <p className="text-white/60 mb-8 text-base">
              Join thousands of travelers planning smarter trips with AI.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-[#111111] bg-white hover:bg-[#F3F3F3] transition-colors text-sm"
            >
              Create Your Free Account →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-[#E5E5E5] px-4 py-8 bg-[#F8F8F8]">
        <div className="max-w-[1280px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 bg-[#111111] rounded-md flex items-center justify-center">
              <span className="text-white text-xs">✈</span>
            </div>
            <span className="text-sm font-semibold text-[#111111]">Trao</span>
          </div>
          <p className="text-[#666666] text-sm">
            © {new Date().getFullYear()} Trao. Built with Next.js & Express.
          </p>
        </div>
      </footer>

    </div>
  );
}
