/**
 * Steganography utility functions for encoding and decoding messages in images
 */

/**
 * Encodes a text message into an image using LSB steganography
 * @param image The original image element
 * @param message The text message to hide
 * @returns A Promise that resolves to a data URL of the encoded image
 */
export const encodeMessage = (image: HTMLImageElement, message: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      // Create canvas and get context
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }
      
      // Set canvas dimensions to match the image
      canvas.width = image.width;
      canvas.height = image.height;
      
      // Draw the image onto the canvas
      ctx.drawImage(image, 0, 0);
      
      // Get image data
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      // Convert the message to binary
      const binaryMessage = stringToBinary(message + '||END||');
      
      // Check if the message is too long for the image
      if (binaryMessage.length > data.length * 0.75) {
        reject(new Error('Message is too long for this image'));
        return;
      }
      
      // Embed the binary message into the LSB of the image data
      let binaryIndex = 0;
      
      for (let i = 0; i < data.length && binaryIndex < binaryMessage.length; i += 4) {
        // Only modify RGB channels (not alpha)
        for (let j = 0; j < 3 && binaryIndex < binaryMessage.length; j++) {
          // Get the current byte value
          const byte = data[i + j];
          
          // Clear the least significant bit
          const clearedByte = byte & 0xFE;
          
          // Set the least significant bit to the current bit of the message
          data[i + j] = clearedByte | parseInt(binaryMessage[binaryIndex]);
          
          binaryIndex++;
        }
      }
      
      // Put the modified image data back onto the canvas
      ctx.putImageData(imageData, 0, 0);
      
      // Convert the canvas to a data URL
      const dataUrl = canvas.toDataURL('image/png');
      resolve(dataUrl);
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Decodes a hidden message from an encoded image
 * @param image The encoded image element
 * @returns A Promise that resolves to the hidden message
 */
export const decodeMessage = (image: HTMLImageElement): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      // Create canvas and get context
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }
      
      // Set canvas dimensions to match the image
      canvas.width = image.width;
      canvas.height = image.height;
      
      // Draw the image onto the canvas
      ctx.drawImage(image, 0, 0);
      
      // Get image data
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      // Extract the binary message
      let binaryMessage = '';
      
      for (let i = 0; i < data.length; i += 4) {
        // Only check RGB channels (not alpha)
        for (let j = 0; j < 3; j++) {
          // Get the least significant bit
          const lsb = data[i + j] & 0x01;
          binaryMessage += lsb;
          
          // Check if we've reached the end marker
          if (binaryMessage.length % 8 === 0) {
            const potentialMessage = binaryToString(binaryMessage);
            if (potentialMessage.endsWith('||END||')) {
              resolve(potentialMessage.slice(0, -7)); // Remove the end marker
              return;
            }
          }
        }
      }
      
      reject(new Error('No hidden message found'));
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Converts a string to binary representation
 * @param str The string to convert
 * @returns Binary representation of the string
 */
const stringToBinary = (str: string): string => {
  let binary = '';
  for (let i = 0; i < str.length; i++) {
    const charCode = str.charCodeAt(i);
    const binaryChar = charCode.toString(2).padStart(8, '0');
    binary += binaryChar;
  }
  return binary;
};

/**
 * Converts a binary string to a regular string
 * @param binary The binary string to convert
 * @returns The decoded string
 */
const binaryToString = (binary: string): string => {
  let str = '';
  for (let i = 0; i < binary.length; i += 8) {
    const byte = binary.slice(i, i + 8);
    if (byte.length === 8) {
      const charCode = parseInt(byte, 2);
      str += String.fromCharCode(charCode);
    }
  }
  return str;
};