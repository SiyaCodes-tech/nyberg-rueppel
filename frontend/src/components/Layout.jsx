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
    <div className="min-h-screen flex flex-col bg-gray-950 text-gray-100 font-sans">
      <nav className="bg-gray-900 border-b border-gray-700 p-4 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-2 text-green-400 font-bold text-xl mb-4 md:mb-0">
            <Shield className="text-green-400" />
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
                    isActive ? 'bg-primary/10 text-green-400' : 'text-gray-400 hover:text-gray-100 hover:bg-[#1a1a1a]'
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
      <footer className="border-t border-gray-700 p-4 text-center text-gray-400 text-sm">
        Nyberg-Rueppel Digital Signature Scheme Demonstration
      </footer>
    </div>
  );
};

export default Layout;
