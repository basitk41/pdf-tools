import { useState, useCallback } from 'react';
import ToolPageLayout from '../components/tool-page/ToolPageLayout';
import FileUpload from '../components/tool-page/FileUpload';
import PrivacyDisclaimer from '../components/tool-page/PrivacyDisclaimer';
import FeedbackButton from '../components/tool-page/FeedbackButton';
import { Button } from '@/components/ui/button';
import { FileType } from 'lucide-react';

function PdfToWord() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        setSelectedFiles(Array.from(e.target.files));
      }
    },
    []
  );

  const handleConvert = useCallback(() => {
    if (selectedFiles.length === 0) {
      alert('Please select a PDF file to convert.');
      return;
    }

    const dummyContent = 'This is a dummy Word document converted from a PDF.';
    const blob = new Blob([dummyContent], {
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedFiles[0].name.replace('.pdf', '')}.docx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    alert(
      'Dummy Word document downloaded! (Actual conversion functionality needs a backend service)'
    );
  }, [selectedFiles]);

  return (
    <ToolPageLayout
      icon={<FileType className='text-blue-600 w-8 h-8' />}
      title='PDF to Word Converter'
      description='Easily convert your PDF files to editable Word documents.'
    >
      <FileUpload
        onFileChange={handleFileChange}
        fileType='.pdf'
        multiple={false}
      />
      <div className='text-center my-6'>
        <Button
          onClick={handleConvert}
          disabled={selectedFiles.length === 0}
          className='bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
        >
          Convert to Word
        </Button>
      </div>
      <PrivacyDisclaimer />
      <FeedbackButton
        onClick={() => alert('Feedback functionality coming soon!')}
      />
    </ToolPageLayout>
  );
}

export default PdfToWord;
