import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Check, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import "flag-icons/css/flag-icons.min.css";
import i18n from "i18next";

// Define supported languages with names and flag codes
const languages = [
  { code: "en", name: "English", flag: "fi-gb" },
  { code: "et", name: "Eesti", flag: "fi-ee" },
  { code: "ru", name: "Русский", flag: "fi-ru" },
  { code: "lv", name: "Latviešu", flag: "fi-lv" },
  { code: "lt", name: "Lietuvių", flag: "fi-lt" },
  { code: "pl", name: "Polski", flag: "fi-pl" },
  { code: "zh-CN", name: "简体中文", flag: "fi-cn" }
];

// Direct language change function that bypasses optimizations when necessary
const directLanguageChange = async (languageCode: string) => {
  // Remember current scroll position
  const lastScrollPosition = window.scrollY;
  
  // Add indicator class for pending language change
  document.body.classList.add('language-changing');
  
  try {
    // Update language attribute for accessibility and SEO
    document.documentElement.lang = languageCode;
    
    // Special handling for Chinese to ensure complete translations load
    if (languageCode === 'zh-CN') {
      await i18n.changeLanguage(languageCode);
      // Force reload resources for Chinese
      await i18n.reloadResources(languageCode, 'translation');
    } else {
      await i18n.changeLanguage(languageCode);
    }
    
    // Restore scroll position after language change
    setTimeout(() => {
      window.scrollTo({
        top: lastScrollPosition,
        behavior: 'auto'
      });
      document.body.classList.remove('language-changing');
    }, 100);
    
    console.log(`Successfully changed language to: ${languageCode}`);
  } catch (error) {
    console.error('Error changing language:', error);
    document.body.classList.remove('language-changing');
  }
};

// Enhanced Language Switcher Component with direct functionality
export function LanguageSwitcherFixed() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState(i18n.language || 'en');

  // Ensure component stays in sync with i18n context
  useEffect(() => {
    const handleLanguageChange = (lang: string) => {
      setCurrentLang(lang);
    };

    i18n.on('languageChanged', handleLanguageChange);
    
    // Set initial language
    setCurrentLang(i18n.language);
    
    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, []);

  const currentLanguage = languages.find(lang => lang.code === currentLang) || languages[0];

  const changeLanguage = async (languageCode: string) => {
    // Close dropdown immediately for better responsiveness
    setOpen(false);
    
    // Change language directly to ensure it works
    await directLanguageChange(languageCode);
  };
  
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-9 px-2 gap-1 text-neutral-600 hover:text-accent hover:bg-neutral-100"
        >
          <span className={`fi ${currentLanguage.flag}`} style={{ width: '20px', height: '15px' }}></span>
          <span className="sr-only">
            {currentLanguage.name}
          </span>
          <ChevronDown className="h-4 w-4 ml-1 text-neutral-500" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[150px] p-2">
        {languages.map(language => (
          <DropdownMenuItem
            key={language.code}
            className={`flex items-center gap-2 text-sm px-2.5 py-2 cursor-pointer ${
              language.code === currentLang ? 'bg-neutral-100' : ''
            }`}
            onClick={() => changeLanguage(language.code)}
          >
            <span className={`fi ${language.flag}`} style={{ width: '20px', height: '15px' }}></span>
            <span className="flex-1">{t(`language.${language.code}`, language.name)}</span>
            {language.code === currentLang && (
              <Check className="h-4 w-4 text-accent" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}