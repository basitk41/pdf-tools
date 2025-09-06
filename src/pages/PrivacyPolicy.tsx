import { useTranslation } from "react-i18next";

const PrivacyPolicy = () => {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8 dark:text-white">
        {t("privacy_policy.title")}
      </h1>
      <p className="text-center text-gray-500 mb-12 dark:text-gray-400">
        {t("privacy_policy.last_updated")}
      </p>

      <section className="mb-12">
        <p className="text-lg text-gray-700 mb-4 dark:text-gray-300">
          {t("privacy_policy.intro.paragraph1")}
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-6 dark:text-white">
          {t("privacy_policy.information_we_collect.title")}
        </h2>
        <p className="text-lg text-gray-700 dark:text-gray-300">
          {t("privacy_policy.information_we_collect.paragraph1")}
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-6 dark:text-white">
          {t("privacy_policy.how_we_use_your_information.title")}
        </h2>
        <p className="text-lg text-gray-700 dark:text-gray-300">
          {t("privacy_policy.how_we_use_your_information.paragraph1")}
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-6 dark:text-white">
          {t("privacy_policy.data_security.title")}
        </h2>
        <p className="text-lg text-gray-700 dark:text-gray-300">
          {t("privacy_policy.data_security.paragraph1")}
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-6 dark:text-white">
          {t("privacy_policy.changes_to_this_policy.title")}
        </h2>
        <p className="text-lg text-gray-700 dark:text-gray-300">
          {t("privacy_policy.changes_to_this_policy.paragraph1")}
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-6 dark:text-white">
          {t("privacy_policy.contact_us.title")}
        </h2>
        <p className="text-lg text-gray-700 dark:text-gray-300">
          {t("privacy_policy.contact_us.paragraph1")}
        </p>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
