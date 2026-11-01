import React, { useRef, useState } from 'react';

const REAL_SAMPLES = [
  {
    file: 'healthy_tomato_leaf.jpg',
    name: 'Tomato (Healthy)',
    crop: 'Tomato',
    type: 'Healthy',
    badge: 'Healthy'
  },
  {
    file: 'tomato_early_blight.jpg',
    name: 'Tomato (Early Blight)',
    crop: 'Tomato',
    type: 'Blight',
    badge: 'Early Blight'
  },
  {
    file: 'apple_cedar_rust.jpg',
    name: 'Apple (Cedar Rust)',
    crop: 'Apple',
    type: 'Rust',
    badge: 'Cedar Rust'
  },
  {
    file: 'potato_late_blight.jpg',
    name: 'Potato (Late Blight)',
    crop: 'Potato',
    type: 'Blight',
    badge: 'Late Blight'
  },
  {
    file: 'corn_common_rust.jpg',
    name: 'Corn (Common Rust)',
    crop: 'Corn',
    type: 'Rust',
    badge: 'Common Rust'
  },
  {
    file: 'grape_black_rot.jpg',
    name: 'Grape (Black Rot)',
    crop: 'Grape',
    type: 'Rot',
    badge: 'Black Rot'
  },
  {
    file: 'peach_bacterial_spot.jpg',
    name: 'Peach (Bacterial Spot)',
    crop: 'Peach',
    type: 'Spot',
    badge: 'Bacterial Spot'
  },
  {
    file: 'pepper_bell_healthy.jpg',
    name: 'Bell Pepper (Healthy)',
    crop: 'Pepper',
    type: 'Healthy',
    badge: 'Healthy'
  },
  {
    file: 'tomato_bacterial_spot.jpg',
    name: 'Tomato (Bacterial Spot)',
    crop: 'Tomato',
    type: 'Spot',
    badge: 'Bacterial Spot'
  },
  {
    file: 'apple_scab.jpg',
    name: 'Apple (Apple Scab)',
    crop: 'Apple',
    type: 'Scab',
    badge: 'Apple Scab'
  }
];

export default function LeafDropzone({ 
  selectedImage, 
  onSelectImage, 
  onDiagnose, 
  loading, 
  onSelectSample, 
  onReset 
}) {
  const fileInputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onSelectImage(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      onSelectImage(e.target.files[0]);
    }
  };

  return (
    <div className="app-card" id="upload-section">
      <div className="card-title-bar">
        <h2 className="card-title">
          <svg style={{ width: 22, height: 22, fill: 'var(--primary)' }} viewBox="0 0 24 24">
            <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"/>
          </svg>
          Upload Crop Leaf
        </h2>
        <span style={{ fontSize: '0.78rem', color: 'var(--secondary)', fontWeight: 600 }}>
          OpenCV + CNN
        </span>
      </div>

      {/* Large Drag-and-Drop Upload Box */}
      <div 
        className={`upload-dropzone ${dragOver ? 'dragover' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current.click()}
        tabIndex={0}
        role="button"
        aria-label="Upload leaf image"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            fileInputRef.current.click();
          }
        }}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          style={{ display: 'none' }} 
          accept="image/*"
          onChange={handleFileInputChange}
        />

        <div className="upload-icon-circle">
          <svg style={{ width: 32, height: 32, fill: 'currentColor' }} viewBox="0 0 24 24">
            <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"/>
          </svg>
        </div>

        <div className="upload-prompt-text">
          Click or drag a leaf image here
        </div>
        <div className="upload-hint-text">
          Supports high-resolution JPEG, PNG, or WebP photographs from mobile or greenhouse cameras.
        </div>

        <div className="browse-files-btn">
          <svg style={{ width: 16, height: 16, fill: 'currentColor' }} viewBox="0 0 24 24">
            <path d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z"/>
          </svg>
          Browse Local Image
        </div>
      </div>

      {/* Uploaded Leaf Image Preview with Scanning Line Animation */}
      {selectedImage && (
        <div className="preview-card">
          {loading && (
            <>
              <div className="scanner-laser" />
              <div className="scanner-overlay-badge">
                <span className="spinner-icon" />
                <span>Analyzing leaf with CNN...</span>
              </div>
            </>
          )}

          <img 
            src={selectedImage.previewUrl} 
            alt="Uploaded leaf preview" 
            className="preview-img-element"
          />

          <div className="preview-bottom-bar">
            <span style={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '70%' }}>
              🍃 {selectedImage.name}
            </span>
            <span style={{ fontFamily: 'var(--font-mono)' }}>
              {(selectedImage.size / 1024).toFixed(1)} KB
            </span>
          </div>
        </div>
      )}

      {/* Action Buttons: Run Diagnosis and Try Another Image */}
      <div className="action-buttons-row">
        <button 
          className="btn-primary-action"
          onClick={onDiagnose}
          disabled={!selectedImage || loading}
          id="btn-diagnose"
        >
          {loading ? (
            <>
              <span className="spinner-icon" />
              <span>Analyzing leaf...</span>
            </>
          ) : (
            <>
              <svg style={{ width: 18, height: 18, fill: 'currentColor' }} viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
              </svg>
              <span>Analyze & Diagnose</span>
            </>
          )}
        </button>

        {selectedImage && (
          <button 
            className="btn-reset-action"
            onClick={onReset}
            disabled={loading}
            title="Try another image"
            id="btn-reset"
          >
            <svg style={{ width: 16, height: 16, fill: 'currentColor' }} viewBox="0 0 24 24">
              <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
            </svg>
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Verified PlantVillage Sample Leaf Quick-Picks */}
      <div className="samples-container">
        <div className="samples-top-row">
          <span className="samples-heading">Or select a verified sample leaf:</span>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>10 Genuine Photos</span>
        </div>

        <div className="sample-chips-grid">
          {REAL_SAMPLES.map((sample) => (
            <div 
              key={sample.file}
              className="sample-leaf-chip"
              onClick={() => onSelectSample(sample.file, sample.name)}
              title={`Load ${sample.name}`}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter') onSelectSample(sample.file, sample.name);
              }}
            >
              <img 
                src={`/sample_images/${sample.file}`} 
                alt={sample.name}
                className="sample-chip-thumb"
                loading="lazy"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <div className="sample-chip-title">{sample.name.split(' (')[0]}</div>
              <div className="sample-chip-badge">{sample.badge}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
