import type { Metadata } from 'next';
import LoginForm from '@/components/auth/LoginForm';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Sign In — Trao',
  description: 'Sign in to your Trao account to access your AI-generated travel plans.',
};

export default function LoginPage() {
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
          <h1 className="text-2xl font-bold text-[#111111] tracking-tight">Welcome back</h1>
          <p className="text-[#666666] text-sm mt-1.5">
            Sign in to continue planning your adventures
          </p>
        </div>

        {/* Card */}
        <div className="bg-white border border-[#E5E5E5] rounded-2xl p-8 shadow-sm">
          <LoginForm />
        </div>

        <p className="text-center text-sm text-[#666666] mt-6">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-[#111111] font-semibold underline underline-offset-2 hover:opacity-70 transition-opacity">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
