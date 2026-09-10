import { useState } from 'react';
import { Save, X, Plus, Trash2, Image, Video, Upload, Check, Sparkles, Film } from 'lucide-react';
import { usePlaces } from '../../contexts/PlacesContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { CATEGORIES } from '../../data/categories';
import { API_BASE_URL, resolveMediaUrl } from '../../utils/constants';

export default function PlaceForm({ place, onDone }) {
  const isEditing = !!place;
  const { addPlace, updatePlace } = usePlaces();
  const { t } = useLanguage();
  const { token } = useAuth();

  const [form, setForm] = useState({
    name: place?.name || '',
    category: place?.category || CATEGORIES[0].id,
    type: place?.type || CATEGORIES[0].type || 'turismo',
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
    videos: place?.videos || [],
    aiTags: place?.aiTags || [],
    audioFile: place?.audioFile || '',
    transport: {
      lineas: place?.transport?.lineas || [],
      direccion: place?.transport?.direccion || '',
      letrero: place?.transport?.letrero || '',
      parada: place?.transport?.parada || '',
    },
  });

  const [photoUrl, setPhotoUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [busLine, setBusLine] = useState('');
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [photoOptimizedNotice, setPhotoOptimizedNotice] = useState(null);

  const updateField = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const updateTransport = (field, value) => {
    setForm(prev => ({
      ...prev,
      transport: { ...prev.transport, [field]: value }
    }));
  };

  // Upload Photo to Backend (WebP Optimization)
  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPhoto(true);
    setPhotoOptimizedNotice(null);

    const formData = new FormData();
    formData.append('photo', file);

    try {
      const res = await fetch(`${API_BASE_URL}/upload/photo`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });

      if (res.ok) {
        const data = await res.json();
        setForm(prev => ({ ...prev, photos: [...prev.photos, data.url] }));
        setPhotoOptimizedNotice(`Foto optimizada a WebP: ${data.stats.optimizedKb} KB (${data.stats.savingsPercent} menos peso).`);
        setTimeout(() => setPhotoOptimizedNotice(null), 5000);
      }
    } catch (err) {
      console.error('Error al subir foto:', err);
    } finally {
      setUploadingPhoto(false);
    }
  };

  // Upload Video to Backend
  const handleVideoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingVideo(true);

    const formData = new FormData();
    formData.append('video', file);

    try {
      const res = await fetch(`${API_BASE_URL}/upload/video`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });

      if (res.ok) {
        const data = await res.json();
        setForm(prev => ({ ...prev, videos: [...prev.videos, data.url] }));
      }
    } catch (err) {
      console.error('Error al subir video:', err);
    } finally {
      setUploadingVideo(false);
    }
  };

  const addManualPhoto = () => {
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

  const addManualVideo = () => {
    if (videoUrl.trim()) {
      setForm(prev => ({ ...prev, videos: [...prev.videos, videoUrl.trim()] }));
      setVideoUrl('');
    }
  };

  const removeVideo = (index) => {
    setForm(prev => ({
      ...prev,
      videos: prev.videos.filter((_, i) => i !== index)
    }));
  };

  const addAiTag = () => {
    if (tagInput.trim() && !form.aiTags.includes(tagInput.trim().toLowerCase())) {
      setForm(prev => ({ ...prev, aiTags: [...prev.aiTags, tagInput.trim().toLowerCase()] }));
      setTagInput('');
    }
  };

  const removeAiTag = (tag) => {
    setForm(prev => ({
      ...prev,
      aiTags: prev.aiTags.filter(t => t !== tag)
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    if (isEditing) {
      await updatePlace(place.id, form);
    } else {
      await addPlace(form);
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
              onChange={(e) => {
                const cat = CATEGORIES.find(c => c.id === e.target.value);
                setForm(prev => ({
                  ...prev,
                  category: e.target.value,
                  type: cat?.type || prev.type
                }));
              }}
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
          <label className={labelClass}>Descripción Detallada (Alimento para la IA turística)</label>
          <textarea
            value={form.fullDesc}
            onChange={(e) => updateField('fullDesc', e.target.value)}
            className={`${inputClass} min-h-[110px] resize-y`}
            placeholder="Incluye detalles históricos, atractivos, recomendaciones y tips que la IA usará para responder a los turistas..."
            rows={4}
          />
        </div>

        {/* AI Semantic Tags */}
        <div className="bg-purple-50/60 rounded-2xl p-4 border border-purple-100 space-y-3">
          <label className="block text-sm font-bold text-purple-900 flex items-center gap-1.5">
            <Sparkles size={16} className="text-purple-600" />
            Etiquetas Semánticas para la IA (Palabras clave)
          </label>
          <div className="flex flex-wrap gap-2">
            {form.aiTags.map((tag, i) => (
              <span key={i} className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 text-xs font-bold rounded-lg">
                #{tag}
                <button type="button" onClick={() => removeAiTag(tag)} className="hover:text-red-500">
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addAiTag())}
              className={`${inputClass} bg-white flex-1`}
              placeholder="Ej: familiar, playa, atardecer, momias, comida tipica..."
            />
            <button
              type="button"
              onClick={addAiTag}
              className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs"
            >
              Añadir Tag
            </button>
          </div>
        </div>

        {/* Coordinates */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>{t('admin.latitude')}</label>
            <input
              type="number"
              step="any"
              value={form.lat}
              onChange={(e) => updateField('lat', parseFloat(e.target.value) || 0)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>{t('admin.longitude')}</label>
            <input
              type="number"
              step="any"
              value={form.lng}
              onChange={(e) => updateField('lng', parseFloat(e.target.value) || 0)}
              className={inputClass}
            />
          </div>
        </div>

        {/* Practical info */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>{t('detail.hours')}</label>
            <input
              type="text"
              value={form.hours}
              onChange={(e) => updateField('hours', e.target.value)}
              className={inputClass}
              placeholder="09:00 - 18:00"
            />
          </div>
          <div>
            <label className={labelClass}>{t('detail.phone')}</label>
            <input
              type="tel"
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

        {/* Photos (Optimized WebP Upload) */}
        <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
              <Image size={16} className="text-brand-500" />
              Fotos (Optimización automática WebP)
            </h3>
            {photoOptimizedNotice && (
              <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                <Check size={14} /> {photoOptimizedNotice}
              </span>
            )}
          </div>

          {form.photos.length > 0 && (
            <div className="flex flex-wrap gap-2.5">
              {form.photos.map((url, i) => (
                <div key={i} className="relative group w-24 h-24 rounded-xl overflow-hidden border-2 border-gray-200 bg-gray-100">
                  <img
                    src={resolveMediaUrl(url)}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removePhoto(i)}
                    className="absolute top-1 right-1 w-6 h-6 bg-red-600/90 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex-1 flex gap-2">
              <input
                type="text"
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                className={`${inputClass} flex-1`}
                placeholder="https://ejemplo.com/foto.jpg"
              />
              <button
                type="button"
                onClick={addManualPhoto}
                className="px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold text-xs"
              >
                Agregar URL
              </button>
            </div>

            <label className="cursor-pointer px-4 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shrink-0">
              <Upload size={15} />
              <span>{uploadingPhoto ? 'Optimizando...' : 'Subir y Optimizar a WebP'}</span>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
                disabled={uploadingPhoto}
              />
            </label>
          </div>
        </div>

        {/* Videos (Web Optimized Video) */}
        <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200 space-y-3">
          <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
            <Film size={16} className="text-accent-500" />
            Videos para la Web (MP4, WebM o Streaming)
          </h3>

          {form.videos.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {form.videos.map((vUrl, i) => (
                <div key={i} className="relative group rounded-xl overflow-hidden border border-gray-200 bg-black">
                  <video
                    src={resolveMediaUrl(vUrl)}
                    controls
                    preload="metadata"
                    className="w-full h-36 object-contain"
                  />
                  <button
                    type="button"
                    onClick={() => removeVideo(i)}
                    className="absolute top-2 right-2 px-2 py-1 bg-red-600 text-white rounded-lg text-xs font-bold shadow"
                  >
                    Eliminar Video
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex-1 flex gap-2">
              <input
                type="text"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className={`${inputClass} flex-1`}
                placeholder="https://... (URL de video MP4 o enlace externo)"
              />
              <button
                type="button"
                onClick={addManualVideo}
                className="px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold text-xs"
              >
                Agregar URL
              </button>
            </div>

            <label className="cursor-pointer px-4 py-3 bg-accent-500 hover:bg-accent-600 text-white rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shrink-0">
              <Upload size={15} />
              <span>{uploadingVideo ? 'Subiendo...' : 'Subir Video'}</span>
              <input
                type="file"
                accept="video/*"
                onChange={handleVideoUpload}
                className="hidden"
                disabled={uploadingVideo}
              />
            </label>
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
