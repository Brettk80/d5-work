import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { createPdfPreview } from '../../lib/pdfPreview';
import { toast } from 'sonner';

interface DocumentPreviewProps {
  fileName: string;
  file: File;
  onClose: () => void;
  onDownload: () => void;
}

const DocumentPreview: React.FC<DocumentPreviewProps> = ({ 
  fileName, 
  file,
  onClose,
  onDownload 
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const loadPreview = useCallback(async () => {
    if (!file) {
      setError('No file provided');
      setIsLoading(false);
      return;
    }

    if (file.type !== 'application/pdf') {
      setError('Invalid file type. Only PDF files are supported.');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await createPdfPreview(file, currentPage);
      setPreviewUrl(result.dataUrl);
      setPageCount(result.pageCount);
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load preview';
      console.error('Preview error:', err);
      setError(message);
      
      // Retry logic for transient errors
      if (retryCount < 2) {
        setRetryCount(prev => prev + 1);
        setTimeout(() => loadPreview(), 1000);
      } else {
        toast.error(message);
      }
    } finally {
      setIsLoading(false);
    }
  }, [file, currentPage, retryCount]);

  useEffect(() => {
    loadPreview();
  }, [loadPreview]);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < pageCount) {
      setCurrentPage(prev => prev + 1);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-xl"
      >
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium text-gray-900">{fileName}</h3>
            {pageCount > 1 && (
              <p className="text-sm text-gray-500">
                Page {currentPage} of {pageCount}
              </p>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={onDownload}
              className="p-2 text-gray-500 hover:text-gray-700 rounded-md hover:bg-gray-100"
              title="Download document"
            >
              <Download className="h-5 w-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 rounded-md hover:bg-gray-100"
              title="Close preview"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="relative">
          <div className="overflow-auto max-h-[calc(90vh-8rem)]">
            <div className="flex flex-col items-center min-h-[600px] relative p-4">
              {isLoading ? (
                <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center w-full h-96 text-center p-4">
                  <p className="text-red-500 mb-4">{error}</p>
                  <button
                    onClick={() => {
                      setRetryCount(0);
                      loadPreview();
                    }}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors mb-4"
                  >
                    Retry Loading
                  </button>
                  <button
                    onClick={onDownload}
                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Download Instead
                  </button>
                </div>
              ) : previewUrl ? (
                <img
                  key={`${currentPage}-${previewUrl}`}
                  src={previewUrl}
                  alt={`Document preview - Page ${currentPage}`}
                  className="max-w-full h-auto shadow-lg"
                  style={{ maxHeight: 'calc(90vh - 12rem)' }}
                  loading="eager"
                />
              ) : null}
            </div>
          </div>

          {pageCount > 1 && !error && (
            <div className="absolute top-1/2 left-0 right-0 flex justify-between px-4 -translate-y-1/2 pointer-events-none">
              <AnimatePresence>
                {currentPage > 1 && (
                  <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    onClick={handlePreviousPage}
                    disabled={isLoading}
                    className="pointer-events-auto flex items-center justify-center w-12 h-12 rounded-full bg-blue-50 shadow-lg text-blue-600 hover:text-blue-700 hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-110 border border-blue-100"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </motion.button>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {currentPage < pageCount && (
                  <motion.button
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    onClick={handleNextPage}
                    disabled={isLoading}
                    className="pointer-events-auto flex items-center justify-center w-12 h-12 rounded-full bg-blue-50 shadow-lg text-blue-600 hover:text-blue-700 hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-110 border border-blue-100"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default DocumentPreview;
