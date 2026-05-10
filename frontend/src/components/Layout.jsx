import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Shield, Key, FileSignature, CheckCircle, Clock } from 'lucide-react';

const Layout = () => {
  const location = useLocation();

  const navLinks = [
    { name: 'Key Generation', path: '/', icon: <Key size={18} /> },
    { name: 'Sign', path: '/sign', icon: <FileSignature size={18} /> },
    { name: 'Verify', path: '/verify', icon: <CheckCircle size={18} /> },
    { name: 'History', path: '/history', icon: <Clock size={18} /> },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-textMain font-sans">
      <nav className="bg-surface border-b border-border p-4 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-2 text-primary font-bold text-xl mb-4 md:mb-0">
            <Shield className="text-primary" />
            <span>Nyberg-Rueppel Crypto</span>
          </div>
          <div className="flex space-x-1 md:space-x-4">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-colors ${
                    isActive ? 'bg-primary/10 text-primary' : 'text-textMuted hover:text-textMain hover:bg-[#1a1a1a]'
                  }`}
                >
                  {link.icon}
                  <span className="hidden sm:inline">{link.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-6">
        <Outlet />
      </main>
      <footer className="border-t border-border p-4 text-center text-textMuted text-sm">
        Nyberg-Rueppel Digital Signature Scheme Demonstration
      </footer>
    </div>
  );
};

export default Layout;
