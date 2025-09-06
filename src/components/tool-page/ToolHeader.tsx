interface ToolHeaderProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const ToolHeader = ({ icon, title, description }: ToolHeaderProps) => {
  return (
    <div className="text-center mb-8">
      <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
        {icon}
      </div>
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{title}</h1>
      <p className="text-gray-600 mt-2 dark:text-gray-400">{description}</p>
    </div>
  );
};

export default ToolHeader;
