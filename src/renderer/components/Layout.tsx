import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Settings, Home, WifiOff, MonitorX } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="bg-zinc-900 text-white p-4 flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-xl font-bold">BasisHax</h1>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className="w-16 bg-zinc-800 text-white flex flex-col items-center py-4">
          <Link 
            to="/" 
            className={`p-3 rounded-lg mb-4 hover:bg-zinc-700 ${isActive('/') ? 'bg-blue-600' : ''}`}
            aria-label="Dashboard"
            tabIndex={0}
          >
            <Home className="h-6 w-6" />
          </Link>
          <Link 
            to="/settings" 
            className={`p-3 rounded-lg mb-4 hover:bg-zinc-700 ${isActive('/settings') ? 'bg-blue-600' : ''}`}
            aria-label="Settings"
            tabIndex={0}
          >
            <Settings className="h-6 w-6" />
          </Link>
        </aside>
        
        {/* Content */}
        <div className="flex-1 overflow-auto p-6 bg-zinc-50 dark:bg-zinc-900">
          {children}
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-zinc-900 text-zinc-400 p-2 text-xs text-center">
        BasisHax &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
};

export default Layout; 