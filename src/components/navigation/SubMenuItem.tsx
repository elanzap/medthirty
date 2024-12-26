import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface SubMenuItemProps {
  icon: LucideIcon;
  text: string;
  href: string;
  isActive?: boolean;
  onClick: () => void;
}

export const SubMenuItem: React.FC<SubMenuItemProps> = ({
  icon: Icon,
  text,
  href,
  isActive = false,
  onClick,
}) => {
  return (
    <a
      href={href}
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
      className={`
        flex items-center px-4 py-2 text-sm text-gray-700 rounded-lg transition-colors
        ${isActive 
          ? 'bg-indigo-50 text-indigo-600' 
          : 'hover:bg-indigo-50 hover:text-indigo-600'
        }
      `}
    >
      <Icon className="w-4 h-4 mr-3" />
      {text}
    </a>
  );
};
