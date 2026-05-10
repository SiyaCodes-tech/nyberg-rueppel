'use client';

import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

export default function History() {
  const [logs, setLogs] = useState([]);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/history');
      if (!res.ok) throw new Error('Failed to fetch history');
      const data = await res.json();
      setLogs(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter(
    (log) => filter === 'All' || log.operation === filter
  );

  return (
    <div className="animate-in fade-in duration-500 pb-12">
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold flex items-center gap-4 mb-2">
            <Clock className="text-green-400 drop-shadow-lg" size={40} />
            <span className="text-gradient">History Log</span>
          </h1>
          <p className="text-gray-400 mt-2">
            Audit trail of all signing and verification operations.
          </p>
        </div>
        <div className="flex gap-2">
          {['All', 'Sign', 'Verify'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                filter === f 
                  ? 'bg-green-500/20 text-green-400 border border-green-500/50' 
                  : 'bg-gray-900 text-gray-400 border border-gray-700 hover:bg-gray-800'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {error && <div className="p-4 bg-red-500/10 text-red-500 border-l-4 border-red-500 mb-6">{error}</div>}

      <div className="cyber-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-950 border-b border-gray-800">
                <th className="p-4 text-gray-400 font-semibold text-sm">Timestamp</th>
                <th className="p-4 text-gray-400 font-semibold text-sm">Operation</th>
                <th className="p-4 text-gray-400 font-semibold text-sm">Key Pair</th>
                <th className="p-4 text-gray-400 font-semibold text-sm">Message / Data</th>
                <th className="p-4 text-gray-400 font-semibold text-sm">Result</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-500 animate-pulse">Loading history logs...</td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-500">No {filter !== 'All' ? filter.toLowerCase() : ''} records found in the database.</td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                    <td className="p-4 text-sm text-gray-400 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        log.operation === 'Sign' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                      }`}>
                        {log.operation}
                      </span>
                    </td>
                    <td className="p-4 text-sm font-medium text-gray-300">
                      {log.key_name}
                    </td>
                    <td className="p-4">
                      <div className="font-mono text-xs text-green-400 bg-gray-950 p-2 rounded border border-gray-800 max-w-xs truncate" title={log.message}>
                        {log.message || '[Unreadable/Failed]'}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 text-sm font-medium ${
                        log.result === 'Success' ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {log.result}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
