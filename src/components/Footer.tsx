import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Scissors, ShieldCheck, Mail, ArrowRight, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const { openBookingModal, openCustomerDashboard, openAuthModal, currentUser, showToast } =
    useApp();
  const [newsletterEmail, setNewsletterEmail] = useState('');

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    showToast('Subscribed! Check your inbox for your 10% grooming coupon.', 'success');
    setNewsletterEmail('');
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-stone-950 border-t border-stone-800/80 pt-16 pb-12 text-stone-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-stone-800">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-stone-950 shadow-md">
                <Scissors className="w-5 h-5 rotate-45" />
              </div>
              <div>
                <h3 className="font-serif-vintage text-lg font-bold text-white tracking-wide">
                  THE SOVEREIGN
                </h3>
                <p className="text-[10px] uppercase font-bold tracking-widest text-amber-500">
                  Barber Co. & Grooming Club
                </p>
              </div>
            </div>

            <p className="text-xs text-stone-400 max-w-sm leading-relaxed">
              Elevating the ritual of masculine grooming. Traditional scissor craftsmanship, straight-razor hot lather shaves, and modern texturing in an unapologetically refined atmosphere.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => openBookingModal()}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs rounded-xl transition-colors shadow flex items-center gap-2"
              >
                <span>Reserve Chair</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Grooming Menu</h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => scrollTo('services')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Signature Haircuts
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('services')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Beard Sculpting & Oils
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('services')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Hot Lather Straight Razor
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('services')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Scalp Detox Therapy
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('services')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Executive Combos
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Portal */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Client Portal</h4>
            <ul className="space-y-2">
              {currentUser ? (
                <>
                  <li>
                    <button
                      onClick={() => openCustomerDashboard('upcoming')}
                      className="hover:text-amber-400 transition-colors text-amber-400/90 font-medium"
                    >
                      Upcoming Appointments
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => openCustomerDashboard('history')}
                      className="hover:text-amber-400 transition-colors"
                    >
                      Past Service History & Receipts
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => openCustomerDashboard('loyalty')}
                      className="hover:text-amber-400 transition-colors"
                    >
                      Stamp Card & Rewards ({currentUser.loyaltyPoints} pts)
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => openCustomerDashboard('profile')}
                      className="hover:text-amber-400 transition-colors"
                    >
                      My Barber Haircut Formula
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <button
                      onClick={() => openAuthModal('login')}
                      className="hover:text-amber-400 transition-colors text-amber-400/90 font-medium"
                    >
                      Client Sign In
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => openAuthModal('register')}
                      className="hover:text-amber-400 transition-colors"
                    >
                      Register New Account
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => openAuthModal('login')}
                      className="hover:text-amber-400 transition-colors"
                    >
                      Track Past Cut History
                    </button>
                  </li>
                </>
              )}
              <li>
                <button
                  onClick={() => scrollTo('barbers')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Master Barbers
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('lookbook')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Style Lookbook
                </button>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              The Gentleman's Gazette
            </h4>
            <p className="text-xs text-stone-400">
              Subscribe for seasonal hair trends, beard maintenance regimens, and VIP holiday chair priority.
            </p>

            <form onSubmit={handleNewsletter} className="space-y-2">
              <div className="relative">
                <Mail className="w-3.5 h-3.5 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-stone-900 border border-stone-800 rounded-lg text-xs text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-500"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold text-xs rounded-lg transition-colors"
              >
                Join Private List
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone-500">
          <p>© {new Date().getFullYear()} The Sovereign Barber Co. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Sanitation Standards</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
