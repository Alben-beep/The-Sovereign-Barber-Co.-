import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Calendar,
  Clock,
  Scissors,
  CheckCircle2,
  DollarSign,
  Users,
  Search,
  Filter,
} from 'lucide-react';
import { Appointment } from '../types';

export const StaffDashboardModal: React.FC = () => {
  const {
    isStaffDashboardOpen,
    closeStaffDashboard,
    appointments,
    markAppointmentStatus,
    barbers,
    services,
    getBarberById,
    getServiceById,
  } = useApp();

  const [selectedBarberFilter, setSelectedBarberFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  if (!isStaffDashboardOpen) return null;

  // Filtered appointments
  const filteredAppointments = appointments.filter((apt) => {
    if (selectedBarberFilter !== 'all' && apt.barberId !== selectedBarberFilter) return false;
    if (statusFilter !== 'all' && apt.status !== statusFilter) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matchName = apt.customerName.toLowerCase().includes(term);
      const matchPhone = apt.customerPhone.includes(term);
      const matchRef = apt.id.toLowerCase().includes(term);
      if (!matchName && !matchPhone && !matchRef) return false;
    }
    return true;
  });

  // Calculate metrics
  const totalRevenue = appointments
    .filter((a) => a.status === 'completed' || a.status === 'confirmed')
    .reduce((sum, a) => sum + a.totalPrice, 0);

  const completedCount = appointments.filter((a) => a.status === 'completed').length;
  const pendingCount = appointments.filter((a) => a.status === 'confirmed').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl max-h-[92vh] bg-stone-900 border border-stone-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-stone-950 via-stone-900 to-stone-950 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Scissors className="w-5 h-5 rotate-45" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif-vintage text-lg font-bold text-white tracking-wide">
                  BARBER DISPATCH & APPOINTMENT MANAGER
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  Staff View
                </span>
              </div>
              <p className="text-xs text-stone-400">
                Live chair board, check-ins, service status updates, and revenue tracking.
              </p>
            </div>
          </div>

          <button
            onClick={closeStaffDashboard}
            className="p-2 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Metrics Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-stone-950/60 border-b border-stone-800 text-xs">
          <div className="p-3 rounded-xl bg-stone-900/80 border border-stone-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <DollarSign className="w-5 h-5 text-amber-400" />
              <div>
                <p className="text-stone-400 font-medium">Booked Revenue</p>
                <p className="text-base font-extrabold text-white">₱{totalRevenue}.00</p>
              </div>
            </div>
            <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-950/50 px-2 py-0.5 rounded">
              Active
            </span>
          </div>

          <div className="p-3 rounded-xl bg-stone-900/80 border border-stone-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Calendar className="w-5 h-5 text-amber-400" />
              <div>
                <p className="text-stone-400 font-medium">Upcoming In Chair</p>
                <p className="text-base font-extrabold text-white">{pendingCount} clients</p>
              </div>
            </div>
            <span className="text-[10px] text-amber-400 font-semibold bg-amber-950/50 px-2 py-0.5 rounded">
              Pending
            </span>
          </div>

          <div className="p-3 rounded-xl bg-stone-900/80 border border-stone-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Users className="w-5 h-5 text-emerald-400" />
              <div>
                <p className="text-stone-400 font-medium">Completed Cuts</p>
                <p className="text-base font-extrabold text-white">{completedCount} cuts</p>
              </div>
            </div>
            <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-950/50 px-2 py-0.5 rounded">
              Processed
            </span>
          </div>
        </div>

        {/* Filters */}
        <div className="p-4 bg-stone-950/40 border-b border-stone-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-stone-500" />
            <input
              type="text"
              placeholder="Search by client name or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-1.5 text-stone-200 text-xs focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-stone-500" />
            <select
              value={selectedBarberFilter}
              onChange={(e) => setSelectedBarberFilter(e.target.value)}
              className="bg-stone-950 border border-stone-800 rounded-lg px-2.5 py-1.5 text-stone-200 text-xs focus:outline-none focus:border-amber-500"
            >
              <option value="all">All Barbers</option>
              {barbers.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-stone-950 border border-stone-800 rounded-lg px-2.5 py-1.5 text-stone-200 text-xs focus:outline-none focus:border-amber-500"
            >
              <option value="all">All Statuses</option>
              <option value="confirmed">Confirmed / Upcoming</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Appointments Table List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredAppointments.length === 0 ? (
            <div className="p-8 text-center text-stone-500 text-xs">
              No appointments match the selected filters.
            </div>
          ) : (
            filteredAppointments.map((apt) => {
              const barber = getBarberById(apt.barberId);
              const service = getServiceById(apt.serviceId);

              return (
                <div
                  key={apt.id}
                  className="p-4 rounded-xl bg-stone-950/70 border border-stone-800 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={barber?.avatar}
                      alt={barber?.name}
                      className="w-10 h-10 rounded-lg object-cover border border-stone-700 shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-bold text-white text-sm">{apt.customerName}</span>
                        <span className="text-[10px] text-stone-500 font-mono">
                          {apt.customerPhone}
                        </span>
                      </div>
                      <p className="text-stone-300">
                        {service?.name} with <span className="text-amber-400 font-medium">{barber?.name}</span>
                      </p>
                      {apt.notes && (
                        <p className="text-[11px] text-stone-400 italic mt-0.5">
                          Notes: "{apt.notes}"
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-4 border-t md:border-t-0 pt-2 md:pt-0 border-stone-800">
                    <div className="text-left md:text-right">
                      <p className="font-semibold text-white">
                        {apt.date} at {apt.timeSlot}
                      </p>
                      <p className="text-amber-400 font-bold">₱{apt.totalPrice}.00</p>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {apt.status === 'confirmed' ? (
                        <>
                          <button
                            onClick={() => markAppointmentStatus(apt.id, 'completed')}
                            className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-stone-950 border border-emerald-500/40 text-xs font-semibold flex items-center gap-1 transition-colors"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Complete</span>
                          </button>
                          <button
                            onClick={() => markAppointmentStatus(apt.id, 'cancelled')}
                            className="px-2.5 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 border border-red-800/40 text-red-300 text-xs transition-colors"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            apt.status === 'completed'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-stone-800 text-stone-400'
                          }`}
                        >
                          {apt.status}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
