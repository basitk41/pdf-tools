import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const { t } = useTranslation();

  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
        {t("not_found.title")}
      </h1>
      <p className="mt-4 text-lg text-muted-foreground">
        {t("not_found.description")}
      </p>
      <Button asChild className="mt-8">
        <Link to="/">{t("common.home")}</Link>
      </Button>
    </div>
  );
};

export default NotFound;