import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import { SUPPORTED_LANGUAGES, COMMON_UI_ELEMENTS, CRITICAL_SECTIONS, auditLanguage, verifyKeyAcrossLanguages, logTranslationAudit } from '@/utils/translation-audit';

/**
 * Translation tester component for debugging i18n issues
 * Only shown in development mode
 */
export function TranslationTester() {
  const { t, i18n } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);
  const [showDetails, setShowDetails] = useState(false);
  const [auditResults, setAuditResults] = useState<any>(null);
  const [customKey, setCustomKey] = useState('');
  const [keyResults, setKeyResults] = useState<any>(null);

  useEffect(() => {
    // Update current language when i18n language changes
    setCurrentLanguage(i18n.language);
  }, [i18n.language]);

  // Run audit for current language
  const runLocalAudit = () => {
    const results = auditLanguage(currentLanguage);
    setAuditResults(results);
  };

  // Run comprehensive audit and log to console
  const runFullAudit = () => {
    logTranslationAudit();
    alert('Full audit results logged to console (F12)');
  };

  // Check specific key
  const checkKey = () => {
    if (!customKey) return;
    const results = verifyKeyAcrossLanguages(customKey);
    setKeyResults(results);
  };

  // Toggle visibility with keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only in development and with Alt+Shift+T
      if (e.altKey && e.shiftKey && e.key === 'T') {
        setIsVisible(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 right-0 z-50 p-4 bg-black/80 text-white rounded-tl-lg max-w-[500px] max-h-[80vh] overflow-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold">Translation Tester</h3>
        <Button size="sm" variant="ghost" onClick={() => setIsVisible(false)}>
          ✕
        </Button>
      </div>

      <div className="space-y-4">
        <div>
          <p className="mb-2">Current Language: {currentLanguage}</p>
          <div className="flex flex-wrap gap-2">
            {SUPPORTED_LANGUAGES.map(lang => (
              <Button 
                key={lang} 
                size="sm" 
                variant={lang === currentLanguage ? "default" : "outline"}
                onClick={() => i18n.changeLanguage(lang)}
              >
                {lang}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <Button size="sm" onClick={runLocalAudit}>
            Audit Current Language
          </Button>
          <Button size="sm" onClick={runFullAudit}>
            Full Audit (Console)
          </Button>
          <Button size="sm" onClick={() => setShowDetails(!showDetails)}>
            {showDetails ? 'Hide' : 'Show'} Details
          </Button>
        </div>

        <div>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={customKey}
              onChange={(e) => setCustomKey(e.target.value)}
              placeholder="Enter translation key"
              className="px-2 py-1 bg-gray-800 rounded text-white w-full"
            />
            <Button size="sm" onClick={checkKey}>
              Check
            </Button>
          </div>

          {keyResults && (
            <div className="text-xs bg-gray-900 p-2 rounded">
              <h4 className="font-bold mb-1">Results for key: {customKey}</h4>
              {Object.entries(keyResults).map(([lang, result]: [string, any]) => (
                <div key={lang} className="mb-1 border-b border-gray-800 pb-1">
                  <p>
                    {lang}: {result.isComplete ? '✅' : '❌'} 
                    {result.value ? ` "${result.value}"` : ' (missing)'}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {auditResults && (
          <div>
            <h4 className="font-bold">Audit Results for {auditResults.language}</h4>
            <p>Missing Keys: {auditResults.totalMissing}</p>
            
            {showDetails && (
              <div className="text-xs mt-2">
                <div className="mb-2">
                  <h5 className="font-bold">Critical Sections</h5>
                  {Object.entries(auditResults.criticalSections).map(([section, exists]: [string, any]) => (
                    <div key={section} className="flex justify-between">
                      <span>{section}</span>
                      <span>{exists ? '✅' : '❌'}</span>
                    </div>
                  ))}
                </div>
                
                <div>
                  <h5 className="font-bold">Common UI Elements</h5>
                  {Object.entries(auditResults.commonElements).map(([element, exists]: [string, any]) => (
                    <div key={element} className="flex justify-between">
                      <span>{element}</span>
                      <span>{exists ? '✅' : '❌'}</span>
                    </div>
                  ))}
                </div>
                
                {auditResults.missingKeys.length > 0 && (
                  <div className="mt-2">
                    <h5 className="font-bold">Missing Keys:</h5>
                    <ul className="list-disc pl-4">
                      {auditResults.missingKeys.map((key: string) => (
                        <li key={key}>{key}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {showDetails && (
          <div>
            <h4 className="font-bold mb-1">Language Testing</h4>
            <div className="text-xs space-y-1">
              {COMMON_UI_ELEMENTS.slice(0, 10).map(key => (
                <div key={key} className="flex justify-between">
                  <span>{key}</span>
                  <span>{t(key)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}