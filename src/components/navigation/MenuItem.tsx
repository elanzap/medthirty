import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { ChevronDown } from 'lucide-react';

interface MenuItemProps {
  icon: LucideIcon;
  text: string;
  href: string;
  isActive?: boolean;
  hasSubItems?: boolean;
  isExpanded?: boolean;
  onClick: () => void;
}

export const MenuItem: React.FC<MenuItemProps> = ({
  icon: Icon,
  text,
  href,
  isActive = false,
  hasSubItems = false,
  isExpanded = false,
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
        flex items-center px-4 py-3 text-gray-700 rounded-lg transition-colors
        ${isActive 
          ? 'bg-indigo-50 text-indigo-600' 
          : 'hover:bg-indigo-50 hover:text-indigo-600'
        }
      `}
    >
      <Icon className="w-5 h-5 mr-3" />
      <span className="flex-1">{text}</span>
      {hasSubItems && (
        <ChevronDown 
          className={`w-4 h-4 transition-transform duration-200 ${
            isExpanded ? 'transform rotate-180' : ''
          }`} 
        />
      )}
    </a>
  );
};
