import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Scissors,
  User,
  Calendar,
  LogOut,
  Menu,
  X,
  History,
  Award,
  Sparkles,
  Shield,
  ChevronDown,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentUser,
    openAuthModal,
    logout,
    openBookingModal,
    openCustomerDashboard,
    openStaffDashboard,
    upcomingAppointments,
  } = useApp();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const scrollToSection = (id: string) => {
    setIsMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-stone-950/90 backdrop-blur-md border-b border-stone-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <div
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-stone-950 shadow-lg shadow-amber-900/30 group-hover:scale-105 transition-transform">
            <Scissors className="w-5 h-5 rotate-45" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-serif-vintage text-lg sm:text-xl font-black tracking-wider text-white">
                THE SOVEREIGN
              </span>
            </div>
            <span className="block text-[10px] uppercase font-bold tracking-[0.25em] text-amber-500">
              Barber Co. & Grooming Club
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-8 text-xs font-semibold uppercase tracking-wider text-stone-300">
          <button
            onClick={() => scrollToSection('services')}
            className="hover:text-amber-400 transition-colors"
          >
            Services & Cuts
          </button>
          <button
            onClick={() => scrollToSection('barbers')}
            className="hover:text-amber-400 transition-colors"
          >
            Master Barbers
          </button>
          <button
            onClick={() => scrollToSection('lookbook')}
            className="hover:text-amber-400 transition-colors"
          >
            Style Lookbook
          </button>
          <button
            onClick={() => scrollToSection('reviews')}
            className="hover:text-amber-400 transition-colors"
          >
            Client Reviews
          </button>
          <button
            onClick={() => scrollToSection('location')}
            className="hover:text-amber-400 transition-colors"
          >
            Hours & Location
          </button>
        </nav>

        {/* Right Action Bar */}
        <div className="flex items-center gap-3">
          {/* Staff View Toggle */}
          <button
            onClick={openStaffDashboard}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 border border-stone-800 text-[11px] font-semibold text-stone-400 hover:text-amber-400 transition-colors"
            title="Toggle Barbershop Staff Dispatch View"
          >
            <Shield className="w-3.5 h-3.5 text-amber-500" />
            <span>Staff View</span>
          </button>

          {/* User Account / Login Button */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-2 rounded-xl bg-stone-900/90 hover:bg-stone-800 border border-stone-800 transition-all text-left"
              >
                <img
                  src={
                    currentUser.avatar ||
                    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'
                  }
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-lg object-cover border border-amber-500/50"
                />
                <div className="hidden sm:block">
                  <p className="text-xs font-bold text-white leading-tight">
                    {currentUser.name.split(' ')[0]}
                  </p>
                  <p className="text-[10px] text-amber-400 font-semibold">
                    {currentUser.loyaltyPoints} pts
                  </p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-stone-400 hidden sm:block" />
              </button>

              {/* Dropdown Menu */}
              {isUserDropdownOpen && (
                <div
                  onMouseLeave={() => setIsUserDropdownOpen(false)}
                  className="absolute right-0 mt-2 w-56 bg-stone-900 border border-stone-800 rounded-xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2"
                >
                  <div className="px-3 py-2 border-b border-stone-800 mb-1">
                    <p className="text-xs font-bold text-white">{currentUser.name}</p>
                    <p className="text-[10px] text-stone-400 truncate">{currentUser.email}</p>
                  </div>

                  <button
                    onClick={() => {
                      setIsUserDropdownOpen(false);
                      openCustomerDashboard('upcoming');
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-stone-200 hover:bg-stone-800 transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-amber-400" />
                      <span>My Bookings</span>
                    </span>
                    {upcomingAppointments.length > 0 && (
                      <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-500 text-stone-950">
                        {upcomingAppointments.length}
                      </span>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      setIsUserDropdownOpen(false);
                      openCustomerDashboard('history');
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-stone-200 hover:bg-stone-800 transition-colors"
                  >
                    <History className="w-4 h-4 text-amber-400" />
                    <span>Service History & Receipts</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsUserDropdownOpen(false);
                      openCustomerDashboard('loyalty');
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-stone-200 hover:bg-stone-800 transition-colors"
                  >
                    <Award className="w-4 h-4 text-amber-400" />
                    <span>Loyalty Stamps ({currentUser.loyaltyPoints} pts)</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsUserDropdownOpen(false);
                      openCustomerDashboard('profile');
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-stone-200 hover:bg-stone-800 transition-colors"
                  >
                    <User className="w-4 h-4 text-amber-400" />
                    <span>Hair Recipe & Formula</span>
                  </button>

                  <div className="border-t border-stone-800 mt-1 pt-1">
                    <button
                      onClick={() => {
                        setIsUserDropdownOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-red-400 hover:bg-stone-800 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => openAuthModal('login')}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-700/80 text-xs font-bold text-stone-200 hover:text-white transition-all shadow"
            >
              <User className="w-3.5 h-3.5 text-amber-400" />
              <span>Sign In / Register</span>
            </button>
          )}

          {/* Book Appointment CTA */}
          <button
            onClick={() => openBookingModal()}
            className="px-4 sm:px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-extrabold text-xs tracking-wider uppercase transition-all shadow-lg shadow-amber-900/30 flex items-center gap-1.5"
          >
            <Scissors className="w-3.5 h-3.5 rotate-45" />
            <span className="hidden sm:inline">Book Chair</span>
            <span className="sm:hidden">Book</span>
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-stone-400 hover:text-white rounded-lg hover:bg-stone-900 transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-stone-950 border-b border-stone-800 px-6 py-5 space-y-4 animate-in slide-in-from-top duration-200">
          <div className="flex flex-col gap-3 text-sm font-semibold uppercase tracking-wider text-stone-300">
            <button
              onClick={() => scrollToSection('services')}
              className="text-left py-2 hover:text-amber-400 border-b border-stone-900"
            >
              Services & Cuts
            </button>
            <button
              onClick={() => scrollToSection('barbers')}
              className="text-left py-2 hover:text-amber-400 border-b border-stone-900"
            >
              Master Barbers
            </button>
            <button
              onClick={() => scrollToSection('lookbook')}
              className="text-left py-2 hover:text-amber-400 border-b border-stone-900"
            >
              Style Lookbook
            </button>
            <button
              onClick={() => scrollToSection('reviews')}
              className="text-left py-2 hover:text-amber-400 border-b border-stone-900"
            >
              Client Reviews
            </button>
            <button
              onClick={() => scrollToSection('location')}
              className="text-left py-2 hover:text-amber-400 border-b border-stone-900"
            >
              Hours & Location
            </button>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                openStaffDashboard();
              }}
              className="w-full py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-xs font-semibold text-stone-300 flex items-center justify-center gap-2"
            >
              <Shield className="w-4 h-4 text-amber-500" />
              <span>Shop Dispatch & Staff View</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
