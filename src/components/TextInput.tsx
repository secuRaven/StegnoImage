import React from 'react';

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label: string;
  rows?: number;
  maxLength?: number;
  disabled?: boolean;
  isDarkMode: boolean;
}

const TextInput: React.FC<TextInputProps> = ({
  value,
  onChange,
  placeholder = '',
  label,
  rows = 4,
  maxLength = 1000,
  disabled = false,
  isDarkMode,
}) => {
  const charsRemaining = maxLength - value.length;
  
  return (
    <div className="w-full">
      <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
        {label}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        maxLength={maxLength}
        disabled={disabled}
        className={`
          w-full rounded-md px-3 py-2 
          ${isDarkMode 
            ? 'bg-gray-800 text-gray-200 border-gray-700 focus:border-purple-500' 
            : 'bg-white text-gray-900 border-gray-300 focus:border-purple-500'
          }
          border focus:outline-none focus:ring-1 focus:ring-purple-500
          disabled:opacity-60 disabled:cursor-not-allowed
          transition-colors duration-200
        `}
      />
      <div className={`mt-1 text-xs flex justify-end ${
        charsRemaining < maxLength * 0.1 
          ? (isDarkMode ? 'text-orange-400' : 'text-orange-500')
          : (isDarkMode ? 'text-gray-400' : 'text-gray-500')
      }`}>
        {charsRemaining} characters remaining
      </div>
    </div>
  );
};

export default TextInput;