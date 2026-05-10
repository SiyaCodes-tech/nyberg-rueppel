'use client';

import React, { useState, useEffect } from 'react';
import { FileSignature, Loader2, Send } from 'lucide-react';
import InfoBanner from '@/components/InfoBanner';
import CopyableField from '@/components/CopyableField';
import StepByStepPanel from '@/components/StepByStepPanel';

export default function SignMessage() {
  const [keys, setKeys] = useState([]);
  const [selectedKey, setSelectedKey] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [keysLoading, setKeysLoading] = useState(true);
  const [signature, setSignature] = useState(null);
  const [steps, setSteps] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchKeys();
  }, []);

  const fetchKeys = async () => {
    try {
      const res = await fetch('/api/keys');
      if (!res.ok) throw new Error('Failed to fetch keys');
      const data = await res.json();
      setKeys(data);
      if (data.length > 0) setSelectedKey(data[0].id);
    } catch (err) {
      setError('Could not load key pairs. Make sure you generated one first.');
    } finally {
      setKeysLoading(false);
    }
  };

  const sign = async () => {
    if (!message || message.length > 128) {
      setError('Message must be between 1 and 128 characters.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSignature(null);
      setSteps([]);

      const res = await fetch('/api/sign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyPairId: selectedKey, message })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to sign message');

      setSignature(data.signature);
      setSteps(data.steps);
      setMessage('');
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
          <FileSignature className="text-green-400 drop-shadow-lg" size={40} />
          <span className="text-gradient">Sign Message</span>
        </h1>
        <p className="text-gray-400 mt-2">
          Sign a message using the Nyberg-Rueppel scheme with message recovery.
        </p>
      </div>

      <InfoBanner 
        type="info" 
        message="Unlike standard DSA, the message is embedded inside the signature components (r, s). You only need to send the signature to the verifier, not the plaintext message!" 
      />

      {error && <InfoBanner type="error" message={error} />}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="cyber-panel p-6 md:p-8 h-fit">
          <h3 className="text-xl font-bold text-gray-100 mb-6">Input Data</h3>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Select Private Key</label>
              {keysLoading ? (
                <div className="h-10 cyber-input flex items-center text-gray-500 animate-pulse">Loading keys...</div>
              ) : (
                <select 
                  className="cyber-input appearance-none cursor-pointer"
                  value={selectedKey}
                  onChange={(e) => setSelectedKey(e.target.value)}
                  disabled={loading || keys.length === 0}
                >
                  {keys.length === 0 && <option value="">No keys found...</option>}
                  {keys.map(k => (
                    <option key={k.id} value={k.id}>
                      {k.name} (Created: {new Date(k.created_at).toLocaleDateString()})
                    </option>
                  ))}
                </select>
              )}
              {keys.length === 0 && !keysLoading && (
                <p className="text-amber-500 text-xs mt-2">You need to generate a key pair first.</p>
              )}
            </div>

            <div>
              <div className="flex justify-between items-end mb-2">
                <label className="block text-sm font-medium text-gray-300">Secret Message</label>
                <span className={`text-xs ${message.length > 128 ? 'text-red-500' : 'text-gray-500'}`}>
                  {message.length}/128 chars
                </span>
              </div>
              <textarea 
                className="cyber-input min-h-[100px] resize-none" 
                placeholder="Enter a secret message (e.g. Launch sequence authorized)" 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={loading}
              />
            </div>

            <button 
              className="cyber-button-primary w-full flex items-center justify-center py-3"
              onClick={sign}
              disabled={loading || !selectedKey || !message || message.length > 128}
            >
              {loading ? (
                <><Loader2 className="animate-spin mr-2" size={18} /> Generating Signature...</>
              ) : (
                <><Send className="mr-2" size={18} /> Sign & Embed Message</>
              )}
            </button>
          </div>
        </div>

        <div className="cyber-panel p-6 md:p-8">
          <h3 className="text-xl font-bold text-green-400 mb-6">Signature Output</h3>
          
          {signature ? (
            <div className="animate-in fade-in">
              <CopyableField label="Signature Component (r)" value={signature.r} isMonospace />
              <CopyableField label="Signature Component (s)" value={signature.s} isMonospace />
              
              <StepByStepPanel steps={steps} />
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-600 italic min-h-[200px] border border-dashed border-gray-800 rounded-lg">
              Output will appear here after signing
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
