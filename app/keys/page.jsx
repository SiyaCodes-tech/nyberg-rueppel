'use client';

import React, { useState, useEffect } from 'react';
import { Key, Loader2, Save } from 'lucide-react';
import InfoBanner from '@/components/InfoBanner';
import CopyableField from '@/components/CopyableField';
import StepByStepPanel from '@/components/StepByStepPanel';

export default function KeyGeneration() {
  const [loading, setLoading] = useState(false);
  const [keyName, setKeyName] = useState('');
  const [keyPair, setKeyPair] = useState(null);
  const [steps, setSteps] = useState([]);
  const [error, setError] = useState('');

  const generateKeys = async () => {
    try {
      setLoading(true);
      setError('');
      setKeyPair(null);
      setSteps([]);

      const name = keyName.trim() || `Key_${Math.floor(Math.random() * 1000)}`;
      const res = await fetch('/api/keys/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate keys');

      setKeyPair(data.keyPair);
      setSteps(data.steps);
      setKeyName('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in duration-500 pb-12">
      <div className="mb-6">
        <h1 className="text-4xl md:text-5xl font-extrabold flex items-center gap-4 mb-2">
          <Key className="text-green-400 drop-shadow-lg" size={40} />
          <span className="text-gradient">Key Generation</span>
        </h1>
        <p className="text-gray-400 mt-2">
          Generate Nyberg-Rueppel cryptographic parameters and key pair.
        </p>
      </div>

      <InfoBanner 
        type="warning" 
        message="Notice: For demonstration and performance purposes, we are generating 512-bit safe primes (which takes ~5 seconds). In a production cryptographic environment, you would use at least 2048-bit primes." 
      />

      {error && <InfoBanner type="error" message={error} />}

      <div className="cyber-panel p-6 md:p-8">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-gray-300 mb-2">Key Pair Name (Optional)</label>
            <input 
              type="text" 
              className="cyber-input" 
              placeholder="e.g. Alice's Primary Key" 
              value={keyName}
              onChange={(e) => setKeyName(e.target.value)}
              disabled={loading}
            />
          </div>
          <button 
            className="cyber-button-primary w-full md:w-auto h-[42px] flex items-center justify-center"
            onClick={generateKeys}
            disabled={loading}
          >
            {loading ? (
              <><Loader2 className="animate-spin mr-2" size={18} /> Computing Math...</>
            ) : (
              <><Save className="mr-2" size={18} /> Generate & Save</>
            )}
          </button>
        </div>

        {keyPair && (
          <div className="mt-10 animate-in slide-in-from-bottom-4">
            <h3 className="text-xl font-bold text-green-400 mb-6 pb-2 border-b border-gray-800">Generated Parameters</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              <div className="col-span-1 md:col-span-2">
                <CopyableField label="Key Pair Name" value={keyPair.name} />
              </div>
              <div className="col-span-1 md:col-span-2">
                <CopyableField label="Prime (p) [Public]" value={keyPair.p} isMonospace />
              </div>
              <CopyableField label="Prime (q) [Public]" value={keyPair.q} isMonospace />
              <CopyableField label="Generator (g) [Public]" value={keyPair.g} isMonospace />
              <CopyableField label="Private Key (x) [Secret]" value={keyPair.x} isMonospace />
              <CopyableField label="Public Key (y) [Public]" value={keyPair.y} isMonospace />
            </div>

            <StepByStepPanel steps={steps} />
          </div>
        )}
      </div>
    </div>
  );
}
