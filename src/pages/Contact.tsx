import { useTranslation } from "react-i18next";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const Contact = () => {
  const { t } = useTranslation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    alert(t("contact_page.success_message"));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-12 dark:text-white">
        {t("contact_page.title")}
      </h1>

      <section className="mb-12 max-w-3xl mx-auto text-center">
        <p className="text-lg text-gray-700 dark:text-gray-300">
          {t("contact_page.intro.paragraph1")}
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8 dark:bg-gray-800">
          <h2 className="text-2xl font-semibold mb-6 dark:text-white">
            {t("contact_page.form.title")}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2 dark:text-gray-300">
                {t("contact_page.form.name")}
              </label>
              <Input type="text" id="name" placeholder={t("contact_page.form.name")} required />
            </div>
            <div>
              <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2 dark:text-gray-300">
                {t("contact_page.form.email")}
              </label>
              <Input type="email" id="email" placeholder={t("contact_page.form.email")} required />
            </div>
            <div>
              <label htmlFor="subject" className="block text-gray-700 text-sm font-bold mb-2 dark:text-gray-300">
                {t("contact_page.form.subject")}
              </label>
              <Input type="text" id="subject" placeholder={t("contact_page.form.subject")} required />
            </div>
            <div>
              <label htmlFor="message" className="block text-gray-700 text-sm font-bold mb-2 dark:text-gray-300">
                {t("contact_page.form.message")}
              </label>
              <Textarea id="message" rows={5} placeholder={t("contact_page.form.message")} required />
            </div>
            <Button type="submit" className="w-full">
              {t("contact_page.form.submit_button")}
            </Button>
          </form>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 dark:bg-gray-800">
          <h2 className="text-2xl font-semibold mb-6 dark:text-white">
            {t("contact_page.info.title")}
          </h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Mail className="text-blue-600 w-6 h-6" />
              <div>
                <p className="text-gray-700 font-semibold dark:text-gray-300">{t("contact_page.info.email_label")}</p>
                <p className="text-gray-600 dark:text-gray-400">{t("contact_page.info.email_address")}</p>
              </div>
            </div>
            {/* Add more contact info like phone, address, social media if needed */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
