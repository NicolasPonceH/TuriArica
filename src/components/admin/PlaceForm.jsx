import { useState } from 'react';
import { Save, X, Plus, Trash2, Image } from 'lucide-react';
import { usePlaces } from '../../contexts/PlacesContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { CATEGORIES } from '../../data/categories';

export default function PlaceForm({ place, onDone }) {
  const isEditing = !!place;
  const { addPlace, updatePlace } = usePlaces();
  const { t } = useLanguage();

  const [form, setForm] = useState({
    name: place?.name || '',
    category: place?.category || CATEGORIES[0].id,
    shortDesc: place?.shortDesc || '',
    fullDesc: place?.fullDesc || '',
    lat: place?.lat || -18.4783,
    lng: place?.lng || -70.3126,
    hours: place?.hours || '',
    directions: place?.directions || '',
    phone: place?.phone || '',
    website: place?.website || '',
    priceRange: place?.priceRange || '',
    is24h: place?.is24h || false,
    photos: place?.photos || [],
    audioFile: place?.audioFile || '',
    transport: {
      lineas: place?.transport?.lineas || [],
      direccion: place?.transport?.direccion || '',
      letrero: place?.transport?.letrero || '',
      parada: place?.transport?.parada || '',
    },
  });

  const [photoUrl, setPhotoUrl] = useState('');
  const [busLine, setBusLine] = useState('');

  const updateField = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const updateTransport = (field, value) => {
    setForm(prev => ({
      ...prev,
      transport: { ...prev.transport, [field]: value }
    }));
  };

  const addPhoto = () => {
    if (photoUrl.trim()) {
      setForm(prev => ({ ...prev, photos: [...prev.photos, photoUrl.trim()] }));
      setPhotoUrl('');
    }
  };

  const removePhoto = (index) => {
    setForm(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  const addBusLine = () => {
    if (busLine.trim()) {
      updateTransport('lineas', [...form.transport.lineas, busLine.trim()]);
      setBusLine('');
    }
  };

  const removeBusLine = (index) => {
    updateTransport('lineas', form.transport.lineas.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    if (isEditing) {
      updatePlace(place.id, form);
    } else {
      addPlace(form);
    }
    onDone();
  };

  const inputClass = "w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-50 focus:border-brand-500 focus:bg-white outline-none transition-colors text-sm";
  const labelClass = "block text-sm font-bold text-gray-700 mb-1.5";

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8 max-w-3xl mx-auto">
      <h2 className="text-xl font-extrabold text-gray-900 mb-6">
        {isEditing ? t('admin.editPlace') : t('admin.addPlace')}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>{t('admin.name')} *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => updateField('name', e.target.value)}
              className={inputClass}
              required
            />
          </div>
          <div>
            <label className={labelClass}>{t('admin.category')} *</label>
            <select
              value={form.category}
              onChange={(e) => updateField('category', e.target.value)}
              className={inputClass}
            >
              {CATEGORIES.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.label} ({cat.type})</option>
              ))}
            </select>
          </div>
        </div>

        {/* Descriptions */}
        <div>
          <label className={labelClass}>{t('admin.shortDesc')}</label>
          <input
            type="text"
            value={form.shortDesc}
            onChange={(e) => updateField('shortDesc', e.target.value)}
            className={inputClass}
            maxLength={120}
          />
        </div>
        <div>
          <label className={labelClass}>{t('admin.fullDesc')}</label>
          <textarea
            value={form.fullDesc}
            onChange={(e) => updateField('fullDesc', e.target.value)}
            className={`${inputClass} min-h-[100px] resize-y`}
            rows={4}
          />
        </div>

        {/* Coordinates */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>{t('admin.latitude')}</label>
            <input
              type="number"
              step="any"
              value={form.lat}
              onChange={(e) => updateField('lat', parseFloat(e.target.value))}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>{t('admin.longitude')}</label>
            <input
              type="number"
              step="any"
              value={form.lng}
              onChange={(e) => updateField('lng', parseFloat(e.target.value))}
              className={inputClass}
            />
          </div>
        </div>

        {/* Schedule & Contact */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>{t('admin.hours')}</label>
            <input
              type="text"
              value={form.hours}
              onChange={(e) => updateField('hours', e.target.value)}
              className={inputClass}
              placeholder="Ej: Lunes a Viernes 09:00 - 18:00"
            />
          </div>
          <div className="flex items-end gap-3">
            <label className="flex items-center gap-2 cursor-pointer py-3">
              <input
                type="checkbox"
                checked={form.is24h}
                onChange={(e) => updateField('is24h', e.target.checked)}
                className="w-5 h-5 rounded border-2 border-gray-300 text-brand-500 focus:ring-brand-500"
              />
              <span className="text-sm font-bold text-gray-700">24 horas</span>
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>{t('detail.phone')}</label>
            <input
              type="text"
              value={form.phone}
              onChange={(e) => updateField('phone', e.target.value)}
              className={inputClass}
              placeholder="+56 58 ..."
            />
          </div>
          <div>
            <label className={labelClass}>{t('detail.website')}</label>
            <input
              type="url"
              value={form.website}
              onChange={(e) => updateField('website', e.target.value)}
              className={inputClass}
              placeholder="https://..."
            />
          </div>
          <div>
            <label className={labelClass}>{t('detail.price')}</label>
            <select
              value={form.priceRange}
              onChange={(e) => updateField('priceRange', e.target.value)}
              className={inputClass}
            >
              <option value="">Sin rango</option>
              <option value="$">$ (Económico)</option>
              <option value="$$">$$ (Moderado)</option>
              <option value="$$$">$$$ (Premium)</option>
            </select>
          </div>
        </div>

        {/* Directions */}
        <div>
          <label className={labelClass}>{t('admin.directions')}</label>
          <textarea
            value={form.directions}
            onChange={(e) => updateField('directions', e.target.value)}
            className={`${inputClass} min-h-[60px] resize-y`}
            rows={2}
          />
        </div>

        {/* Transport */}
        <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200 space-y-4">
          <h3 className="font-bold text-gray-900 text-sm">{t('detail.transport')}</h3>

          <div>
            <label className={labelClass}>Líneas de micro</label>
            <div className="flex gap-2 mb-2 flex-wrap">
              {form.transport.lineas.map((line, i) => (
                <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 bg-accent-500 text-white text-xs font-black rounded-lg">
                  {line}
                  <button type="button" onClick={() => removeBusLine(i)} className="hover:text-red-200">
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={busLine}
                onChange={(e) => setBusLine(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addBusLine())}
                className={`${inputClass} flex-1`}
                placeholder="Ej: 12"
              />
              <button
                type="button"
                onClick={addBusLine}
                className="px-4 py-2 rounded-xl bg-brand-500 text-white font-bold text-sm hover:bg-brand-600 transition-colors"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Letrero</label>
              <input
                type="text"
                value={form.transport.letrero}
                onChange={(e) => updateTransport('letrero', e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Parada</label>
              <input
                type="text"
                value={form.transport.parada}
                onChange={(e) => updateTransport('parada', e.target.value)}
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* Photos */}
        <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200 space-y-3">
          <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
            <Image size={16} />
            Fotos
          </h3>

          {form.photos.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {form.photos.map((url, i) => (
                <div key={i} className="relative group">
                  <img src={url} alt="" className="w-20 h-20 rounded-xl object-cover border-2 border-gray-200" />
                  <button
                    type="button"
                    onClick={() => removePhoto(i)}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={10} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-2">
            <input
              type="url"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              className={`${inputClass} flex-1`}
              placeholder="https://ejemplo.com/foto.jpg"
            />
            <button
              type="button"
              onClick={addPhoto}
              className="px-4 py-2 rounded-xl bg-brand-500 text-white font-bold text-sm hover:bg-brand-600 transition-colors"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t border-gray-100">
          <button
            type="submit"
            className="flex-1 py-3 px-6 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold transition-all shadow-lg shadow-brand-500/20 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Save size={18} />
            {t('admin.save')}
          </button>
          <button
            type="button"
            onClick={onDone}
            className="px-6 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold transition-colors"
          >
            {t('admin.cancel')}
          </button>
        </div>
      </form>
    </div>
  );
}
