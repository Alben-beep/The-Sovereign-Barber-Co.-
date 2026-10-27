import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Barber, Service, AddOnService, Appointment, LookbookItem, Review } from '../types';
import {
  BARBERS,
  SERVICES,
  ADD_ONS,
  LOOKBOOK,
  REVIEWS,
  INITIAL_DEMO_USER,
  INITIAL_APPOINTMENTS,
  AVAILABLE_TIME_SLOTS,
} from '../data/mockData';

interface BookingPayload {
  serviceId: string;
  barberId: string;
  addOnIds: string[];
  date: string;
  timeSlot: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  notes?: string;
}

interface ToastInfo {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface AppContextType {
  currentUser: User | null;
  barbers: Barber[];
  services: Service[];
  addOns: AddOnService[];
  lookbook: LookbookItem[];
  reviews: Review[];
  appointments: Appointment[];
  userAppointments: Appointment[];
  upcomingAppointments: Appointment[];
  pastAppointments: Appointment[];
  // Auth
  isAuthModalOpen: boolean;
  authModalTab: 'login' | 'register';
  openAuthModal: (tab?: 'login' | 'register') => void;
  closeAuthModal: () => void;
  login: (email: string, pass: string) => boolean;
  loginAsDemoUser: () => void;
  register: (name: string, email: string, phone: string, pass: string) => boolean;
  logout: () => void;
  updateUserProfile: (updates: Partial<User>) => void;
  // Booking modal
  isBookingModalOpen: boolean;
  openBookingModal: (initialServiceId?: string, initialBarberId?: string) => void;
  closeBookingModal: () => void;
  selectedServiceForBooking: string | null;
  selectedBarberForBooking: string | null;
  bookAppointment: (payload: BookingPayload) => Appointment;
  cancelAppointment: (id: string) => void;
  rescheduleAppointment: (id: string, date: string, timeSlot: string) => void;
  addReviewToAppointment: (appointmentId: string, rating: number, reviewText: string) => void;
  rebookPastAppointment: (pastAppointment: Appointment) => void;
  // Customer Dashboard
  isCustomerDashboardOpen: boolean;
  dashboardActiveTab: 'upcoming' | 'history' | 'profile' | 'loyalty';
  openCustomerDashboard: (tab?: 'upcoming' | 'history' | 'profile' | 'loyalty') => void;
  closeCustomerDashboard: () => void;
  setDashboardActiveTab: (tab: 'upcoming' | 'history' | 'profile' | 'loyalty') => void;
  // Staff Portal
  isStaffDashboardOpen: boolean;
  openStaffDashboard: () => void;
  closeStaffDashboard: () => void;
  markAppointmentStatus: (id: string, status: Appointment['status']) => void;
  // Utilities
  toasts: ToastInfo[];
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  dismissToast: (id: string) => void;
  getBarberById: (id: string) => Barber | undefined;
  getServiceById: (id: string) => Service | undefined;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load persistent user state
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('sovereign_current_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_DEMO_USER;
      }
    }
    // Default to demo user for a rich immediate experience, but allow logout
    return INITIAL_DEMO_USER;
  });

  // Load persistent appointments
  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem('sovereign_appointments');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_APPOINTMENTS;
      }
    }
    return INITIAL_APPOINTMENTS;
  });

  // Reviews list
  const [reviews, setReviews] = useState<Review[]>(REVIEWS);

  // Modals state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('login');
  
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedServiceForBooking, setSelectedServiceForBooking] = useState<string | null>(null);
  const [selectedBarberForBooking, setSelectedBarberForBooking] = useState<string | null>(null);

  const [isCustomerDashboardOpen, setIsCustomerDashboardOpen] = useState(false);
  const [dashboardActiveTab, setDashboardActiveTab] = useState<'upcoming' | 'history' | 'profile' | 'loyalty'>('upcoming');

  const [isStaffDashboardOpen, setIsStaffDashboardOpen] = useState(false);

  // Toast notifications
  const [toasts, setToasts] = useState<ToastInfo[]>([]);

  // Sync to local storage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('sovereign_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('sovereign_current_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('sovereign_appointments', JSON.stringify(appointments));
  }, [appointments]);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Auth functions
  const openAuthModal = (tab: 'login' | 'register' = 'login') => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => setIsAuthModalOpen(false);

  const login = (email: string) => {
    // Check if demo user
    if (email.toLowerCase().includes('marcus') || email.toLowerCase().includes('demo')) {
      setCurrentUser(INITIAL_DEMO_USER);
      showToast('Welcome back, Marcus! Signed in successfully.', 'success');
      setIsAuthModalOpen(false);
      return true;
    }
    // Check existing stored users or create active session
    const savedUsersStr = localStorage.getItem('sovereign_registered_users');
    let registeredUsers: User[] = savedUsersStr ? JSON.parse(savedUsersStr) : [];
    const found = registeredUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
    
    if (found) {
      setCurrentUser(found);
      showToast(`Welcome back, ${found.name}!`, 'success');
      setIsAuthModalOpen(false);
      return true;
    }

    // Standard fallback login
    const newUser: User = {
      id: 'usr-' + Date.now(),
      name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      email,
      phone: '(555) 019-2831',
      loyaltyPoints: 100,
      totalVisits: 0,
      memberSince: 'October 2026',
    };
    registeredUsers.push(newUser);
    localStorage.setItem('sovereign_registered_users', JSON.stringify(registeredUsers));
    setCurrentUser(newUser);
    showToast(`Welcome to The Sovereign Barber Co., ${newUser.name}!`, 'success');
    setIsAuthModalOpen(false);
    return true;
  };

  const loginAsDemoUser = () => {
    setCurrentUser(INITIAL_DEMO_USER);
    showToast('Signed in as demo customer Marcus Vance.', 'info');
    setIsAuthModalOpen(false);
  };

  const register = (name: string, email: string, phone: string) => {
    const newUser: User = {
      id: 'usr-' + Date.now(),
      name,
      email,
      phone,
      loyaltyPoints: 150, // bonus 150 points on signup
      totalVisits: 0,
      haircutNotes: 'First-time client preference',
      memberSince: 'October 2026',
    };

    const savedUsersStr = localStorage.getItem('sovereign_registered_users');
    const registeredUsers: User[] = savedUsersStr ? JSON.parse(savedUsersStr) : [];
    registeredUsers.push(newUser);
    localStorage.setItem('sovereign_registered_users', JSON.stringify(registeredUsers));

    setCurrentUser(newUser);
    showToast(`Welcome ${name}! Your account was created with 150 bonus loyalty points.`, 'success');
    setIsAuthModalOpen(false);
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    setIsCustomerDashboardOpen(false);
    showToast('You have been signed out.', 'info');
  };

  const updateUserProfile = (updates: Partial<User>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updates };
    setCurrentUser(updated);
    showToast('Profile updated successfully.', 'success');
  };

  // Booking functions
  const openBookingModal = (initialServiceId?: string, initialBarberId?: string) => {
    setSelectedServiceForBooking(initialServiceId || null);
    setSelectedBarberForBooking(initialBarberId || null);
    setIsBookingModalOpen(true);
  };

  const closeBookingModal = () => {
    setIsBookingModalOpen(false);
    setSelectedServiceForBooking(null);
    setSelectedBarberForBooking(null);
  };

  const bookAppointment = (payload: BookingPayload): Appointment => {
    const service = SERVICES.find((s) => s.id === payload.serviceId);
    let totalAddonPrice = 0;
    let totalAddonDuration = 0;

    payload.addOnIds.forEach((addonId) => {
      const addon = ADD_ONS.find((a) => a.id === addonId);
      if (addon) {
        totalAddonPrice += addon.price;
        totalAddonDuration += addon.durationMinutes;
      }
    });

    const totalPrice = (service ? service.price : 450) + totalAddonPrice;
    const totalDuration = (service ? service.durationMinutes : 45) + totalAddonDuration;

    const newAppointment: Appointment = {
      id: 'apt-' + Date.now().toString(36) + Math.random().toString(36).substr(2, 4),
      userId: currentUser ? currentUser.id : 'usr-guest-' + Date.now(),
      customerName: payload.customerName,
      customerEmail: payload.customerEmail,
      customerPhone: payload.customerPhone,
      barberId: payload.barberId,
      serviceId: payload.serviceId,
      addOnIds: payload.addOnIds,
      date: payload.date,
      timeSlot: payload.timeSlot,
      status: 'confirmed',
      totalPrice,
      totalDuration,
      notes: payload.notes,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setAppointments((prev) => [newAppointment, ...prev]);

    // Reward points if user is logged in (5 points per dollar)
    if (currentUser) {
      const earnedPoints = Math.round(totalPrice * 5);
      setCurrentUser((prev) =>
        prev
          ? {
              ...prev,
              loyaltyPoints: prev.loyaltyPoints + earnedPoints,
              totalVisits: prev.totalVisits + 1,
            }
          : null
      );
    }

    showToast(`Appointment confirmed for ${payload.date} at ${payload.timeSlot}!`, 'success');
    return newAppointment;
  };

  const cancelAppointment = (id: string) => {
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === id ? { ...apt, status: 'cancelled' } : apt))
    );
    showToast('Appointment has been cancelled.', 'info');
  };

  const rescheduleAppointment = (id: string, date: string, timeSlot: string) => {
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === id ? { ...apt, date, timeSlot, status: 'confirmed' } : apt))
    );
    showToast(`Appointment rescheduled to ${date} at ${timeSlot}.`, 'success');
  };

  const addReviewToAppointment = (appointmentId: string, rating: number, reviewText: string) => {
    const apt = appointments.find((a) => a.id === appointmentId);
    if (!apt) return;

    setAppointments((prev) =>
      prev.map((a) =>
        a.id === appointmentId ? { ...a, ratingGiven: rating, reviewGiven: reviewText } : a
      )
    );

    const barber = BARBERS.find((b) => b.id === apt.barberId);
    const service = SERVICES.find((s) => s.id === apt.serviceId);

    const newRev: Review = {
      id: 'rev-' + Date.now(),
      authorName: apt.customerName,
      avatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      rating,
      date: 'Just now',
      comment: reviewText,
      barberName: barber ? barber.name : 'Master Barber',
      serviceName: service ? service.name : 'Grooming Service',
      verified: true,
    };

    setReviews((prev) => [newRev, ...prev]);
    showToast('Thank you! Your verified review has been submitted.', 'success');
  };

  const rebookPastAppointment = (pastAppointment: Appointment) => {
    setIsCustomerDashboardOpen(false);
    openBookingModal(pastAppointment.serviceId, pastAppointment.barberId);
    showToast('Selected your previous service and barber. Choose your new date & time!', 'info');
  };

  // Dashboard modal
  const openCustomerDashboard = (tab: 'upcoming' | 'history' | 'profile' | 'loyalty' = 'upcoming') => {
    if (!currentUser) {
      openAuthModal('login');
      return;
    }
    setDashboardActiveTab(tab);
    setIsCustomerDashboardOpen(true);
  };

  const closeCustomerDashboard = () => setIsCustomerDashboardOpen(false);

  // Staff modal
  const openStaffDashboard = () => setIsStaffDashboardOpen(true);
  const closeStaffDashboard = () => setIsStaffDashboardOpen(false);

  const markAppointmentStatus = (id: string, status: Appointment['status']) => {
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === id ? { ...apt, status } : apt))
    );
    showToast(`Appointment status updated to ${status}.`, 'info');
  };

  // Filtered appointments for current logged in user
  const userAppointments = currentUser
    ? appointments.filter(
        (a) =>
          a.userId === currentUser.id ||
          a.customerEmail.toLowerCase() === currentUser.email.toLowerCase()
      )
    : [];

  const upcomingAppointments = userAppointments.filter(
    (a) => a.status === 'confirmed' || a.status === 'in-progress'
  );

  const pastAppointments = userAppointments.filter(
    (a) => a.status === 'completed' || a.status === 'cancelled'
  );

  const getBarberById = (id: string) => BARBERS.find((b) => b.id === id);
  const getServiceById = (id: string) => SERVICES.find((s) => s.id === id);

  return (
    <AppContext.Provider
      value={{
        currentUser,
        barbers: BARBERS,
        services: SERVICES,
        addOns: ADD_ONS,
        lookbook: LOOKBOOK,
        reviews,
        appointments,
        userAppointments,
        upcomingAppointments,
        pastAppointments,
        isAuthModalOpen,
        authModalTab,
        openAuthModal,
        closeAuthModal,
        login,
        loginAsDemoUser,
        register,
        logout,
        updateUserProfile,
        isBookingModalOpen,
        openBookingModal,
        closeBookingModal,
        selectedServiceForBooking,
        selectedBarberForBooking,
        bookAppointment,
        cancelAppointment,
        rescheduleAppointment,
        addReviewToAppointment,
        rebookPastAppointment,
        isCustomerDashboardOpen,
        dashboardActiveTab,
        openCustomerDashboard,
        closeCustomerDashboard,
        setDashboardActiveTab,
        isStaffDashboardOpen,
        openStaffDashboard,
        closeStaffDashboard,
        markAppointmentStatus,
        toasts,
        showToast,
        dismissToast,
        getBarberById,
        getServiceById,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
