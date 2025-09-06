import { useTranslation } from "react-i18next";
import { ShieldCheck, Zap, CircleDollarSign } from "lucide-react";

const Features = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: <ShieldCheck className="text-blue-600 w-8 h-8" />,
      title: t("features.secure.title"),
      description: t("features.secure.description"),
    },
    {
      icon: <Zap className="text-green-600 w-8 h-8" />,
      title: t("features.fast.title"),
      description: t("features.fast.description"),
    },
    {
      icon: <CircleDollarSign className="text-purple-600 w-8 h-8" />,
      title: t("features.free.title"),
      description: t("features.free.description"),
    },
  ];

  return (
    <section className="py-16 bg-gray-100 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12 dark:text-white">
          {t("features.title")}
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-lg p-6 shadow-md text-center dark:bg-gray-800">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2 dark:text-white">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
