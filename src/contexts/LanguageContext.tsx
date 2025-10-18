// src/contexts/LanguageContext.tsx
'use client';
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { translations, Translation } from '@/lib/translations';

type Language = {
  code: string;
  name: string;
};

export const languages: Language[] = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'Hindi (हिन्दी)' },
  { code: 'or', name: 'Odia (ଓଡ଼ିଆ)' },
  { code: 'te', name: 'Telugu (తెలుగు)' },
];

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  translations: Translation;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>(languages[0]);
  const [currentTranslations, setCurrentTranslations] = useState<Translation>(translations.en);

  useEffect(() => {
    setCurrentTranslations(translations[language.code as keyof typeof translations]);
  }, [language]);

  const value = {
    language,
    setLanguage,
    translations: currentTranslations,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
