import React from 'react';
import Navbar from './Navbar';

interface LayoutProps {
  children: React.ReactNode;
  fullWidth?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, fullWidth = false }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className={`${fullWidth ? 'w-full' : 'container mx-auto'} px-4 py-8`}>
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout; 