import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Scissors,
  Calendar,
  Sparkles,
  ShieldCheck,
  Star,
  Clock,
  ArrowRight,
  Coffee,
  CheckCircle,
} from 'lucide-react';

export const Hero: React.FC = () => {
  const { openBookingModal, openCustomerDashboard, currentUser, openAuthModal } = useApp();

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-stone-950 pt-8 pb-16">
      {/* Background with moody texture and vignette */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=2000&q=80"
          alt="Barbershop Atmosphere"
          className="w-full h-full object-cover object-center opacity-25 filter brightness-75 contrast-125"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/70 to-stone-950/90" />
        {/* Subtle radial amber glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-amber-600/10 rounded-full blur-[120px] pointer-events-none" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headlines & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Live Status Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-stone-900/90 border border-amber-500/40 text-amber-400 text-xs font-semibold backdrop-blur-md shadow-lg shadow-amber-950/20">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Chairs Open Today • Master Barbers on Duty</span>
            </div>

            <h1 className="font-serif-vintage text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
              PRECISION CUTS. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500">
                TIMELESS CRAFT.
              </span>
            </h1>

            <p className="text-stone-300 text-base sm:text-lg max-w-xl font-normal leading-relaxed">
              Step into an elevated gentlemen's sanctuary. Bespoke scissor work, skin fades, hot lather straight-razor shaves, and artisanal beard grooming paired with complimentary bourbon and espresso.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <button
                onClick={() => openBookingModal()}
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-extrabold text-sm uppercase tracking-wider transition-all shadow-xl shadow-amber-950/40 flex items-center justify-center gap-2.5 group cursor-pointer"
              >
                <Scissors className="w-4 h-4 rotate-45 group-hover:rotate-90 transition-transform" />
                <span>Book Appointment</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              {currentUser ? (
                <button
                  onClick={() => openCustomerDashboard('history')}
                  className="px-6 py-4 rounded-xl bg-stone-900/90 hover:bg-stone-800 border border-stone-700 text-stone-200 font-bold text-sm transition-all flex items-center justify-center gap-2"
                >
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>View My Service History</span>
                </button>
              ) : (
                <button
                  onClick={() => openAuthModal('login')}
                  className="px-6 py-4 rounded-xl bg-stone-900/90 hover:bg-stone-800 border border-stone-700 text-stone-200 font-bold text-sm transition-all flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4 text-amber-400" />
                  <span>Customer Login & Records</span>
                </button>
              )}
            </div>

            {/* Social Proof & Metrics */}
            <div className="pt-6 border-t border-stone-800/80 grid grid-cols-3 gap-4 max-w-lg">
              <div>
                <p className="font-serif-vintage text-2xl font-bold text-white">4.9 ★</p>
                <p className="text-xs text-stone-400 mt-0.5">850+ Verified Reviews</p>
              </div>
              <div>
                <p className="font-serif-vintage text-2xl font-bold text-white">14+ Yrs</p>
                <p className="text-xs text-stone-400 mt-0.5">Heritage Tradition</p>
              </div>
              <div>
                <p className="font-serif-vintage text-2xl font-bold text-white">100%</p>
                <p className="text-xs text-stone-400 mt-0.5">Satisfaction Pledge</p>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Feature Showcase Card */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md bg-gradient-to-b from-stone-900/90 to-stone-950/90 border border-amber-500/30 rounded-2xl p-6 shadow-2xl backdrop-blur-md">
              {/* Gold Ribbon badge */}
              <div className="absolute -top-3.5 right-6 px-3.5 py-1 rounded-full bg-amber-500 text-stone-950 text-[11px] font-extrabold uppercase tracking-wider shadow-md">
                Master Barber Approved
              </div>

              {/* Service Hero Card */}
              <div className="relative rounded-xl overflow-hidden mb-5 aspect-[4/3] border border-stone-800">
                <img
                  src="https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=800&q=80"
                  alt="Barber Cutting Hair"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                      Signature Experience
                    </span>
                    <p className="text-sm font-bold">The Sovereign Executive Cut</p>
                  </div>
                  <span className="font-extrabold text-amber-300 text-lg">₱450</span>
                </div>
              </div>

              {/* Included Amenities Checklist */}
              <div className="space-y-2.5 text-xs text-stone-300 mb-6">
                <div className="flex items-center gap-2.5">
                  <CheckCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Complimentary craft single-barrel bourbon or espresso</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Dual steaming eucalyptus hot towels & scalp massage</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Straight razor neck cleanup with soothing alum block</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Digital service history & tailored haircut recipe tracking</span>
                </div>
              </div>

              {/* Action Banner */}
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-white">First-time client?</p>
                  <p className="text-[11px] text-amber-400/90">Get 150 bonus loyalty points today</p>
                </div>
                <button
                  onClick={() => openBookingModal('serv-1')}
                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold rounded-lg transition-colors"
                >
                  Select Cut
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
