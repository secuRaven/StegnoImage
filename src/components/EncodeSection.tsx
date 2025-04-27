import React, { useState } from 'react';
import { ArrowRight, Lock } from 'lucide-react';
import Button from './Button';
import TextInput from './TextInput';
import DropZone from './DropZone';
import ImagePreview from './ImagePreview';
import { StegImageData } from '../types';
import { encodeMessage } from '../utils/steganography';

interface EncodeSectionProps {
  isDarkMode: boolean;
}

const EncodeSection: React.FC<EncodeSectionProps> = ({ isDarkMode }) => {
  const [message, setMessage] = useState('');
  const [imageData, setImageData] = useState<StegImageData>({
    original: null,
    preview: null,
    encoded: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelected = (file: File) => {
    // Clear any previous states
    setError(null);
    setImageData({
      original: file,
      preview: URL.createObjectURL(file),
      encoded: null,
    });
  };

  const handleEncode = async () => {
    if (!imageData.original || !imageData.preview || !message.trim()) {
      setError('Please provide both an image and a message to hide.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Create an image element for the encoding process
      const img = new Image();
      img.src = imageData.preview;
      
      // Wait for the image to load
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('Failed to load image'));
      });
      
      // Encode the message
      const encodedImageDataUrl = await encodeMessage(img, message);
      
      // Update state with the encoded image
      setImageData({
        ...imageData,
        encoded: encodedImageDataUrl,
      });
    } catch (err) {
      setError((err as Error).message || 'Failed to encode message');
    } finally {
      setLoading(false);
    }
  };

  const handleClearOriginal = () => {
    setImageData({
      original: null,
      preview: null,
      encoded: null,
    });
    setError(null);
  };

  const handleClearEncoded = () => {
    setImageData({
      ...imageData,
      encoded: null,
    });
  };

  const handleDownload = () => {
    if (!imageData.encoded) return;
    
    // Create an anchor element to download the image
    const link = document.createElement('a');
    link.href = imageData.encoded;
    link.download = `stegnoimage-${Date.now()}.png`;
    link.click();
  };

  return (
    <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-900' : 'bg-white'} shadow-md`}>
      <h2 className={`text-xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-800'} flex items-center gap-2`}>
        <Lock size={20} />
        Hide a Secret Message
      </h2>
      
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            {!imageData.preview ? (
              <DropZone 
                onImageSelected={handleImageSelected}
                isDarkMode={isDarkMode}
              />
            ) : (
              <ImagePreview
                imageData={imageData}
                onClear={handleClearOriginal}
                type="original"
                isDarkMode={isDarkMode}
              />
            )}
          </div>
          
          <div>
            <TextInput
              value={message}
              onChange={setMessage}
              label="Secret Message"
              placeholder="Enter the text you want to hide in the image..."
              rows={6}
              maxLength={1000}
              disabled={!imageData.preview || loading}
              isDarkMode={isDarkMode}
            />
            
            <div className="mt-4">
              <Button
                onClick={handleEncode}
                disabled={!imageData.preview || !message.trim() || loading}
                className="w-full mt-2"
                icon={ArrowRight}
                isDarkMode={isDarkMode}
              >
                {loading ? 'Encoding...' : 'Encode Message'}
              </Button>
            </div>
          </div>
        </div>
        
        {(imageData.encoded || error) && (
          <div className="mt-8 border-t pt-6 border-dashed border-gray-200 dark:border-gray-700">
            <h3 className={`text-lg font-medium mb-4 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
              Result
            </h3>
            
            <ImagePreview
              imageData={imageData}
              onClear={handleClearEncoded}
              onDownload={handleDownload}
              type="encoded"
              loading={loading}
              error={error}
              isDarkMode={isDarkMode}
            />
            
            {imageData.encoded && (
              <p className={`mt-4 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Your message has been hidden in the image. Download it and share it securely with your recipient.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EncodeSection;