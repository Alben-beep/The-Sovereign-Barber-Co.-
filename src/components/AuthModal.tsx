import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Lock, Mail, User, Phone, Sparkles, Scissors, ShieldCheck, ArrowRight } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    authModalTab,
    closeAuthModal,
    openAuthModal,
    login,
    register,
    loginAsDemoUser,
  } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (authModalTab === 'login') {
      if (!email.trim()) {
        setError('Please enter your email address');
        return;
      }
      login(email, password);
    } else {
      if (!name.trim() || !email.trim() || !phone.trim()) {
        setError('Please complete all required fields');
        return;
      }
      if (password.length < 4) {
        setError('Password must be at least 4 characters');
        return;
      }
      register(name, email, phone, password);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-stone-900 border border-stone-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Top gold accent line */}
        <div className="h-1 bg-gradient-to-r from-amber-600 via-amber-400 to-amber-700" />

        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 text-stone-400 hover:text-white p-1 rounded-lg hover:bg-stone-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8">
          {/* Brand Crest */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-stone-950 font-bold shadow-lg shadow-amber-900/30">
              <Scissors className="w-5 h-5 rotate-45" />
            </div>
            <div>
              <h3 className="font-serif-vintage text-xl font-bold tracking-wide text-white">
                THE SOVEREIGN
              </h3>
              <p className="text-xs uppercase tracking-widest text-amber-500 font-medium">
                Customer Grooming Portal
              </p>
            </div>
          </div>

          {/* Quick Demo Login Banner */}
          <div className="mb-6 p-3.5 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
              <div className="text-left">
                <p className="text-xs font-semibold text-amber-200">Test with full history?</p>
                <p className="text-[11px] text-stone-400">Marcus Vance (4 past cuts, 1 upcoming)</p>
              </div>
            </div>
            <button
              type="button"
              onClick={loginAsDemoUser}
              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold text-xs rounded-lg transition-colors shrink-0 shadow"
            >
              One-Click Demo
            </button>
          </div>

          {/* Tab buttons */}
          <div className="flex p-1 bg-stone-950/60 rounded-xl border border-stone-800/80 mb-6">
            <button
              type="button"
              onClick={() => {
                setError('');
                openAuthModal('login');
              }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                authModalTab === 'login'
                  ? 'bg-amber-500 text-stone-950 shadow-md font-bold'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setError('');
                openAuthModal('register');
              }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                authModalTab === 'register'
                  ? 'bg-amber-500 text-stone-950 shadow-md font-bold'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Create Account
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-950/40 border border-red-800/50 text-red-300 text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {authModalTab === 'register' && (
              <>
                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1.5">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Julian Alexander"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-stone-950/70 border border-stone-800 rounded-xl text-stone-100 placeholder-stone-600 text-sm focus:outline-none focus:border-amber-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1.5">
                    Phone Number (for SMS reminders)
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
                    <input
                      type="tel"
                      required
                      placeholder="(555) 000-0000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-stone-950/70 border border-stone-800 rounded-xl text-stone-100 placeholder-stone-600 text-sm focus:outline-none focus:border-amber-500 transition-colors"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-stone-950/70 border border-stone-800 rounded-xl text-stone-100 placeholder-stone-600 text-sm focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-stone-300">Password</label>
                {authModalTab === 'login' && (
                  <span className="text-[11px] text-amber-500/80 hover:text-amber-400 cursor-pointer">
                    Forgot password?
                  </span>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-stone-950/70 border border-stone-800 rounded-xl text-stone-100 placeholder-stone-600 text-sm focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>
            </div>

            {authModalTab === 'register' && (
              <div className="flex items-center gap-2 p-3 bg-stone-950/50 rounded-xl border border-stone-800/80 text-[11px] text-stone-400">
                <ShieldCheck className="w-4 h-4 text-amber-500 shrink-0" />
                <span>
                  Signing up grants <strong>150 Loyalty Points</strong> + access to your permanent haircut recipe card.
                </span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-sm rounded-xl transition-all shadow-lg shadow-amber-900/30 flex items-center justify-center gap-2 mt-2"
            >
              <span>{authModalTab === 'login' ? 'Sign In to Dashboard' : 'Create Customer Account'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Footer perk checklist */}
          <div className="mt-6 pt-5 border-t border-stone-800/80 text-center">
            <p className="text-xs text-stone-400">
              {authModalTab === 'login' ? "Don't have an account yet?" : 'Already registered?'}
              <button
                type="button"
                onClick={() => openAuthModal(authModalTab === 'login' ? 'register' : 'login')}
                className="ml-2 font-semibold text-amber-400 hover:underline"
              >
                {authModalTab === 'login' ? 'Create an account' : 'Sign in here'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
