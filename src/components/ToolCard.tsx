import { Link } from "react-router-dom";

interface ToolCardProps {
  to: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}

const ToolCard = ({ to, icon, title, description }: ToolCardProps) => {
  return (
    <Link to={to} className="tool-card bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg dark:bg-gray-800">
      <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
        {icon}
      </div>
      <h3 className="font-semibold text-gray-800 dark:text-white">{title}</h3>
      <p className="text-sm text-gray-600 mt-2 dark:text-gray-400">{description}</p>
    </Link>
  );
};

export default ToolCard;
