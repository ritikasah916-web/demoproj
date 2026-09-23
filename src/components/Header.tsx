import React from 'react';
import { Menu, Bell, Search } from 'lucide-react';

interface HeaderProps {
  onMenuToggle: () => void;
  title: string;
}

export default function Header({ onMenuToggle, title }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-gray-950/80 backdrop-blur-xl border-b border-gray-800 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuToggle}
            className="lg:hidden text-gray-400 hover:text-white transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h2 className="text-xl font-bold text-white">{title}</h2>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center bg-gray-800/50 rounded-xl px-4 py-2 border border-gray-700/50">
            <Search className="w-4 h-4 text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent text-sm text-white placeholder-gray-500 outline-none w-48"
            />
          </div>
          <button className="relative p-2 rounded-xl bg-gray-800/50 border border-gray-700/50 text-gray-400 hover:text-white transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full" />
          </button>
        </div>
      </div>
    </header>
  );
}
