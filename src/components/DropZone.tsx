import React, { useCallback, useState } from 'react';
import { Upload, ImageIcon } from 'lucide-react';

interface DropZoneProps {
  onImageSelected: (file: File) => void;
  acceptedTypes?: string[];
  maxSizeMB?: number;
  isDarkMode: boolean;
}

const DropZone: React.FC<DropZoneProps> = ({
  onImageSelected,
  acceptedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  maxSizeMB = 5,
  isDarkMode,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileValidation = (file: File): boolean => {
    // Reset error
    setError(null);
    
    // Check file type
    if (!acceptedTypes.includes(file.type)) {
      setError(`Invalid file type. Please use: ${acceptedTypes.join(', ')}`);
      return false;
    }
    
    // Check file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      setError(`File is too large. Maximum size is ${maxSizeMB}MB.`);
      return false;
    }
    
    return true;
  };

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        const file = e.dataTransfer.files[0];
        
        if (handleFileValidation(file)) {
          onImageSelected(file);
        }
      }
    },
    [onImageSelected]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        
        if (handleFileValidation(file)) {
          onImageSelected(file);
        }
      }
    },
    [onImageSelected]
  );

  return (
    <div
      className={`
        rounded-lg border-2 border-dashed p-8
        transition-colors duration-200 ease-in-out
        ${isDragging 
          ? (isDarkMode ? 'border-purple-500 bg-purple-900/20' : 'border-purple-500 bg-purple-50') 
          : (isDarkMode ? 'border-gray-700 hover:border-gray-500' : 'border-gray-300 hover:border-gray-400')
        }
        ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}
        flex flex-col items-center justify-center cursor-pointer
      `}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={() => document.getElementById('fileInput')?.click()}
    >
      <input
        type="file"
        id="fileInput"
        className="hidden"
        accept={acceptedTypes.join(',')}
        onChange={handleFileSelect}
      />

      {isDragging ? (
        <Upload className={`${isDarkMode ? 'text-purple-400' : 'text-purple-500'} mb-3`} size={32} />
      ) : (
        <ImageIcon className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-3`} size={32} />
      )}

      <p className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
        {isDragging ? 'Drop image here' : 'Drag & drop image or click to browse'}
      </p>
      
      <p className={`mt-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
        Supports JPG, PNG, GIF, WebP (max {maxSizeMB}MB)
      </p>

      {error && (
        <p className={`mt-3 text-sm ${isDarkMode ? 'text-red-400' : 'text-red-500'}`}>
          {error}
        </p>
      )}
    </div>
  );
};

export default DropZone;