import { useState } from 'react';
import { Edit2, Trash2, Search, MapPin } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { usePlaces } from '../../contexts/PlacesContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { getCategoryMeta } from '../../data/categories';

export default function PlacesList({ onEdit }) {
  const { places, deletePlace } = usePlaces();
  const { t } = useLanguage();
  const [search, setSearch] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);

  const filtered = search.trim()
    ? places.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase())
      )
    : places;

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
    <div>
      {/* Search */}
      <div className="flex items-center gap-3 bg-white rounded-2xl border border-gray-200 px-4 py-3 mb-6 shadow-sm">
        <Search size={18} className="text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nombre o categoría..."
          className="flex-1 bg-transparent outline-none text-gray-800 placeholder-gray-400"
        />
        <span className="text-xs text-gray-400 font-bold">{filtered.length} lugares</span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Lugar</th>
                <th className="text-left px-4 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Categoría</th>
                <th className="text-left px-4 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider hidden md:table-cell">Tipo</th>
                <th className="text-left px-4 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Coordenadas</th>
                <th className="text-right px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(place => {
                const meta = getCategoryMeta(place.category);
                const Icon = LucideIcons[meta.icon] || LucideIcons.MapPin;

                return (
                  <tr key={place.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                          style={{ backgroundColor: place.color }}
                        >
                          <Icon size={16} className="text-white" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-gray-900 text-sm truncate">{place.name}</p>
                          <p className="text-xs text-gray-500 truncate max-w-[200px]">{place.shortDesc}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 hidden sm:table-cell">
                      <span
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold text-white"
                        style={{ backgroundColor: meta.color }}
                      >
                        {place.category}
                      </span>
                    </td>
                    <td className="px-4 py-4 hidden md:table-cell">
                      <span className="text-xs text-gray-500 font-medium capitalize">{place.type}</span>
                    </td>
                    <td className="px-4 py-4 hidden lg:table-cell">
                      <span className="text-xs text-gray-400 font-mono">
                        {place.lat.toFixed(4)}, {place.lng.toFixed(4)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {!place.isDefault && (
                          <>
                            <button
                              onClick={() => onEdit(place)}
                              className="p-2 rounded-lg hover:bg-brand-50 text-gray-400 hover:text-brand-600 transition-colors"
                              title={t('admin.editPlace')}
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(place.id)}
                              className={`p-2 rounded-lg transition-colors ${
                                confirmDelete === place.id
                                  ? 'bg-red-500 text-white'
                                  : 'hover:bg-red-50 text-gray-400 hover:text-red-600'
                              }`}
                              title={confirmDelete === place.id ? t('admin.confirmDelete') : t('admin.deletePlace')}
                            >
                              <Trash2 size={16} />
                            </button>
                          </>
                        )}
                        {place.isDefault && (
                          <span className="text-[10px] text-gray-300 font-bold px-2 py-1 bg-gray-50 rounded-lg">
                            DEFAULT
                          </span>
                        )}
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
