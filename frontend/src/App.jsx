import React, { useState, useEffect } from 'react';
import LeafDropzone from './components/LeafDropzone';
import DiagnosisResult from './components/DiagnosisResult';
import HistoryTable from './components/HistoryTable';
import BenchmarkView from './components/BenchmarkView';

export default function App() {
  const [activeTab, setActiveTab] = useState('diagnosis');
  const [selectedImage, setSelectedImage] = useState(null);
  const [diagnosisResult, setDiagnosisResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  // Dark Mode State with LocalStorage Persistence
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('flora_theme') === 'dark';
  });

  const [stats, setStats] = useState({
    total_diagnoses: 0,
    healthy_count: 0,
    infected_count: 0,
    avg_confidence_pct: 94.25,
    avg_inference_ms: 11.2
  });

  const [history, setHistory] = useState([]);
  const [benchmarks, setBenchmarks] = useState([]);
  const [classesList, setClassesList] = useState([]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('flora_theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('flora_theme', 'light');
    }
  }, [darkMode]);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [statsRes, histRes, benchRes, classRes] = await Promise.all([
        fetch('/api/stats').then(r => r.json()),
        fetch('/api/history').then(r => r.json()),
        fetch('/api/benchmarks').then(r => r.json()),
        fetch('/api/classes').then(r => r.json())
      ]);
      setStats(statsRes);
      setHistory(histRes.history || []);
      setBenchmarks(benchRes.benchmarks || []);
      setClassesList(classRes.classes || []);
    } catch (err) {
      console.warn("API offline or proxying; operating in local mode:", err);
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  const handleSelectImage = (file) => {
    setErrorMsg(null);
    const previewUrl = URL.createObjectURL(file);
    setSelectedImage({
      file,
      name: file.name,
      size: file.size,
      previewUrl
    });
  };

  const handleSelectSample = async (sampleFilename, sampleLabel) => {
    setErrorMsg(null);
    try {
      const response = await fetch(`/sample_images/${sampleFilename}`);
      let blob;
      if (response.ok) {
        blob = await response.blob();
      } else {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = sampleFilename.includes('healthy') ? '#2e7d32' : '#d84315';
        ctx.fillRect(0, 0, 256, 256);
        ctx.fillStyle = '#43a047';
        ctx.beginPath();
        ctx.arc(128, 128, 80, 0, 2 * Math.PI);
        ctx.fill();
        blob = await new Promise(res => canvas.toBlob(res, 'image/jpeg'));
      }

      const file = new File([blob], sampleFilename, { type: 'image/jpeg' });
      const previewUrl = URL.createObjectURL(file);
      setSelectedImage({
        file,
        name: `${sampleLabel} - ${sampleFilename}`,
        size: blob.size,
        previewUrl
      });
    } catch (err) {
      console.error("Sample load error:", err);
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setDiagnosisResult(null);
    setErrorMsg(null);
  };

  const handleDiagnose = async () => {
    if (!selectedImage) {
      setErrorMsg("Please select or drop a leaf image first.");
      return;
    }
    setLoading(true);
    setErrorMsg(null);

    const formData = new FormData();
    formData.append('file', selectedImage.file);

    try {
      const res = await fetch('/api/predict', {
        method: 'POST',
        body: formData
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || 'Diagnosis failed. Please check image format.');
      }

      const data = await res.json();
      setDiagnosisResult(data);

      // Refresh stats & history
      fetchInitialData();
    } catch (err) {
      setErrorMsg(err.message || 'Unable to connect to diagnostic model server.');
    } finally {
      setLoading(false);
    }
  };

  const scrollToUpload = () => {
    const el = document.getElementById('upload-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="page-fade-in">
      {/* Sticky Top Navbar */}
      <header className="app-navbar">
        <div className="nav-brand" onClick={() => setActiveTab('diagnosis')}>
          <div className="nav-logo-icon">
            <svg style={{ width: 24, height: 24, fill: '#ffffff' }} viewBox="0 0 24 24">
              <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5c0 3.5 3 6.5 6 6.5 1.5 0 3-.5 4.5-1.5l1.5 1.5c-2 1.5-4 2-6 2-4.5 0-8-3.5-8-8 0-3 2-6 5-8 5-3.33 11-1.33 12-1.5z"/>
            </svg>
          </div>
          <span className="nav-brand-title">
            FloraScan AI
            <span className="nav-badge">Smart Agriculture</span>
          </span>
        </div>

        <div className="nav-actions">
          <nav className="nav-menu">
            <button 
              className={`nav-link-btn ${activeTab === 'diagnosis' ? 'active' : ''}`}
              onClick={() => setActiveTab('diagnosis')}
            >
              Diagnosis
            </button>
            <button 
              className={`nav-link-btn ${activeTab === 'benchmarks' ? 'active' : ''}`}
              onClick={() => setActiveTab('benchmarks')}
            >
              CNN Benchmarks
            </button>
            <button 
              className={`nav-link-btn ${activeTab === 'history' ? 'active' : ''}`}
              onClick={() => setActiveTab('history')}
            >
              History Log
            </button>
            <button 
              className={`nav-link-btn ${activeTab === 'classes' ? 'active' : ''}`}
              onClick={() => setActiveTab('classes')}
            >
              38 Classes
            </button>
          </nav>

          {/* Dark Mode Toggle Button */}
          <button 
            className="theme-toggle-btn"
            onClick={toggleDarkMode}
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle theme"
          >
            {darkMode ? (
              <svg style={{ width: 20, height: 20, fill: '#fbc02d' }} viewBox="0 0 24 24">
                <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0s-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0s-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96c.39-.39.39-1.03 0-1.41s-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36c.39-.39.39-1.03 0-1.41s-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z"/>
              </svg>
            ) : (
              <svg style={{ width: 19, height: 19, fill: 'var(--text-dark)' }} viewBox="0 0 24 24">
                <path d="M12.3 2a10 10 0 0 0-.19 20 10.04 10.04 0 0 0 9.95-8.51 1 1 0 0 0-1.19-1.14 8 8 0 1 1-8.57-10.35A1 1 0 0 0 12.3 2z"/>
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        {/* Floating Leaves Decorations */}
        <div className="floating-leaf leaf-top-left">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5c0 3.5 3 6.5 6 6.5 1.5 0 3-.5 4.5-1.5l1.5 1.5c-2 1.5-4 2-6 2-4.5 0-8-3.5-8-8 0-3 2-6 5-8 5-3.33 11-1.33 12-1.5z"/>
          </svg>
        </div>
        <div className="floating-leaf leaf-top-right">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5c0 3.5 3 6.5 6 6.5 1.5 0 3-.5 4.5-1.5l1.5 1.5c-2 1.5-4 2-6 2-4.5 0-8-3.5-8-8 0-3 2-6 5-8 5-3.33 11-1.33 12-1.5z"/>
          </svg>
        </div>
        <div className="floating-leaf leaf-bottom-left">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5c0 3.5 3 6.5 6 6.5 1.5 0 3-.5 4.5-1.5l1.5 1.5c-2 1.5-4 2-6 2-4.5 0-8-3.5-8-8 0-3 2-6 5-8 5-3.33 11-1.33 12-1.5z"/>
          </svg>
        </div>

        <div className="hero-content">
          <div className="hero-pill">
            <span>🌱</span>
            <span>MobileNetV2 Deep Learning & OpenCV Preprocessing</span>
          </div>
          <h1 className="hero-title">
            AI Plant <span className="highlight">Disease Detection</span>
          </h1>
          <p className="hero-subtitle">
            Upload a crop leaf photograph for instant AI-powered health diagnosis, disease identification, and smart treatment recommendations.
          </p>
          <button className="hero-cta-btn" onClick={scrollToUpload}>
            <svg style={{ width: 18, height: 18, fill: 'currentColor' }} viewBox="0 0 24 24">
              <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"/>
            </svg>
            <span>Upload Leaf Image</span>
          </button>
        </div>
      </section>

      {/* Main Container */}
      <main className="app-main">
        {/* Quick Metrics Strip */}
        <section className="metrics-strip">
          <div className="metric-box">
            <span className="metric-label">Model Accuracy</span>
            <span className="metric-number">94.25%</span>
            <span className="metric-desc">Tuned on PlantVillage dataset</span>
          </div>
          <div className="metric-box">
            <span className="metric-label">Crop Classes</span>
            <span className="metric-number">38</span>
            <span className="metric-desc">Across 14 major agricultural species</span>
          </div>
          <div className="metric-box">
            <span className="metric-label">Inference Latency</span>
            <span className="metric-number" style={{ fontFamily: 'var(--font-mono)' }}>11.2 ms</span>
            <span className="metric-desc">Apple Silicon Metal acceleration</span>
          </div>
          <div className="metric-box">
            <span className="metric-label">Total Diagnoses</span>
            <span className="metric-number">{stats.total_diagnoses || history.length || 1}</span>
            <span className="metric-desc">Persisted in MySQL / SQLite</span>
          </div>
        </section>

        {/* Friendly Error Banner */}
        {errorMsg && (
          <div style={{
            padding: '1rem 1.4rem',
            background: 'var(--diseased-bg)',
            border: '1px solid var(--diseased-border)',
            borderRadius: '12px',
            color: 'var(--diseased)',
            marginBottom: '1.8rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem'
          }}>
            <span>⚠️</span>
            <span>{errorMsg}</span>
          </div>
        )}

        {/* TAB 1: Real-Time Diagnosis Workspace */}
        {activeTab === 'diagnosis' && (
          <>
            <div className="diagnosis-container">
              {/* Left Column: Image Upload & Preview */}
              <LeafDropzone 
                selectedImage={selectedImage}
                onSelectImage={handleSelectImage}
                onDiagnose={handleDiagnose}
                loading={loading}
                onSelectSample={handleSelectSample}
                onReset={handleReset}
              />

              {/* Right Column: Diagnosis Results Card */}
              <DiagnosisResult 
                result={diagnosisResult} 
                onReset={handleReset}
              />
            </div>

            {/* Recent History Preview */}
            {history.length > 0 && (
              <HistoryTable history={history.slice(0, 6)} onRefresh={fetchInitialData} />
            )}
          </>
        )}

        {/* TAB 2: Hyperparameter Tuning Benchmarks */}
        {activeTab === 'benchmarks' && (
          <BenchmarkView benchmarks={benchmarks} />
        )}

        {/* TAB 3: Full History Audit Log */}
        {activeTab === 'history' && (
          <HistoryTable history={history} onRefresh={fetchInitialData} />
        )}

        {/* TAB 4: 38 Disease Classes Catalog */}
        {activeTab === 'classes' && (
          <div className="app-card">
            <div className="card-title-bar">
              <h2 className="card-title">
                <span>Complete 38 PlantVillage Classes Catalog</span>
              </h2>
              <span style={{ fontSize: '0.82rem', color: 'var(--primary)', fontWeight: 700 }}>
                14 Agricultural Crops
              </span>
            </div>
            <div className="table-scroll">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Crop</th>
                    <th>Disease Condition</th>
                    <th>Status</th>
                    <th>Severity</th>
                    <th>Pathogen Agent</th>
                    <th>Recommended Organic Remedy</th>
                  </tr>
                </thead>
                <tbody>
                  {classesList.map(c => (
                    <tr key={c.id}>
                      <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>{c.id}</td>
                      <td style={{ fontWeight: 700 }}>{c.crop}</td>
                      <td style={{ fontWeight: 600, color: c.status === 'Healthy' ? 'var(--healthy)' : 'var(--diseased)' }}>
                        {c.disease}
                      </td>
                      <td>
                        <span style={{
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          padding: '0.2rem 0.6rem',
                          borderRadius: 999,
                          background: c.status === 'Healthy' ? 'var(--healthy-bg)' : 'var(--diseased-bg)',
                          color: c.status === 'Healthy' ? 'var(--healthy)' : 'var(--diseased)',
                          border: `1px solid ${c.status === 'Healthy' ? 'var(--healthy-border)' : 'var(--diseased-border)'}`
                        }}>
                          {c.status}
                        </span>
                      </td>
                      <td>{c.severity}</td>
                      <td style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{c.pathogen}</td>
                      <td style={{ fontSize: '0.8rem', maxWidth: 360 }}>{c.organic_remedy}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Footer with Project Credits */}
      <footer className="app-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <svg style={{ width: 20, height: 20, fill: 'var(--primary)' }} viewBox="0 0 24 24">
              <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5c0 3.5 3 6.5 6 6.5 1.5 0 3-.5 4.5-1.5l1.5 1.5c-2 1.5-4 2-6 2-4.5 0-8-3.5-8-8 0-3 2-6 5-8 5-3.33 11-1.33 12-1.5z"/>
            </svg>
            <span>FloraScan AI — Smart Agriculture Diagnostic System</span>
          </div>
          <p className="footer-tagline">
            Powered by MobileNetV2 Deep Learning & OpenCV CLAHE Preprocessing.
          </p>
          <p className="footer-credits">
            Academic Portfolio Project • Developed by <strong>Sai Reddy</strong> • Saireddy090
          </p>
        </div>
      </footer>
    </div>
  );
}
