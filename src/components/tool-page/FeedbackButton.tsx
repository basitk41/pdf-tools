import { useTranslation } from "react-i18next";
import { MessageSquare } from "lucide-react";

interface FeedbackButtonProps {
  onClick: () => void;
}

const FeedbackButton = ({ onClick }: FeedbackButtonProps) => {
  const { t } = useTranslation();

  return (
    <button
      onClick={onClick}
      className="fixed right-6 bottom-6 bg-blue-600 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:bg-blue-700 transition duration-300 z-40"
      aria-label={t("common.give_feedback")}
    >
      <MessageSquare className="w-6 h-6" />
    </button>
  );
};

export default FeedbackButton;
