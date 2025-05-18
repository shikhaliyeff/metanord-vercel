import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

type SupportedLanguage = 'en' | 'et' | 'ru' | 'lv' | 'lt' | 'pl';

export function useLanguage() {
  const { i18n } = useTranslation();
  const [language, setLanguage] = useState<SupportedLanguage>('en');

  useEffect(() => {
    const currentLang = i18n.language as SupportedLanguage;
    setLanguage(currentLang || 'en');
  }, [i18n.language]);

  const changeLanguage = (newLanguage: SupportedLanguage) => {
    i18n.changeLanguage(newLanguage);
    setLanguage(newLanguage);
  };

  return { language, changeLanguage };
}