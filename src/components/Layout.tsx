import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

interface LayoutProps {
  title: string;
  children: React.ReactNode;
}

export default function Layout({ title, children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="lg:ml-64 min-h-screen flex flex-col">
        <Header title={title} onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
