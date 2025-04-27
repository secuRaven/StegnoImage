import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
  icon?: LucideIcon;
  type?: 'button' | 'submit' | 'reset';
  isDarkMode?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  onClick,
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  icon: Icon,
  type = 'button',
  isDarkMode = false,
}) => {
  // Size classes
  const sizeClasses = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
  };

  // Variant classes
  const getVariantClasses = () => {
    if (disabled) {
      return `bg-gray-300 text-gray-500 cursor-not-allowed ${isDarkMode ? 'opacity-40' : ''}`;
    }

    switch (variant) {
      case 'primary':
        return isDarkMode
          ? 'bg-purple-700 hover:bg-purple-600 text-white shadow-md hover:shadow-lg'
          : 'bg-purple-600 hover:bg-purple-700 text-white shadow-md hover:shadow-lg';
      case 'secondary':
        return isDarkMode
          ? 'bg-teal-700 hover:bg-teal-600 text-white shadow-md hover:shadow-lg'
          : 'bg-teal-600 hover:bg-teal-700 text-white shadow-md hover:shadow-lg';
      case 'accent':
        return isDarkMode
          ? 'bg-pink-700 hover:bg-pink-600 text-white shadow-md hover:shadow-lg'
          : 'bg-pink-600 hover:bg-pink-700 text-white shadow-md hover:shadow-lg';
      case 'ghost':
        return isDarkMode
          ? 'bg-transparent hover:bg-gray-800 text-gray-300 hover:text-white'
          : 'bg-transparent hover:bg-gray-100 text-gray-600 hover:text-gray-900';
      default:
        return 'bg-purple-600 hover:bg-purple-700 text-white';
    }
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${sizeClasses[size]}
        ${getVariantClasses()}
        rounded-md font-medium transition-all duration-200 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-offset-2 ${
          isDarkMode ? 'focus:ring-purple-400' : 'focus:ring-purple-500'
        }
        flex items-center justify-center gap-2
        ${className}
      `}
    >
      {Icon && <Icon size={size === 'sm' ? 16 : size === 'lg' ? 24 : 20} />}
      {children}
    </button>
  );
};

export default Button;