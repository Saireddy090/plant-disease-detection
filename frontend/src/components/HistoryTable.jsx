import React, { useState } from 'react';

export default function HistoryTable({ history, onRefresh }) {
  const [filter, setFilter] = useState('');

  const filteredHistory = history.filter(item => 
    (item.crop && item.crop.toLowerCase().includes(filter.toLowerCase())) ||
    (item.disease_name && item.disease_name.toLowerCase().includes(filter.toLowerCase()))
  );

  return (
    <div className="glass-card" style={{ marginTop: '2rem' }}>
      <div className="card-heading">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <span>Diagnosis Audit Log</span>
          <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem', borderRadius: 6, background: 'rgba(255,255,255,0.06)' }}>
            MySQL / SQLite Persisted
          </span>
        </div>
        <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
          <input 
            type="text" 
            placeholder="Filter by crop or disease..." 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{
              padding: '0.35rem 0.8rem',
              borderRadius: 8,
              border: '1px solid var(--border-glass)',
              background: 'rgba(0,0,0,0.3)',
              color: 'var(--text-primary)',
              fontSize: '0.78rem',
              outline: 'none',
              width: 220
            }}
          />
          <button 
            onClick={onRefresh}
            style={{
              padding: '0.35rem 0.8rem',
              borderRadius: 8,
              border: '1px solid var(--border-glass)',
              background: 'rgba(255,255,255,0.05)',
              color: 'var(--text-primary)',
              fontSize: '0.78rem',
              cursor: 'pointer'
            }}
          >
            ↻ Refresh
          </button>
        </div>
      </div>

      <div className="table-scroll">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Timestamp</th>
              <th>Image File</th>
              <th>Crop</th>
              <th>Diagnosed Condition</th>
              <th>Confidence</th>
              <th>Severity</th>
              <th>Status</th>
              <th>Latency</th>
            </tr>
          </thead>
          <tbody>
            {filteredHistory.length === 0 ? (
              <tr>
                <td colSpan="9" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                  No diagnosis records found in database.
                </td>
              </tr>
            ) : (
              filteredHistory.map((row) => (
                <tr key={row.id}>
                  <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>#{row.id}</td>
                  <td style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{row.created_at}</td>
                  <td style={{ fontWeight: 600 }}>{row.image_filename}</td>
                  <td>{row.crop}</td>
                  <td style={{ fontWeight: 600 }}>{row.disease_name}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--emerald-primary)' }}>
                    {Math.round(row.confidence_score * 100)}%
                  </td>
                  <td>
                    <span style={{
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      padding: '0.15rem 0.5rem',
                      borderRadius: 6,
                      background: row.severity === 'Critical' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                      color: row.severity === 'Critical' ? 'var(--accent-red)' : 'var(--text-primary)'
                    }}>
                      {row.severity}
                    </span>
                  </td>
                  <td>
                    <span style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      padding: '0.15rem 0.5rem',
                      borderRadius: 999,
                      background: row.is_healthy ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                      color: row.is_healthy ? 'var(--emerald-primary)' : 'var(--accent-amber)'
                    }}>
                      {row.is_healthy ? 'HEALTHY' : 'INFECTED'}
                    </span>
                  </td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {row.inference_time_ms} ms
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
