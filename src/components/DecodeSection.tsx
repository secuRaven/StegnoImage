import React, { useState } from 'react';
import { Unlock, Clipboard, CheckCircle } from 'lucide-react';
import Button from './Button';
import DropZone from './DropZone';
import ImagePreview from './ImagePreview';
import { StegImageData } from '../types';
import { decodeMessage } from '../utils/steganography';

interface DecodeSectionProps {
  isDarkMode: boolean;
}

const DecodeSection: React.FC<DecodeSectionProps> = ({ isDarkMode }) => {
  const [imageData, setImageData] = useState<StegImageData>({
    original: null,
    preview: null,
    encoded: null,
  });
  const [decodedMessage, setDecodedMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleImageSelected = (file: File) => {
    // Clear any previous states
    setError(null);
    setDecodedMessage(null);
    setCopied(false);
    setImageData({
      original: file,
      preview: URL.createObjectURL(file),
      encoded: null,
    });
  };

  const handleDecode = async () => {
    if (!imageData.original || !imageData.preview) {
      setError('Please provide an image to decode.');
      return;
    }

    setLoading(true);
    setError(null);
    setDecodedMessage(null);
    setCopied(false);

    try {
      // Create an image element for the decoding process
      const img = new Image();
      img.src = imageData.preview;
      
      // Wait for the image to load
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('Failed to load image'));
      });
      
      // Decode the message
      const message = await decodeMessage(img);
      setDecodedMessage(message);
    } catch (err) {
      setError((err as Error).message || 'Failed to decode message');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setImageData({
      original: null,
      preview: null,
      encoded: null,
    });
    setDecodedMessage(null);
    setError(null);
    setCopied(false);
  };

  const handleCopyToClipboard = () => {
    if (decodedMessage) {
      navigator.clipboard.writeText(decodedMessage);
      setCopied(true);
      
      // Reset the copied state after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-900' : 'bg-white'} shadow-md`}>
      <h2 className={`text-xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-800'} flex items-center gap-2`}>
        <Unlock size={20} />
        Reveal Hidden Message
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
                onClear={handleClear}
                type="decode"
                loading={loading}
                isDarkMode={isDarkMode}
              />
            )}
          </div>
          
          <div>
            <div className={`rounded-lg ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'} border p-4 h-full flex flex-col`}>
              <h3 className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} mb-2`}>
                Decoded Message
              </h3>
              
              {loading ? (
                <div className="flex-1 flex items-center justify-center">
                  <div className={`animate-spin rounded-full h-10 w-10 border-b-2 ${isDarkMode ? 'border-teal-400' : 'border-teal-600'}`}></div>
                </div>
              ) : error ? (
                <div className={`flex-1 flex items-center justify-center ${isDarkMode ? 'text-red-400' : 'text-red-500'} text-center p-4`}>
                  {error}
                </div>
              ) : decodedMessage ? (
                <div className="flex-1 flex flex-col">
                  <div className={`flex-1 p-3 rounded ${isDarkMode ? 'bg-gray-700 text-gray-200' : 'bg-white text-gray-800'} overflow-auto mb-3`}>
                    {decodedMessage}
                  </div>
                  
                  <Button
                    onClick={handleCopyToClipboard}
                    variant={copied ? 'secondary' : 'primary'}
                    className="self-end"
                    icon={copied ? CheckCircle : Clipboard}
                    isDarkMode={isDarkMode}
                  >
                    {copied ? 'Copied!' : 'Copy to Clipboard'}
                  </Button>
                </div>
              ) : (
                <div className={`flex-1 flex items-center justify-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-center p-4`}>
                  {imageData.preview 
                    ? 'Click "Decode Message" to reveal the hidden content' 
                    : 'Upload an encoded image to reveal its hidden message'}
                </div>
              )}
            </div>
            
            <div className="mt-4">
              <Button
                onClick={handleDecode}
                disabled={!imageData.preview || loading}
                className="w-full"
                variant="secondary"
                isDarkMode={isDarkMode}
              >
                {loading ? 'Decoding...' : 'Decode Message'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DecodeSection;