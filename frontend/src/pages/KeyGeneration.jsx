import React, { useState } from 'react';
import { Key } from 'lucide-react';
import InfoBanner from '../components/InfoBanner';
import CopyableField from '../components/CopyableField';
import StepByStepPanel from '../components/StepByStepPanel';

const KeyGeneration = () => {
  const [keyName, setKeyName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/keys/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: keyName || 'Unnamed Key' }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to generate keys');

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
          <Key className="text-green-400 drop-shadow-lg" size={40} />
          <span className="text-gradient">Key Generation</span>
        </h1>
        <p className="text-gray-400 mt-2">
          Generate Nyberg-Rueppel cryptographic parameters and key pair.
        </p>
      </div>

      <InfoBanner 
        type="warning" 
        message="512-bit parameters are used for demonstration to ensure generation finishes within serverless timeout limits. Production systems should use 2048-bit or higher." 
      />

      <div className="cyber-panel p-6 mb-8">
        <form onSubmit={handleGenerate} className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Key Pair Name (Optional)
            </label>
            <input
              type="text"
              value={keyName}
              onChange={(e) => setKeyName(e.target.value)}
              placeholder="e.g., Alice's Keys"
              className="cyber-input"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="cyber-button-primary w-full sm:w-auto h-10 flex items-center justify-center min-w-[150px]"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 text-green-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                Generating...
              </span>
            ) : (
              'Generate Keys'
            )}
          </button>
        </form>
        {error && <div className="mt-4 text-red-500 text-sm">{error}</div>}
      </div>

      {result && (
        <div className="animate-in slide-in-from-bottom-4 duration-500">
          <div className="cyber-panel p-6">
            <h2 className="text-xl font-bold mb-6 text-green-400 border-b border-gray-700 pb-2">
              Generated Key Pair: {result.keyPair.name}
            </h2>
            
            <div className="grid grid-cols-1 gap-4">
              <CopyableField label="Prime p (512-bit)" value={result.keyPair.p} multiline />
              <CopyableField label="Prime q (160-bit divisor of p-1)" value={result.keyPair.q} />
              <CopyableField label="Generator g (order q)" value={result.keyPair.g} multiline />
              <CopyableField label="Private Key x" value={result.keyPair.x} />
              <CopyableField label="Public Key y" value={result.keyPair.y} multiline />
            </div>
          </div>

          <StepByStepPanel steps={result.steps} />
        </div>
      )}
    </div>
  );
};

export default KeyGeneration;
