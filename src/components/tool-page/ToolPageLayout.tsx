import BackButton from "./BackButton";
import ToolHeader from "./ToolHeader";
import PrivacyDisclaimer from "./PrivacyDisclaimer";

interface ToolPageLayoutProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
}

const ToolPageLayout = ({ icon, title, description, children }: ToolPageLayoutProps) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <BackButton />
      <ToolHeader icon={icon} title={title} description={description} />
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-4xl mx-auto dark:bg-gray-800">
        <PrivacyDisclaimer />
        {children}
      </div>
    </div>
  );
};

export default ToolPageLayout;
