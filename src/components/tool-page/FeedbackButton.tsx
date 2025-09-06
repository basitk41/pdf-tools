import { useTranslation } from 'react-i18next';
import { MessageSquare } from 'lucide-react';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../ui/dialog';
import ChatUI from './ChatUI';

const FeedbackButton = () => {
  const { t } = useTranslation();
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);

  const handleButtonClick = () => {
    setIsChatModalOpen(true);
  };

  return (
    <>
      <button
        onClick={handleButtonClick}
        className='fixed right-6 bottom-6 bg-blue-600 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:bg-blue-700 transition duration-300 z-40'
        aria-label={t('common.give_feedback')}
      >
        <MessageSquare className='w-6 h-6' />
      </button>

      <Dialog open={isChatModalOpen} onOpenChange={setIsChatModalOpen}>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>{t('chat.title')}</DialogTitle>
            <DialogDescription>{t('chat.description')}</DialogDescription>
          </DialogHeader>
          <div className='py-4'>
            <ChatUI />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FeedbackButton;
