import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Clock, Check, Scissors, Sparkles, ArrowRight } from 'lucide-react';
import { ServiceCategory } from '../types';

export const ServicesSection: React.FC = () => {
  const { services, addOns, openBookingModal } = useApp();
  const [activeCategory, setActiveCategory] = useState<ServiceCategory>('all');

  const filteredServices = services.filter((srv) => {
    if (activeCategory === 'all') return true;
    return srv.category === activeCategory;
  });

  return (
    <section id="services" className="py-20 bg-stone-900 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-3">
            <Scissors className="w-3.5 h-3.5 rotate-45" />
            <span>Master Services Menu</span>
          </div>
          <h2 className="font-serif-vintage text-3xl sm:text-4xl font-black text-white tracking-tight">
            TAILORED GROOMING RITUALS
          </h2>
          <p className="text-stone-400 text-sm mt-3">
            Every appointment begins with a personal style consultation and concludes with hot steam towels, a razor neck shave, and artisan styling.
          </p>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap justify-center items-center gap-2 mt-8">
            {[
              { id: 'all', label: 'All Services' },
              { id: 'haircuts', label: 'Haircuts & Fades' },
              { id: 'beards', label: 'Beards & Shaves' },
              { id: 'combos', label: 'Combos & VIP' },
              { id: 'treatments', label: 'Scalp & Facial' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id as ServiceCategory)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeCategory === cat.id
                    ? 'bg-amber-500 text-stone-950 shadow-lg shadow-amber-950/30'
                    : 'bg-stone-950/80 border border-stone-800 text-stone-300 hover:text-white hover:border-stone-700'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="group bg-stone-950/80 border border-stone-800/90 hover:border-amber-500/50 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-amber-950/20 flex flex-col justify-between"
            >
              <div>
                {/* Image & Price Tag */}
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-transparent opacity-80" />

                  {service.popular && (
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wider bg-amber-500 text-stone-950 shadow-md">
                      Client Favorite
                    </span>
                  )}

                  <div className="absolute bottom-3 right-3 px-3 py-1 rounded-lg bg-stone-950/90 border border-stone-700/80 text-amber-300 font-extrabold text-base backdrop-blur-sm">
                    ₱{service.price}
                  </div>
                </div>

                {/* Details */}
                <div className="p-5 space-y-3">
                  <div className="flex items-center gap-1.5 text-stone-400 text-xs font-semibold">
                    <Clock className="w-3.5 h-3.5 text-amber-500" />
                    <span>{service.durationMinutes} minutes</span>
                  </div>

                  <h3 className="font-bold text-white text-base group-hover:text-amber-400 transition-colors">
                    {service.name}
                  </h3>

                  <p className="text-xs text-stone-400 line-clamp-3 leading-relaxed">
                    {service.description}
                  </p>

                  {/* Feature checklist */}
                  <div className="space-y-1.5 pt-2 border-t border-stone-800/80">
                    {service.features.map((feat, i) => (
                      <div key={i} className="flex items-center gap-2 text-[11px] text-stone-300">
                        <Check className="w-3 h-3 text-amber-500 shrink-0" />
                        <span className="truncate">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-5 pt-0">
                <button
                  onClick={() => openBookingModal(service.id)}
                  className="w-full py-2.5 rounded-xl bg-stone-900 hover:bg-amber-500 text-stone-200 hover:text-stone-950 border border-stone-800 hover:border-amber-400 font-bold text-xs uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow"
                >
                  <span>Book This Service</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add-ons Bar */}
        <div className="mt-16 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-stone-950 via-stone-900 to-stone-950 border border-amber-500/20">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="max-w-md">
              <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Grooming Upgrades</span>
              </span>
              <h3 className="text-lg font-bold text-white font-serif-vintage mt-1">
                Custom Treatment Add-ons
              </h3>
              <p className="text-xs text-stone-400 mt-1">
                Enhance any haircut or beard sculpt with specialized masks, razor parts, or cooling scalp treatments.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 w-full lg:w-auto">
              {addOns.map((add) => (
                <div
                  key={add.id}
                  className="p-3 rounded-xl bg-stone-950/80 border border-stone-800 flex items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <p className="font-semibold text-white">{add.name}</p>
                    <p className="text-[10px] text-stone-500">+{add.durationMinutes} min</p>
                  </div>
                  <span className="font-bold text-amber-400 text-sm shrink-0">+₱{add.price}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
