import React, { useRef, useState } from 'react';

const REAL_SAMPLES = [
  {
    file: 'healthy_tomato_leaf.jpg',
    name: 'Tomato (Healthy)',
    crop: 'Tomato',
    type: 'Healthy',
    badgeClass: 'badge-healthy',
    emoji: '🌿'
  },
  {
    file: 'tomato_early_blight.jpg',
    name: 'Tomato (Early Blight)',
    crop: 'Tomato',
    type: 'Blight',
    badgeClass: 'badge-blight',
    emoji: '🍂'
  },
  {
    file: 'apple_cedar_rust.jpg',
    name: 'Apple (Cedar Rust)',
    crop: 'Apple',
    type: 'Rust',
    badgeClass: 'badge-rust',
    emoji: '🍎'
  },
  {
    file: 'potato_late_blight.jpg',
    name: 'Potato (Late Blight)',
    crop: 'Potato',
    type: 'Blight',
    badgeClass: 'badge-blight',
    emoji: '🥔'
  },
  {
    file: 'corn_common_rust.jpg',
    name: 'Corn (Common Rust)',
    crop: 'Corn',
    type: 'Rust',
    badgeClass: 'badge-rust',
    emoji: '🌽'
  },
  {
    file: 'grape_black_rot.jpg',
    name: 'Grape (Black Rot)',
    crop: 'Grape',
    type: 'Rot',
    badgeClass: 'badge-rot',
    emoji: '🍇'
  },
  {
    file: 'peach_bacterial_spot.jpg',
    name: 'Peach (Bacterial Spot)',
    crop: 'Peach',
    type: 'Spot',
    badgeClass: 'badge-spot',
    emoji: '🍑'
  },
  {
    file: 'pepper_bell_healthy.jpg',
    name: 'Bell Pepper (Healthy)',
    crop: 'Pepper',
    type: 'Healthy',
    badgeClass: 'badge-healthy',
    emoji: '🫑'
  },
  {
    file: 'tomato_bacterial_spot.jpg',
    name: 'Tomato (Bacterial Spot)',
    crop: 'Tomato',
    type: 'Spot',
    badgeClass: 'badge-spot',
    emoji: '🍅'
  },
  {
    file: 'apple_scab.jpg',
    name: 'Apple (Apple Scab)',
    crop: 'Apple',
    type: 'Scab',
    badgeClass: 'badge-scab',
    emoji: '🍏'
  }
];

export default function LeafDropzone({ selectedImage, onSelectImage, onDiagnose, loading, onSelectSample }) {
  const fileInputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [sampleFilter, setSampleFilter] = useState('ALL');

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onSelectImage(e.dataTransfer.files[0]);
    }
  };

  const filteredSamples = REAL_SAMPLES.filter(s => {
    if (sampleFilter === 'ALL') return true;
    if (sampleFilter === 'HEALTHY') return s.type === 'Healthy';
    if (sampleFilter === 'BLIGHT') return s.type === 'Blight';
    if (sampleFilter === 'RUST') return s.type === 'Rust' || s.type === 'Scab';
    if (sampleFilter === 'SPOT') return s.type === 'Spot' || s.type === 'Rot';
    return true;
  });

  return (
    <div className="glass-card upload-card">
      <div className="card-heading">
        <div className="heading-title-group">
          <span className="heading-dot" />
          <span>Leaf Diagnostic Intake</span>
        </div>
        <span className="heading-chip">OpenCV CLAHE + CNN</span>
      </div>

      {/* Dropzone Area */}
      <div 
        className={`dropzone ${dragOver ? 'dragover' : ''} ${selectedImage ? 'has-preview' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current.click()}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          style={{ display: 'none' }} 
          accept="image/*"
          onChange={(e) => e.target.files[0] && onSelectImage(e.target.files[0])}
        />
        
        <div className="dropzone-ambient-glow" />

        <div className="dropzone-icon-pulse">
          <svg viewBox="0 0 24 24" className="leaf-svg-icon">
            <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5c0 3.5 3 6.5 6 6.5 1.5 0 3-.5 4.5-1.5l1.5 1.5c-2 1.5-4 2-6 2-4.5 0-8-3.5-8-8 0-3 2-6 5-8 5-3.33 11-1.33 12-1.5z"/>
          </svg>
        </div>

        <div className="dropzone-text-primary">
          Drop Genuine Leaf Photograph Here
        </div>
        <div className="dropzone-text-secondary">
          High-res JPEG, PNG from mobile or field cameras • Auto-validates chlorophyll
        </div>

        <div className="dropzone-button-fake">
          <svg style={{ width: 14, height: 14, fill: 'currentColor' }} viewBox="0 0 24 24">
            <path d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z"/>
          </svg>
          Browse Files
        </div>
      </div>

      {/* Holographic Laser Scanner Preview */}
      {selectedImage && (
        <div className="scanner-frame">
          <div className="scanner-hud-corners">
            <span className="corner top-left" />
            <span className="corner top-right" />
            <span className="corner bottom-left" />
            <span className="corner bottom-right" />
          </div>

          {loading && (
            <>
              <div className="scanner-laser-line" />
              <div className="scanner-hud-overlay">
                <div className="hud-reticle" />
                <div className="hud-status">
                  <span className="hud-pulse-dot" />
                  ANALYZING CELLULAR MORPHOLOGY & CLAHE TENSOR...
                </div>
              </div>
            </>
          )}

          <img src={selectedImage.previewUrl} alt="Leaf Preview" className="preview-image" />
          
          <div className="preview-meta-bar">
            <div className="meta-filename">
              <span className="meta-icon">📷</span>
              <span className="meta-name">{selectedImage.name}</span>
            </div>
            <div className="meta-size">
              {(selectedImage.size / 1024).toFixed(1)} KB
            </div>
          </div>
        </div>
      )}

      {/* Verified Real Leaf Sample Quick-Picks Gallery */}
      <div className="samples-section">
        <div className="samples-header">
          <div className="samples-title">
            <span>Verified PlantVillage Sample Leaves</span>
            <span className="samples-count-tag">{REAL_SAMPLES.length} Photos</span>
          </div>
          
          {/* Filter Pills */}
          <div className="samples-filters">
            {['ALL', 'HEALTHY', 'BLIGHT', 'RUST', 'SPOT'].map(f => (
              <button 
                key={f}
                className={`filter-pill ${sampleFilter === f ? 'active' : ''}`}
                onClick={() => setSampleFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="samples-grid-cards">
          {filteredSamples.map((sample) => (
            <div 
              key={sample.file} 
              className="sample-photo-card"
              onClick={() => onSelectSample(sample.file, sample.name)}
              title={`Load ${sample.name}`}
            >
              <div className="sample-thumb-wrapper">
                <img 
                  src={`/sample_images/${sample.file}`} 
                  alt={sample.name} 
                  className="sample-thumb"
                  loading="lazy"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
                <span className={`sample-type-badge ${sample.badgeClass}`}>
                  {sample.type}
                </span>
              </div>
              <div className="sample-card-info">
                <div className="sample-card-name">
                  <span>{sample.emoji}</span> {sample.crop}
                </div>
                <div className="sample-card-disease">
                  {sample.name.replace(`${sample.crop} (`, '').replace(')', '')}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Diagnose Button */}
      <button 
        className={`btn-diagnose ${loading ? 'analyzing' : ''}`} 
        onClick={onDiagnose} 
        disabled={!selectedImage || loading}
      >
        {loading ? (
          <div className="btn-analyzing-content">
            <span className="spinner-orbit" />
            <span>Scanning Foliage with MobileNetV2...</span>
          </div>
        ) : (
          <div className="btn-content">
            <svg viewBox="0 0 24 24" className="btn-icon">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
            </svg>
            <span>Execute Real-Time Diagnosis</span>
          </div>
        )}
      </button>
    </div>
  );
}
