import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Document, Page, pdfjs } from 'react-pdf';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { Rnd } from 'react-rnd';
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
  Square,
  PenTool,
  Trash2,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ToolPageLayout from '@/components/tool-page/ToolPageLayout';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

// Element type definition
type ElementType = 'text' | 'image' | 'shape' | 'drawing';

type Element = {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  width?: number;
  height?: number;
  pageNumber: number; // Page number this element belongs to
  // Text specific
  text?: string;
  fontSize?: number;
  color?: string;
  // Image specific
  dataUrl?: string;
  // Shape specific
  shapeType?: 'rect' | 'circle';
  shapeColor?: string;
  // Drawing specific
  strokeColor?: string;
  strokeWidth?: number;
};

type PageDimensions = {
  width: number;
  height: number;
  scale: number;
  originalWidth: number;
  originalHeight: number;
};

export const EditPdf = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pageContainerRef = useRef<HTMLDivElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [textToAdd, setTextToAdd] = useState('');
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [elements, setElements] = useState<Element[]>([]);
  const [pageDimensions, setPageDimensions] = useState<PageDimensions>({
    width: 0,
    height: 0,
    scale: 1,
    originalWidth: 0,
    originalHeight: 0,
  });
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(
    null
  );

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
      setElements([]);
      setPageNumber(1);
    }
  };

  const onDocumentLoadSuccess = async ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    // Dimensions will be calculated when page loads
  };

  const onPageLoadSuccess = async (page: {
    getViewport: (options: { scale: number }) => {
      width: number;
      height: number;
    };
  }) => {
    // Get original PDF dimensions for current page
    const viewport = page.getViewport({ scale: 1 });
    const container = pageContainerRef.current;

    if (container) {
      // Use the fixed width we set (800px)
      const renderedWidth = 800;
      const scale = renderedWidth / viewport.width;
      const renderedHeight = viewport.height * scale;

      setPageDimensions({
        width: renderedWidth,
        height: renderedHeight,
        scale: scale,
        originalWidth: viewport.width,
        originalHeight: viewport.height,
      });
    }
  };

  const onDocumentLoadError = (error: Error) => {
    console.error('PDF load error:', error);
    toast({
      title: t('common.error'),
      description: t('tools.edit_pdf.error_loading_pdf'),
      variant: 'destructive',
    });
  };

  const handleAddText = () => {
    if (!textToAdd.trim()) return;

    const newElement: Element = {
      id: `text-${Date.now()}`,
      type: 'text',
      x: 50,
      y: 50,
      width: 200,
      height: 30,
      pageNumber: pageNumber,
      text: textToAdd,
      fontSize: 18,
      color: '#0000E6',
    };

    setElements([...elements, newElement]);
    setTextToAdd('');
    toast({
      title: t('common.success'),
      description: t('tools.edit_pdf.text_added'),
    });
  };

  const handleAddImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;
    if (!files || !files[0]) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      const img = new Image();
      img.onload = () => {
        const aspectRatio = img.width / img.height;
        const maxWidth = 200;
        const width = Math.min(maxWidth, img.width);
        const height = width / aspectRatio;

        const newElement: Element = {
          id: `image-${Date.now()}`,
          type: 'image',
          x: 50,
          y: 50,
          width: width,
          height: height,
          pageNumber: pageNumber,
          dataUrl: dataUrl,
        };

        setElements([...elements, newElement]);
        toast({
          title: t('common.success'),
          description: t('tools.edit_pdf.image_added'),
        });
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(files[0]);

    // Reset input
    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }
  };

  const handleAddShape = (shapeType: 'rect' | 'circle') => {
    const newElement: Element = {
      id: `shape-${Date.now()}`,
      type: 'shape',
      x: 50,
      y: 50,
      width: 100,
      height: 100,
      pageNumber: pageNumber,
      shapeType: shapeType,
      shapeColor: '#FF0000',
    };

    setElements([...elements, newElement]);
    toast({
      title: t('common.success'),
      description: 'Shape added',
    });
  };

  const handleDeleteElement = (id: string) => {
    setElements(elements.filter((el) => el.id !== id));
    if (selectedElementId === id) {
      setSelectedElementId(null);
    }
  };

  // Drawing functionality
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawingMode || !canvasRef.current) return;
    setIsDrawing(true);
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    lastPointRef.current = { x, y };
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef.current || !lastPointRef.current) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();

    // Update last point for smooth drawing
    ctx.beginPath();
    ctx.moveTo(x, y);
    lastPointRef.current = { x, y };
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    lastPointRef.current = null;
    // Don't clear canvas or add to elements here - let user finish drawing first
  };

  const finishDrawing = () => {
    if (!canvasRef.current) return;
    setIsDrawing(false);
    lastPointRef.current = null;

    // Convert canvas to image and add to elements
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Check if there's actually something drawn
    const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
    const hasContent = imageData?.data.some((pixel, index) => {
      // Check alpha channel (every 4th value starting from index 3)
      return index % 4 === 3 && pixel > 0;
    });

    if (hasContent) {
      const dataUrl = canvas.toDataURL();

      const newElement: Element = {
        id: `drawing-${Date.now()}`,
        type: 'drawing',
        x: 0,
        y: 0,
        width: canvas.width,
        height: canvas.height,
        pageNumber: pageNumber,
        dataUrl: dataUrl,
      };

      setElements([...elements, newElement]);
      toast({
        title: t('common.success'),
        description: 'Drawing added',
      });
    } else {
      toast({
        title: t('common.error'),
        description: 'No drawing to add',
        variant: 'destructive',
      });
    }

    // Clear canvas
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    setIsDrawingMode(false);
  };

  const handleSave = async () => {
    if (!file || elements.length === 0) {
      toast({
        title: t('common.error'),
        description: 'No elements to save',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pages = pdfDoc.getPages();
      const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

      // Group elements by page number
      const elementsByPage = elements.reduce((acc, element) => {
        const pageIndex = element.pageNumber - 1;
        if (!acc[pageIndex]) {
          acc[pageIndex] = [];
        }
        acc[pageIndex].push(element);
        return acc;
      }, {} as Record<number, Element[]>);

      // Process elements for each page
      for (const [pageIndexStr, pageElements] of Object.entries(
        elementsByPage
      )) {
        const pageIndex = parseInt(pageIndexStr);
        if (pageIndex < 0 || pageIndex >= pages.length) {
          console.warn(`Skipping elements for invalid page ${pageIndex + 1}`);
          continue;
        }

        const selectedPage = pages[pageIndex];

        // Get page dimensions for coordinate conversion
        const pageWidth = selectedPage.getWidth();
        const pageHeight = selectedPage.getHeight();
        const renderedWidth = 800; // Same as display width
        const pageScale = renderedWidth / pageWidth;

        // Process each element on this page
        for (const element of pageElements) {
          // Convert HTML coordinates to PDF coordinates for this specific page
          const pdfX = element.x / pageScale;
          const pdfY = pageHeight - element.y / pageScale;

          switch (element.type) {
            case 'text':
              if (element.text) {
                const fontSize = element.fontSize || 18;
                const color = element.color || '#0000E6';
                const rgbColor = hexToRgb(color);

                selectedPage.drawText(element.text, {
                  x: pdfX,
                  y: pdfY - fontSize, // Adjust for text baseline
                  size: fontSize,
                  font: font,
                  color: rgbColor,
                });
              }
              break;

            case 'image':
              if (element.dataUrl) {
                try {
                  const imageBytes = await fetch(element.dataUrl).then((res) =>
                    res.arrayBuffer()
                  );
                  let img;

                  // Try PNG first, then JPG
                  try {
                    img = await pdfDoc.embedPng(imageBytes);
                  } catch {
                    img = await pdfDoc.embedJpg(imageBytes);
                  }

                  const width = element.width ? element.width / pageScale : 100;
                  const height = element.height
                    ? element.height / pageScale
                    : 100;

                  selectedPage.drawImage(img, {
                    x: pdfX,
                    y: pdfY - height, // Adjust for image origin
                    width: width,
                    height: height,
                  });
                } catch (error) {
                  console.error('Error embedding image:', error);
                }
              }
              break;

            case 'drawing':
              if (element.dataUrl) {
                try {
                  const imageBytes = await fetch(element.dataUrl).then((res) =>
                    res.arrayBuffer()
                  );
                  let img;

                  try {
                    img = await pdfDoc.embedPng(imageBytes);
                  } catch {
                    img = await pdfDoc.embedJpg(imageBytes);
                  }

                  const width = element.width ? element.width / pageScale : 100;
                  const height = element.height
                    ? element.height / pageScale
                    : 100;

                  selectedPage.drawImage(img, {
                    x: pdfX,
                    y: pdfY - height,
                    width: width,
                    height: height,
                  });
                } catch (error) {
                  console.error('Error embedding drawing:', error);
                }
              }
              break;

            case 'shape':
              if (
                element.shapeType === 'rect' &&
                element.width &&
                element.height
              ) {
                const width = element.width / pageScale;
                const height = element.height / pageScale;
                const color = element.shapeColor || '#FF0000';
                const rgbColor = hexToRgb(color);

                selectedPage.drawRectangle({
                  x: pdfX,
                  y: pdfY - height,
                  width: width,
                  height: height,
                  color: rgbColor,
                });
              } else if (
                element.shapeType === 'circle' &&
                element.width &&
                element.height
              ) {
                const radius = element.width / pageScale / 2;
                const color = element.shapeColor || '#FF0000';
                const rgbColor = hexToRgb(color);

                // Draw circle as a path
                selectedPage.drawCircle({
                  x: pdfX + radius,
                  y: pdfY - radius,
                  size: radius,
                  color: rgbColor,
                });
              }
              break;
          }
        }
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as unknown as BlobPart], {
        type: 'application/pdf',
      });
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = 'edited_document.pdf';
      link.click();

      URL.revokeObjectURL(url);

      toast({
        title: t('common.success'),
        description: t('tools.edit_pdf.download_success'),
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

  // Helper function to convert hex to RGB
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return rgb(0, 0, 0);

    const r = parseInt(result[1], 16) / 255;
    const g = parseInt(result[2], 16) / 255;
    const b = parseInt(result[3], 16) / 255;

    return rgb(r, g, b);
  };

  const handleElementUpdate = (id: string, updates: Partial<Element>) => {
    setElements(
      elements.map((el) => (el.id === id ? { ...el, ...updates } : el))
    );
  };

  return (
    <ToolPageLayout
      icon={<Edit3 className='text-blue-600 w-8 h-8' />}
      title={t('tools.edit_pdf.title')}
      description={t('tools.edit_pdf.description')}
    >
      <div className='container mx-auto p-4 md:p-8 flex flex-col items-center justify-center min-h-[80vh] gap-8'>
        <div className='w-full max-w-4xl flex flex-col items-center gap-4 p-6 border rounded-lg shadow-lg bg-card'>
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

              {/* PDF Viewer with Overlay */}
              <div
                ref={pageContainerRef}
                className='relative border rounded-lg overflow-hidden bg-gray-100'
                style={{ width: '100%', maxWidth: '800px' }}
              >
                <Document
                  file={fileUrl}
                  onLoadSuccess={onDocumentLoadSuccess}
                  onLoadError={onDocumentLoadError}
                >
                  <Page
                    pageNumber={pageNumber}
                    width={800}
                    onLoadSuccess={onPageLoadSuccess}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                  />
                </Document>

                {/* Overlay for interactive elements */}
                {pageDimensions.width > 0 && pageDimensions.height > 0 && (
                  <div
                    className='absolute top-0 left-0'
                    style={{
                      width: `${pageDimensions.width}px`,
                      height: `${pageDimensions.height}px`,
                      pointerEvents: isDrawingMode ? 'none' : 'auto',
                    }}
                  >
                    {elements
                      .filter((element) => element.pageNumber === pageNumber)
                      .map((element) => (
                        <Rnd
                          key={element.id}
                          size={{
                            width: element.width || 100,
                            height: element.height || 100,
                          }}
                          position={{ x: element.x, y: element.y }}
                          onDragStart={() => {
                            if (!isDrawingMode) {
                              setSelectedElementId(element.id);
                            }
                          }}
                          onDragStop={(_e, d) => {
                            if (!isDrawingMode) {
                              handleElementUpdate(element.id, {
                                x: d.x,
                                y: d.y,
                              });
                            }
                          }}
                          onResizeStop={(
                            _e,
                            _direction,
                            ref,
                            _delta,
                            position
                          ) => {
                            if (!isDrawingMode) {
                              handleElementUpdate(element.id, {
                                x: position.x,
                                y: position.y,
                                width: parseInt(ref.style.width),
                                height: parseInt(ref.style.height),
                              });
                            }
                          }}
                          bounds='parent'
                          disableDragging={isDrawingMode}
                          enableResizing={!isDrawingMode}
                          style={{
                            border:
                              selectedElementId === element.id
                                ? '2px solid blue'
                                : '1px dashed #ccc',
                            cursor: isDrawingMode ? 'default' : 'move',
                            zIndex: selectedElementId === element.id ? 10 : 1,
                          }}
                          onClick={(e: React.MouseEvent) => {
                            if (!isDrawingMode) {
                              e.stopPropagation();
                              setSelectedElementId(element.id);
                            }
                          }}
                        >
                          <div className='relative w-full h-full'>
                            {element.type === 'text' && (
                              <textarea
                                value={element.text || ''}
                                onChange={(e) =>
                                  handleElementUpdate(element.id, {
                                    text: e.target.value,
                                  })
                                }
                                className='w-full h-full resize-none border-none outline-none bg-transparent'
                                style={{
                                  fontSize: `${element.fontSize || 18}px`,
                                  color: element.color || '#0000E6',
                                  fontFamily: 'Arial, sans-serif',
                                }}
                                onClick={(e) => e.stopPropagation()}
                              />
                            )}
                            {element.type === 'image' && element.dataUrl && (
                              <img
                                src={element.dataUrl}
                                alt=''
                                className='w-full h-full object-contain'
                                draggable={false}
                              />
                            )}
                            {element.type === 'drawing' && element.dataUrl && (
                              <img
                                src={element.dataUrl}
                                alt=''
                                className='w-full h-full object-contain'
                                draggable={false}
                              />
                            )}
                            {element.type === 'shape' && (
                              <div
                                className='w-full h-full'
                                style={{
                                  backgroundColor:
                                    element.shapeColor || '#FF0000',
                                  borderRadius:
                                    element.shapeType === 'circle'
                                      ? '50%'
                                      : '0',
                                }}
                              />
                            )}
                            {selectedElementId === element.id && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteElement(element.id);
                                }}
                                className='absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600'
                              >
                                <Trash2 className='w-3 h-3' />
                              </button>
                            )}
                          </div>
                        </Rnd>
                      ))}
                  </div>
                )}

                {/* Drawing Canvas */}
                {isDrawingMode &&
                  pageDimensions.width > 0 &&
                  pageDimensions.height > 0 && (
                    <canvas
                      ref={canvasRef}
                      width={pageDimensions.width}
                      height={pageDimensions.height}
                      className='absolute top-0 left-0'
                      style={{
                        cursor: 'crosshair',
                        zIndex: 100,
                        pointerEvents: 'auto',
                      }}
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={stopDrawing}
                      onMouseLeave={stopDrawing}
                    />
                  )}
              </div>

              {numPages && (
                <p className='text-sm text-muted-foreground'>
                  {t('tools.edit_pdf.total_pages')}: {numPages}
                </p>
              )}

              <Separator className='my-2' />

              <div className='w-full'>
                <Label>{t('tools.edit_pdf.page_number')}</Label>
                <Input
                  type='number'
                  min={1}
                  max={numPages || 1}
                  value={pageNumber}
                  onChange={(e) => setPageNumber(Number(e.target.value))}
                />
                <p className='text-xs text-muted-foreground mt-1'>
                  Elements will be added to the currently selected page
                </p>
              </div>

              <div className='w-full flex flex-col gap-4 mt-4'>
                {/* Add Text */}
                <div>
                  <Label>{t('tools.edit_pdf.add_text_label')}</Label>
                  <Input
                    placeholder={t('tools.edit_pdf.add_text_placeholder')}
                    value={textToAdd}
                    onChange={(e) => setTextToAdd(e.target.value)}
                    className='mt-2'
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleAddText();
                      }
                    }}
                  />
                  <Button
                    onClick={handleAddText}
                    className='w-full mt-2'
                    disabled={!textToAdd.trim()}
                  >
                    <Type className='mr-2 h-4 w-4' />
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
                  >
                    <ImageIcon className='mr-2 h-4 w-4' />
                    {t('tools.edit_pdf.add_image_button')}
                  </Button>
                </div>

                {/* Add Shape */}
                <div>
                  <Label>Add Shape</Label>
                  <div className='flex gap-2 mt-2'>
                    <Button
                      onClick={() => handleAddShape('rect')}
                      className='flex-1'
                      variant='outline'
                    >
                      <Square className='mr-2 h-4 w-4' />
                      Rectangle
                    </Button>
                    <Button
                      onClick={() => handleAddShape('circle')}
                      className='flex-1'
                      variant='outline'
                    >
                      <Square className='mr-2 h-4 w-4' />
                      Circle
                    </Button>
                  </div>
                </div>

                {/* Drawing Mode */}
                <div>
                  <Label>Drawing / Signature</Label>
                  <Button
                    onClick={() => {
                      if (isDrawingMode) {
                        // If currently in drawing mode, finish the drawing
                        finishDrawing();
                      } else {
                        setIsDrawingMode(true);
                        setSelectedElementId(null);
                      }
                    }}
                    className='w-full mt-2'
                    variant={isDrawingMode ? 'default' : 'outline'}
                  >
                    <PenTool className='mr-2 h-4 w-4' />
                    {isDrawingMode ? 'Finish Drawing' : 'Start Drawing'}
                  </Button>
                  {isDrawingMode && (
                    <div className='mt-2 space-y-1'>
                      <p className='text-xs text-muted-foreground'>
                        Click and drag on the PDF to draw. You can draw multiple
                        strokes. Click "Finish Drawing" when done.
                      </p>
                      <Button
                        onClick={() => {
                          finishDrawing();
                        }}
                        className='w-full'
                        variant='outline'
                        size='sm'
                      >
                        Finish & Add Drawing
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Save Button */}
              {elements.length > 0 && (
                <>
                  <Separator className='my-4' />
                  <Button
                    onClick={handleSave}
                    className='w-full'
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className='h-4 w-4 animate-spin mr-2' />
                    ) : (
                      <Download className='mr-2 h-4 w-4' />
                    )}
                    {t('tools.edit_pdf.download_button')}
                  </Button>
                  <p className='text-xs text-muted-foreground text-center mt-2'>
                    {elements.length} element{elements.length !== 1 ? 's' : ''}{' '}
                    added
                  </p>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </ToolPageLayout>
  );
};
