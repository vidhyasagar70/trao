import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import Navbar from '@/components/ui/Navbar';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Trao — Premium AI Travel Planner',
  description:
    'Plan your perfect trip with AI-generated itineraries, hotel recommendations, and budget breakdowns. Smart travel planning made effortless.',
  keywords: 'travel planner, AI travel, itinerary generator, trip planning, travel AI',
  authors: [{ name: 'Trao' }],
  openGraph: {
    title: 'Trao — Premium AI Travel Planner',
    description: 'Plan your perfect trip with AI.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-white text-[#111111] antialiased min-h-screen">
        <AuthProvider>
          <Navbar />
          <main className="pt-16">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
