import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const BackButton = () => {
  const { t } = useTranslation();

  return (
    <Link to="/" className="flex items-center text-blue-600 hover:text-blue-800 mb-6">
      <ArrowLeft className="mr-2" />
      {t("common.home")}
    </Link>
  );
};

export default BackButton;
