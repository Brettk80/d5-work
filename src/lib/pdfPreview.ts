import * as PDFJS from 'pdfjs-dist';
import type { PDFDocumentLoadingTask, PDFDocumentProxy, PDFPageProxy } from 'pdfjs-dist';

// Initialize PDF.js worker
const workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS.version}/pdf.worker.min.js`;
PDFJS.GlobalWorkerOptions.workerSrc = workerSrc;

interface PreviewResult {
  dataUrl: string;
  pageCount: number;
}

export async function createPdfPreview(file: File, pageNumber: number = 1): Promise<PreviewResult> {
  try {
    // Validate file type
    if (!file || file.type !== 'application/pdf') {
      throw new Error('Invalid file type. Expected PDF.');
    }

    // Read file as ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    if (!arrayBuffer || arrayBuffer.byteLength === 0) {
      throw new Error('Empty or invalid file');
    }

    // Load the PDF document
    const loadingTask: PDFDocumentLoadingTask = PDFJS.getDocument({
      data: arrayBuffer,
      cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/cmaps/',
      cMapPacked: true,
      standardFontDataUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/standard_fonts/'
    });

    // Handle password-protected PDFs
    loadingTask.onPassword = () => {
      throw new Error('Password protected PDFs are not supported');
    };

    // Load PDF document
    const pdf: PDFDocumentProxy = await loadingTask.promise;
    const totalPages = pdf.numPages;

    // Validate page number
    if (pageNumber < 1 || pageNumber > totalPages) {
      throw new Error(`Invalid page number. Document has ${totalPages} pages.`);
    }

    // Get specific page
    const page: PDFPageProxy = await pdf.getPage(pageNumber);
    
    // Calculate viewport with a scale that provides good quality
    const viewport = page.getViewport({ scale: 2.0 }); // Increased scale for better quality

    // Create canvas with proper dimensions
    const canvas = document.createElement('canvas');
    const pixelRatio = window.devicePixelRatio || 1;
    canvas.width = viewport.width * pixelRatio;
    canvas.height = viewport.height * pixelRatio;
    canvas.style.width = `${viewport.width}px`;
    canvas.style.height = `${viewport.height}px`;

    const context = canvas.getContext('2d', { 
      alpha: false,
      willReadFrequently: true
    });

    if (!context) {
      throw new Error('Could not create canvas context');
    }

    // Set white background
    context.fillStyle = 'white';
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Scale context for high DPI displays
    context.scale(pixelRatio, pixelRatio);

    // Render PDF page
    try {
      await page.render({
        canvasContext: context,
        viewport: viewport,
        background: 'white',
        enableWebGL: true
      }).promise;

      // Convert to JPEG with good quality
      const dataUrl = canvas.toDataURL('image/jpeg', 0.95);

      // Cleanup
      canvas.width = 0;
      canvas.height = 0;
      await page.cleanup();

      return {
        dataUrl,
        pageCount: totalPages
      };
    } catch (renderError) {
      console.error('PDF rendering error:', renderError);
      throw new Error('Failed to render PDF page');
    } finally {
      // Ensure proper cleanup
      pdf.destroy().catch(console.error);
    }
  } catch (error) {
    console.error('PDF preview error:', error);
    throw error instanceof Error ? error : new Error('Unknown PDF processing error');
  }
}
