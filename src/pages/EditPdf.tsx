import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Document, Page, pdfjs } from 'react-pdf';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { Rnd } from 'react-rnd';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
  Eraser,
  X,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ToolPageLayout from '@/components/tool-page/ToolPageLayout';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

// Element type definition
type ElementType = 'text' | 'image' | 'shape' | 'drawing' | 'whiteout';

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
  fontFamily?: string;
  fontWeight?: 'normal' | 'bold';
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
  const [savedSignatures, setSavedSignatures] = useState<string[]>([]);
  const [showSignatureDialog, setShowSignatureDialog] = useState(false);
  const [activeTool, setActiveTool] = useState<
    'text' | 'image' | 'shape' | 'drawing' | 'whiteout' | null
  >(null);
  const [textInputPos, setTextInputPos] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [isCreatingSignature, setIsCreatingSignature] = useState(false);
  const signatureCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isSignatureDrawing, setIsSignatureDrawing] = useState(false);
  const [textColor, setTextColor] = useState('#000000');
  const [textFont, setTextFont] = useState('Helvetica');
  const [textSize, setTextSize] = useState(14);
  const signatureFileInputRef = useRef<HTMLInputElement>(null);

  // Load saved signatures from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('pdfSignatures');
    if (stored) {
      try {
        const signatures = JSON.parse(stored);
        setSavedSignatures(signatures);
      } catch (error) {
        console.error('Error loading signatures:', error);
      }
    }
  }, []);

  // Save signature to localStorage
  const saveSignature = (dataUrl: string) => {
    const updated = [...savedSignatures, dataUrl];
    setSavedSignatures(updated);
    localStorage.setItem('pdfSignatures', JSON.stringify(updated));
    toast({
      title: t('common.success'),
      description: 'Signature saved successfully',
    });
  };

  // Delete signature from localStorage
  const deleteSignature = (index: number) => {
    const updated = savedSignatures.filter((_, i) => i !== index);
    setSavedSignatures(updated);
    localStorage.setItem('pdfSignatures', JSON.stringify(updated));
    toast({
      title: t('common.success'),
      description: 'Signature deleted',
    });
  };

  // Use saved signature
  const applySavedSignature = (dataUrl: string) => {
    const img = new Image();
    img.onload = () => {
      const aspectRatio = img.width / img.height;
      const maxWidth = 200;
      const width = Math.min(maxWidth, img.width);
      const height = width / aspectRatio;

      const newElement: Element = {
        id: `signature-${Date.now()}`,
        type: 'image',
        x: 50,
        y: 50,
        width: width,
        height: height,
        pageNumber: pageNumber,
        dataUrl: dataUrl,
      };

      setElements([...elements, newElement]);
      setShowSignatureDialog(false);
      toast({
        title: t('common.success'),
        description: 'Signature added',
      });
    };
    img.src = dataUrl;
  };

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
    if (!textToAdd.trim() || !textInputPos) return;

    const newElement: Element = {
      id: `text-${Date.now()}`,
      type: 'text',
      x: textInputPos.x,
      y: textInputPos.y,
      width: 200,
      height: 30,
      pageNumber: pageNumber,
      text: textToAdd,
      fontSize: textSize,
      color: textColor,
      fontFamily: textFont,
      fontWeight: 'normal',
    };

    setElements([...elements, newElement]);
    setTextToAdd('');
    setTextInputPos(null);
    setActiveTool(null);
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

  const handleAddWhiteout = () => {
    const newElement: Element = {
      id: `whiteout-${Date.now()}`,
      type: 'whiteout',
      x: 50,
      y: 50,
      width: 200,
      height: 50,
      pageNumber: pageNumber,
      shapeColor: '#FFFFFF',
    };

    setElements([...elements, newElement]);
    setActiveTool(null);
    toast({
      title: t('common.success'),
      description: 'Whiteout added',
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

  // Signature Drawing functions
  const startSignatureDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsSignatureDrawing(true);
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    lastPointRef.current = { x, y };
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const drawSignature = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isSignatureDrawing || !signatureCanvasRef.current || !lastPointRef.current)
      return;
    const canvas = signatureCanvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x, y);
    lastPointRef.current = { x, y };
  };

  const stopSignatureDrawing = () => {
    if (!isSignatureDrawing) return;
    setIsSignatureDrawing(false);
    lastPointRef.current = null;
  };

  const clearSignatureCanvas = () => {
    const canvas = signatureCanvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  };

  const handleSaveNewSignature = () => {
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;

    // Check if empty
    const ctx = canvas.getContext('2d');
    const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
    const hasContent = imageData?.data.some((pixel, index) => {
      return index % 4 === 3 && pixel > 0;
    });

    if (hasContent) {
      const dataUrl = canvas.toDataURL();
      saveSignature(dataUrl);
      setIsCreatingSignature(false);
    } else {
      toast({
        title: t('common.error'),
        description: 'Please draw a signature first',
        variant: 'destructive',
      });
    }
  };

  const handleUploadSignature = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        // Adaptive background removal
        // 1. Sample corners to estimate background color
        const corners = [
          0, // Top-left
          (canvas.width - 1) * 4, // Top-right
          (canvas.height - 1) * canvas.width * 4, // Bottom-left
          (canvas.height * canvas.width - 1) * 4, // Bottom-right
        ];

        let bgR = 0,
          bgG = 0,
          bgB = 0;
        let samples = 0;

        corners.forEach((idx) => {
          if (idx < data.length) {
            bgR += data[idx];
            bgG += data[idx + 1];
            bgB += data[idx + 2];
            samples++;
          }
        });

        // Average background luminance
        const avgBgR = samples ? bgR / samples : 255;
        const avgBgG = samples ? bgG / samples : 255;
        const avgBgB = samples ? bgB / samples : 255;
        const bgLum = 0.299 * avgBgR + 0.587 * avgBgG + 0.114 * avgBgB;

        // Set threshold slightly below background (fallback to 200 if background is dark)
        const threshold = bgLum > 100 ? bgLum - 40 : 200;

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];

          // Calculate luminance
          const lum = 0.299 * r + 0.587 * g + 0.114 * b;

          // If pixel is lighter than threshold, make it transparent
          if (lum > threshold) {
            data[i + 3] = 0;
          }
        }

        ctx.putImageData(imageData, 0, 0);
        const dataUrl = canvas.toDataURL();
        saveSignature(dataUrl);
        setIsCreatingSignature(false);
        toast({
          title: t('common.success'),
          description: 'Signature uploaded and processed',
        });
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const finishDrawing = (saveAsSignature = false) => {
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

      if (saveAsSignature) {
        // Save as signature
        saveSignature(dataUrl);
      } else {
        // Add as drawing element
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
      }
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

      // Load the PDF using pdfjs to render pages as images
      // This bypasses encryption restrictions for viewing
      const loadingTask = pdfjs.getDocument(arrayBuffer);
      const pdf = await loadingTask.promise;
      const numPages = pdf.numPages;

      // Create a new PDF document
      const newPdfDoc = await PDFDocument.create();

      // Embed fonts
      const font = await newPdfDoc.embedFont(StandardFonts.Helvetica);
      const fontBold = await newPdfDoc.embedFont(StandardFonts.HelveticaBold);
      const timesFont = await newPdfDoc.embedFont(StandardFonts.TimesRoman);
      const timesFontBold = await newPdfDoc.embedFont(StandardFonts.TimesRomanBold);
      const courierFont = await newPdfDoc.embedFont(StandardFonts.Courier);
      const courierFontBold = await newPdfDoc.embedFont(StandardFonts.CourierBold);

      const getFont = (fontName?: string, fontWeight?: string) => {
        const isBold = fontWeight === 'bold';
        switch (fontName) {
          case 'Times Roman':
            return isBold ? timesFontBold : timesFont;
          case 'Courier':
            return isBold ? courierFontBold : courierFont;
          default:
            return isBold ? fontBold : font;
        }
      };

      // Process each page
      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);

        // Render page to canvas at high quality (scale 2.0)
        const viewport = page.getViewport({ scale: 2.0 });
        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const context = canvas.getContext('2d');

        if (!context) continue;

        await page.render({
          canvasContext: context,
          viewport: viewport,
        }).promise;

        // Convert canvas to image
        const imgDataUrl = canvas.toDataURL('image/jpeg', 0.8);
        const img = await newPdfDoc.embedJpg(imgDataUrl);

        // Add page to new PDF with original dimensions
        const originalViewport = page.getViewport({ scale: 1.0 });
        const { width, height } = originalViewport;
        const newPage = newPdfDoc.addPage([width, height]);

        // Draw the rendered page image
        newPage.drawImage(img, {
          x: 0,
          y: 0,
          width: width,
          height: height,
        });

        // Add user elements for this page
        const pageElements = elements.filter((el) => el.pageNumber === i);

        // Calculate scale factor (elements are positioned based on 800px width)
        const renderedWidth = 800;
        const pageScale = renderedWidth / width;

        for (const element of pageElements) {
          // Convert HTML coordinates to PDF coordinates
          const pdfX = element.x / pageScale;
          const pdfY = height - element.y / pageScale;

          switch (element.type) {
            case 'text':
              if (element.text) {
                const fontSize = element.fontSize || 18;
                const color = element.color || '#000000';
                const rgbColor = hexToRgb(color);
                const textFont = getFont(element.fontFamily, element.fontWeight);

                newPage.drawText(element.text, {
                  x: pdfX,
                  y: pdfY - fontSize,
                  size: fontSize,
                  font: textFont,
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
                  try {
                    img = await newPdfDoc.embedPng(imageBytes);
                  } catch {
                    img = await newPdfDoc.embedJpg(imageBytes);
                  }

                  const elWidth = element.width ? element.width / pageScale : 100;
                  const elHeight = element.height ? element.height / pageScale : 100;

                  newPage.drawImage(img, {
                    x: pdfX,
                    y: pdfY - elHeight,
                    width: elWidth,
                    height: elHeight,
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
                    img = await newPdfDoc.embedPng(imageBytes);
                  } catch {
                    img = await newPdfDoc.embedJpg(imageBytes);
                  }

                  const elWidth = element.width ? element.width / pageScale : 100;
                  const elHeight = element.height ? element.height / pageScale : 100;

                  newPage.drawImage(img, {
                    x: pdfX,
                    y: pdfY - elHeight,
                    width: elWidth,
                    height: elHeight,
                  });
                } catch (error) {
                  console.error('Error embedding drawing:', error);
                }
              }
              break;

            case 'shape':
              if (element.shapeType === 'rect' && element.width && element.height) {
                const elWidth = element.width / pageScale;
                const elHeight = element.height / pageScale;
                const color = element.shapeColor || '#FF0000';
                const rgbColor = hexToRgb(color);

                newPage.drawRectangle({
                  x: pdfX,
                  y: pdfY - elHeight,
                  width: elWidth,
                  height: elHeight,
                  color: rgbColor,
                });
              } else if (element.shapeType === 'circle' && element.width) {
                const radius = element.width / pageScale / 2;
                const color = element.shapeColor || '#FF0000';
                const rgbColor = hexToRgb(color);

                newPage.drawCircle({
                  x: pdfX + radius,
                  y: pdfY - radius,
                  size: radius,
                  color: rgbColor,
                });
              }
              break;

            case 'whiteout':
              if (element.width && element.height) {
                const elWidth = element.width / pageScale;
                const elHeight = element.height / pageScale;

                newPage.drawRectangle({
                  x: pdfX,
                  y: pdfY - elHeight,
                  width: elWidth,
                  height: elHeight,
                  color: rgb(1, 1, 1),
                });
              }
              break;
          }
        }
      }

      const pdfBytes = await newPdfDoc.save();
      const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
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
              {/* Floating Toolbar */}
              <div className='w-full max-w-4xl'>
                <div className='bg-card border rounded-lg shadow-lg p-4 mb-4'>
                  {/* Page Navigation */}
                  <div className='flex items-center justify-between mb-4'>
                    <div className='flex items-center gap-2'>
                      <Label className='text-sm'>
                        {t('tools.edit_pdf.page_number')}
                      </Label>
                      <Input
                        type='number'
                        min={1}
                        max={numPages || 1}
                        value={pageNumber}
                        onChange={(e) => setPageNumber(Number(e.target.value))}
                        className='w-20'
                      />
                      {numPages && (
                        <span className='text-sm text-muted-foreground'>
                          / {numPages}
                        </span>
                      )}
                    </div>
                    <Button
                      onClick={handleSave}
                      disabled={isLoading || elements.length === 0}
                      className='ml-auto'
                    >
                      {isLoading ? (
                        <Loader2 className='h-4 w-4 animate-spin mr-2' />
                      ) : (
                        <Download className='mr-2 h-4 w-4' />
                      )}
                      {t('tools.edit_pdf.download_button')}
                    </Button>
                  </div>

                  {/* Toolbar Buttons */}
                  <div className='flex flex-wrap gap-2'>
                    {/* Text Tool */}
                    <div className='flex flex-col gap-2'>
                      <Button
                        onClick={() => {
                          if (activeTool === 'text') {
                            setActiveTool(null);
                            setTextInputPos(null);
                          } else {
                            setActiveTool('text');
                            setIsDrawingMode(false);
                            toast({
                              description:
                                'Click anywhere on the PDF to add text',
                            });
                          }
                        }}
                        variant={activeTool === 'text' ? 'default' : 'outline'}
                        size='sm'
                      >
                        <Type className='h-4 w-4 mr-2' />
                        Text
                      </Button>
                      {activeTool === 'text' && (
                        <div className='flex gap-2 items-center p-2 bg-muted rounded'>
                          <div className='flex gap-1'>
                            {['#000000', '#FF0000', '#00FF00', '#0000FF'].map(
                              (color) => (
                                <button
                                  key={color}
                                  className={`w-6 h-6 rounded-full border ${
                                    textColor === color
                                      ? 'ring-2 ring-offset-1 ring-primary'
                                      : ''
                                  }`}
                                  style={{ backgroundColor: color }}
                                  onClick={() => setTextColor(color)}
                                />
                              )
                            )}
                          </div>
                          <Separator orientation='vertical' className='h-6' />
                          <select
                            className='h-8 rounded border border-input bg-background px-2 text-sm'
                            value={textFont}
                            onChange={(e) => setTextFont(e.target.value)}
                          >
                            <option value='Helvetica'>Helvetica</option>
                            <option value='Times Roman'>Times Roman</option>
                            <option value='Courier'>Courier</option>
                          </select>
                          <Input
                            type='number'
                            min={8}
                            max={72}
                            value={textSize}
                            onChange={(e) => setTextSize(Number(e.target.value))}
                            className='w-16 h-8'
                          />
                        </div>
                      )}
                    </div>

                    {/* Image Tool */}
                    <Button
                      onClick={() => imageInputRef.current?.click()}
                      variant={activeTool === 'image' ? 'default' : 'outline'}
                      size='sm'
                    >
                      <ImageIcon className='h-4 w-4 mr-2' />
                      Image
                    </Button>
                    <input
                      type='file'
                      accept='image/*'
                      ref={imageInputRef}
                      className='hidden'
                      onChange={handleAddImage}
                    />

                    {/* Signature Tool */}
                    <Button
                      onClick={() => setShowSignatureDialog(true)}
                      variant='outline'
                      size='sm'
                    >
                      <PenTool className='h-4 w-4 mr-2' />
                      Signature
                    </Button>

                    {/* Drawing Tool */}
                    <Button
                      onClick={() => {
                        if (isDrawingMode) {
                          finishDrawing();
                        } else {
                          setIsDrawingMode(true);
                          setActiveTool('drawing');
                          setSelectedElementId(null);
                        }
                      }}
                      variant={isDrawingMode ? 'default' : 'outline'}
                      size='sm'
                    >
                      <PenTool className='h-4 w-4 mr-2' />
                      {isDrawingMode ? 'Finish Draw' : 'Draw'}
                    </Button>

                    {/* Whiteout Tool */}
                    <Button
                      onClick={() => {
                        handleAddWhiteout();
                      }}
                      variant={
                        activeTool === 'whiteout' ? 'default' : 'outline'
                      }
                      size='sm'
                    >
                      <Eraser className='h-4 w-4 mr-2' />
                      Whiteout
                    </Button>

                    {/* Shapes */}
                    <Button
                      onClick={() => handleAddShape('rect')}
                      variant='outline'
                      size='sm'
                    >
                      <Square className='h-4 w-4 mr-2' />
                      Rectangle
                    </Button>
                    <Button
                      onClick={() => handleAddShape('circle')}
                      variant='outline'
                      size='sm'
                    >
                      <Square className='h-4 w-4 mr-2' />
                      Circle
                    </Button>
                  </div>

                  {isDrawingMode && (
                    <div className='mt-3 p-2 bg-muted rounded flex items-center justify-between'>
                      <p className='text-xs text-muted-foreground'>
                        Click and drag on the PDF to draw. Click "Finish Draw"
                        when done.
                      </p>
                      <div className='flex gap-2'>
                        <Button
                          onClick={() => finishDrawing()}
                          size='sm'
                          variant='outline'
                        >
                          Finish
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
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
                      cursor: activeTool === 'text' ? 'text' : 'default',
                    }}
                    onClick={(e) => {
                      if (activeTool === 'text' && !textInputPos) {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const x = e.clientX - rect.left;
                        const y = e.clientY - rect.top;
                        setTextInputPos({ x, y });
                      } else if (selectedElementId) {
                        setSelectedElementId(null);
                      }
                    }}
                  >
                    {textInputPos && (
                      <div
                        style={{
                          position: 'absolute',
                          left: textInputPos.x,
                          top: textInputPos.y,
                          zIndex: 50,
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Input
                          placeholder='Enter text'
                          value={textToAdd}
                          onChange={(e) => setTextToAdd(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              handleAddText();
                            }
                            if (e.key === 'Escape') {
                              setTextInputPos(null);
                              setTextToAdd('');
                            }
                          }}
                          onBlur={() => {
                            if (textToAdd.trim()) {
                              handleAddText();
                            } else {
                              setTextInputPos(null);
                            }
                          }}
                          className='w-48 bg-white shadow-lg'
                          autoFocus
                        />
                      </div>
                    )}
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
                          <div className='w-full h-full relative group'>
                            {selectedElementId === element.id &&
                              element.type === 'text' && (
                                <div className='absolute -top-12 left-0 bg-white shadow-lg border rounded-md p-1 flex items-center gap-2 z-50 whitespace-nowrap'>
                                  {/* Colors */}
                                  <div className='flex gap-1'>
                                    {[
                                      '#000000',
                                      '#FF0000',
                                      '#00FF00',
                                      '#0000FF',
                                    ].map((color) => (
                                      <button
                                        key={color}
                                        className={`w-4 h-4 rounded-full border ${
                                          (element.color || '#000000') === color
                                            ? 'ring-1 ring-offset-1 ring-primary'
                                            : ''
                                        }`}
                                        style={{ backgroundColor: color }}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleElementUpdate(element.id, {
                                            color,
                                          });
                                        }}
                                      />
                                    ))}
                                  </div>
                                  <Separator
                                    orientation='vertical'
                                    className='h-4'
                                  />
                                  {/* Font Family */}
                                  <select
                                    className='h-6 text-xs rounded border border-input bg-background px-1'
                                    value={element.fontFamily || 'Helvetica'}
                                    onChange={(e) => {
                                      e.stopPropagation();
                                      handleElementUpdate(element.id, {
                                        fontFamily: e.target.value,
                                      });
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <option value='Helvetica'>Helvetica</option>
                                    <option value='Times Roman'>Times</option>
                                    <option value='Courier'>Courier</option>
                                  </select>
                                  {/* Font Size */}
                                  <input
                                    type='number'
                                    className='w-10 h-6 text-xs rounded border border-input bg-background px-1'
                                    value={element.fontSize || 14}
                                    onChange={(e) => {
                                      e.stopPropagation();
                                      handleElementUpdate(element.id, {
                                        fontSize: Number(e.target.value),
                                      });
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                    min={8}
                                    max={72}
                                  />
                                  {/* Bold Toggle */}
                                  <Button
                                    variant={
                                      element.fontWeight === 'bold'
                                        ? 'default'
                                        : 'ghost'
                                    }
                                    size='icon'
                                    className='h-6 w-6'
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleElementUpdate(element.id, {
                                        fontWeight:
                                          element.fontWeight === 'bold'
                                            ? 'normal'
                                            : 'bold',
                                      });
                                    }}
                                  >
                                    <span className='font-bold text-xs'>B</span>
                                  </Button>
                                  <Separator
                                    orientation='vertical'
                                    className='h-4'
                                  />
                                  {/* Delete */}
                                  <Button
                                    variant='ghost'
                                    size='icon'
                                    className='h-6 w-6 text-destructive hover:text-destructive'
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteElement(element.id);
                                    }}
                                  >
                                    <Trash2 className='w-3 h-3' />
                                  </Button>
                                </div>
                              )}

                            {selectedElementId === element.id &&
                              element.type !== 'text' && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteElement(element.id);
                                  }}
                                  className='absolute -top-3 -right-3 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 shadow-md z-50'
                                  title='Delete element'
                                >
                                  <Trash2 className='w-3 h-4' />
                                </button>
                              )}

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
                                  color: element.color || '#000000',
                                  fontFamily:
                                    element.fontFamily === 'Times Roman'
                                      ? 'Times New Roman, serif'
                                      : element.fontFamily === 'Courier'
                                      ? 'Courier New, monospace'
                                      : 'Arial, sans-serif',
                                  fontWeight: element.fontWeight || 'normal',
                                }}
                                onClick={(e) => e.stopPropagation()}
                              />
                            )}
                            {element.type === 'image' && element.dataUrl && (
                              <img
                                src={element.dataUrl}
                                alt='Uploaded'
                                className='w-full h-full object-contain'
                                draggable={false}
                              />
                            )}
                            {element.type === 'drawing' && element.dataUrl && (
                              <img
                                src={element.dataUrl}
                                alt='Drawing'
                                className='w-full h-full object-contain'
                                draggable={false}
                              />
                            )}
                            {element.type === 'shape' && (
                              <div
                                className='w-full h-full'
                                style={{
                                  backgroundColor: 'transparent',
                                  border: `2px solid ${
                                    element.shapeColor || '#FF0000'
                                  }`,
                                  borderRadius:
                                    element.shapeType === 'circle'
                                      ? '50%'
                                      : '0',
                                }}
                              />
                            )}
                            {element.type === 'whiteout' && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteElement(element.id);
                                }}
                                className='absolute -top-3 -right-3 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 shadow-md z-50'
                                title='Delete element'
                              >
                                <Trash2 className='w-3 h-4' />
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

              {/* Legacy UI - keeping for reference but will be removed */}
              <div className='w-full flex flex-col gap-4 mt-4 hidden'>
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

      {/* Signature Dialog */}
      <Dialog
        open={showSignatureDialog}
        onOpenChange={(open) => {
          setShowSignatureDialog(open);
          if (!open) setIsCreatingSignature(false);
        }}
      >
        <DialogContent className='max-w-2xl'>
          <DialogHeader>
            <DialogTitle>
              {isCreatingSignature ? 'Draw New Signature' : 'Saved Signatures'}
            </DialogTitle>
            <DialogDescription>
              {isCreatingSignature
                ? 'Draw your signature below'
                : 'Select a saved signature to use, or draw a new one'}
            </DialogDescription>
          </DialogHeader>
          <div className='mt-4 space-y-4'>
            {isCreatingSignature ? (
              <div className='flex flex-col gap-4'>
                <div className='border rounded-lg bg-white h-60 w-full flex items-center justify-center overflow-hidden'>
                  <canvas
                    ref={signatureCanvasRef}
                    width={600}
                    height={240}
                    className='cursor-crosshair touch-none'
                    onMouseDown={startSignatureDrawing}
                    onMouseMove={drawSignature}
                    onMouseUp={stopSignatureDrawing}
                    onMouseLeave={stopSignatureDrawing}
                  />
                </div>
                <div className='flex justify-between'>
                  <Button variant='outline' onClick={clearSignatureCanvas}>
                    <Eraser className='h-4 w-4 mr-2' />
                    Clear
                  </Button>
                  <div className='flex gap-2'>
                    <Button
                      variant='ghost'
                      onClick={() => setIsCreatingSignature(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleSaveNewSignature}>Save</Button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {/* Draw New Signature */}
                <div className='flex gap-2'>
                  <Button
                    onClick={() => setIsCreatingSignature(true)}
                    variant='outline'
                    className='flex-1'
                  >
                    <PenTool className='h-4 w-4 mr-2' />
                    Draw New Signature
                  </Button>
                  <Button
                    onClick={() => signatureFileInputRef.current?.click()}
                    variant='outline'
                    className='flex-1'
                  >
                    <FileUp className='h-4 w-4 mr-2' />
                    Upload Image
                  </Button>
                  <input
                    type='file'
                    accept='image/*'
                    ref={signatureFileInputRef}
                    className='hidden'
                    onChange={handleUploadSignature}
                  />
                </div>

                {/* Saved Signatures */}
                {savedSignatures.length > 0 && (
                  <div>
                    <Label className='mb-2 block'>Saved Signatures</Label>
                    <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
                      {savedSignatures.map((signature, index) => (
                        <div
                          key={index}
                          className='relative border rounded-lg p-2 hover:bg-muted cursor-pointer group'
                          onClick={() => applySavedSignature(signature)}
                        >
                          <img
                            src={signature}
                            alt={`Signature ${index + 1}`}
                            className='w-full h-20 object-contain'
                          />
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteSignature(index);
                            }}
                            className='absolute top-1 right-1 opacity-0 group-hover:opacity-100 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600 transition-opacity'
                          >
                            <X className='h-3 w-3' />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {savedSignatures.length === 0 && (
                  <p className='text-sm text-muted-foreground text-center py-4'>
                    No saved signatures. Draw a new one to get started.
                  </p>
                )}
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </ToolPageLayout>
  );
};
