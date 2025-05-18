import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Check, ChevronDown, Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import "flag-icons/css/flag-icons.min.css";
import { changeLanguageOptimized, preloadLanguage } from "@/i18n-optimizations";

const languages = [
  { code: "en", name: "English", flag: "fi-gb" },
  { code: "et", name: "Eesti", flag: "fi-ee" },
  { code: "ru", name: "Русский", flag: "fi-ru" },
  { code: "lv", name: "Latviešu", flag: "fi-lv" },
  { code: "lt", name: "Lietuvių", flag: "fi-lt" },
  { code: "pl", name: "Polski", flag: "fi-pl" },
  { code: "zh-CN", name: "简体中文", flag: "fi-cn" }
];

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation();
  const [open, setOpen] = useState(false);

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  const changeLanguage = async (languageCode: string) => {
    // Close dropdown immediately for better responsiveness
    setOpen(false);
    
    // Use optimized language change function for better performance
    await changeLanguageOptimized(languageCode);
  };
  
  // Preload languages on hover to reduce perceived latency
  const handleLanguageHover = (languageCode: string) => {
    preloadLanguage(languageCode);
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-9 px-2 gap-1 text-neutral-600 hover:text-accent hover:bg-neutral-100"
        >
          <span className={`${currentLanguage.flag}`} style={{ width: '20px', height: '15px' }}></span>
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
              language.code === i18n.language ? 'bg-neutral-100' : ''
            }`}
            onClick={() => changeLanguage(language.code)}
            onMouseEnter={() => handleLanguageHover(language.code)}
          >
            <span className={`${language.flag}`} style={{ width: '20px', height: '15px' }}></span>
            <span className="flex-1">{t(`language.${language.code}`)}</span>
            {language.code === i18n.language && (
              <Check className="h-4 w-4 text-accent" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}