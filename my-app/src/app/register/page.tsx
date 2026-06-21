import type { Metadata } from 'next';
import RegisterForm from '@/components/auth/RegisterForm';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Create Account — Trao',
  description: 'Create your Trao account and start planning AI-powered travel itineraries.',
};

export default function RegisterPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-[#F8F8F8]">
      <div className="w-full max-w-md animate-in">
        {/* Brand */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-6">
            <div className="w-9 h-9 bg-[#111111] rounded-xl flex items-center justify-center">
              <span className="text-white text-base">✈</span>
            </div>
            <span className="text-xl font-bold text-[#111111] tracking-tight">Trao</span>
          </Link>
          <h1 className="text-2xl font-bold text-[#111111] tracking-tight">Create your account</h1>
          <p className="text-[#666666] text-sm mt-1.5">
            Start planning your AI-powered adventures
          </p>
        </div>

        {/* Card */}
        <div className="bg-white border border-[#E5E5E5] rounded-2xl p-8 shadow-sm">
          <RegisterForm />
        </div>

        <p className="text-center text-sm text-[#666666] mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-[#111111] font-semibold underline underline-offset-2 hover:opacity-70 transition-opacity">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
