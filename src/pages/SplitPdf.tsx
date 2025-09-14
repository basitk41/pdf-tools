import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { PDFDocument } from 'pdf-lib';
import JSZip from 'jszip';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Loader2, FileUp, Files, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

export const SplitPdf = () => {
  const { t } = useTranslation();
  const [file, setFile] = useState<File | null>(null);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [splitOption, setSplitOption] = useState<'all' | 'range'>('all');
  const [pageRanges, setPageRanges] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [splitPdfUrls, setSplitPdfUrls] = useState<string[]>([]); // To store URLs of split PDFs or a single ZIP
  const [error, setError] = useState<string | null>(null); // State to handle errors
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;
    if (files && files[0]) {
      const selectedFile = files[0];
      console.log(
        'File selected:',
        selectedFile.name,
        selectedFile.type,
        selectedFile.size
      );
      if (selectedFile.type !== 'application/pdf') {
        toast({
          title: t('common.error'),
          description: t('tools.split_pdf.error_file_type'),
          variant: 'destructive',
        });
        return;
      }
      if (selectedFile.size > 100 * 1024 * 1024) {
        // 100 MB limit
        toast({
          title: t('common.error'),
          description: t('tools.split_pdf.error_file_size'),
          variant: 'destructive',
        });
        return;
      }
      setFile(selectedFile);
      setSplitPdfUrls([]);
      setError(null); // Clear any previous errors
    }
  };

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    console.log('Document loaded successfully. Number of pages:', numPages);
    setNumPages(numPages);
    if (numPages === 0) {
      setError(t('tools.split_pdf.error_no_pages'));
      toast({
        title: t('common.error'),
        description: t('tools.split_pdf.error_no_pages'),
        variant: 'destructive',
      });
    }
  };

  const onDocumentLoadError = (error: Error) => {
    console.error('Error loading document:', error);
    setError(t('tools.split_pdf.error_loading_pdf'));
    toast({
      title: t('common.error'),
      description: t('tools.split_pdf.error_loading_pdf'),
      variant: 'destructive',
    });
  };

  const parsePageRanges = (
    rangeString: string,
    totalPages: number
  ): number[][] => {
    const ranges: number[][] = [];
    rangeString.split(',').forEach((part) => {
      const trimmedPart = part.trim();
      if (trimmedPart.includes('-')) {
        const [start, end] = trimmedPart.split('-').map(Number);
        if (
          !isNaN(start) &&
          !isNaN(end) &&
          start >= 1 &&
          end <= totalPages &&
          start <= end
        ) {
          ranges.push([start, end]);
        } else {
          setError(t('tools.split_pdf.error_invalid_ranges'));
        }
      } else {
        const pageNum = Number(trimmedPart);
        if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
          ranges.push([pageNum, pageNum]);
        } else {
          setError(t('tools.split_pdf.error_invalid_ranges'));
        }
      }
    });
    return ranges;
  };

  const handleSplitPdf = async () => {
    console.log('Attempting to split PDF. Current state: ', {
      file: !!file,
      numPages,
      error,
    });
    if (!file || !numPages || error) {
      toast({
        title: t('common.error'),
        description: error || t('tools.split_pdf.error_no_file_or_pages'),
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setSplitPdfUrls([]);
    setError(null);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const splitDocs: { name: string; pdfBytes: Uint8Array }[] = [];

      if (splitOption === 'all') {
        for (let i = 0; i < numPages; i++) {
          const subDocument = await PDFDocument.create();
          const [copiedPage] = await subDocument.copyPages(pdfDoc, [i]);
          subDocument.addPage(copiedPage);
          const pdfBytes = await subDocument.save();
          splitDocs.push({
            name: `${file.name.replace('.pdf', '')}_page_${i + 1}.pdf`,
            pdfBytes: pdfBytes,
          });
        }
      } else if (splitOption === 'range' && pageRanges) {
        const parsedRanges = parsePageRanges(pageRanges, numPages);

        if (parsedRanges.length === 0 || error) {
          toast({
            title: t('common.error'),
            description: error || t('tools.split_pdf.error_invalid_ranges'),
            variant: 'destructive',
          });
          setIsLoading(false);
          return;
        }

        for (const range of parsedRanges) {
          const subDocument = await PDFDocument.create();
          const pagesToCopy: number[] = [];
          for (let i = range[0] - 1; i < range[1]; i++) {
            pagesToCopy.push(i);
          }
          const copiedPages = await subDocument.copyPages(pdfDoc, pagesToCopy);
          copiedPages.forEach((page) => subDocument.addPage(page));
          const pdfBytes = await subDocument.save();
          const rangeName =
            range[0] === range[1]
              ? `page_${range[0]}`
              : `pages_${range[0]}-${range[1]}`;
          splitDocs.push({
            name: `${file.name.replace('.pdf', '')}_${rangeName}.pdf`,
            pdfBytes: pdfBytes,
          });
        }
      }

      if (splitDocs.length === 0) {
        toast({
          title: t('common.error'),
          description: t('tools.split_pdf.error_no_output'),
          variant: 'destructive',
        });
        setIsLoading(false);
        return;
      }

      if (splitDocs.length > 1) {
        const zip = new JSZip();
        for (const doc of splitDocs) {
          zip.file(doc.name, doc.pdfBytes);
        }
        const zipBlob = await zip.generateAsync({ type: 'blob' });
        setSplitPdfUrls([URL.createObjectURL(zipBlob)]);
        toast({
          title: t('common.success'),
          description: t('tools.split_pdf.split_success_zip'),
        });
      } else if (splitDocs.length === 1) {
        setSplitPdfUrls([
          URL.createObjectURL(
            new Blob([splitDocs[0].pdfBytes], { type: 'application/pdf' })
          ),
        ]);
        toast({
          title: t('common.success'),
          description: t('tools.split_pdf.split_success_single'),
        });
      }
    } catch (error: any) {
      console.error('Error splitting PDF:', error);
      setError(error.message);
      toast({
        title: t('common.error'),
        description: t('tools.split_pdf.split_error') + `: ${error.message}`,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (splitPdfUrls.length > 0 && file) {
      const url = splitPdfUrls[0];
      const link = document.createElement('a');
      link.href = url;
      if (
        splitPdfUrls.length > 1 ||
        (splitOption === 'all' &&
          splitPdfUrls.length === 1 &&
          splitPdfUrls[0].endsWith('.zip'))
      ) {
        link.download = `${file.name.replace('.pdf', '')}_split.zip`;
      } else if (splitOption === 'range' && splitPdfUrls.length === 1) {
        const parsedRanges = parsePageRanges(pageRanges, numPages || 0);
        const rangeName =
          parsedRanges.length === 1 && parsedRanges[0][0] === parsedRanges[0][1]
            ? `page_${parsedRanges[0][0]}`
            : `pages_${parsedRanges[0][0]}-${parsedRanges[0][1]}`;
        link.download = `${file.name.replace('.pdf', '')}_${rangeName}.pdf`;
      } else {
        link.download = `split_${file?.name || 'document'}.pdf`;
      }

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      if (!url.endsWith('.zip')) {
        URL.revokeObjectURL(url);
      }
      setSplitPdfUrls([]);
      setFile(null);
      setNumPages(null);
      setPageRanges('');
      setSplitOption('all');
      setError(null);
    }
  };

  return (
    <div className='container mx-auto p-4 md:p-8 lg:p-12 flex flex-col items-center justify-center min-h-[80vh] bg-background text-foreground gap-8'>
      <h1 className='text-4xl font-bold text-center'>
        {t('tools.split_pdf.title')}
      </h1>
      <p className='text-lg text-muted-foreground text-center max-w-prose'>
        {t('tools.split_pdf.description')}
      </p>

      <div className='w-full max-w-xl flex flex-col items-center gap-4 p-6 border rounded-lg shadow-lg bg-card'>
        {!file ? (
          <>
            <FileUp className='w-16 h-16 text-primary' />
            <p className='text-lg text-center text-card-foreground'>
              {t('tools.split_pdf.upload_prompt')}
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
              <Files className='mr-2 h-4 w-4' />{' '}
              {t('tools.split_pdf.upload_button')}
            </Button>
          </>
        ) : (
          <div className='w-full flex flex-col gap-4'>
            <p className='text-lg font-semibold text-center text-card-foreground'>
              {t('tools.split_pdf.selected_file')}: {file.name}
            </p>
            {numPages && (
              <p className='text-sm text-center text-muted-foreground'>
                {t('tools.split_pdf.total_pages')}: {numPages}
              </p>
            )}
            {/* Add the Document component here for initial preview and numPages detection */}
            {!splitPdfUrls.length && file && (
              <div className='w-full flex justify-center mt-4'>
                <Document
                  file={file}
                  onLoadSuccess={onDocumentLoadSuccess}
                  onLoadError={onDocumentLoadError}
                >
                  <Page pageNumber={1} width={300} />
                </Document>
              </div>
            )}
            {error && (
              <p className='text-sm text-center text-destructive'>{error}</p>
            )}
            <Separator className='my-2' />
            <h2 className='text-xl font-semibold text-card-foreground'>
              {t('tools.split_pdf.options_heading')}
            </h2>
            <RadioGroup
              value={splitOption}
              onValueChange={(value: 'all' | 'range') => setSplitOption(value)}
              className='flex flex-col space-y-2'
            >
              <div className='flex items-center space-x-2'>
                <RadioGroupItem value='all' id='split-all' />
                <Label htmlFor='split-all'>
                  {t('tools.split_pdf.split_all_pages')}
                </Label>
              </div>
              <div className='flex items-center space-x-2'>
                <RadioGroupItem value='range' id='split-range' />
                <Label htmlFor='split-range'>
                  {t('tools.split_pdf.split_by_range')}
                </Label>
              </div>
            </RadioGroup>

            {splitOption === 'range' && (
              <div className='mt-4'>
                <Label htmlFor='page-ranges'>
                  {t('tools.split_pdf.page_ranges_label')}
                </Label>
                <Input
                  id='page-ranges'
                  placeholder={t('tools.split_pdf.page_ranges_placeholder')}
                  value={pageRanges}
                  onChange={(e) => setPageRanges(e.target.value)}
                  className='mt-2'
                />
                <p className='text-sm text-muted-foreground mt-1'>
                  {t('tools.split_pdf.page_ranges_helper')}
                </p>
              </div>
            )}
            <Button
              onClick={handleSplitPdf}
              className='w-full mt-4'
              disabled={
                isLoading ||
                !file ||
                (splitOption === 'range' && !pageRanges) ||
                !!error
              }
            >
              {isLoading ? (
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              ) : (
                <Files className='mr-2 h-4 w-4' />
              )}
              {t('tools.split_pdf.split_button')}
            </Button>

            {splitPdfUrls.length > 0 && (
              <div className='mt-6 w-full flex flex-col items-center gap-4'>
                <h2 className='text-xl font-semibold text-card-foreground'>
                  {t('tools.split_pdf.result_heading')}
                </h2>
                {/* Display a preview of the first split PDF if it's a single file, otherwise a ZIP icon */}
                {splitPdfUrls.length === 1 &&
                !splitPdfUrls[0].endsWith('.zip') ? (
                  <Document
                    file={splitPdfUrls[0]}
                    onLoadSuccess={onDocumentLoadSuccess}
                    onLoadError={onDocumentLoadError}
                  >
                    <Page pageNumber={1} width={300} />
                  </Document>
                ) : (
                  <div className='flex flex-col items-center gap-2'>
                    <Download className='w-16 h-16 text-primary' />
                    <p className='text-lg text-center text-card-foreground'>
                      {t('tools.split_pdf.zip_ready')}
                    </p>
                  </div>
                )}
                <Button onClick={handleDownload} className='w-full'>
                  <Download className='mr-2 h-4 w-4' />{' '}
                  {t('tools.split_pdf.download_button')}
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
