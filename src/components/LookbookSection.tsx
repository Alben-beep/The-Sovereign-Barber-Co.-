import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, Scissors, Eye, X, ArrowRight } from 'lucide-react';
import { LookbookItem } from '../types';

export const LookbookSection: React.FC = () => {
  const { lookbook, openBookingModal } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [inspectItem, setInspectItem] = useState<LookbookItem | null>(null);

  const categories = ['All', 'Modern Fades', 'Classic Gentlemen', 'Beard Art', 'Textured & Natural', 'Shaves'];

  const filteredItems = lookbook.filter((item) => {
    if (selectedCategory === 'All') return true;
    return item.category === selectedCategory;
  });

  return (
    <section id="lookbook" className="py-20 bg-stone-900 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Style Inspiration</span>
          </div>
          <h2 className="font-serif-vintage text-3xl sm:text-4xl font-black text-white tracking-tight">
            THE GALLERY LOOKBOOK
          </h2>
          <p className="text-stone-400 text-sm mt-3">
            Explore authentic cuts crafted in our chairs. Tap "Book This Look" to reserve the exact service with our team.
          </p>

          {/* Categories */}
          <div className="flex flex-wrap justify-center items-center gap-2 mt-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedCategory === cat
                    ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-950/30'
                    : 'bg-stone-950/80 border border-stone-800 text-stone-300 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="group relative rounded-2xl overflow-hidden bg-stone-950 border border-stone-800 hover:border-amber-500/50 transition-all duration-300 shadow-lg"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/30 to-transparent opacity-90 group-hover:opacity-95 transition-opacity" />

                <span className="absolute top-3 left-3 px-2 py-0.5 rounded text-[10px] font-bold bg-stone-950/80 border border-stone-700 text-amber-400 uppercase tracking-wider">
                  {item.category}
                </span>

                <button
                  onClick={() => setInspectItem(item)}
                  className="absolute top-3 right-3 p-2 rounded-xl bg-stone-950/80 hover:bg-stone-800 text-stone-300 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Inspect Look"
                >
                  <Eye className="w-4 h-4" />
                </button>

                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="font-bold text-white text-base leading-snug">{item.title}</h3>
                  <p className="text-xs text-amber-400/90 font-medium mt-0.5">
                    Cut by {item.barberName}
                  </p>
                  <p className="text-xs text-stone-400 line-clamp-2 mt-1">
                    {item.description}
                  </p>

                  <div className="mt-3 pt-3 border-t border-stone-800/80 flex items-center justify-between">
                    <button
                      onClick={() => openBookingModal(item.serviceId)}
                      className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-1.5 transition-colors shadow"
                    >
                      <Scissors className="w-3.5 h-3.5 rotate-45" />
                      <span>Book This Look</span>
                    </button>
                    <button
                      onClick={() => setInspectItem(item)}
                      className="text-xs text-stone-400 hover:text-white transition-colors"
                    >
                      Details & Recipe
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Modal */}
        {inspectItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
            <div className="relative w-full max-w-2xl bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden shadow-2xl">
              <button
                onClick={() => setInspectItem(null)}
                className="absolute top-4 right-4 z-10 p-2 text-stone-400 hover:text-white rounded-lg bg-stone-950/80"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="aspect-[16/10] overflow-hidden relative">
                <img
                  src={inspectItem.imageUrl}
                  alt={inspectItem.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                      {inspectItem.category}
                    </span>
                    <h3 className="font-serif-vintage text-xl font-bold text-white mt-0.5">
                      {inspectItem.title}
                    </h3>
                  </div>
                  <span className="text-xs font-semibold text-stone-400">
                    Crafted by {inspectItem.barberName}
                  </span>
                </div>

                <p className="text-xs text-stone-300 leading-relaxed">
                  {inspectItem.description}
                </p>

                <div className="p-3.5 bg-stone-950/80 rounded-xl border border-stone-800 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-white">Love this style?</p>
                    <p className="text-[11px] text-stone-400">
                      Our barbers can recreate or customize this silhouette for your facial structure.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setInspectItem(null);
                      openBookingModal(inspectItem.serviceId);
                    }}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs rounded-xl transition-colors shadow flex items-center gap-1.5"
                  >
                    <span>Book This Look</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
