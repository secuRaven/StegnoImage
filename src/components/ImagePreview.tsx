import React from 'react';
import { Trash2, Download, AlertCircle } from 'lucide-react';
import Button from './Button';
import { StegImageData } from '../types';

interface ImagePreviewProps {
  imageData: StegImageData;
  onClear: () => void;
  onDownload?: () => void;
  type: 'original' | 'encoded' | 'decode';
  loading?: boolean;
  error?: string | null;
  isDarkMode: boolean;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({
  imageData,
  onClear,
  onDownload,
  type,
  loading = false,
  error = null,
  isDarkMode,
}) => {
  const getImageSrc = () => {
    if (type === 'encoded' && imageData.encoded) {
      return imageData.encoded;
    }
    return imageData.preview;
  };

  const getTitle = () => {
    switch (type) {
      case 'original':
        return 'Original Image';
      case 'encoded':
        return 'Encoded Image';
      case 'decode':
        return 'Image to Decode';
      default:
        return 'Image Preview';
    }
  };

  if (error) {
    return (
      <div className={`rounded-lg ${isDarkMode ? 'bg-red-900/20 border-red-800' : 'bg-red-50 border-red-200'} border p-4 h-full flex flex-col items-center justify-center text-center`}>
        <AlertCircle className={`${isDarkMode ? 'text-red-400' : 'text-red-500'} mb-2`} size={24} />
        <p className={`${isDarkMode ? 'text-red-300' : 'text-red-600'} font-medium`}>{error}</p>
      </div>
    );
  }

  if (!imageData.preview) {
    return (
      <div className={`rounded-lg ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'} border p-4 h-64 flex flex-col items-center justify-center text-center`}>
        <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-2`}>{getTitle()}</p>
        <p className={`${isDarkMode ? 'text-gray-500' : 'text-gray-400'} text-sm`}>
          {type === 'decode' ? 'Upload an image to decode' : 'Upload an image to begin'}
        </p>
      </div>
    );
  }

  return (
    <div className={`rounded-lg ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border overflow-hidden`}>
      <div className={`p-3 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} flex justify-between items-center`}>
        <h3 className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>{getTitle()}</h3>
        <div className="flex gap-2">
          {type === 'encoded' && onDownload && (
            <Button
              onClick={onDownload}
              variant="secondary"
              size="sm"
              icon={Download}
              isDarkMode={isDarkMode}
            >
              Download
            </Button>
          )}
          <Button
            onClick={onClear}
            variant="ghost"
            size="sm"
            icon={Trash2}
            isDarkMode={isDarkMode}
          >
            Clear
          </Button>
        </div>
      </div>
      
      <div className={`relative ${loading ? 'opacity-50' : ''}`}>
        <img
          src={getImageSrc() || ''}
          alt={`${type} preview`}
          className="w-full h-auto max-h-64 object-contain p-4"
        />
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={`animate-spin rounded-full h-12 w-12 border-b-2 ${isDarkMode ? 'border-purple-400' : 'border-purple-600'}`}></div>
          </div>
        )}
      </div>
      
      {imageData.original && (
        <div className={`px-4 py-2 text-xs ${isDarkMode ? 'text-gray-400 border-t border-gray-700' : 'text-gray-500 border-t border-gray-100'}`}>
          {imageData.original.name} ({Math.round(imageData.original.size / 1024)} KB)
        </div>
      )}
    </div>
  );
};

export default ImagePreview;