import React, { useState } from 'react';

export default function DiagnosisResult({ result, onReset }) {
  const [activeTab, setActiveTab] = useState('organic');

  if (!result) {
    return (
      <div className="app-card result-awaiting-card" id="results-placeholder">
        <div className="awaiting-icon-wrap">
          <svg style={{ width: 36, height: 36, fill: 'currentColor' }} viewBox="0 0 24 24">
            <path d="M12 3C6.5 3 2 6.5 2 12c0 3.58 2.5 6.55 6 7.5v-2.13C5.5 16.5 4 14.5 4 12c0-4.41 3.59-8 8-8s8 3.59 8 8c0 2.5-1.5 4.5-4 5.37v2.13c3.5-.95 6-3.92 6-7.5 0-5.5-4.5-9-10-9zm1 14.93V21h-2v-3.07c-2.34-.48-4-2.52-4-4.93 0-2.76 2.24-5 5-5s5 2.24 5 5c0 2.41-1.66 4.45-4 4.93z"/>
          </svg>
        </div>
        <h3 className="awaiting-title">Awaiting Leaf Diagnosis</h3>
        <p className="awaiting-text">
          Upload a crop leaf photograph or select one of the verified sample leaves on the left to analyze with the MobileNetV2 CNN model.
        </p>
      </div>
    );
  }

  const { diagnosis, top3_ranking, inference_time_ms, foliage_ratio, is_leaf_warning } = result;
  const isHealthy = diagnosis.status === 'Healthy';

  return (
    <div 
      className={`app-card result-card-active ${isHealthy ? 'status-healthy-theme' : 'status-diseased-theme'}`}
      id="results-card"
    >
      <div className="card-title-bar">
        <h2 className="card-title">
          <svg style={{ width: 22, height: 22, fill: isHealthy ? 'var(--healthy)' : 'var(--diseased)' }} viewBox="0 0 24 24">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/>
          </svg>
          Diagnostic Assessment
        </h2>
        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          ⚡ {inference_time_ms} ms Latency
        </span>
      </div>

      {is_leaf_warning && (
        <div style={{
          padding: '0.75rem 1rem',
          background: 'rgba(245, 127, 23, 0.12)',
          border: '1px solid rgba(245, 127, 23, 0.35)',
          borderRadius: '10px',
          color: '#e65100',
          fontSize: '0.8rem',
          marginBottom: '1.2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <span>⚠️</span>
          <span>Notice: Low foliage tissue detected ({Math.round(foliage_ratio * 100)}%). Ensure the leaf blade fills the central frame.</span>
        </div>
      )}

      {/* Disease Name & Status Banner */}
      <div className={`result-status-banner ${isHealthy ? 'status-healthy-theme' : 'status-diseased-theme'}`}>
        <div className="status-left-meta">
          <div className="result-crop-tag">
            {diagnosis.crop} • {diagnosis.pathogen !== 'None' ? diagnosis.pathogen : 'Healthy Foliage'}
          </div>
          <h1 className="result-disease-heading">
            {diagnosis.disease}
          </h1>
        </div>

        <div className="status-right-badge">
          <span className={`status-badge-chip ${isHealthy ? 'status-badge-healthy' : 'status-badge-diseased'}`}>
            {isHealthy ? (
              <>
                <svg style={{ width: 16, height: 16, fill: '#ffffff' }} viewBox="0 0 24 24">
                  <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/>
                </svg>
                <span>Healthy Leaf</span>
              </>
            ) : (
              <>
                <svg style={{ width: 16, height: 16, fill: '#ffffff' }} viewBox="0 0 24 24">
                  <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
                </svg>
                <span>{diagnosis.status}</span>
              </>
            )}
          </span>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'right', marginTop: '0.4rem' }}>
            Severity: <strong style={{ color: isHealthy ? 'var(--healthy)' : 'var(--diseased)' }}>{diagnosis.severity}</strong>
          </div>
        </div>
      </div>

      {/* Confidence Percentage with Animated Progress Bar */}
      <div className="confidence-bar-section">
        <div className="conf-bar-header">
          <span>AI Diagnostic Confidence</span>
          <span className="conf-bar-percentage">{diagnosis.confidence_pct}%</span>
        </div>
        <div className="progress-track" role="progressbar" aria-valuenow={diagnosis.confidence_pct} aria-valuemin="0" aria-valuemax="100">
          <div 
            className={`progress-fill ${isHealthy ? 'progress-fill-healthy' : 'progress-fill-diseased'}`}
            style={{ width: `${diagnosis.confidence_pct}%` }}
          />
        </div>
      </div>

      {/* Observed Symptoms */}
      {diagnosis.symptoms && (
        <div className="symptoms-preview-box">
          <div className="symptoms-label">Observed Leaf Symptoms:</div>
          <p className="symptoms-detail">{diagnosis.symptoms}</p>
        </div>
      )}

      {/* Treatment Tips Section */}
      <div className="treatment-section">
        <div className="treatment-nav-tabs">
          <button 
            className={`treatment-tab-btn ${activeTab === 'organic' ? 'active' : ''}`}
            onClick={() => setActiveTab('organic')}
          >
            🌱 Organic Remedies
          </button>
          <button 
            className={`treatment-tab-btn ${activeTab === 'chemical' ? 'active' : ''}`}
            onClick={() => setActiveTab('chemical')}
          >
            🧪 Chemical Control
          </button>
          <button 
            className={`treatment-tab-btn ${activeTab === 'prevention' ? 'active' : ''}`}
            onClick={() => setActiveTab('prevention')}
          >
            🛡️ Cultural Prevention
          </button>
        </div>

        <div className="treatment-content-box">
          {activeTab === 'organic' && (
            <div>
              <div className="treatment-heading">🌱 Recommended Organic & Bio-Fungicide Treatment:</div>
              <p className="treatment-text">{diagnosis.organic_remedy}</p>
            </div>
          )}
          {activeTab === 'chemical' && (
            <div>
              <div className="treatment-heading">🧪 Targeted Chemical Compounds:</div>
              <p className="treatment-text">{diagnosis.chemical_remedy}</p>
            </div>
          )}
          {activeTab === 'prevention' && (
            <div>
              <div className="treatment-heading">🛡️ Best Agronomic Practices:</div>
              <p className="treatment-text">{diagnosis.prevention}</p>
            </div>
          )}
        </div>
      </div>

      {/* Top 3 Alternative Candidates */}
      {top3_ranking && top3_ranking.length > 1 && (
        <div style={{ marginTop: '1.2rem', paddingTop: '1.2rem', borderTop: '1px solid var(--border-color)' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
            Alternative Candidates Breakdown
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {top3_ranking.map((cand) => (
              <div key={cand.rank} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                <span>#{cand.rank} {cand.crop} — {cand.disease}</span>
                <span style={{ fontWeight: 700, color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>{cand.confidence_pct}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Try Another Image Button */}
      {onReset && (
        <div style={{ marginTop: '1.6rem', textAlign: 'center' }}>
          <button 
            className="btn-reset-action" 
            onClick={onReset}
            style={{ width: '100%', justifyContent: 'center' }}
          >
            <svg style={{ width: 16, height: 16, fill: 'currentColor' }} viewBox="0 0 24 24">
              <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
            </svg>
            <span>Try Another Image</span>
          </button>
        </div>
      )}
    </div>
  );
}
