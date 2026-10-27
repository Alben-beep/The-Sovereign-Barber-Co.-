import React from 'react';
import { useApp } from '../context/AppContext';
import { Star, Award, Calendar, Scissors, ArrowRight } from 'lucide-react';

export const BarbersSection: React.FC = () => {
  const { barbers, openBookingModal } = useApp();

  return (
    <section id="barbers" className="py-20 bg-stone-950 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-3">
            <Award className="w-3.5 h-3.5" />
            <span>Master Craftsmen</span>
          </div>
          <h2 className="font-serif-vintage text-3xl sm:text-4xl font-black text-white tracking-tight">
            MEET THE ARTISANS
          </h2>
          <p className="text-stone-400 text-sm mt-3">
            Each chair is held by a master practitioner dedicated to the heritage craft of gentlemen's barbering, razor symmetry, and bespoke style.
          </p>
        </div>

        {/* Barbers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {barbers.map((barber) => (
            <div
              key={barber.id}
              className="group bg-stone-900/90 border border-stone-800 hover:border-amber-500/50 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-amber-950/20 flex flex-col justify-between"
            >
              <div>
                {/* Photo & Rating Pill */}
                <div className="relative aspect-[4/4.5] overflow-hidden">
                  <img
                    src={barber.avatar}
                    alt={barber.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/20 to-transparent" />

                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-stone-950/80 border border-stone-700/80 text-amber-400 font-bold text-xs flex items-center gap-1 backdrop-blur-sm">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{barber.rating}</span>
                    <span className="text-stone-400 font-normal">({barber.reviewCount})</span>
                  </div>

                  <div className="absolute bottom-3 left-4 right-4">
                    <p className="text-[10px] uppercase font-bold tracking-widest text-amber-400">
                      {barber.experienceYears} Years Master Craft
                    </p>
                    <h3 className="font-serif-vintage font-bold text-lg text-white">
                      {barber.name}
                    </h3>
                  </div>
                </div>

                {/* Details */}
                <div className="p-5 space-y-3">
                  <p className="text-xs font-semibold text-stone-300">{barber.role}</p>

                  <p className="text-xs text-stone-400 leading-relaxed line-clamp-3">
                    {barber.bio}
                  </p>

                  {/* Specialties */}
                  <div className="pt-2">
                    <p className="text-[10px] uppercase font-bold text-stone-500 tracking-wider mb-1.5">
                      Specialties
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {barber.specialties.map((spec, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md bg-stone-950 border border-stone-800 text-[10px] text-stone-300"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="p-5 pt-0">
                <button
                  onClick={() => openBookingModal(undefined, barber.id)}
                  className="w-full py-2.5 rounded-xl bg-stone-950 hover:bg-amber-500 text-stone-200 hover:text-stone-950 border border-stone-800 hover:border-amber-400 font-bold text-xs uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow"
                >
                  <Scissors className="w-3.5 h-3.5 rotate-45" />
                  <span>Book with {barber.name.split(' ')[0]}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
