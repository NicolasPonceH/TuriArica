import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { API_BASE_URL } from '../utils/constants';
import { STORAGE_KEYS, getStoredData, setStoredData } from '../utils/storage';
import { useAuth } from './AuthContext';

const EventsContext = createContext(null);

const DEFAULT_EVENTS = [
  {
    id: 1,
    title: 'Carnaval Andino con la Fuerza del Sol 2026',
    message: '¡El evento cultural y de danzas más grande del norte de Chile! Vive 3 días de emoción, comparsas y tradición andina a los pies del Morro de Arica. Más de 16.000 bailarines y músicos.',
    type: 'festival',
    startDate: '2026-01-23',
    endDate: '2026-02-15',
    isActive: false,
    isPopup: false,
    bannerUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop',
    actionUrl: 'https://aricafuerzadelsol.cl',
    priority: 1
  }
];

export function EventsProvider({ children }) {
  const [activeEvents, setActiveEvents] = useState([]);
  const [allEvents, setAllEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [featuredPopup, setFeaturedPopup] = useState(null);
  const { token, isAdmin } = useAuth();

  // 1. Fetch active events for users
  const fetchActiveEvents = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/events/active`);
      if (res.ok) {
        const data = await res.json();
        setActiveEvents(data);

        // Check if there is an active popup event that hasn't been dismissed today
        const popup = data.find(e => e.isPopup && e.isActive);
        if (popup) {
          const dismissedDate = getStoredData(`${STORAGE_KEYS.DISMISSED_POPUP}_${popup.id}`);
          const today = new Date().toISOString().split('T')[0];
          if (dismissedDate !== today) {
            setFeaturedPopup(popup);
          }
        }
        return;
      }
    } catch (err) {
      console.warn('[EVENTS] Usando eventos predeterminados.');
    } finally {
      setLoading(false);
    }

    // Fallback
    setActiveEvents(DEFAULT_EVENTS);
    const today = new Date().toISOString().split('T')[0];
    const popup = DEFAULT_EVENTS.find(e => e.isPopup && e.isActive && (!e.endDate || e.endDate >= today));
    if (popup) {
      const dismissedDate = getStoredData(`${STORAGE_KEYS.DISMISSED_POPUP}_${popup.id}`);
      if (dismissedDate !== today) {
        setFeaturedPopup(popup);
      }
    }
  }, []);

  // 2. Fetch all events for admin panel
  const fetchAllEvents = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE_URL}/events`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setAllEvents(data);
      }
    } catch (err) {
      console.warn('[EVENTS] Error al cargar lista completa de eventos.');
    }
  }, [token]);

  useEffect(() => {
    fetchActiveEvents();
  }, [fetchActiveEvents]);

  useEffect(() => {
    if (isAdmin) {
      fetchAllEvents();
    }
  }, [isAdmin, fetchAllEvents]);

  // Dismiss popup for today
  const dismissPopup = useCallback((eventId) => {
    setFeaturedPopup(null);
    const today = new Date().toISOString().split('T')[0];
    setStoredData(`${STORAGE_KEYS.DISMISSED_POPUP}_${eventId}`, today);
  }, []);

  // Admin CRUD
  const createEvent = useCallback(async (eventData) => {
    if (!token) return null;
    try {
      const res = await fetch(`${API_BASE_URL}/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(eventData)
      });
      if (res.ok) {
        const data = await res.json();
        await fetchAllEvents();
        await fetchActiveEvents();
        return data.event;
      }
    } catch (err) {
      console.error('[EVENTS] Error al crear evento:', err);
    }
    return null;
  }, [token, fetchAllEvents, fetchActiveEvents]);

  const updateEvent = useCallback(async (id, eventData) => {
    if (!token) return false;
    try {
      const res = await fetch(`${API_BASE_URL}/events/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(eventData)
      });
      if (res.ok) {
        await fetchAllEvents();
        await fetchActiveEvents();
        return true;
      }
    } catch (err) {
      console.error('[EVENTS] Error al actualizar evento:', err);
    }
    return false;
  }, [token, fetchAllEvents, fetchActiveEvents]);

  const deleteEvent = useCallback(async (id) => {
    if (!token) return false;
    try {
      const res = await fetch(`${API_BASE_URL}/events/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        await fetchAllEvents();
        await fetchActiveEvents();
        return true;
      }
    } catch (err) {
      console.error('[EVENTS] Error al eliminar evento:', err);
    }
    return false;
  }, [token, fetchAllEvents, fetchActiveEvents]);

  return (
    <EventsContext.Provider value={{
      activeEvents,
      allEvents,
      loading,
      featuredPopup,
      dismissPopup,
      fetchActiveEvents,
      fetchAllEvents,
      createEvent,
      updateEvent,
      deleteEvent
    }}>
      {children}
    </EventsContext.Provider>
  );
}

export function useEvents() {
  const ctx = useContext(EventsContext);
  if (!ctx) throw new Error('useEvents must be used within EventsProvider');
  return ctx;
}
