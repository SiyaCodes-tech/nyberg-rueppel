import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Shield, Key, FileSignature, CheckCircle, Clock, Home, BookOpen } from 'lucide-react';

const Layout = () => {
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/', icon: <Home size={18} /> },
    { name: 'How It Works', path: '/how-it-works', icon: <BookOpen size={18} /> },
    { name: 'Keys', path: '/keys', icon: <Key size={18} /> },
    { name: 'Sign', path: '/sign', icon: <FileSignature size={18} /> },
    { name: 'Verify', path: '/verify', icon: <CheckCircle size={18} /> },
    { name: 'History', path: '/history', icon: <Clock size={18} /> },
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <nav className="bg-gradient-to-r from-gray-900 via-[#064e3b] to-[#0f766e] border-b border-green-900/50 p-4 sticky top-0 z-50 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 text-green-400 font-extrabold text-2xl mb-4 md:mb-0 drop-shadow-[0_0_8px_rgba(74,222,128,0.8)] hover:scale-105 transition-transform">
            <Shield className="text-green-400" size={28} />
            <span>Nyberg-Rueppel Crypto</span>
          </Link>
          <div className="flex flex-wrap justify-center gap-2">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center space-x-1 px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                    isActive 
                      ? 'bg-green-500/20 text-green-400 shadow-[0_0_10px_rgba(74,222,128,0.2)]' 
                      : 'text-gray-400 hover:text-gray-100 hover:bg-gray-800/50'
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
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-12">
        <Outlet />
      </main>
      <footer className="border-t border-gray-800 p-8 text-center text-gray-500 text-sm bg-gray-950 mt-12">
        Nyberg-Rueppel Digital Signature Scheme Demonstration &bull; Educational Purpose Only
      </footer>
    </div>
  );
};

export default Layout;
