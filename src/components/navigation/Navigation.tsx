import React, { useState } from 'react';
import { MenuItem } from './MenuItem';
import { SubMenuItem } from './SubMenuItem';
import { NAVIGATION_ITEMS } from '../../constants/navigation';
import { LogOut, Settings } from 'lucide-react';

interface NavigationProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  onLogout: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeSection,
  onNavigate,
  onLogout,
}) => {
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['settings']); // Settings expanded by default

  const toggleMenu = (menuId: string) => {
    setExpandedMenus(prev => 
      prev.includes(menuId) 
        ? prev.filter(id => id !== menuId)
        : [...prev, menuId]
    );
  };

  return (
    <nav className="mt-6">
      <div className="px-4 space-y-1">
        {NAVIGATION_ITEMS.map((item) => (
          <div key={item.id}>
            <MenuItem
              icon={item.icon}
              text={item.text}
              href={item.href}
              isActive={activeSection === item.id}
              hasSubItems={'subItems' in item}
              isExpanded={expandedMenus.includes(item.id)}
              onClick={() => {
                if ('subItems' in item) {
                  toggleMenu(item.id);
                } else {
                  onNavigate(item.id);
                }
              }}
            />
            {'subItems' in item && expandedMenus.includes(item.id) && (
              <div className="mt-1 ml-4 space-y-1 border-l-2 border-gray-200">
                {item.subItems?.map((subItem) => (
                  <SubMenuItem
                    key={subItem.id}
                    icon={subItem.icon}
                    text={subItem.text}
                    href={subItem.href}
                    isActive={activeSection === subItem.id}
                    onClick={() => onNavigate(subItem.id)}
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <button
          onClick={onLogout}
          className="flex items-center px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors w-full"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Logout
        </button>
      </div>
    </nav>
  );
};
