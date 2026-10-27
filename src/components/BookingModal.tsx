import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Calendar,
  Clock,
  User,
  Scissors,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  ShieldCheck,
  CalendarPlus,
  ArrowRight,
  Info,
} from 'lucide-react';
import { AVAILABLE_TIME_SLOTS } from '../data/mockData';
import { Appointment } from '../types';

export const BookingModal: React.FC = () => {
  const {
    isBookingModalOpen,
    closeBookingModal,
    selectedServiceForBooking,
    selectedBarberForBooking,
    services,
    barbers,
    addOns,
    currentUser,
    bookAppointment,
    openCustomerDashboard,
    openAuthModal,
    showToast,
  } = useApp();

  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Form states
  const [serviceId, setServiceId] = useState<string>(services[0]?.id || 'serv-1');
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [barberId, setBarberId] = useState<string>(barbers[0]?.id || 'barber-1');
  
  // Date calculation: default to tomorrow
  const getTomorrowDateString = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  };

  const [date, setDate] = useState<string>(getTomorrowDateString());
  const [timeSlot, setTimeSlot] = useState<string>('10:30 AM');
  
  // Client info
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  // Confirmed appointment result
  const [confirmedApt, setConfirmedApt] = useState<Appointment | null>(null);

  // Synchronize initial selections when opened from external buttons (e.g. "Book with Matteo" or "Book Signature Cut")
  useEffect(() => {
    if (selectedServiceForBooking) {
      setServiceId(selectedServiceForBooking);
    }
    if (selectedBarberForBooking) {
      setBarberId(selectedBarberForBooking);
    }
    if (currentUser) {
      setName(currentUser.name);
      setEmail(currentUser.email);
      setPhone(currentUser.phone);
      if (currentUser.haircutNotes) {
        setNotes(currentUser.haircutNotes);
      }
      if (currentUser.preferredBarberId && !selectedBarberForBooking) {
        setBarberId(currentUser.preferredBarberId);
      }
    }
  }, [selectedServiceForBooking, selectedBarberForBooking, currentUser, isBookingModalOpen]);

  if (!isBookingModalOpen) return null;

  const currentService = services.find((s) => s.id === serviceId) || services[0];
  const currentBarber = barbers.find((b) => b.id === barberId) || barbers[0];

  const calculateAddonTotal = () => {
    return selectedAddOns.reduce((acc, id) => {
      const found = addOns.find((a) => a.id === id);
      return acc + (found ? found.price : 0);
    }, 0);
  };

  const calculateDurationTotal = () => {
    const base = currentService ? currentService.durationMinutes : 45;
    const addOnsDuration = selectedAddOns.reduce((acc, id) => {
      const found = addOns.find((a) => a.id === id);
      return acc + (found ? found.durationMinutes : 0);
    }, 0);
    return base + addOnsDuration;
  };

  const totalPrice = (currentService ? currentService.price : 450) + calculateAddonTotal();
  const totalDuration = calculateDurationTotal();

  const toggleAddOn = (id: string) => {
    setSelectedAddOns((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim()) {
      showToast('Please enter your contact details', 'error');
      return;
    }

    const apt = bookAppointment({
      serviceId,
      barberId,
      addOnIds: selectedAddOns,
      date,
      timeSlot,
      customerName: name,
      customerEmail: email,
      customerPhone: phone,
      notes,
    });

    setConfirmedApt(apt);
    setStep(5); // Confirmation screen
  };

  const handleDownloadCalendar = () => {
    if (!confirmedApt) return;
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//The Sovereign Barber Co//Appointment//EN
BEGIN:VEVENT
SUMMARY:The Sovereign Barber: ${currentService.name} with ${currentBarber.name}
DESCRIPTION:Service: ${currentService.name} (₱${confirmedApt.totalPrice})\\nLocation: 428 Heritage Blvd, Suite 104
LOCATION:428 Heritage Blvd, Suite 104, Arts & Design District
DTSTART:${confirmedApt.date.replace(/-/g, '')}T100000Z
DTEND:${confirmedApt.date.replace(/-/g, '')}T110000Z
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Sovereign-Cut-${confirmedApt.date}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Appointment added to calendar file (.ics)', 'info');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[92vh] bg-stone-900 border border-stone-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Top Gold Accent Bar */}
        <div className="h-1 bg-gradient-to-r from-amber-600 via-amber-400 to-amber-700" />

        {/* Modal Header */}
        <div className="px-6 py-4 bg-stone-950/70 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Scissors className="w-4 h-4 rotate-45" />
            </div>
            <div>
              <h3 className="font-serif-vintage text-base sm:text-lg font-bold text-white tracking-wide">
                BOOK A CHAIR APPOINTMENT
              </h3>
              <p className="text-[11px] text-stone-400">
                The Sovereign Barber Co. • Heritage Precision Grooming
              </p>
            </div>
          </div>

          <button
            onClick={closeBookingModal}
            className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Multi-step progress bar (if not on confirmation screen) */}
        {step < 5 && (
          <div className="px-6 py-3 bg-stone-950/40 border-b border-stone-800/80 flex items-center justify-between text-xs font-semibold">
            <div className="flex items-center gap-2">
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  step >= 1 ? 'bg-amber-500 text-stone-950' : 'bg-stone-800 text-stone-400'
                }`}
              >
                1
              </span>
              <span className={step === 1 ? 'text-amber-400' : 'text-stone-400 hidden sm:inline'}>
                Service
              </span>
            </div>

            <ChevronRight className="w-3.5 h-3.5 text-stone-600" />

            <div className="flex items-center gap-2">
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  step >= 2 ? 'bg-amber-500 text-stone-950' : 'bg-stone-800 text-stone-400'
                }`}
              >
                2
              </span>
              <span className={step === 2 ? 'text-amber-400' : 'text-stone-400 hidden sm:inline'}>
                Barber
              </span>
            </div>

            <ChevronRight className="w-3.5 h-3.5 text-stone-600" />

            <div className="flex items-center gap-2">
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  step >= 3 ? 'bg-amber-500 text-stone-950' : 'bg-stone-800 text-stone-400'
                }`}
              >
                3
              </span>
              <span className={step === 3 ? 'text-amber-400' : 'text-stone-400 hidden sm:inline'}>
                Date & Time
              </span>
            </div>

            <ChevronRight className="w-3.5 h-3.5 text-stone-600" />

            <div className="flex items-center gap-2">
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  step >= 4 ? 'bg-amber-500 text-stone-950' : 'bg-stone-800 text-stone-400'
                }`}
              >
                4
              </span>
              <span className={step === 4 ? 'text-amber-400' : 'text-stone-400 hidden sm:inline'}>
                Review & Confirm
              </span>
            </div>
          </div>
        )}

        {/* Step Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* STEP 1: SERVICE & ADD-ONS */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-bold text-white mb-1">Select Primary Service</h4>
                <p className="text-xs text-stone-400">
                  Each service includes a complimentary craft beverage and hot neck shave finish.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {services.map((srv) => {
                  const isSelected = srv.id === serviceId;
                  return (
                    <div
                      key={srv.id}
                      onClick={() => setServiceId(srv.id)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'bg-amber-500/10 border-amber-500 shadow-md shadow-amber-950/40 ring-1 ring-amber-500'
                          : 'bg-stone-950/60 border-stone-800 hover:border-stone-700'
                      }`}
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <h5 className="font-bold text-white text-sm">{srv.name}</h5>
                          <span className="text-base font-extrabold text-amber-400">
                            ₱{srv.price}
                          </span>
                        </div>
                        <p className="text-xs text-stone-400 line-clamp-2 mb-2">
                          {srv.description}
                        </p>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-stone-500 pt-2 border-t border-stone-800/60">
                        <span className="flex items-center gap-1 text-stone-400">
                          <Clock className="w-3 h-3 text-amber-500" />
                          {srv.durationMinutes} mins
                        </span>
                        {srv.popular && (
                          <span className="text-amber-400 font-semibold uppercase text-[10px] tracking-wider">
                            Popular Choice
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Add-ons selection */}
              <div>
                <h4 className="text-sm font-bold text-white mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Enhance Your Visit (Add-on Treatments)</span>
                </h4>
                <p className="text-xs text-stone-400 mb-3">
                  Tailored upgrades applied during your chair time.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {addOns.map((addon) => {
                    const isChecked = selectedAddOns.includes(addon.id);
                    return (
                      <div
                        key={addon.id}
                        onClick={() => toggleAddOn(addon.id)}
                        className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                          isChecked
                            ? 'bg-amber-500/15 border-amber-500/80 text-white'
                            : 'bg-stone-950/40 border-stone-800/80 text-stone-400 hover:border-stone-700'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {}}
                            className="rounded border-stone-700 text-amber-500 focus:ring-0 accent-amber-500 cursor-pointer"
                          />
                          <div>
                            <p className="text-xs font-semibold text-stone-200">{addon.name}</p>
                            <p className="text-[10px] text-stone-500">+{addon.durationMinutes} mins</p>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-amber-400">+₱{addon.price}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: BARBER SELECTION */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-bold text-white mb-1">Select Your Master Barber</h4>
                <p className="text-xs text-stone-400">
                  Every craftsman at The Sovereign brings years of precision training and artisanal expertise.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {barbers.map((barber) => {
                  const isSelected = barber.id === barberId;
                  return (
                    <div
                      key={barber.id}
                      onClick={() => setBarberId(barber.id)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all flex gap-3.5 ${
                        isSelected
                          ? 'bg-amber-500/10 border-amber-500 ring-1 ring-amber-500 shadow-lg shadow-amber-950/40'
                          : 'bg-stone-950/60 border-stone-800 hover:border-stone-700'
                      }`}
                    >
                      <img
                        src={barber.avatar}
                        alt={barber.name}
                        className="w-16 h-16 rounded-xl object-cover border border-stone-700 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1 mb-0.5">
                          <h5 className="font-bold text-white text-sm truncate">{barber.name}</h5>
                          <span className="text-xs text-amber-400 font-semibold shrink-0">
                            ★ {barber.rating}
                          </span>
                        </div>
                        <p className="text-xs text-amber-500 font-medium mb-1 truncate">
                          {barber.role}
                        </p>
                        <p className="text-[11px] text-stone-400 line-clamp-2 mb-2">
                          {barber.bio}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {barber.specialties.slice(0, 2).map((spec, i) => (
                            <span
                              key={i}
                              className="text-[9px] px-1.5 py-0.5 rounded bg-stone-900 border border-stone-800 text-stone-300"
                            >
                              {spec}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3: DATE & TIME */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-bold text-white mb-1">Choose Date & Time Slot</h4>
                <p className="text-xs text-stone-400">
                  Real-time chair availability with {currentBarber?.name}.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                    Appointment Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full sm:w-72 p-3 bg-stone-950 border border-stone-800 rounded-xl text-stone-100 text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-2">
                    Available Time Slots for {date}
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2.5">
                    {AVAILABLE_TIME_SLOTS.map((slot) => {
                      const isSelected = slot === timeSlot;
                      return (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setTimeSlot(slot)}
                          className={`py-2.5 px-2 rounded-xl text-xs font-semibold border transition-all text-center ${
                            isSelected
                              ? 'bg-amber-500 text-stone-950 border-amber-400 font-bold shadow-md shadow-amber-950/30'
                              : 'bg-stone-950/70 border-stone-800 text-stone-300 hover:border-amber-500/40 hover:text-white'
                          }`}
                        >
                          {slot}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: REVIEW & CONTACT DETAILS */}
          {step === 4 && (
            <form id="booking-submit-form" onSubmit={handleFinalSubmit} className="space-y-6">
              {/* Order Summary Card */}
              <div className="p-4 rounded-xl bg-stone-950/80 border border-amber-500/30 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-stone-800">
                  <span className="text-xs uppercase font-bold tracking-wider text-amber-400">
                    Booking Summary
                  </span>
                  <span className="text-xs font-bold text-white">
                    {date} at {timeSlot}
                  </span>
                </div>

                <div className="flex justify-between items-center text-xs">
                  <div>
                    <span className="font-semibold text-stone-200">{currentService.name}</span>
                    <span className="text-stone-500 ml-1">({currentService.durationMinutes} min)</span>
                  </div>
                  <span className="text-stone-300 font-bold">₱{currentService.price}</span>
                </div>

                {selectedAddOns.map((id) => {
                  const add = addOns.find((a) => a.id === id);
                  if (!add) return null;
                  return (
                    <div key={id} className="flex justify-between items-center text-xs text-stone-400">
                      <span>+ {add.name}</span>
                      <span>₱{add.price}</span>
                    </div>
                  );
                })}

                <div className="flex justify-between items-center text-xs text-stone-400">
                  <span>Selected Craftsman:</span>
                  <span className="font-semibold text-amber-300">{currentBarber.name}</span>
                </div>

                <div className="pt-2 border-t border-stone-800 flex justify-between items-center text-sm font-bold text-white">
                  <span>Total (Pay In-Shop):</span>
                  <span className="text-amber-400 text-base font-extrabold">₱{totalPrice}.00</span>
                </div>
              </div>

              {!currentUser && (
                <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <Info className="w-4 h-4 text-amber-400 shrink-0" />
                    <span className="text-stone-300">
                      Already have an account? Sign in to save to your service history.
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => openAuthModal('login')}
                    className="text-amber-400 font-bold hover:underline shrink-0"
                  >
                    Sign In
                  </button>
                </div>
              )}

              {/* Customer Contact Inputs */}
              <div className="space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-300 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Liam Sterling"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full p-2.5 bg-stone-950/70 border border-stone-800 rounded-xl text-stone-100 text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-300 mb-1">
                      Phone Number (SMS confirmation) *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="(555) 000-0000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full p-2.5 bg-stone-950/70 border border-stone-800 rounded-xl text-stone-100 text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2.5 bg-stone-950/70 border border-stone-800 rounded-xl text-stone-100 text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1 flex items-center justify-between">
                    <span>Special Notes or Desired Haircut Style</span>
                    <span className="text-[11px] text-stone-500 font-normal">Optional</span>
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Skin fade with razor hard part, or please use lavender aftershave"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full p-2.5 bg-stone-950/70 border border-stone-800 rounded-xl text-stone-100 placeholder-stone-600 text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </form>
          )}

          {/* STEP 5: CONFIRMATION SUCCESS */}
          {step === 5 && confirmedApt && (
            <div className="py-8 px-4 text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-xl">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-amber-500">
                  Appointment Confirmed
                </span>
                <h3 className="font-serif-vintage text-2xl font-bold text-white mt-1">
                  Your Chair Is Reserved
                </h3>
                <p className="text-xs text-stone-400 max-w-md mx-auto mt-1">
                  We've sent a booking confirmation and SMS reminder to{' '}
                  <strong className="text-stone-200">{confirmedApt.customerPhone}</strong>.
                </p>
              </div>

              {/* Receipt Reference card */}
              <div className="max-w-md mx-auto p-4 rounded-xl bg-stone-950/80 border border-stone-800 text-left space-y-2 text-xs">
                <div className="flex justify-between text-stone-400 pb-2 border-b border-stone-800">
                  <span>Reference ID:</span>
                  <span className="font-mono font-bold text-amber-400">
                    #{confirmedApt.id.slice(-8).toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between text-stone-300">
                  <span>Service:</span>
                  <span className="font-semibold text-white">{currentService.name}</span>
                </div>
                <div className="flex justify-between text-stone-300">
                  <span>Craftsman:</span>
                  <span className="font-semibold text-white">{currentBarber.name}</span>
                </div>
                <div className="flex justify-between text-stone-300">
                  <span>Date & Time:</span>
                  <span className="font-semibold text-amber-300">
                    {confirmedApt.date} at {confirmedApt.timeSlot}
                  </span>
                </div>
                <div className="flex justify-between text-stone-300 pt-2 border-t border-stone-800 font-bold">
                  <span>Total Amount:</span>
                  <span className="text-white">₱{confirmedApt.totalPrice}.00 (Pay in Shop)</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  onClick={handleDownloadCalendar}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <CalendarPlus className="w-4 h-4 text-amber-400" />
                  <span>Add to Calendar</span>
                </button>

                <button
                  onClick={() => {
                    closeBookingModal();
                    openCustomerDashboard('upcoming');
                  }}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold transition-colors shadow-lg flex items-center justify-center gap-2"
                >
                  <span>View in Customer Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        {step < 5 && (
          <div className="px-6 py-4 bg-stone-950/80 border-t border-stone-800 flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((s) => (s - 1) as any)}
                className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-medium flex items-center gap-1.5 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-[10px] uppercase font-bold text-stone-500">Estimated Total</p>
                <p className="text-sm font-bold text-amber-400">
                  ₱{totalPrice}.00 <span className="text-[11px] text-stone-400 font-normal">({totalDuration}m)</span>
                </p>
              </div>

              {step < 4 ? (
                <button
                  type="button"
                  onClick={() => setStep((s) => (s + 1) as any)}
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
                >
                  <span>Continue</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  form="booking-submit-form"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 text-xs font-extrabold transition-all shadow-lg flex items-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Confirm Chair Booking</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
