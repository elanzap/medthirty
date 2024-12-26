import React from 'react';
import { Navigation } from './navigation/Navigation';
import { Settings } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeSection: string;
  onNavigate: (sectionId: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeSection, onNavigate }) => {
  const handleLogout = () => {
    // Implement logout logic here
    console.log('Logout clicked');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed top-0 left-0 h-screen w-64 bg-white shadow-lg">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-indigo-600">MedScript</h1>
        </div>
        <Navigation
          activeSection={activeSection}
          onNavigate={onNavigate}
          onLogout={handleLogout}
        />
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;
