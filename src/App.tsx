import React, { useState } from 'react';
import { ImageIcon, MessageSquare, Info } from 'lucide-react';
import Header from './components/Header';
import Footer from './components/Footer';
import EncodeSection from './components/EncodeSection';
import DecodeSection from './components/DecodeSection';
import Button from './components/Button';

enum AppSection {
  ENCODE = 'encode',
  DECODE = 'decode',
  INFO = 'info',
}

function App() {
  const [isDarkMode, setIsDarkMode] = useState(window.matchMedia('(prefers-color-scheme: dark)').matches);
  const [activeSection, setActiveSection] = useState<AppSection>(AppSection.ENCODE);

  const toggleDarkMode = () => setIsDarkMode(prevMode => !prevMode);

  return (
    <div className={`min-h-screen flex flex-col ${isDarkMode ? 'bg-gray-950 text-gray-200' : 'bg-gray-50 text-gray-800'}`}>
      <Header isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-6 flex flex-wrap justify-center gap-2">
          <Button
            onClick={() => setActiveSection(AppSection.ENCODE)}
            variant={activeSection === AppSection.ENCODE ? 'primary' : 'ghost'}
            icon={ImageIcon}
            isDarkMode={isDarkMode}
          >
            Hide Message
          </Button>
          
          <Button
            onClick={() => setActiveSection(AppSection.DECODE)}
            variant={activeSection === AppSection.DECODE ? 'secondary' : 'ghost'}
            icon={MessageSquare}
            isDarkMode={isDarkMode}
          >
            Reveal Message
          </Button>
          
          <Button
            onClick={() => setActiveSection(AppSection.INFO)}
            variant={activeSection === AppSection.INFO ? 'accent' : 'ghost'}
            icon={Info}
            isDarkMode={isDarkMode}
          >
            About Steganography
          </Button>
        </div>
        
        <div className="max-w-4xl mx-auto">
          {activeSection === AppSection.ENCODE && <EncodeSection isDarkMode={isDarkMode} />}
          {activeSection === AppSection.DECODE && <DecodeSection isDarkMode={isDarkMode} />}
          {activeSection === AppSection.INFO && (
           <section className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-900' : 'bg-white'} shadow-md`}>
           <h2 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'} flex items-center gap-2`}>
             <Info size={20} />
             About Steganography
           </h2>
         
           <div className={`prose ${isDarkMode ? 'prose-invert' : ''} max-w-none`}>
             <p>
               <strong className="text-lg font-semibold">Steganography</strong> is the practice of hiding secret information within ordinary, non-secret data or a physical object to avoid detection.
             </p>
         
             <h3 className="text-lg font-semibold mt-6 mb-4">How It Works</h3>  {/* Reduced font size */}
             <p className="mb-4">
               StegoImage uses the Least Significant Bit (LSB) technique to hide your message inside an image. This works by replacing the least significant bit of each color channel (RGB) with bits from your message.
             </p>
         
             <h3 className="text-lg font-semibold mt-6 mb-4">Security Considerations</h3>  {/* Reduced font size */}
             <ul className="list-disc pl-5 mb-4 space-y-2">
               <li>Steganography provides security through obscurity — no one will look for a message if they don't know it exists.</li>
               <li>This tool does not encrypt your message, it only hides it. For maximum security, encrypt your message before hiding it.</li>
               <li>Lossy compression (like JPEG) can destroy hidden data, so we save encoded images as PNG.</li>
               <li>All processing happens in your browser — no data is ever sent to a server.</li>
             </ul>
         
             <h3 className="text-lg font-semibold mt-6 mb-4">Applications</h3>  {/* Reduced font size */}
             <p className="mb-4">
               Steganography has many legitimate uses:
             </p>
             <ul className="list-disc pl-5 mb-4 space-y-2">
               <li>Watermarking digital media to protect copyright.</li>
               <li>Secure communication where encryption might raise suspicion.</li>
               <li>Protecting sensitive data from casual observation.</li>
             </ul>
           </div>
         </section>
         
          )}
        </div>
      </main>
      
      <Footer isDarkMode={isDarkMode} />
    </div>
  );
}

export default App;
