import { useTranslation } from 'react-i18next';
import ToolGrid from '@/components/ToolGrid';

const Tools = () => {
  const { t } = useTranslation();

  return (
    <div className='container mx-auto px-4'>
      <ToolGrid />
    </div>
  );
};

export default Tools;
