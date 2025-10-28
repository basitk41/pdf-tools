import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Document, Page, pdfjs } from 'react-pdf';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  FileUp,
  Loader2,
  Download,
  Edit3,
  FileText,
  Image as ImageIcon,
  Type,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ToolPageLayout from '@/components/tool-page/ToolPageLayout';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export const EditPdf = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [editedPdfUrl, setEditedPdfUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [textToAdd, setTextToAdd] = useState('');
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [_, setError] = useState<string | null>(null);

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;
    if (files && files[0]) {
      const selectedFile = files[0];
      if (selectedFile.type !== 'application/pdf') {
        toast({
          title: t('common.error'),
          description: t('tools.edit_pdf.error_file_type'),
          variant: 'destructive',
        });
        return;
      }

      if (selectedFile.size > 100 * 1024 * 1024) {
        toast({
          title: t('common.error'),
          description: t('tools.edit_pdf.error_file_size'),
          variant: 'destructive',
        });
        return;
      }

      if (fileUrl) URL.revokeObjectURL(fileUrl);

      setFile(selectedFile);
      setFileUrl(URL.createObjectURL(selectedFile));
      setEditedPdfUrl(null);
      setError(null);
    }
  };

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const onDocumentLoadError = (error: Error) => {
    console.error('PDF load error:', error);
    setError(t('tools.edit_pdf.error_loading_pdf'));
    toast({
      title: t('common.error'),
      description: t('tools.edit_pdf.error_loading_pdf'),
      variant: 'destructive',
    });
  };

  const handleAddText = async () => {
    if (!file || !textToAdd || !pageNumber) return;

    setIsLoading(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pages = pdfDoc.getPages();
      const selectedPage = pages[pageNumber - 1];

      const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      selectedPage.drawText(textToAdd, {
        x: 50,
        y: selectedPage.getHeight() - 100,
        size: 18,
        font,
        color: rgb(0.1, 0.1, 0.9),
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as unknown as BlobPart], {
        type: 'application/pdf',
      });
      const editedUrl = URL.createObjectURL(blob);
      setEditedPdfUrl(editedUrl);

      toast({
        title: t('common.success'),
        description: t('tools.edit_pdf.text_added'),
      });
    } catch (err) {
      console.error(err);
      toast({
        title: t('common.error'),
        description: t('tools.edit_pdf.edit_error'),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;
    if (!files || !files[0] || !file) return;

    setIsLoading(true);
    try {
      const imageBytes = await files[0].arrayBuffer();
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pages = pdfDoc.getPages();
      const firstPage = pages[pageNumber - 1];

      const img = await pdfDoc.embedPng(imageBytes);
      const { width, height } = img.scale(0.5);
      firstPage.drawImage(img, {
        x: 50,
        y: firstPage.getHeight() - 150,
        width,
        height,
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as unknown as BlobPart], {
        type: 'application/pdf',
      });
      const editedUrl = URL.createObjectURL(blob);
      setEditedPdfUrl(editedUrl);
      toast({
        title: t('common.success'),
        description: t('tools.edit_pdf.image_added'),
      });
    } catch (err) {
      console.error(err);
      toast({
        title: t('common.error'),
        description: t('tools.edit_pdf.edit_error'),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (editedPdfUrl) {
      const link = document.createElement('a');
      link.href = editedPdfUrl;
      link.download = 'edited_document.pdf';
      link.click();
      toast({
        title: t('common.success'),
        description: t('tools.edit_pdf.download_success'),
      });
    }
  };

  return (
    <ToolPageLayout
      icon={<Edit3 className='text-blue-600 w-8 h-8' />}
      title={t('tools.edit_pdf.title')}
      description={t('tools.edit_pdf.description')}
    >
      <div className='container mx-auto p-4 md:p-8 flex flex-col items-center justify-center min-h-[80vh] gap-8'>
        <div className='w-full max-w-xl flex flex-col items-center gap-4 p-6 border rounded-lg shadow-lg bg-card'>
          {!file ? (
            <>
              <FileUp className='w-16 h-16 text-primary' />
              <p className='text-lg text-center text-card-foreground'>
                {t('tools.edit_pdf.upload_prompt')}
              </p>
              <input
                type='file'
                accept='application/pdf'
                onChange={onFileChange}
                className='hidden'
                ref={fileInputRef}
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                className='w-full'
              >
                <FileText className='mr-2 h-4 w-4' />{' '}
                {t('tools.edit_pdf.upload_button')}
              </Button>
            </>
          ) : (
            <>
              <p className='text-lg font-semibold text-center'>{file.name}</p>
              <Document
                file={fileUrl}
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadError={onDocumentLoadError}
              >
                <Page pageNumber={1} width={300} />
              </Document>

              {numPages && (
                <p className='text-sm text-muted-foreground'>
                  {t('tools.edit_pdf.total_pages')}: {numPages}
                </p>
              )}

              <Separator className='my-2' />

              <Label>{t('tools.edit_pdf.page_number')}</Label>
              <Input
                type='number'
                min={1}
                max={numPages || 1}
                value={pageNumber}
                onChange={(e) => setPageNumber(Number(e.target.value))}
              />

              <div className='w-full flex flex-col gap-4 mt-4'>
                {/* Add Text */}
                <div>
                  <Label>{t('tools.edit_pdf.add_text_label')}</Label>
                  <Input
                    placeholder={t('tools.edit_pdf.add_text_placeholder')}
                    value={textToAdd}
                    onChange={(e) => setTextToAdd(e.target.value)}
                    className='mt-2'
                  />
                  <Button
                    onClick={handleAddText}
                    className='w-full mt-2'
                    disabled={isLoading || !textToAdd}
                  >
                    {isLoading ? (
                      <Loader2 className='h-4 w-4 animate-spin mr-2' />
                    ) : (
                      <Type className='mr-2 h-4 w-4' />
                    )}
                    {t('tools.edit_pdf.add_text_button')}
                  </Button>
                </div>

                {/* Add Image */}
                <div>
                  <Label>{t('tools.edit_pdf.add_image_label')}</Label>
                  <input
                    type='file'
                    accept='image/*'
                    ref={imageInputRef}
                    className='hidden'
                    onChange={handleAddImage}
                  />
                  <Button
                    onClick={() => imageInputRef.current?.click()}
                    className='w-full mt-2'
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className='h-4 w-4 animate-spin mr-2' />
                    ) : (
                      <ImageIcon className='mr-2 h-4 w-4' />
                    )}
                    {t('tools.edit_pdf.add_image_button')}
                  </Button>
                </div>
              </div>

              {editedPdfUrl && (
                <>
                  <Separator className='my-4' />
                  <h3 className='text-lg font-semibold'>
                    {t('tools.edit_pdf.preview_edited')}
                  </h3>
                  <Document file={editedPdfUrl}>
                    <Page pageNumber={1} width={300} />
                  </Document>
                  <Button
                    onClick={handleDownload}
                    className='w-full mt-4'
                    disabled={!editedPdfUrl}
                  >
                    <Download className='mr-2 h-4 w-4' />{' '}
                    {t('tools.edit_pdf.download_button')}
                  </Button>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </ToolPageLayout>
  );
};
