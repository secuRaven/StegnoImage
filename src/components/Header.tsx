import React from 'react';
import { Moon, Sun } from 'lucide-react';

interface HeaderProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const Header: React.FC<HeaderProps> = ({ isDarkMode, toggleDarkMode }) => {
  return (
    <header className={`w-full py-4 px-6 ${isDarkMode ? 'bg-gray-900' : 'bg-white'} shadow-md`}>
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            StegnoImage
          </div>
          <span className={`text-xs px-2 py-1 rounded-full ${isDarkMode ? 'bg-purple-900 text-purple-100' : 'bg-purple-100 text-purple-800'}`}>
  
          </span>
        </div>
        
        <button
          onClick={toggleDarkMode}
          className={`p-2 rounded-full ${
            isDarkMode 
              ? 'bg-gray-800 text-yellow-300 hover:bg-gray-700' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          } transition-colors duration-200`}
          aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
    </header>
  );
};

export default Header;