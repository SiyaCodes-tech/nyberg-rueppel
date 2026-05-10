"use client";

import React, { useState, useEffect } from "react";
import { CheckCircle, XCircle, Loader2, Search } from "lucide-react";
import InfoBanner from "@/components/InfoBanner";
import StepByStepPanel from "@/components/StepByStepPanel";

export default function VerifyMessage() {
  const [keys, setKeys] = useState([]);
  const [selectedKey, setSelectedKey] = useState("");
  const [r, setR] = useState("");
  const [s, setS] = useState("");
  const [loading, setLoading] = useState(false);
  const [keysLoading, setKeysLoading] = useState(true);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchKeys();
  }, []);

  const fetchKeys = async () => {
    try {
      const res = await fetch("/api/keys");
      if (!res.ok) throw new Error("Failed to fetch keys");
      const data = await res.json();
      setKeys(data);
      if (data.length > 0) setSelectedKey(data[0].id);
    } catch (err) {
      setError("Could not load public keys.");
    } finally {
      setKeysLoading(false);
    }
  };

  const verify = async () => {
    if (!r || !s) {
      setError("Both signature components (r and s) are required.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setResult(null);

      const res = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyPairId: selectedKey, r, s }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to verify signature");

      setResult(data);
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
          <CheckCircle className="text-green-400 drop-shadow-lg" size={40} />
          <span className="text-gradient">Verify & Recover</span>
        </h1>
        <p className="text-gray-400 mt-2">
          Verify a Nyberg-Rueppel signature and recover the original message.
        </p>
      </div>

      <InfoBanner
        type="info"
        message="Input the signature components (r, s) and select the sender's public key. The math will verify the integrity and extract the hidden text."
      />

      {error && <InfoBanner type="error" message={error} />}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="cyber-panel p-6 md:p-8 h-fit">
          <h3 className="text-xl font-bold text-gray-100 mb-6">
            Input Signature
          </h3>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Sender's Public Key
              </label>
              {keysLoading ? (
                <div className="h-10 cyber-input flex items-center text-gray-500 animate-pulse">
                  Loading keys...
                </div>
              ) : (
                <select
                  className="cyber-input appearance-none cursor-pointer"
                  value={selectedKey}
                  onChange={(e) => setSelectedKey(e.target.value)}
                  disabled={loading || keys.length === 0}
                >
                  {keys.length === 0 && (
                    <option value="">No keys found...</option>
                  )}
                  {keys.map((k) => (
                    <option key={k.id} value={k.id}>
                      {k.name} (Public Key ID: {k.id.slice(0, 8)})
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Signature Component (r)
              </label>
              <textarea
                className="cyber-input min-h-[80px] resize-y font-mono text-sm text-green-400"
                placeholder="Paste the 'r' component..."
                value={r}
                onChange={(e) => setR(e.target.value)}
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Signature Component (s)
              </label>
              <textarea
                className="cyber-input min-h-[80px] resize-y font-mono text-sm text-green-400"
                placeholder="Paste the 's' component..."
                value={s}
                onChange={(e) => setS(e.target.value)}
                disabled={loading}
              />
            </div>

            <button
              className="cyber-button-primary w-full flex items-center justify-center py-3"
              onClick={verify}
              disabled={loading || !selectedKey || !r || !s}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={18} /> Verifying
                  & Recovering...
                </>
              ) : (
                <>
                  <Search className="mr-2" size={18} /> Verify & Recover Message
                </>
              )}
            </button>
          </div>
        </div>

        <div className="cyber-panel p-6 md:p-8">
          <h3 className="text-xl font-bold text-gray-100 mb-6">
            Verification Results
          </h3>

          {result ? (
            <div className="animate-in fade-in space-y-6">
              <div
                className={`p-4 border rounded-md ${result.isValid ? "bg-green-500/10 border-green-500/50" : "bg-red-500/10 border-red-500/50"}`}
              >
                <div className="flex items-center gap-2 mb-2">
                  {result.isValid ? (
                    <CheckCircle className="text-green-500" size={24} />
                  ) : (
                    <XCircle className="text-red-500" size={24} /> // Note: using AlertTriangle/XCircle logic
                  )}
                  <h4
                    className={`text-lg font-bold ${result.isValid ? "text-green-500" : "text-red-500"}`}
                  >
                    {result.isValid ? "Signature Valid" : "Signature Invalid"}
                  </h4>
                </div>
                <p className="text-gray-300 text-sm">
                  {result.isValid
                    ? "The signature was mathematically verified against the public key, and the original message was successfully recovered."
                    : "The mathematical verification failed. The signature may be forged, corrupted, or does not belong to the selected public key."}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2 uppercase tracking-wider">
                  Recovered Plaintext Message
                </label>
                <div
                  className={`p-4 rounded-md font-mono text-lg break-words border ${result.isValid ? "bg-gray-950 border-green-500/30 text-green-400" : "bg-gray-950 border-red-500/30 text-red-400"}`}
                >
                  {result.recovered_message || "Could not decode text."}
                </div>
              </div>

              <StepByStepPanel steps={result.steps} />
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-600 italic min-h-[300px] border border-dashed border-gray-800 rounded-lg">
              Results will appear here after verification
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
