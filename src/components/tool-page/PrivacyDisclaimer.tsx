import { useTranslation } from "react-i18next";
import { Info } from "lucide-react";

const PrivacyDisclaimer = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 dark:bg-blue-900/20 dark:border-blue-400">
      <div className="flex">
        <div className="flex-shrink-0">
          <Info className="text-blue-400 mt-1" />
        </div>
        <div className="ml-3">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            <strong>{t("common.privacy_note")}:</strong> {t("common.privacy_disclaimer")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyDisclaimer;
