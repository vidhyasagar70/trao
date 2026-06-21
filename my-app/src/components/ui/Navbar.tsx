'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/ui/Button';
import { useState } from 'react';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-[#E5E5E5]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href={isAuthenticated ? '/dashboard' : '/'}
            className="flex items-center gap-2.5 group"
          >
            <div className="w-8 h-8 bg-[#111111] rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm">✈</span>
            </div>
            <span className="text-[#111111] font-bold text-lg tracking-tight">
              Trao
            </span>
          </Link>

          {/* Nav Links — authenticated */}
          {isAuthenticated && (
            <div className="hidden sm:flex items-center gap-1">
              <Link
                href="/dashboard"
                className="px-3 py-2 text-sm text-[#666666] hover:text-[#111111] hover:bg-[#F3F3F3] rounded-lg transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/trips/new"
                className="px-3 py-2 text-sm text-[#666666] hover:text-[#111111] hover:bg-[#F3F3F3] rounded-lg transition-colors"
              >
                Trips
              </Link>
            </div>
          )}

          {/* Nav Actions */}
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <>
                {/* Mobile: New Trip */}
                <div className="sm:hidden">
                  <Link href="/trips/new">
                    <Button variant="primary" size="sm">+ Trip</Button>
                  </Link>
                </div>

                {/* Desktop: New Trip */}
                <div className="hidden sm:block">
                  <Link href="/trips/new">
                    <Button variant="primary" size="sm">
                      + New Trip
                    </Button>
                  </Link>
                </div>

                <div className="flex items-center gap-2.5 pl-3 border-l border-[#E5E5E5]">
                  {/* User info */}
                  <div className="hidden sm:flex flex-col items-end">
                    <span className="text-sm font-medium text-[#111111] leading-tight">{user?.name}</span>
                    <span className="text-xs text-[#666666]">{user?.email}</span>
                  </div>
                  {/* Avatar */}
                  <div className="w-8 h-8 rounded-full bg-[#111111] flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    isLoading={isLoggingOut}
                  >
                    Logout
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">Sign In</Button>
                </Link>
                <Link href="/register">
                  <Button variant="primary" size="sm">Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
