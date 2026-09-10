import { useState } from 'react';
import { Edit2, Trash2, Search, MapPin, Plus, Compass, Bus, ExternalLink, Image } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { usePlaces } from '../../contexts/PlacesContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { getCategoryMeta } from '../../data/categories';
import { resolveMediaUrl } from '../../utils/constants';

export default function PlacesList({ onEdit }) {
  const { places, deletePlace } = usePlaces();
  const { t } = useLanguage();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [confirmDelete, setConfirmDelete] = useState(null);

  const categories = ['Todos', ...new Set(places.map(p => p.category))];

  const filtered = places.filter(p => {
    const matchesSearch = !search.trim() || (
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()) ||
      (p.shortDesc && p.shortDesc.toLowerCase().includes(search.toLowerCase()))
    );
    const matchesCategory = selectedCategory === 'Todos' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDelete = (id) => {
    if (confirmDelete === id) {
      deletePlace(id);
      setConfirmDelete(null);
    } else {
      setConfirmDelete(id);
      setTimeout(() => setConfirmDelete(null), 3000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Search & Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 flex items-center gap-2.5 bg-slate-50 rounded-xl px-3.5 py-2.5 border border-slate-200">
            <Search size={18} className="text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nombre, categoría o descripción..."
              className="flex-1 bg-transparent outline-none text-sm text-slate-800 placeholder-slate-400 font-medium"
            />
            {search && (
              <button onClick={() => setSearch('')} className="text-xs text-slate-400 hover:text-slate-600 font-bold">
                Limpiar
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-2 rounded-xl shrink-0">
              {filtered.length} de {places.length} lugares
            </span>
          </div>
        </div>

        {/* Category Filter Chips */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors shrink-0 ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Places Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-500 text-[11px] font-black uppercase tracking-wider">
                <th className="text-left px-5 py-3.5">Atractivo Turístico</th>
                <th className="text-left px-4 py-3.5 hidden sm:table-cell">Categoría</th>
                <th className="text-left px-4 py-3.5 hidden md:table-cell">Transporte</th>
                <th className="text-left px-4 py-3.5 hidden lg:table-cell">Coordenadas</th>
                <th className="text-right px-5 py-3.5">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(place => {
                const meta = getCategoryMeta(place.category);
                const Icon = LucideIcons[meta.icon] || LucideIcons.MapPin;

                return (
                  <tr key={place.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3.5">
                        {/* Thumbnail */}
                        <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200 relative">
                          {place.photos && place.photos.length > 0 ? (
                            <img
                              src={resolveMediaUrl(place.photos[0])}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div
                              className="w-full h-full flex items-center justify-center text-white"
                              style={{ backgroundColor: place.color || '#0ea5e9' }}
                            >
                              <Icon size={18} />
                            </div>
                          )}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-extrabold text-slate-900 text-sm truncate">{place.name}</p>
                            {place.is24h && (
                              <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 text-[10px] font-black">
                                24h
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 truncate max-w-xs sm:max-w-md">
                            {place.shortDesc || place.fullDesc}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4 hidden sm:table-cell">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-800">
                        <Icon size={12} style={{ color: place.color }} />
                        <span>{place.category}</span>
                      </span>
                    </td>

                    <td className="px-4 py-4 hidden md:table-cell text-xs text-slate-600">
                      {place.transport?.lineas?.length > 0 ? (
                        <div className="flex items-center gap-1 font-semibold">
                          <Bus size={13} className="text-accent-500" />
                          <span>Micros {place.transport.lineas.join(', ')}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400">Auto / Taxi</span>
                      )}
                    </td>

                    <td className="px-4 py-4 hidden lg:table-cell text-xs font-mono text-slate-500">
                      {place.lat.toFixed(4)}, {place.lng.toFixed(4)}
                    </td>

                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onEdit(place)}
                          className="p-2 rounded-xl text-slate-500 hover:text-brand-600 hover:bg-slate-100 transition-colors"
                          title="Editar"
                        >
                          <Edit2 size={16} />
                        </button>

                        <button
                          onClick={() => handleDelete(place.id)}
                          className={`p-2 rounded-xl transition-all ${
                            confirmDelete === place.id
                              ? 'bg-red-500 text-white font-bold text-xs px-3'
                              : 'text-slate-400 hover:text-red-500 hover:bg-red-50'
                          }`}
                          title="Eliminar"
                        >
                          {confirmDelete === place.id ? (
                            '¿Confirmar?'
                          ) : (
                            <Trash2 size={16} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
