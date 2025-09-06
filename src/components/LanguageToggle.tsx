
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

const LanguageToggle = () => {
  const { i18n, t } = useTranslation();
  const [currentLang, setCurrentLang] = useState(i18n.language || "en");

  useEffect(() => {
    // Set the initial language
    i18n.changeLanguage(currentLang);
  }, []);

  const toggleLanguage = () => {
    const newLang = currentLang === "en" ? "de" : "en";
    setCurrentLang(newLang);
    i18n.changeLanguage(newLang);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleLanguage}
      aria-label={t("language.switch", { lang: currentLang === "en" ? t("language.de") : t("language.en") })}
    >
      <Globe className="w-5 h-5" />
      <span className="sr-only">
        {currentLang === "en" ? t("language.de") : t("language.en")}
      </span>
    </Button>
  );
};

export default LanguageToggle;
