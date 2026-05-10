import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Key, FileSignature, CheckCircle, Clock, ArrowRight } from 'lucide-react';

const Home = () => {
  const cards = [
    {
      title: 'Key Generation',
      description: 'Generate 512-bit safe prime parameters and your personal Nyberg-Rueppel public/private key pair.',
      icon: <Key size={32} className="text-green-400" />,
      path: '/keys',
      delay: 'delay-100'
    },
    {
      title: 'Sign Message',
      description: 'Sign a secret message where the message itself is mathematically embedded into the signature.',
      icon: <FileSignature size={32} className="text-green-400" />,
      path: '/sign',
      delay: 'delay-200'
    },
    {
      title: 'Verify & Recover',
      description: 'Verify a signature and mathematically recover the original embedded message text.',
      icon: <CheckCircle size={32} className="text-green-400" />,
      path: '/verify',
      delay: 'delay-300'
    },
    {
      title: 'Audit History',
      description: 'View the complete database log of all cryptographic signing and verification operations.',
      icon: <Clock size={32} className="text-green-400" />,
      path: '/history',
      delay: 'delay-400'
    }
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] animate-in fade-in duration-700">
      <div className="text-center mb-16 space-y-6 max-w-3xl">
        <div className="inline-flex items-center justify-center p-4 bg-green-500/10 rounded-full mb-4 animate-glow">
          <Shield size={48} className="text-green-400" />
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">
          <span className="text-gray-100 drop-shadow-lg">Nyberg-Rueppel</span>
          <br />
          <span className="text-gradient">Message Recovery</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-400 leading-relaxed font-light">
          A variant of the Digital Signature Algorithm where the original message is mathematically embedded directly within the signature components, eliminating the need to transmit the message separately.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl">
        {cards.map((card, idx) => (
          <Link 
            to={card.path} 
            key={idx}
            className={`cyber-panel p-8 group flex flex-col items-start gap-4 animate-in slide-in-from-bottom-8 duration-700 fill-mode-both ${card.delay}`}
          >
            <div className="bg-gray-950 p-3 rounded-lg border border-gray-800 group-hover:border-green-400/50 transition-colors">
              {card.icon}
            </div>
            <h2 className="text-2xl font-bold text-gray-100 group-hover:text-green-400 transition-colors">
              {card.title}
            </h2>
            <p className="text-gray-400 flex-1">
              {card.description}
            </p>
            <div className="flex items-center text-green-400 font-semibold mt-4 group-hover:translate-x-2 transition-transform">
              Get Started <ArrowRight size={18} className="ml-2" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;
