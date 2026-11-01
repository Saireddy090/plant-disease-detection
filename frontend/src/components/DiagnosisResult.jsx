import React, { useState } from 'react';

export default function DiagnosisResult({ result }) {
  const [activeTab, setActiveTab] = useState('organic');

  if (!result) {
    return (
      <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 450, textAlign: 'center' }}>
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
          <svg style={{ width: 32, height: 32, fill: 'var(--text-muted)' }} viewBox="0 0 24 24">
            <path d="M12 3C6.5 3 2 6.5 2 12c0 3.58 2.5 6.55 6 7.5v-2.13C5.5 16.5 4 14.5 4 12c0-4.41 3.59-8 8-8s8 3.59 8 8c0 2.5-1.5 4.5-4 5.37v2.13c3.5-.95 6-3.92 6-7.5 0-5.5-4.5-9-10-9zm1 14.93V21h-2v-3.07c-2.34-.48-4-2.52-4-4.93 0-2.76 2.24-5 5-5s5 2.24 5 5c0 2.41-1.66 4.45-4 4.93z"/>
          </svg>
        </div>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.4rem' }}>Awaiting Leaf Upload</h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: 360 }}>
          Upload a crop leaf image on the left or select a sample leaf to trigger OpenCV preprocessing and real-time deep learning diagnosis.
        </p>
      </div>
    );
  }

  const { diagnosis, top3_ranking, inference_time_ms, foliage_ratio, is_leaf_warning } = result;
  const isHealthy = diagnosis.status === 'Healthy';

  return (
    <div className="glass-card">
      <div className="card-heading">
        <span>Diagnostic Assessment</span>
        <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--emerald-primary)' }}>
          ⚡ {inference_time_ms} ms Latency
        </span>
      </div>

      {is_leaf_warning && (
        <div style={{ padding: '0.75rem 1rem', background: 'rgba(245, 158, 11, 0.12)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: 10, fontSize: '0.8rem', color: 'var(--accent-amber)', marginBottom: '1.2rem' }}>
          ⚠️ Notice: Low foliage tissue detected ({Math.round(foliage_ratio * 100)}%). For highest accuracy, capture leaf against a neutral background.
        </div>
      )}

      {/* Main Champion Banner */}
      <div className={`result-banner ${isHealthy ? 'healthy' : 'infected'}`}>
        <div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
            {diagnosis.crop} • {diagnosis.pathogen !== 'None' ? diagnosis.pathogen : 'No Pathogen'}
          </div>
          <div style={{ fontSize: '1.45rem', fontWeight: 800, marginTop: '0.1rem' }}>
            {diagnosis.disease}
          </div>
          <div style={{ fontSize: '0.82rem', color: isHealthy ? 'var(--emerald-primary)' : 'var(--accent-amber)', marginTop: '0.2rem' }}>
            Confidence: <strong>{diagnosis.confidence_pct}%</strong> (Top Rank)
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <span className={`status-badge ${isHealthy ? 'healthy' : 'infected'}`}>
            {diagnosis.status}
          </span>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
            Severity: <strong style={{ color: diagnosis.severity === 'Critical' ? 'var(--accent-red)' : 'var(--text-primary)' }}>{diagnosis.severity}</strong>
          </div>
        </div>
      </div>

      {/* Top 3 Predictions Probability Breakdown */}
      <div className="ranking-section">
        <div style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.8rem' }}>
          Model Confidence Distribution (Top 3 Candidates)
        </div>
        {top3_ranking.map((cand) => (
          <div key={cand.rank} className="rank-row">
            <div className="rank-meta">
              <span>#{cand.rank} {cand.crop} — {cand.disease}</span>
              <span style={{ fontFamily: 'var(--font-mono)' }}>{cand.confidence_pct}%</span>
            </div>
            <div className="bar-track">
              <div className="bar-fill-emerald" style={{ width: `${cand.confidence_pct}%` }} />
            </div>
          </div>
        ))}
      </div>

      {/* Symptoms & Visual Description */}
      <div style={{ marginBottom: '1.2rem', padding: '0.8rem 1rem', background: 'rgba(255,255,255,0.02)', borderRadius: 10, border: '1px solid var(--border-glass)' }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
          Observed Leaf Symptoms
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>
          {diagnosis.symptoms}
        </p>
      </div>

      {/* Actionable Remedies Tabs */}
      <div className="remedy-box">
        <div className="remedy-tabs">
          <button 
            className={`remedy-tab ${activeTab === 'organic' ? 'active' : ''}`}
            onClick={() => setActiveTab('organic')}
          >
            🌱 Organic Remedies
          </button>
          <button 
            className={`remedy-tab ${activeTab === 'chemical' ? 'active' : ''}`}
            onClick={() => setActiveTab('chemical')}
          >
            🧪 Chemical Control
          </button>
          <button 
            className={`remedy-tab ${activeTab === 'prevention' ? 'active' : ''}`}
            onClick={() => setActiveTab('prevention')}
          >
            🛡️ Prevention Practices
          </button>
        </div>

        <div className="remedy-content">
          {activeTab === 'organic' && <p>{diagnosis.organic_remedy}</p>}
          {activeTab === 'chemical' && <p>{diagnosis.chemical_remedy}</p>}
          {activeTab === 'prevention' && <p>{diagnosis.prevention}</p>}
        </div>
      </div>
    </div>
  );
}
