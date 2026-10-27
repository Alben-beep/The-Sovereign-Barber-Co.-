/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ServicesSection } from './components/ServicesSection';
import { BarbersSection } from './components/BarbersSection';
import { LookbookSection } from './components/LookbookSection';
import { ReviewsSection } from './components/ReviewsSection';
import { LocationAndHours } from './components/LocationAndHours';
import { Footer } from './components/Footer';
import { BookingModal } from './components/BookingModal';
import { AuthModal } from './components/AuthModal';
import { CustomerDashboardModal } from './components/CustomerDashboardModal';
import { StaffDashboardModal } from './components/StaffDashboardModal';
import { ToastContainer } from './components/ToastContainer';
import { Calendar, Clock, Scissors, Award, ArrowRight } from 'lucide-react';

const CustomerStatusBar: React.FC = () => {
  const { currentUser, upcomingAppointments, openCustomerDashboard, openBookingModal } = useApp();

  if (!currentUser) return null;

  const nextApt = upcomingAppointments[0];

  return (
    <div className="bg-gradient-to-r from-amber-950/60 via-stone-900 to-amber-950/60 border-y border-amber-500/20 px-4 py-2.5">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-stone-300 font-medium">
            Welcome back, <strong className="text-white">{currentUser.name}</strong>
          </span>
          <span className="hidden sm:inline text-stone-600">|</span>
          <span className="hidden sm:inline text-amber-400 font-semibold">
            {currentUser.loyaltyPoints} Rewards Points Available
          </span>
        </div>

        <div className="flex items-center gap-3">
          {nextApt ? (
            <div className="flex items-center gap-2">
              <span className="text-stone-400">Next Chair:</span>
              <span className="text-white font-bold">
                {nextApt.date} at {nextApt.timeSlot}
              </span>
              <button
                onClick={() => openCustomerDashboard('upcoming')}
                className="ml-2 text-amber-400 hover:text-amber-300 font-bold hover:underline flex items-center gap-1"
              >
                <span>View Details</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-stone-400">No active appointment.</span>
              <button
                onClick={() => openBookingModal()}
                className="text-amber-400 hover:text-amber-300 font-bold hover:underline flex items-center gap-1"
              >
                <span>Book now</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          )}

          <button
            onClick={() => openCustomerDashboard('history')}
            className="px-2.5 py-1 rounded-md bg-stone-800 hover:bg-stone-700 text-stone-200 text-[11px] font-medium transition-colors"
          >
            Past Service History
          </button>
        </div>
      </div>
    </div>
  );
};

function MainAppContent() {
  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col selection:bg-amber-500 selection:text-stone-950">
      <Navbar />
      <CustomerStatusBar />
      <main className="flex-1">
        <Hero />
        <ServicesSection />
        <BarbersSection />
        <LookbookSection />
        <ReviewsSection />
        <LocationAndHours />
      </main>
      <Footer />

      {/* Global Interactive Modals & Notifications */}
      <BookingModal />
      <AuthModal />
      <CustomerDashboardModal />
      <StaffDashboardModal />
      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
