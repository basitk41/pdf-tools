import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const tools = [
  "merge_pdf",
  "split_pdf",
  "edit_pdf",
  "pdf_to_word",
  "word_to_pdf",
  "pdf_to_powerpoint",
  "powerpoint_to_pdf",
  "pdf_to_jpg",
  "pdf_to_png",
  "image_to_pdf",
  "pdf_to_html",
];

const Home = () => {
  const { t } = useTranslation();

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
          {t("common.title")}
        </h1>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <Link to={`/${tool}`} key={tool}>
            <Card className="h-full hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle>{t(`tools.${tool}.title`)}</CardTitle>
                <CardDescription>{t(`tools.${tool}.description`)}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;