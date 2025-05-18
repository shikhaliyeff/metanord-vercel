import { useState } from "react";
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

// Simple language switcher that directly uses the i18n instance
export function SimpleLanguageSwitcher() {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  const changeLanguage = (languageCode: string) => {
    // Close dropdown immediately for better responsiveness
    setOpen(false);
    
    // Simple direct language change
    i18n.changeLanguage(languageCode);
    
    // Log for debugging
    console.log(`Changed language to: ${languageCode}`);
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
              language.code === i18n.language ? 'bg-neutral-100' : ''
            }`}
            onClick={() => changeLanguage(language.code)}
          >
            <span className={`fi ${language.flag}`} style={{ width: '20px', height: '15px' }}></span>
            <span className="flex-1">{language.name}</span>
            {language.code === i18n.language && (
              <Check className="h-4 w-4 text-accent" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}