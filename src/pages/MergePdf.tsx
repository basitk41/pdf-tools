import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PDFDocument } from 'pdf-lib';
import { Button } from '@/components/ui/button';
import { X, CheckCircle, Combine } from 'lucide-react';
import ToolPageLayout from '@/components/tool-page/ToolPageLayout';
import FileUpload from '@/components/tool-page/FileUpload';

const MergePdf = () => {
  const { t } = useTranslation();
  const [files, setFiles] = useState<File[]>([]);
  const [mergedPdf, setMergedPdf] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles([...files, ...Array.from(e.target.files)]);
    }
  };

  const handleRemoveFile = (index: number) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
  };

  const handleMerge = async () => {
    if (files.length < 2) {
      // TODO: Add a toast notification here
      return;
    }

    setIsProcessing(true);
    setProgress(0);

    const mergedDoc = await PDFDocument.create();
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      const copiedPages = await mergedDoc.copyPages(pdf, pdf.getPageIndices());
      copiedPages.forEach((page) => mergedDoc.addPage(page));
      setProgress(Math.floor(((i + 1) / files.length) * 100));
    }

    const mergedPdfBytes = await mergedDoc.save();
    const mergedPdfBlob = new Blob([mergedPdfBytes], {
      type: 'application/pdf',
    });
    const mergedPdfUrl = URL.createObjectURL(mergedPdfBlob);
    setMergedPdf(mergedPdfUrl);
    setIsProcessing(false);
  };

  return (
    <ToolPageLayout
      icon={<Combine className='text-yellow-600 w-10 h-10' />}
      title={t('tools.merge_pdf.title')}
      description={t('tools.merge_pdf.description')}
    >
      <div className='flex flex-col gap-4'>
        <FileUpload onFileChange={handleFileChange} />

        {files.length > 0 && (
          <div className='flex flex-col gap-2 mb-4'>
            {files.map((file, index) => (
              <div
                key={index}
                className='flex items-center justify-between p-2 border rounded-md dark:bg-gray-700'
              >
                <span className='dark:text-white'>{file.name}</span>
                <Button
                  variant='ghost'
                  size='icon'
                  onClick={() => handleRemoveFile(index)}
                >
                  <X className='h-4 w-4 dark:text-white' />
                </Button>
              </div>
            ))}
          </div>
        )}

        {!mergedPdf && (
          <Button
            onClick={handleMerge}
            disabled={files.length < 2 || isProcessing}
            className='w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300'
          >
            {isProcessing
              ? `${t('common.processing')} (${progress}%)`
              : t('tools.merge_pdf.title')}
          </Button>
        )}

        {isProcessing && (
          <div className='mt-6'>
            <div className='flex justify-between text-sm text-gray-600 mb-1 dark:text-gray-400'>
              <span>{t('common.converting')}...</span>
              <span>{progress}%</span>
            </div>
            <div className='w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700'>
              <div
                className='progress-bar bg-blue-600 h-2.5 rounded-full'
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}

        {mergedPdf && (
          <div className='mt-6 p-4 bg-green-50 rounded-lg text-center dark:bg-green-900/20'>
            <CheckCircle className='text-green-500 w-10 h-10 mx-auto mb-3' />
            <h3 className='text-lg font-semibold text-gray-800 mb-2 dark:text-white'>
              {t('common.conversion_complete')}
            </h3>
            <p className='text-gray-600 mb-4 dark:text-gray-400'>
              {t('common.conversion_success_message')}
            </p>
            <a href={mergedPdf} download='merged.pdf'>
              <Button className='bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition duration-300'>
                <Combine className='mr-2' /> {t('common.download_merged_pdf')}
              </Button>
            </a>
          </div>
        )}

        {mergedPdf && (
          <div className='mt-8'>
            <h2 className='text-2xl font-bold mb-4'>
              {t('common.merged_pdf')}
            </h2>
            <div className='flex flex-col gap-4'>
              <iframe
                src={mergedPdf}
                className='w-full h-[600px] border rounded-md'
              />
              <a href={mergedPdf} download='merged.pdf'>
                <Button>{t('common.download')}</Button>
              </a>
            </div>
          </div>
        )}
      </div>
    </ToolPageLayout>
  );
};

export default MergePdf;
