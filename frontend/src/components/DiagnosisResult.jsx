import React, { useState } from 'react';

export default function DiagnosisResult({ result }) {
  const [activeTab, setActiveTab] = useState('organic');

  if (!result) {
    return (
      <div className="glass-card result-placeholder-card">
        <div className="placeholder-glow-ring">
          <div className="placeholder-icon-wrap">
            <svg viewBox="0 0 24 24" className="placeholder-leaf-svg">
              <path d="M12 3C6.5 3 2 6.5 2 12c0 3.58 2.5 6.55 6 7.5v-2.13C5.5 16.5 4 14.5 4 12c0-4.41 3.59-8 8-8s8 3.59 8 8c0 2.5-1.5 4.5-4 5.37v2.13c3.5-.95 6-3.92 6-7.5 0-5.5-4.5-9-10-9zm1 14.93V21h-2v-3.07c-2.34-.48-4-2.52-4-4.93 0-2.76 2.24-5 5-5s5 2.24 5 5c0 2.41-1.66 4.45-4 4.93z"/>
            </svg>
          </div>
        </div>
        <h3 className="placeholder-title">Awaiting Leaf Diagnostics</h3>
        <p className="placeholder-desc">
          Upload a high-resolution field or greenhouse leaf photo on the left, or pick one from the verified PlantVillage gallery below to run the OpenCV CLAHE & MobileNetV2 CNN pipeline.
        </p>
        <div className="placeholder-feature-tags">
          <span className="feat-tag">⚡ 28ms Latency</span>
          <span className="feat-tag">🌿 38 Plant Classes</span>
          <span className="feat-tag">🔬 CLAHE Normalized</span>
        </div>
      </div>
    );
  }

  const { diagnosis, top3_ranking, inference_time_ms, foliage_ratio, is_leaf_warning } = result;
  const isHealthy = diagnosis.status === 'Healthy';

  // Determine severity coloring
  let severityTheme = 'theme-moderate';
  if (isHealthy) {
    severityTheme = 'theme-healthy';
  } else if (diagnosis.severity === 'Critical' || diagnosis.severity === 'High') {
    severityTheme = 'theme-critical';
  }

  return (
    <div className={`glass-card result-card ${severityTheme}`}>
      <div className="card-heading">
        <div className="heading-title-group">
          <span className={`status-pulse-orb ${isHealthy ? 'orb-healthy' : 'orb-infected'}`} />
          <span>Diagnostic Assessment</span>
        </div>
        <span className="latency-badge">
          ⚡ {inference_time_ms} ms Latency
        </span>
      </div>

      {is_leaf_warning && (
        <div className="foliage-warning-alert">
          <span className="alert-icon">⚠️</span>
          <span>
            Low foliage tissue detected ({Math.round(foliage_ratio * 100)}%). Ensure leaf blade fills at least 15% of frame against neutral backdrop.
          </span>
        </div>
      )}

      {/* Main Champion Hero Result Banner */}
      <div className={`diagnosis-hero-banner ${isHealthy ? 'hero-healthy' : 'hero-infected'}`}>
        <div className="hero-left">
          <div className="hero-crop-meta">
            <span className="crop-tag">{diagnosis.crop}</span>
            <span className="meta-bullet">•</span>
            <span className="pathogen-tag">
              {diagnosis.pathogen !== 'None' && diagnosis.pathogen !== 'N/A' ? diagnosis.pathogen : 'No Pathogen (Vibrant)'}
            </span>
          </div>

          <h2 className="hero-disease-name">
            {diagnosis.disease}
          </h2>

          <div className="hero-confidence-row">
            <div className="confidence-pill">
              <span className="conf-label">Confidence:</span>
              <strong className="conf-value">{diagnosis.confidence_pct}%</strong>
            </div>
            <div className="model-chip">
              MobileNetV2 CNN
            </div>
          </div>
        </div>

        <div className="hero-right">
          <div className={`status-pill-badge ${isHealthy ? 'status-healthy' : 'status-infected'}`}>
            <span className="status-dot-blink" />
            <span>{diagnosis.status}</span>
          </div>
          
          <div className="severity-meter-mini">
            <span className="severity-label">Severity Level:</span>
            <span className={`severity-val severity-${diagnosis.severity.toLowerCase()}`}>
              {diagnosis.severity}
            </span>
          </div>
        </div>
      </div>

      {/* Foliage Purity Meter */}
      <div className="foliage-meter-bar">
        <div className="foliage-label">
          <span>🌿 Chlorophyll Foliage Coverage:</span>
          <strong>{Math.round(foliage_ratio * 100)}% Verified Tissue</strong>
        </div>
        <div className="foliage-track">
          <div 
            className="foliage-fill" 
            style={{ width: `${Math.min(100, Math.max(10, Math.round(foliage_ratio * 100)))}%` }} 
          />
        </div>
      </div>

      {/* Top 3 Predictions Probability Breakdown */}
      <div className="confidence-distribution-box">
        <div className="dist-header">
          <span>Top Candidates Distribution</span>
          <span className="dist-subtitle">Multi-Class Probability Distribution</span>
        </div>

        <div className="candidate-list">
          {top3_ranking.map((cand, idx) => (
            <div key={cand.rank} className={`candidate-row ${idx === 0 ? 'candidate-champion' : ''}`}>
              <div className="candidate-meta">
                <div className="candidate-name-wrap">
                  <span className="candidate-rank">#{cand.rank}</span>
                  <span className="candidate-name">{cand.crop} — {cand.disease}</span>
                </div>
                <span className="candidate-pct">{cand.confidence_pct}%</span>
              </div>
              <div className="candidate-bar-track">
                <div 
                  className={`candidate-bar-fill fill-rank-${cand.rank}`}
                  style={{ width: `${cand.confidence_pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Observed Symptoms Box */}
      <div className="symptoms-card">
        <div className="symptoms-title">
          <svg viewBox="0 0 24 24" className="symptom-icon">
            <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
          </svg>
          <span>Observed Pathology & Lesion Morphology</span>
        </div>
        <p className="symptoms-text">
          {diagnosis.symptoms}
        </p>
      </div>

      {/* Actionable Remedies Section with Realistic Animated Tabs */}
      <div className="remedy-container">
        <div className="remedy-nav">
          <button 
            className={`remedy-nav-tab ${activeTab === 'organic' ? 'active tab-organic' : ''}`}
            onClick={() => setActiveTab('organic')}
          >
            🌱 Organic Remedies
          </button>
          <button 
            className={`remedy-nav-tab ${activeTab === 'chemical' ? 'active tab-chemical' : ''}`}
            onClick={() => setActiveTab('chemical')}
          >
            🧪 Chemical Control
          </button>
          <button 
            className={`remedy-nav-tab ${activeTab === 'prevention' ? 'active tab-prevention' : ''}`}
            onClick={() => setActiveTab('prevention')}
          >
            🛡️ Cultural Prevention
          </button>
        </div>

        <div className="remedy-body-card">
          {activeTab === 'organic' && (
            <div className="remedy-panel anim-fade-in">
              <div className="remedy-type-heading">
                <span>🌱 Recommended Bio-Fungicides & Cultural Measures:</span>
              </div>
              <p className="remedy-detail-text">{diagnosis.organic_remedy}</p>
              <div className="remedy-tip-banner">
                💡 <em>Tip: Spray during early morning or overcast days to prevent leaf phototoxicity.</em>
              </div>
            </div>
          )}

          {activeTab === 'chemical' && (
            <div className="remedy-panel anim-fade-in">
              <div className="remedy-type-heading">
                <span>🧪 Targeted Chemical Fungicide & Bactericide Compounds:</span>
              </div>
              <p className="remedy-detail-text">{diagnosis.chemical_remedy}</p>
              <div className="remedy-tip-banner chemical-tip">
                ⚠️ <em>Ensure compliance with Pre-Harvest Interval (PHI) regulations and rotate FRAC action groups.</em>
              </div>
            </div>
          )}

          {activeTab === 'prevention' && (
            <div className="remedy-panel anim-fade-in">
              <div className="remedy-type-heading">
                <span>🛡️ Preventative Husbandry & Disease Avoidance:</span>
              </div>
              <p className="remedy-detail-text">{diagnosis.prevention}</p>
              <div className="remedy-tip-banner">
                🌾 <em>Incorporate 2-year non-solanaceous crop rotations to interrupt pathogen spore life cycles.</em>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
