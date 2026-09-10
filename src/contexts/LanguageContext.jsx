import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getTranslation } from '../data/i18n';
import { getStoredLanguage, setStoredLanguage, getCachedTranslation, setCachedTranslation } from '../utils/storage';
import { API } from '../utils/constants';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState('es');

  useEffect(() => {
    const stored = getStoredLanguage();
    if (stored) setLanguageState(stored);
  }, []);

  const setLanguage = useCallback((lang) => {
    setLanguageState(lang);
    setStoredLanguage(lang);
  }, []);

  // Static UI translation
  const t = useCallback((key) => {
    return getTranslation(language, key);
  }, [language]);

  // Dynamic text translation via MyMemory API
  const translateText = useCallback(async (text, targetLang) => {
    if (!text || targetLang === 'es') return text;

    // Check cache first
    const cached = getCachedTranslation(text, targetLang);
    if (cached) return cached;

    try {
      const url = `${API.MYMEMORY}?q=${encodeURIComponent(text.substring(0, 500))}&langpair=es|${targetLang}&de=${API.MYMEMORY_EMAIL}`;
      const res = await fetch(url);
      const data = await res.json();

      if (data.responseStatus === 200 && data.responseData?.translatedText) {
        const translation = data.responseData.translatedText;
        setCachedTranslation(text, targetLang, translation);
        return translation;
      }
      return text;
    } catch {
      return text;
    }
  }, []);

  return (
    <LanguageContext.Provider value={{
      language,
      setLanguage,
      t,
      translateText,
    }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
