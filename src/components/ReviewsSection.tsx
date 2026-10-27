import React from 'react';
import { useApp } from '../context/AppContext';
import { Star, ShieldCheck, MessageSquare, Plus } from 'lucide-react';

export const ReviewsSection: React.FC = () => {
  const { reviews, currentUser, openCustomerDashboard, openAuthModal } = useApp();

  return (
    <section id="reviews" className="py-20 bg-stone-950 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-3">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span>Client Testimonials</span>
            </div>
            <h2 className="font-serif-vintage text-3xl sm:text-4xl font-black text-white tracking-tight">
              VOICES FROM THE CHAIR
            </h2>
            <p className="text-stone-400 text-sm mt-2 max-w-xl">
              Real reviews submitted by verified clients after their haircuts, beard sculpts, and straight razor sessions.
            </p>
          </div>

          {/* Rating Summary Scorecard */}
          <div className="flex items-center gap-6 p-4 rounded-2xl bg-stone-900/80 border border-stone-800 shrink-0">
            <div className="text-center">
              <p className="font-serif-vintage text-3xl font-black text-white">4.96</p>
              <div className="flex text-amber-400 mt-1 justify-center">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-3.5 h-3.5 fill-amber-400" />
                ))}
              </div>
              <p className="text-[10px] text-stone-400 mt-1">Based on 850+ cuts</p>
            </div>

            <div className="h-12 w-px bg-stone-800" />

            <div className="text-left text-xs space-y-1 text-stone-300">
              <p className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>100% Certified Master Barbers</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span>Verified Client Reviews Only</span>
              </p>
            </div>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="p-6 rounded-2xl bg-stone-900/60 border border-stone-800 hover:border-amber-500/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex text-amber-400">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-[11px] text-stone-500">{rev.date}</span>
                </div>

                <p className="text-xs text-stone-300 leading-relaxed italic mb-4">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-4 border-t border-stone-800/80 flex items-center gap-3">
                <img
                  src={rev.avatar}
                  alt={rev.authorName}
                  className="w-10 h-10 rounded-full object-cover border border-amber-500/30"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className="font-bold text-white text-xs truncate">{rev.authorName}</p>
                    {rev.verified && (
                      <span title="Verified Client">
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-stone-400 truncate">
                    {rev.serviceName} • {rev.barberName}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Callout: Want to leave a review? */}
        <div className="mt-12 text-center p-6 rounded-2xl bg-stone-900/40 border border-dashed border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-left">
            <h4 className="text-sm font-bold text-white">Visited us recently?</h4>
            <p className="text-xs text-stone-400">
              Log into your customer dashboard to leave feedback for your barber and earn bonus loyalty points.
            </p>
          </div>

          <button
            onClick={() => {
              if (currentUser) {
                openCustomerDashboard('history');
              } else {
                openAuthModal('login');
              }
            }}
            className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold flex items-center gap-2 transition-colors shrink-0"
          >
            <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
            <span>Review Past Appointment</span>
          </button>
        </div>
      </div>
    </section>
  );
};
