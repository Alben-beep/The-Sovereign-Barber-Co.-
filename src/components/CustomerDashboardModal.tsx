import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Calendar,
  Clock,
  Scissors,
  Award,
  History,
  User as UserIcon,
  RotateCcw,
  Star,
  CheckCircle2,
  AlertTriangle,
  Plus,
  FileText,
  Download,
  CalendarPlus,
  Edit3,
  Sparkles,
  Phone,
  Mail,
} from 'lucide-react';
import { Appointment } from '../types';

export const CustomerDashboardModal: React.FC = () => {
  const {
    currentUser,
    isCustomerDashboardOpen,
    closeCustomerDashboard,
    dashboardActiveTab,
    setDashboardActiveTab,
    upcomingAppointments,
    pastAppointments,
    cancelAppointment,
    rescheduleAppointment,
    rebookPastAppointment,
    addReviewToAppointment,
    updateUserProfile,
    getBarberById,
    getServiceById,
    addOns,
    openBookingModal,
    showToast,
    barbers,
  } = useApp();

  // Review modal state
  const [reviewingAptId, setReviewingAptId] = useState<string | null>(null);
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewComment, setReviewComment] = useState<string>('');

  // Reschedule state
  const [reschedulingAptId, setReschedulingAptId] = useState<string | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState<string>('');
  const [rescheduleTime, setRescheduleTime] = useState<string>('02:30 PM');

  // Receipt modal state
  const [viewingReceiptApt, setViewingReceiptApt] = useState<Appointment | null>(null);

  // Profile edit state
  const [haircutNotes, setHaircutNotes] = useState<string>(currentUser?.haircutNotes || '');
  const [phone, setPhone] = useState<string>(currentUser?.phone || '');
  const [preferredBarberId, setPreferredBarberId] = useState<string>(
    currentUser?.preferredBarberId || 'barber-3'
  );

  if (!isCustomerDashboardOpen || !currentUser) return null;

  // Calendar .ics download generator
  const downloadCalendarEvent = (apt: Appointment) => {
    const service = getServiceById(apt.serviceId);
    const barber = getBarberById(apt.barberId);

    const title = `The Sovereign Barber: ${service?.name || 'Haircut'} with ${barber?.name || 'Barber'}`;
    const description = `Appointment at The Sovereign Barber Co. \nService: ${service?.name} (₱${apt.totalPrice}) \nBarber: ${barber?.name} \nAddress: 428 Heritage Blvd, Suite 104`;
    const location = '428 Heritage Blvd, Suite 104, Arts & Design District';

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//The Sovereign Barber Co//Appointment Schedule//EN
BEGIN:VEVENT
SUMMARY:${title}
DESCRIPTION:${description}
LOCATION:${location}
DTSTART:${apt.date.replace(/-/g, '')}T100000Z
DTEND:${apt.date.replace(/-/g, '')}T110000Z
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Sovereign-Barber-${apt.date}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Calendar event downloaded (.ics)', 'info');
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewingAptId) return;
    addReviewToAppointment(reviewingAptId, reviewRating, reviewComment);
    setReviewingAptId(null);
    setReviewComment('');
  };

  const handleRescheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reschedulingAptId || !rescheduleDate) {
      showToast('Please select a date to reschedule', 'error');
      return;
    }
    rescheduleAppointment(reschedulingAptId, rescheduleDate, rescheduleTime);
    setReschedulingAptId(null);
  };

  const handleSaveProfile = () => {
    updateUserProfile({
      phone,
      haircutNotes,
      preferredBarberId,
    });
  };

  const getAddOnNames = (addonIds: string[]) => {
    return addonIds
      .map((id) => addOns.find((a) => a.id === id)?.name)
      .filter(Boolean)
      .join(', ');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-stone-900 border border-stone-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header bar */}
        <div className="p-6 bg-gradient-to-r from-stone-950 via-stone-900 to-stone-950 border-b border-stone-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={
                  currentUser.avatar ||
                  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80'
                }
                alt={currentUser.name}
                className="w-14 h-14 rounded-2xl object-cover border-2 border-amber-500/50 shadow-md"
              />
              <span className="absolute -bottom-1 -right-1 p-1 bg-amber-500 text-stone-950 rounded-full">
                <Scissors className="w-3 h-3" />
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white font-serif-vintage tracking-wide">
                  {currentUser.name}
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  VIP Club Member
                </span>
              </div>
              <p className="text-xs text-stone-400 flex items-center gap-2 mt-0.5">
                <span>{currentUser.email}</span>
                <span>•</span>
                <span>Member since {currentUser.memberSince}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick loyalty points badge */}
            <div className="px-3.5 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-right">
              <p className="text-[10px] uppercase font-bold tracking-wider text-amber-400">
                Loyalty Balance
              </p>
              <p className="text-lg font-extrabold text-amber-200">
                {currentUser.loyaltyPoints} <span className="text-xs font-medium">pts</span>
              </p>
            </div>

            <button
              onClick={closeCustomerDashboard}
              className="p-2 text-stone-400 hover:text-white rounded-xl hover:bg-stone-800 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 border-b border-stone-800 bg-stone-950/60 flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setDashboardActiveTab('upcoming')}
            className={`flex items-center gap-2 py-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
              dashboardActiveTab === 'upcoming'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Upcoming Appointments ({upcomingAppointments.length})</span>
          </button>

          <button
            onClick={() => setDashboardActiveTab('history')}
            className={`flex items-center gap-2 py-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
              dashboardActiveTab === 'history'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Service History ({pastAppointments.length})</span>
          </button>

          <button
            onClick={() => setDashboardActiveTab('loyalty')}
            className={`flex items-center gap-2 py-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
              dashboardActiveTab === 'loyalty'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Rewards & Stamp Card</span>
          </button>

          <button
            onClick={() => setDashboardActiveTab('profile')}
            className={`flex items-center gap-2 py-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
              dashboardActiveTab === 'profile'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <UserIcon className="w-4 h-4" />
            <span>Hair Recipe & Notes</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: UPCOMING APPOINTMENTS */}
          {dashboardActiveTab === 'upcoming' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">Your Scheduled Bookings</h3>
                  <p className="text-xs text-stone-400">
                    Manage upcoming haircuts, reschedule times, or add to your personal calendar.
                  </p>
                </div>
                <button
                  onClick={() => {
                    closeCustomerDashboard();
                    openBookingModal();
                  }}
                  className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors shadow"
                >
                  <Plus className="w-4 h-4" />
                  <span>Book New Cut</span>
                </button>
              </div>

              {upcomingAppointments.length === 0 ? (
                <div className="p-12 text-center border border-dashed border-stone-800 rounded-2xl bg-stone-950/40">
                  <Calendar className="w-12 h-12 text-stone-600 mx-auto mb-3" />
                  <p className="text-stone-300 font-semibold mb-1">No upcoming appointments</p>
                  <p className="text-xs text-stone-500 max-w-sm mx-auto mb-4">
                    Ready for a sharp fade or fresh beard sculpt? Choose your favorite barber and book your chair in seconds.
                  </p>
                  <button
                    onClick={() => {
                      closeCustomerDashboard();
                      openBookingModal();
                    }}
                    className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs rounded-xl shadow-lg transition-colors"
                  >
                    Schedule an Appointment
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingAppointments.map((apt) => {
                    const barber = getBarberById(apt.barberId);
                    const service = getServiceById(apt.serviceId);
                    const addOnNames = getAddOnNames(apt.addOnIds);

                    return (
                      <div
                        key={apt.id}
                        className="p-5 rounded-2xl bg-stone-950/80 border border-stone-800/90 hover:border-amber-500/40 transition-all shadow-md relative overflow-hidden"
                      >
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-500" />

                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex items-start gap-4">
                            <img
                              src={
                                barber?.avatar ||
                                'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
                              }
                              alt={barber?.name}
                              className="w-14 h-14 rounded-xl object-cover border border-stone-700 shrink-0"
                            />
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                  Confirmed Chair
                                </span>
                                <span className="text-xs text-stone-500 font-mono">
                                  Ref #{apt.id.slice(-6).toUpperCase()}
                                </span>
                              </div>
                              <h4 className="text-base font-bold text-white">
                                {service?.name || 'Grooming Service'}
                              </h4>
                              <p className="text-xs text-stone-300 mt-0.5">
                                Master Barber: <span className="font-semibold text-amber-400">{barber?.name}</span>
                              </p>
                              {addOnNames && (
                                <p className="text-[11px] text-stone-400 mt-1">
                                  Add-ons: <span className="text-stone-300">{addOnNames}</span>
                                </p>
                              )}
                              {apt.notes && (
                                <p className="text-[11px] text-stone-500 italic mt-1">
                                  Note: "{apt.notes}"
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex flex-col md:items-end justify-between border-t md:border-t-0 pt-3 md:pt-0 border-stone-800">
                            <div className="text-left md:text-right mb-3">
                              <div className="flex items-center md:justify-end gap-1.5 text-amber-400 text-sm font-semibold">
                                <Calendar className="w-4 h-4" />
                                <span>{apt.date}</span>
                                <span>at</span>
                                <Clock className="w-4 h-4 ml-1" />
                                <span>{apt.timeSlot}</span>
                              </div>
                              <p className="text-xs text-stone-400 mt-0.5">
                                Duration: {apt.totalDuration} mins • Total: ₱{apt.totalPrice}
                              </p>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-wrap items-center gap-2">
                              <button
                                onClick={() => downloadCalendarEvent(apt)}
                                className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium flex items-center gap-1.5 transition-colors"
                                title="Add to Apple/Google/Outlook Calendar"
                              >
                                <CalendarPlus className="w-3.5 h-3.5 text-amber-400" />
                                <span>Calendar</span>
                              </button>

                              <button
                                onClick={() => {
                                  setReschedulingAptId(apt.id);
                                  setRescheduleDate(apt.date);
                                  setRescheduleTime(apt.timeSlot);
                                }}
                                className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium flex items-center gap-1.5 transition-colors"
                              >
                                <Clock className="w-3.5 h-3.5 text-amber-400" />
                                <span>Reschedule</span>
                              </button>

                              <button
                                onClick={() => cancelAppointment(apt.id)}
                                className="px-3 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 border border-red-800/40 text-red-300 text-xs font-medium flex items-center gap-1.5 transition-colors"
                              >
                                <X className="w-3.5 h-3.5" />
                                <span>Cancel</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: SERVICE HISTORY */}
          {dashboardActiveTab === 'history' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">Completed Grooming History</h3>
                  <p className="text-xs text-stone-400">
                    Full log of previous barbers, services, and receipts. Easily 1-click rebook your favorite cuts.
                  </p>
                </div>
              </div>

              {pastAppointments.length === 0 ? (
                <div className="p-10 text-center border border-dashed border-stone-800 rounded-2xl bg-stone-950/40">
                  <History className="w-12 h-12 text-stone-600 mx-auto mb-3" />
                  <p className="text-stone-300 font-semibold mb-1">No past service records yet</p>
                  <p className="text-xs text-stone-500">
                    Completed appointments and barber notes will appear here automatically.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pastAppointments.map((apt) => {
                    const barber = getBarberById(apt.barberId);
                    const service = getServiceById(apt.serviceId);
                    const addOnNames = getAddOnNames(apt.addOnIds);

                    return (
                      <div
                        key={apt.id}
                        className="p-5 rounded-2xl bg-stone-950/60 border border-stone-800/80 hover:border-stone-700 transition-all"
                      >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex items-start gap-4">
                            <img
                              src={
                                barber?.avatar ||
                                'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
                              }
                              alt={barber?.name}
                              className="w-12 h-12 rounded-xl object-cover border border-stone-700 shrink-0"
                            />
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span
                                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                    apt.status === 'completed'
                                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                      : 'bg-stone-800 text-stone-400'
                                  }`}
                                >
                                  {apt.status === 'completed' ? 'Completed' : 'Cancelled'}
                                </span>
                                <span className="text-xs text-stone-400 font-mono">
                                  {apt.date} • {apt.timeSlot}
                                </span>
                              </div>
                              <h4 className="text-base font-bold text-white">
                                {service?.name || 'Signature Haircut'}
                              </h4>
                              <p className="text-xs text-stone-300">
                                Crafted by: <span className="font-semibold text-amber-400">{barber?.name}</span>
                              </p>
                              {addOnNames && (
                                <p className="text-[11px] text-stone-400 mt-1">
                                  Add-ons: <span className="text-stone-300">{addOnNames}</span>
                                </p>
                              )}
                              {apt.reviewGiven && (
                                <div className="mt-2 p-2 bg-stone-900/90 rounded-lg border border-stone-800 text-[11px] text-stone-300 flex items-center gap-2">
                                  <div className="flex text-amber-400">
                                    {Array.from({ length: apt.ratingGiven || 5 }).map((_, i) => (
                                      <Star key={i} className="w-3 h-3 fill-amber-400" />
                                    ))}
                                  </div>
                                  <span className="italic">"{apt.reviewGiven}"</span>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex flex-col md:items-end justify-between border-t md:border-t-0 pt-3 md:pt-0 border-stone-800 gap-2">
                            <div className="text-left md:text-right">
                              <p className="text-base font-extrabold text-amber-300">
                                ₱{apt.totalPrice}.00
                              </p>
                              <p className="text-[11px] text-stone-500">
                                Receipt Ref #{apt.id.slice(-6).toUpperCase()}
                              </p>
                            </div>

                            <div className="flex flex-wrap items-center gap-2">
                              {/* 1-Click Rebook Button */}
                              <button
                                onClick={() => rebookPastAppointment(apt)}
                                className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-stone-950 border border-amber-500/40 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                                <span>Book This Again</span>
                              </button>

                              {/* View Receipt */}
                              <button
                                onClick={() => setViewingReceiptApt(apt)}
                                className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-medium flex items-center gap-1.5 transition-colors"
                              >
                                <FileText className="w-3.5 h-3.5 text-stone-400" />
                                <span>Receipt</span>
                              </button>

                              {/* Leave Review if not reviewed yet */}
                              {!apt.ratingGiven && apt.status === 'completed' && (
                                <button
                                  onClick={() => {
                                    setReviewingAptId(apt.id);
                                    setReviewRating(5);
                                    setReviewComment('');
                                  }}
                                  className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-amber-400 text-xs font-medium flex items-center gap-1.5 transition-colors"
                                >
                                  <Star className="w-3.5 h-3.5" />
                                  <span>Review</span>
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: LOYALTY & REWARDS */}
          {dashboardActiveTab === 'loyalty' && (
            <div className="space-y-6">
              {/* Digital Stamp Card */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-stone-950 via-stone-900 to-amber-950/30 border border-amber-500/30 shadow-xl">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400">
                      Gentlemen's Rewards
                    </span>
                    <h3 className="text-lg font-bold text-white font-serif-vintage">
                      The Sovereign 10-Cut Stamp Card
                    </h3>
                    <p className="text-xs text-stone-400">
                      Earn 1 haircut stamp per visit. Complete 10 stamps to receive a complimentary Sovereign Signature Cut!
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-amber-300">
                      {currentUser.totalVisits % 10} / 10
                    </span>
                    <p className="text-[11px] text-stone-400">Stamps Collected</p>
                  </div>
                </div>

                {/* 10 Stamp Circles Grid */}
                <div className="grid grid-cols-5 sm:grid-cols-10 gap-2.5 my-4">
                  {Array.from({ length: 10 }).map((_, index) => {
                    const isStamped = index < currentUser.totalVisits % 10;
                    const isTenth = index === 9;

                    return (
                      <div
                        key={index}
                        className={`aspect-square rounded-xl border flex flex-col items-center justify-center p-1 transition-all ${
                          isStamped
                            ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-md shadow-amber-900/20'
                            : isTenth
                            ? 'bg-stone-900/90 border-amber-500/40 text-amber-500/50'
                            : 'bg-stone-950/70 border-stone-800 text-stone-600'
                        }`}
                      >
                        {isStamped ? (
                          <Scissors className="w-5 h-5 text-amber-400 rotate-45" />
                        ) : isTenth ? (
                          <Sparkles className="w-5 h-5 text-amber-400/80" />
                        ) : (
                          <span className="text-xs font-mono font-bold text-stone-600">
                            #{index + 1}
                          </span>
                        )}
                        <span className="text-[9px] mt-1 font-semibold">
                          {isTenth ? 'FREE' : `#${index + 1}`}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <p className="text-[11px] text-stone-400 italic">
                  * Next stamp will be credited automatically upon completion of your next visit.
                </p>
              </div>

              {/* Redeemable Perks Catalog */}
              <div>
                <h4 className="text-sm font-bold text-white mb-3">Redeemable Point Rewards</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-4 rounded-xl bg-stone-950/60 border border-stone-800 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-xs font-semibold text-amber-400 mb-1">
                        <span>Steam Towel Upgrade</span>
                        <span>200 pts</span>
                      </div>
                      <p className="text-xs text-stone-400 mb-3">
                        Complimentary eucalyptus steam towel & scalp tonic infused finish ($15 value).
                      </p>
                    </div>
                    <button
                      disabled={currentUser.loyaltyPoints < 200}
                      onClick={() => showToast('Voucher applied! Will be redeemed at checkout.', 'success')}
                      className={`w-full py-2 rounded-lg text-xs font-semibold transition-all ${
                        currentUser.loyaltyPoints >= 200
                          ? 'bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold'
                          : 'bg-stone-800 text-stone-500 cursor-not-allowed'
                      }`}
                    >
                      {currentUser.loyaltyPoints >= 200 ? 'Apply Voucher' : 'Need 200 pts'}
                    </button>
                  </div>

                  <div className="p-4 rounded-xl bg-stone-950/60 border border-stone-800 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-xs font-semibold text-amber-400 mb-1">
                        <span>50% Off Beard Sculpt</span>
                        <span>350 pts</span>
                      </div>
                      <p className="text-xs text-stone-400 mb-3">
                        Half off full beard trim & razor lineup on any combo visit ($18 value).
                      </p>
                    </div>
                    <button
                      disabled={currentUser.loyaltyPoints < 350}
                      onClick={() => showToast('50% Off Beard Sculpt voucher applied to your profile!', 'success')}
                      className={`w-full py-2 rounded-lg text-xs font-semibold transition-all ${
                        currentUser.loyaltyPoints >= 350
                          ? 'bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold'
                          : 'bg-stone-800 text-stone-500 cursor-not-allowed'
                      }`}
                    >
                      {currentUser.loyaltyPoints >= 350 ? 'Apply Voucher' : 'Need 350 pts'}
                    </button>
                  </div>

                  <div className="p-4 rounded-xl bg-stone-950/60 border border-stone-800 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-xs font-semibold text-amber-400 mb-1">
                        <span>Free Signature Cut</span>
                        <span>500 pts</span>
                      </div>
                      <p className="text-xs text-stone-400 mb-3">
                        One 100% free Sovereign Signature Cut with your choice of master barber ($48 value).
                      </p>
                    </div>
                    <button
                      disabled={currentUser.loyaltyPoints < 500}
                      onClick={() => showToast('Free Cut voucher redeemed! Discount will be deducted.', 'success')}
                      className={`w-full py-2 rounded-lg text-xs font-semibold transition-all ${
                        currentUser.loyaltyPoints >= 500
                          ? 'bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold'
                          : 'bg-stone-800 text-stone-500 cursor-not-allowed'
                      }`}
                    >
                      {currentUser.loyaltyPoints >= 500 ? 'Claim Free Cut' : 'Need 500 pts'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: GROOMING PROFILE & HAIR RECIPE */}
          {dashboardActiveTab === 'profile' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-white">Your Haircut Recipe & Styling Notes</h3>
                <p className="text-xs text-stone-400">
                  Our barbers consult your profile recipe before every appointment so your fade and scissor lengths are consistently perfect.
                </p>
              </div>

              <div className="space-y-4 max-w-2xl">
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1.5 flex items-center justify-between">
                    <span>Barber Haircut Formula & Notes</span>
                    <span className="text-[11px] text-amber-500 font-normal">
                      Shared with your barber
                    </span>
                  </label>
                  <textarea
                    rows={4}
                    value={haircutNotes}
                    onChange={(e) => setHaircutNotes(e.target.value)}
                    placeholder="e.g. Skin fade with #1 guard blend. Textured 2 inches on top with scissors, slight fringe parted right. Sensitive skin on lower neck."
                    className="w-full p-3 bg-stone-950/70 border border-stone-800 rounded-xl text-stone-100 placeholder-stone-600 text-xs focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                      Phone Number (for SMS confirmation)
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full p-2.5 bg-stone-950/70 border border-stone-800 rounded-xl text-stone-100 text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                      Preferred Master Barber
                    </label>
                    <select
                      value={preferredBarberId}
                      onChange={(e) => setPreferredBarberId(e.target.value)}
                      className="w-full p-2.5 bg-stone-950/70 border border-stone-800 rounded-xl text-stone-100 text-xs focus:outline-none focus:border-amber-500"
                    >
                      {barbers.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.name} ({b.role})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSaveProfile}
                  className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs rounded-xl shadow-lg transition-colors flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Save Haircut Formula & Profile</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Reschedule Modal Overlay */}
        {reschedulingAptId && (
          <div className="absolute inset-0 z-20 bg-stone-950/95 backdrop-blur-sm p-6 flex flex-col justify-center items-center">
            <div className="max-w-md w-full bg-stone-900 border border-stone-700 rounded-2xl p-6 shadow-2xl">
              <h4 className="text-base font-bold text-white mb-2">Reschedule Your Appointment</h4>
              <p className="text-xs text-stone-400 mb-4">
                Select a new date and time for your chair booking.
              </p>

              <form onSubmit={handleRescheduleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1">New Date</label>
                  <input
                    type="date"
                    required
                    value={rescheduleDate}
                    onChange={(e) => setRescheduleDate(e.target.value)}
                    className="w-full p-2.5 bg-stone-950 border border-stone-800 rounded-xl text-stone-100 text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1">Time Slot</label>
                  <select
                    value={rescheduleTime}
                    onChange={(e) => setRescheduleTime(e.target.value)}
                    className="w-full p-2.5 bg-stone-950 border border-stone-800 rounded-xl text-stone-100 text-xs focus:outline-none focus:border-amber-500"
                  >
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="11:30 AM">11:30 AM</option>
                    <option value="01:15 PM">01:15 PM</option>
                    <option value="02:30 PM">02:30 PM</option>
                    <option value="04:00 PM">04:00 PM</option>
                    <option value="05:30 PM">05:30 PM</option>
                  </select>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs rounded-xl shadow"
                  >
                    Confirm Reschedule
                  </button>
                  <button
                    type="button"
                    onClick={() => setReschedulingAptId(null)}
                    className="px-4 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs rounded-xl"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Leave Review Overlay */}
        {reviewingAptId && (
          <div className="absolute inset-0 z-20 bg-stone-950/95 backdrop-blur-sm p-6 flex flex-col justify-center items-center">
            <div className="max-w-md w-full bg-stone-900 border border-stone-700 rounded-2xl p-6 shadow-2xl">
              <h4 className="text-base font-bold text-white mb-1">Rate Your Barber Experience</h4>
              <p className="text-xs text-stone-400 mb-4">
                Your feedback helps our master craftsmen maintain the highest standard.
              </p>

              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div className="flex items-center justify-center gap-2 py-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setReviewRating(star)}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          star <= reviewRating
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-stone-600'
                        }`}
                      />
                    </button>
                  ))}
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1">
                    Your Comments
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="How was your cut, steam towel, and styling?"
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    className="w-full p-2.5 bg-stone-950 border border-stone-800 rounded-xl text-stone-100 text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs rounded-xl shadow"
                  >
                    Submit Review
                  </button>
                  <button
                    type="button"
                    onClick={() => setReviewingAptId(null)}
                    className="px-4 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs rounded-xl"
                  >
                    Close
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Itemized Receipt Popover */}
        {viewingReceiptApt && (
          <div className="absolute inset-0 z-20 bg-stone-950/95 backdrop-blur-sm p-6 flex flex-col justify-center items-center">
            <div className="max-w-md w-full bg-stone-900 border border-amber-500/30 rounded-2xl p-6 shadow-2xl relative">
              <button
                onClick={() => setViewingReceiptApt(null)}
                className="absolute top-4 right-4 text-stone-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center pb-4 border-b border-stone-800 mb-4">
                <Scissors className="w-6 h-6 text-amber-500 mx-auto mb-1 rotate-45" />
                <h4 className="font-serif-vintage text-base font-bold text-white tracking-wider">
                  THE SOVEREIGN BARBER CO.
                </h4>
                <p className="text-[11px] text-stone-400">Official Service Receipt & Tax Invoice</p>
                <p className="text-[10px] text-stone-500 mt-1">
                  Receipt Ref #{viewingReceiptApt.id.slice(-8).toUpperCase()} • Date: {viewingReceiptApt.date}
                </p>
              </div>

              <div className="space-y-2 text-xs mb-4">
                <div className="flex justify-between text-stone-300">
                  <span>Client:</span>
                  <span className="font-semibold text-white">{viewingReceiptApt.customerName}</span>
                </div>
                <div className="flex justify-between text-stone-300">
                  <span>Master Barber:</span>
                  <span className="font-semibold text-white">
                    {getBarberById(viewingReceiptApt.barberId)?.name}
                  </span>
                </div>
                <div className="flex justify-between text-stone-300">
                  <span>Primary Service:</span>
                  <span className="font-semibold text-white">
                    {getServiceById(viewingReceiptApt.serviceId)?.name}
                  </span>
                </div>
                {viewingReceiptApt.addOnIds.length > 0 && (
                  <div className="flex justify-between text-stone-300">
                    <span>Add-ons:</span>
                    <span className="text-stone-400">
                      {getAddOnNames(viewingReceiptApt.addOnIds)}
                    </span>
                  </div>
                )}
                <div className="border-t border-stone-800 pt-2 flex justify-between font-bold text-sm text-white">
                  <span>Total Amount Paid:</span>
                  <span className="text-amber-400">₱{viewingReceiptApt.totalPrice}.00</span>
                </div>
                <div className="flex justify-between text-[11px] text-stone-500">
                  <span>Payment Method:</span>
                  <span>Credit Card / Cash In-Shop</span>
                </div>
              </div>

              <button
                onClick={() => {
                  showToast('Receipt saved to PDF / print preview', 'success');
                  setViewingReceiptApt(null);
                }}
                className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs rounded-xl shadow flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Save / Print Receipt</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
