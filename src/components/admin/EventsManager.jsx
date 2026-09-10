import { useState } from 'react';
import { Plus, Edit2, Trash2, Bell, Sparkles, Calendar, ExternalLink, CheckCircle2, XCircle } from 'lucide-react';
import { useEvents } from '../../contexts/EventsContext';
import { resolveMediaUrl } from '../../utils/constants';
import EventForm from './EventForm';

export default function EventsManager() {
  const { allEvents, deleteEvent, updateEvent } = useEvents();
  const [editingEvent, setEditingEvent] = useState(null);
  const [creatingNew, setCreatingNew] = useState(false);

  const handleToggleActive = async (event) => {
    await updateEvent(event.id, {
      ...event,
      isActive: !event.isActive
    });
  };

  const handleTogglePopup = async (event) => {
    await updateEvent(event.id, {
      ...event,
      isPopup: !event.isPopup
    });
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`¿Estás seguro de eliminar el anuncio "${title}"?`)) {
      await deleteEvent(id);
    }
  };

  if (creatingNew || editingEvent) {
    return (
      <EventForm
        event={editingEvent}
        onDone={() => {
          setEditingEvent(null);
          setCreatingNew(false);
        }}
      />
    );
  }

  const getTypeBadge = (type) => {
    switch (type) {
      case 'festival':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">🎉 Festival</span>;
      case 'alerta':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200">⚠️ Alerta</span>;
      case 'cultural':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">🎭 Cultural</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">📅 Evento</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <div>
          <h2 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
            <Bell className="text-accent-500" size={24} />
            <span>Gestor de Eventos & Notificaciones Emergentes</span>
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Crea anuncios importantes, alertas de seguridad o festivales para que aparezcan como popups a los turistas.
          </p>
        </div>

        <button
          onClick={() => setCreatingNew(true)}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm transition-all shadow-lg shadow-brand-500/20 shrink-0 hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus size={18} />
          <span>Nuevo Anuncio</span>
        </button>
      </div>

      {/* Events List */}
      {allEvents.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-200">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
            <Bell size={28} />
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-1">No hay anuncios configurados</h3>
          <p className="text-gray-500 text-sm mb-5">
            Crea tu primer evento o notificación emergente para informar a los turistas que visitan Arica.
          </p>
          <button
            onClick={() => setCreatingNew(true)}
            className="px-5 py-2.5 rounded-xl bg-brand-500 text-white font-bold text-sm hover:bg-brand-600 transition-colors"
          >
            Crear Primer Anuncio
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {allEvents.map((evt) => (
            <div
              key={evt.id}
              className={`bg-white rounded-2xl border transition-all overflow-hidden flex flex-col justify-between ${
                evt.isActive ? 'border-gray-200 shadow-sm' : 'border-gray-200 opacity-60 bg-gray-50'
              }`}
            >
              {evt.bannerUrl && (
                <div className="h-36 overflow-hidden bg-gray-900 relative">
                  <img
                    src={resolveMediaUrl(evt.bannerUrl)}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2">
                    {getTypeBadge(evt.type)}
                  </div>
                  {evt.isPopup && (
                    <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-amber-500 text-white text-xs font-black tracking-wide shadow">
                      POPUP ACTIVO
                    </span>
                  )}
                </div>
              )}

              <div className="p-5 flex-1">
                {!evt.bannerUrl && (
                  <div className="flex items-center gap-2 mb-2">
                    {getTypeBadge(evt.type)}
                    {evt.isPopup && (
                      <span className="px-2 py-0.5 rounded-md bg-amber-500 text-white text-xs font-black tracking-wide">
                        POPUP ACTIVO
                      </span>
                    )}
                  </div>
                )}

                <h3 className="text-base font-bold text-gray-900 mb-1.5">{evt.title}</h3>
                <p className="text-sm text-gray-600 line-clamp-3 mb-3">{evt.message}</p>

                {(evt.startDate || evt.endDate) && (
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium mb-3">
                    <Calendar size={13} />
                    <span>
                      {evt.startDate || 'Inicio'} → {evt.endDate || 'Vigente'}
                    </span>
                  </div>
                )}

                {evt.actionUrl && (
                  <a
                    href={evt.actionUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-brand-600 hover:text-brand-700 font-semibold inline-flex items-center gap-1 mb-2"
                  >
                    <span>Enlace oficial</span>
                    <ExternalLink size={12} />
                  </a>
                )}
              </div>

              {/* Card Footer Actions */}
              <div className="px-5 py-3.5 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleActive(evt)}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold transition-colors ${
                      evt.isActive
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {evt.isActive ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
                    <span>{evt.isActive ? 'Activo' : 'Pausado'}</span>
                  </button>

                  <button
                    onClick={() => handleTogglePopup(evt)}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${
                      evt.isPopup
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    }`}
                  >
                    Popup: {evt.isPopup ? 'Sí' : 'No'}
                  </button>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setEditingEvent(evt)}
                    className="p-1.5 text-gray-500 hover:text-brand-600 hover:bg-white rounded-lg transition-colors"
                    title="Editar"
                  >
                    <Edit2 size={15} />
                  </button>
                  <button
                    onClick={() => handleDelete(evt.id, evt.title)}
                    className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-white rounded-lg transition-colors"
                    title="Eliminar"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
