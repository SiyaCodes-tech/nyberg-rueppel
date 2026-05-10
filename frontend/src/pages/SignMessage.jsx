import React, { useState, useEffect } from 'react';
import { FileSignature } from 'lucide-react';
import CopyableField from '../components/CopyableField';
import StepByStepPanel from '../components/StepByStepPanel';

const SignMessage = () => {
  const [keys, setKeys] = useState([]);
  const [selectedKey, setSelectedKey] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  useEffect(() => {
    fetchKeys();
  }, []);

  const fetchKeys = async () => {
    try {
      const res = await fetch('/api/keys');
      if (res.ok) {
        const data = await res.json();
        setKeys(data);
        if (data.length > 0) setSelectedKey(data[0].id.toString());
      }
    } catch (err) {
      console.error('Failed to fetch keys', err);
    }
  };

  const handleSign = async (e) => {
    e.preventDefault();
    if (!selectedKey || !message) return;
    
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/sign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyPairId: parseInt(selectedKey), message }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to sign message');

      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-6">
        <h1 className="text-4xl md:text-5xl font-extrabold flex items-center gap-4 mb-2">
          <FileSignature className="text-green-400 drop-shadow-lg" size={40} />
          <span className="text-gradient">Sign Message</span>
        </h1>
        <p className="text-gray-400 mt-2">
          Sign a message using the Nyberg-Rueppel scheme with message recovery.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="cyber-panel p-6 h-fit">
          <form onSubmit={handleSign} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Select Key Pair
              </label>
              <select
                value={selectedKey}
                onChange={(e) => setSelectedKey(e.target.value)}
                className="cyber-input appearance-none"
                required
              >
                <option value="" disabled>Select a key pair...</option>
                {keys.map((k) => (
                  <option key={k.id} value={k.id}>
                    {k.name} (ID: {k.id})
                  </option>
                ))}
              </select>
              {keys.length === 0 && (
                <p className="text-xs text-red-500 mt-2">No keys found. Please generate one first.</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Message to Sign (Max 128 characters)
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value.slice(0, 128))}
                maxLength={128}
                rows={4}
                className="cyber-input resize-none"
                placeholder="Enter your secret message..."
                required
              />
              <div className="text-right text-xs text-gray-400 mt-1">
                {message.length} / 128
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || keys.length === 0 || !message}
              className="cyber-button-primary w-full flex items-center justify-center h-12 text-lg"
            >
              {loading ? 'Signing...' : 'Sign Message'}
            </button>
            {error && <div className="text-red-500 text-sm text-center">{error}</div>}
          </form>
        </div>

        <div>
          {result && (
            <div className="animate-in slide-in-from-right-8 duration-500 space-y-6">
              <div className="cyber-panel p-6 border-primary/50">
                <h3 className="text-lg font-bold text-green-400 mb-4">Generated Signature</h3>
                <CopyableField label="Signature r" value={result.signature.r} multiline />
                <CopyableField label="Signature s" value={result.signature.s} />
              </div>
              <StepByStepPanel steps={result.steps} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignMessage;
