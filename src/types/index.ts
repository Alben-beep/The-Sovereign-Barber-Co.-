export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  loyaltyPoints: number;
  totalVisits: number;
  preferredBarberId?: string;
  haircutNotes?: string;
  memberSince: string;
}

export interface Barber {
  id: string;
  name: string;
  role: string;
  avatar: string;
  bio: string;
  experienceYears: number;
  rating: number;
  reviewCount: number;
  specialties: string[];
  daysWorking: string[];
  instagram?: string;
}

export type ServiceCategory = 'all' | 'haircuts' | 'beards' | 'combos' | 'treatments';

export interface Service {
  id: string;
  name: string;
  category: 'haircuts' | 'beards' | 'combos' | 'treatments';
  price: number;
  durationMinutes: number;
  description: string;
  popular?: boolean;
  features: string[];
  image: string;
}

export interface AddOnService {
  id: string;
  name: string;
  price: number;
  durationMinutes: number;
  description: string;
}

export interface Appointment {
  id: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  barberId: string;
  serviceId: string;
  addOnIds: string[];
  date: string; // YYYY-MM-DD
  timeSlot: string; // "10:30 AM"
  status: 'confirmed' | 'completed' | 'cancelled' | 'in-progress';
  totalPrice: number;
  totalDuration: number;
  notes?: string;
  ratingGiven?: number;
  reviewGiven?: string;
  createdAt: string;
}

export interface LookbookItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  description: string;
  serviceId: string;
  barberName: string;
}

export interface Review {
  id: string;
  authorName: string;
  avatar: string;
  rating: number;
  date: string;
  comment: string;
  barberName: string;
  serviceName: string;
  verified: boolean;
}
