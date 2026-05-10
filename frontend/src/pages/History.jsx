import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

const History = () => {
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
    <div className="animate-in fade-in duration-500">
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-textMain flex items-center gap-3">
            <Clock className="text-primary" size={32} />
            History Log
          </h1>
          <p className="text-textMuted mt-2">
            Audit trail of all signing and verification operations.
          </p>
        </div>

        <div className="flex bg-[#1a1a1a] p-1 rounded-md border border-[#2a2a2a] w-fit">
          {['All', 'Sign', 'Verify'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded text-sm font-medium transition-colors ${
                filter === f
                  ? 'bg-primary text-background'
                  : 'text-textMuted hover:text-textMain'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="cyber-panel overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-textMuted flex flex-col items-center gap-2">
            <svg className="animate-spin h-6 w-6 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            Loading history...
          </div>
        ) : error ? (
          <div className="p-8 text-center text-error">{error}</div>
        ) : filteredLogs.length === 0 ? (
          <div className="p-8 text-center text-textMuted">
            No history found. Try signing or verifying a message first.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#1a1a1a] border-b border-border text-textMuted text-xs uppercase tracking-wider">
                  <th className="p-4 font-medium">Timestamp</th>
                  <th className="p-4 font-medium">Operation</th>
                  <th className="p-4 font-medium">Key Pair</th>
                  <th className="p-4 font-medium">Message</th>
                  <th className="p-4 font-medium text-right">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredLogs.map((log) => (
                  <tr key={log.id + log.operation} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 text-sm text-textMuted whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium border ${
                        log.operation === 'Sign' 
                          ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' 
                          : 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                      }`}>
                        {log.operation}
                      </span>
                    </td>
                    <td className="p-4 text-sm font-medium text-textMain">
                      {log.key_name}
                    </td>
                    <td className="p-4 text-sm font-mono text-textMuted max-w-[200px] truncate" title={log.message}>
                      {log.message}
                    </td>
                    <td className="p-4 text-right">
                      <span className={`inline-flex items-center text-sm font-medium ${
                        log.result === 'Success' ? 'text-success' : 'text-error'
                      }`}>
                        {log.result}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
