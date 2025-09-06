import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="border-t">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            {t("common.privacy_disclaimer")}
          </p>
          <a
            href="mailto:feedback@example.com"
            className="text-sm text-muted-foreground hover:text-primary mt-4 md:mt-0"
          >
            {t("common.give_feedback")}
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
