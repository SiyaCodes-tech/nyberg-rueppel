import React, { useState, useEffect } from 'react';
import { CheckCircle } from 'lucide-react';
import InfoBanner from '../components/InfoBanner';
import StepByStepPanel from '../components/StepByStepPanel';

const VerifyMessage = () => {
  const [keys, setKeys] = useState([]);
  const [selectedKey, setSelectedKey] = useState('');
  const [r, setR] = useState('');
  const [s, setS] = useState('');
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

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!selectedKey || !r || !s) return;
    
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyPairId: parseInt(selectedKey), r, s }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to verify signature');

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
        <h1 className="text-3xl font-bold text-textMain flex items-center gap-3">
          <CheckCircle className="text-primary" size={32} />
          Verify & Recover
        </h1>
        <p className="text-textMuted mt-2">
          Verify a Nyberg-Rueppel signature and recover the original message.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="cyber-panel p-6 h-fit">
          <form onSubmit={handleVerify} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-textMuted mb-2">
                Public Key to Verify Against
              </label>
              <select
                value={selectedKey}
                onChange={(e) => setSelectedKey(e.target.value)}
                className="cyber-input appearance-none"
                required
              >
                <option value="" disabled>Select a public key...</option>
                {keys.map((k) => (
                  <option key={k.id} value={k.id}>
                    {k.name} (ID: {k.id})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-textMuted mb-2">
                Signature r
              </label>
              <textarea
                value={r}
                onChange={(e) => setR(e.target.value)}
                className="cyber-input font-mono text-sm resize-none"
                rows={3}
                placeholder="Enter r component of signature..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-textMuted mb-2">
                Signature s
              </label>
              <textarea
                value={s}
                onChange={(e) => setS(e.target.value)}
                className="cyber-input font-mono text-sm resize-none"
                rows={2}
                placeholder="Enter s component of signature..."
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading || keys.length === 0 || !r || !s}
              className="cyber-button-primary w-full flex items-center justify-center h-12 text-lg"
            >
              {loading ? 'Verifying...' : 'Verify & Recover'}
            </button>
            {error && <div className="text-error text-sm text-center">{error}</div>}
          </form>
        </div>

        <div>
          {result && (
            <div className="animate-in slide-in-from-right-8 duration-500 space-y-6">
              {result.isValid ? (
                <InfoBanner 
                  type="success" 
                  message="Signature Verified! Message successfully recovered." 
                />
              ) : (
                <InfoBanner 
                  type="error" 
                  message="Verification Failed. The signature is invalid or the message could not be decoded." 
                />
              )}

              <div className="cyber-panel p-6">
                <h3 className="text-lg font-medium text-textMuted mb-4">Recovered Message</h3>
                <div className={`p-4 rounded-md text-lg font-mono break-all ${result.isValid ? 'bg-success/10 text-success border border-success/30' : 'bg-error/10 text-error border border-error/30'}`}>
                  {result.recovered_message || '[Unreadable / Empty]'}
                </div>
              </div>

              <StepByStepPanel steps={result.steps} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyMessage;
