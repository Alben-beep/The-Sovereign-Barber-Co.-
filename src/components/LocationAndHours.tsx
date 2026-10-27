import React from 'react';
import { useApp } from '../context/AppContext';
import {
  MapPin,
  Clock,
  Phone,
  Mail,
  Coffee,
  Wine,
  Tv,
  Car,
  Wifi,
  Scissors,
  ExternalLink,
} from 'lucide-react';

export const LocationAndHours: React.FC = () => {
  const { openBookingModal } = useApp();

  const hours = [
    { day: 'Monday – Thursday', time: '9:00 AM – 7:30 PM', status: 'Open' },
    { day: 'Friday', time: '8:30 AM – 8:00 PM', status: 'Open' },
    { day: 'Saturday', time: '8:00 AM – 7:00 PM', status: 'High Demand' },
    { day: 'Sunday', time: '10:00 AM – 5:00 PM', status: 'Open' },
  ];

  const amenities = [
    {
      icon: <Wine className="w-5 h-5 text-amber-400" />,
      title: 'Complimentary Spirits Bar',
      desc: 'Top-shelf single malt whiskey, bourbon, and craft local brews served on arrival.',
    },
    {
      icon: <Coffee className="w-5 h-5 text-amber-400" />,
      title: 'Artisan Espresso Station',
      desc: 'Freshly ground Italian roast espresso, cortados, and cold-brew coffee.',
    },
    {
      icon: <Car className="w-5 h-5 text-amber-400" />,
      title: 'Free Reserved Parking',
      desc: 'Dedicated private client parking stalls located directly behind our building.',
    },
    {
      icon: <Wifi className="w-5 h-5 text-amber-400" />,
      title: 'Private Lounge & Wi-Fi',
      desc: 'Plush Chesterfield leather seating, high-speed fiber internet, and live sports.',
    },
  ];

  return (
    <section id="location" className="py-20 bg-stone-900 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Hours & Contact */}
          <div className="lg:col-span-6 space-y-8">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-3">
                <Clock className="w-3.5 h-3.5" />
                <span>Visit The Shop</span>
              </div>
              <h2 className="font-serif-vintage text-3xl sm:text-4xl font-black text-white tracking-tight">
                LOCATION & HOURS
              </h2>
              <p className="text-stone-400 text-sm mt-2">
                Situated in the heart of the Arts & Design District. Walk-ins are always welcomed subject to chair availability, though online appointments are strongly recommended.
              </p>
            </div>

            {/* Hours Table */}
            <div className="bg-stone-950/80 border border-stone-800 rounded-2xl p-6 shadow-xl space-y-3">
              <h3 className="font-serif-vintage text-base font-bold text-white mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>Operating Schedule</span>
              </h3>
              <div className="space-y-2.5">
                {hours.map((h, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between py-2 border-b border-stone-800/80 last:border-0 text-xs"
                  >
                    <span className="font-medium text-stone-200">{h.day}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-stone-300 font-mono font-medium">{h.time}</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          h.status === 'High Demand'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        }`}
                      >
                        {h.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Address & Direct Contact */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-stone-950/80 border border-stone-800 space-y-1">
                <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
                  <MapPin className="w-4 h-4" />
                  <span>Shop Address</span>
                </div>
                <p className="text-white text-xs font-semibold leading-relaxed">
                  428 Heritage Blvd, Suite 104
                </p>
                <p className="text-stone-400 text-xs">Arts & Design District</p>
              </div>

              <div className="p-4 rounded-xl bg-stone-950/80 border border-stone-800 space-y-1">
                <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
                  <Phone className="w-4 h-4" />
                  <span>Front Desk Direct</span>
                </div>
                <p className="text-white text-xs font-semibold">(555) 382-7490</p>
                <p className="text-stone-400 text-xs">concierge@sovereignbarber.co</p>
              </div>
            </div>
          </div>

          {/* Right Column: Amenities & Visual Map Mockup */}
          <div className="lg:col-span-6 space-y-6">
            {/* Visual Shop Map Card */}
            <div className="relative rounded-2xl overflow-hidden border border-stone-800 aspect-[16/9] shadow-2xl group">
              <img
                src="https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=1200&q=80"
                alt="The Sovereign Barbershop Interior"
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500 filter brightness-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />

              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-amber-400 font-bold mb-0.5">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Valet & Self-Parking Available</span>
                  </div>
                  <h4 className="font-bold text-sm">428 Heritage Boulevard, Suite 104</h4>
                </div>

                <button
                  onClick={() => openBookingModal()}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold rounded-xl shadow-lg transition-colors flex items-center gap-1.5 shrink-0"
                >
                  <Scissors className="w-3.5 h-3.5 rotate-45" />
                  <span>Reserve Chair</span>
                </button>
              </div>
            </div>

            {/* Luxury Amenities Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {amenities.map((item, index) => (
                <div
                  key={index}
                  className="p-4 rounded-xl bg-stone-950/60 border border-stone-800/80 flex items-start gap-3.5"
                >
                  <div className="p-2 rounded-lg bg-stone-900 border border-stone-800 shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <h5 className="font-bold text-white text-xs mb-1">{item.title}</h5>
                    <p className="text-[11px] text-stone-400 leading-snug">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
