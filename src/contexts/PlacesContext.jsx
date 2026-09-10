import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { defaultPlaces } from '../data/places';
import { getStoredPlaces, setStoredPlaces } from '../utils/storage';
import { getCategoryMeta } from '../data/categories';

const PlacesContext = createContext(null);

export function PlacesProvider({ children }) {
  const [adminPlaces, setAdminPlaces] = useState([]);

  // Load admin places from localStorage on mount
  useEffect(() => {
    const stored = getStoredPlaces();
    if (stored && stored.length > 0) {
      setAdminPlaces(stored);
    }
  }, []);

  // Persist admin places to localStorage on change
  useEffect(() => {
    setStoredPlaces(adminPlaces);
  }, [adminPlaces]);

  // Merge default + admin places
  const allPlaces = [...defaultPlaces, ...adminPlaces];

  // Get unique categories from all places
  const categories = [...new Set(allPlaces.map(p => p.category))];

  // CRUD Operations (only for admin places)
  const addPlace = useCallback((place) => {
    const newId = Math.max(0, ...allPlaces.map(p => p.id)) + 1;
    const meta = getCategoryMeta(place.category);
    const newPlace = {
      ...place,
      id: newId,
      icon: meta.icon,
      color: meta.color,
      type: meta.type,
      isDefault: false,
      transport: place.transport || { lineas: [], direccion: "", letrero: "", parada: "" },
    };
    setAdminPlaces(prev => [...prev, newPlace]);
    return newPlace;
  }, [allPlaces]);

  const updatePlace = useCallback((id, data) => {
    // Check if it's a default place — cannot edit defaults
    const isDefault = defaultPlaces.some(p => p.id === id);
    if (isDefault) return false;

    setAdminPlaces(prev => prev.map(p => {
      if (p.id === id) {
        const meta = getCategoryMeta(data.category || p.category);
        return { ...p, ...data, icon: meta.icon, color: meta.color, type: meta.type };
      }
      return p;
    }));
    return true;
  }, []);

  const deletePlace = useCallback((id) => {
    const isDefault = defaultPlaces.some(p => p.id === id);
    if (isDefault) return false;

    setAdminPlaces(prev => prev.filter(p => p.id !== id));
    return true;
  }, []);

  // Search places by name, category, or description
  const searchPlaces = useCallback((query) => {
    if (!query || query.trim() === '') return allPlaces;
    const q = query.toLowerCase().trim();
    return allPlaces.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.shortDesc.toLowerCase().includes(q) ||
      (p.type && p.type.toLowerCase().includes(q))
    );
  }, [allPlaces]);

  // Filter by category
  const getPlacesByCategory = useCallback((category) => {
    if (!category || category === 'Todos') return allPlaces;
    return allPlaces.filter(p => p.category === category);
  }, [allPlaces]);

  // Filter by type
  const getPlacesByType = useCallback((type) => {
    if (!type || type === 'todos') return allPlaces;
    return allPlaces.filter(p => p.type === type);
  }, [allPlaces]);

  // Import/export
  const exportData = useCallback(() => {
    return JSON.stringify(adminPlaces, null, 2);
  }, [adminPlaces]);

  const importData = useCallback((jsonString) => {
    try {
      const data = JSON.parse(jsonString);
      if (Array.isArray(data)) {
        setAdminPlaces(data);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, []);

  return (
    <PlacesContext.Provider value={{
      places: allPlaces,
      adminPlaces,
      defaultPlaces,
      categories,
      addPlace,
      updatePlace,
      deletePlace,
      searchPlaces,
      getPlacesByCategory,
      getPlacesByType,
      exportData,
      importData,
    }}>
      {children}
    </PlacesContext.Provider>
  );
}

export function usePlaces() {
  const ctx = useContext(PlacesContext);
  if (!ctx) throw new Error('usePlaces must be used within PlacesProvider');
  return ctx;
}
