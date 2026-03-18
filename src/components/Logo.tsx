import React from 'react';

interface LogoProps {
  className?: string;
  iconSize?: number;
}

export const Logo: React.FC<LogoProps> = ({ className = '', iconSize = 18 }) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <img 
        src="/Logo.png" 
        width={iconSize} 
        height={iconSize} 
        alt="SlimTab Logo" 
        className="object-contain"
      />
    </div>
  );
};
