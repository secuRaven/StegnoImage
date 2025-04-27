import React from 'react';
import { Shield, Lock } from 'lucide-react';

interface FooterProps {
  isDarkMode: boolean;
}

const Footer: React.FC<FooterProps> = ({ isDarkMode }) => {
  return (
    <footer className={`w-full py-6 ${isDarkMode ? 'bg-gray-900 text-gray-300' : 'bg-gray-100 text-gray-600'} mt-auto`}>
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm">
            <p className="flex items-center gap-1">
              <Shield size={16} />
              <span>Processing happens entirely in your browser. No data is sent to any server.</span>
            </p>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <Lock size={16} />
            <span>StegnoImage © {new Date().getFullYear()}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;