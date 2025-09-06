import { useTranslation } from 'react-i18next';
import { UploadCloud } from 'lucide-react';

interface FileUploadProps {
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fileType?: string;
  multiple?: boolean;
}

const FileUpload = ({
  onFileChange,
  fileType = '.pdf',
  multiple = true,
}: FileUploadProps) => {
  const { t } = useTranslation();

  return (
    <div className='drop-zone border-2 border-dashed rounded-lg p-8 text-center mb-6'>
      <UploadCloud className='text-gray-400 w-16 h-16 mx-auto mb-4' />
      <p className='text-gray-600 mb-2 dark:text-gray-400'>
        {t('common.drag_and_drop')}
      </p>
      <p className='text-gray-500 text-sm mb-4'>{t('common.or')}</p>
      <label
        htmlFor='file-upload'
        className='bg-blue-600 text-white px-6 py-2 rounded-lg cursor-pointer hover:bg-blue-700 transition duration-300'
      >
        {t('common.browse_files')}
      </label>
      <input
        id='file-upload'
        type='file'
        className='hidden'
        multiple={multiple}
        onChange={onFileChange}
        accept={fileType}
      />
      <p className='text-gray-400 text-sm mt-4'>{t('common.max_file_size')}</p>
    </div>
  );
};

export default FileUpload;
