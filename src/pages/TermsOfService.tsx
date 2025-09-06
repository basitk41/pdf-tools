import { useTranslation } from "react-i18next";

const TermsOfService = () => {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8 dark:text-white">
        {t("terms_of_service.title")}
      </h1>
      <p className="text-center text-gray-500 mb-12 dark:text-gray-400">
        {t("terms_of_service.last_updated")}
      </p>

      <section className="mb-12">
        <p className="text-lg text-gray-700 mb-4 dark:text-gray-300">
          {t("terms_of_service.intro.paragraph1")}
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-6 dark:text-white">
          {t("terms_of_service.acceptance_of_terms.title")}
        </h2>
        <p className="text-lg text-gray-700 dark:text-gray-300">
          {t("terms_of_service.acceptance_of_terms.paragraph1")}
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-6 dark:text-white">
          {t("terms_of_service.use_of_service.title")}
        </h2>
        <p className="text-lg text-gray-700 dark:text-gray-300">
          {t("terms_of_service.use_of_service.paragraph1")}
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-6 dark:text-white">
          {t("terms_of_service.intellectual_property.title")}
        </h2>
        <p className="text-lg text-gray-700 dark:text-gray-300">
          {t("terms_of_service.intellectual_property.paragraph1")}
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-6 dark:text-white">
          {t("terms_of_service.disclaimer_of_warranties.title")}
        </h2>
        <p className="text-lg text-gray-700 dark:text-gray-300">
          {t("terms_of_service.disclaimer_of_warranties.paragraph1")}
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-6 dark:text-white">
          {t("terms_of_service.limitation_of_liability.title")}
        </h2>
        <p className="text-lg text-gray-700 dark:text-gray-300">
          {t("terms_of_service.limitation_of_liability.paragraph1")}
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-6 dark:text-white">
          {t("terms_of_service.changes_to_terms.title")}
        </h2>
        <p className="text-lg text-gray-700 dark:text-gray-300">
          {t("terms_of_service.changes_to_terms.paragraph1")}
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-6 dark:text-white">
          {t("terms_of_service.governing_law.title")}
        </h2>
        <p className="text-lg text-gray-700 dark:text-gray-300">
          {t("terms_of_service.governing_law.paragraph1")}
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-6 dark:text-white">
          {t("terms_of_service.contact_us.title")}
        </h2>
        <p className="text-lg text-gray-700 dark:text-gray-300">
          {t("terms_of_service.contact_us.paragraph1")}
        </p>
      </section>
    </div>
  );
};

export default TermsOfService;
