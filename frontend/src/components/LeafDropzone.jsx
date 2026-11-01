import React, { useRef, useState } from 'react';

export default function LeafDropzone({ selectedImage, onSelectImage, onDiagnose, loading, onSelectSample }) {
  const fileInputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onSelectImage(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="glass-card">
      <div className="card-heading">
        <span>Leaf Image Upload</span>
        <span style={{ fontSize: '0.72rem', color: 'var(--emerald-primary)' }}>OpenCV Pipeline</span>
      </div>

      <div 
        className={`dropzone ${dragOver ? 'dragover' : ''}`}
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
        <div className="dropzone-icon">
          <svg style={{ width: 28, height: 28, fill: 'currentColor' }} viewBox="0 0 24 24">
            <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"/>
          </svg>
        </div>
        <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.3rem' }}>
          Drag & Drop leaf photo here
        </div>
        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          Supports JPEG, PNG, WebP (Field & Greenhouse leaves)
        </div>
      </div>

      {selectedImage && (
        <div className="preview-container">
          <img src={selectedImage.previewUrl} alt="Leaf Preview" className="preview-image" />
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            background: 'linear-gradient(transparent, rgba(0,0,0,0.85))',
            padding: '0.8rem 1rem', fontSize: '0.75rem', color: '#fff',
            display: 'flex', justifyContent: 'space-between'
          }}>
            <span>{selectedImage.name}</span>
            <span>{(selectedImage.size / 1024).toFixed(1)} KB</span>
          </div>
        </div>
      )}

      {/* Sample Quick Pick Chips */}
      <div className="samples-wrapper">
        <div className="samples-label">Or test with verified sample leaves:</div>
        <div className="samples-grid">
          <button className="sample-chip" onClick={() => onSelectSample('healthy_tomato_leaf.jpg', 'Tomato (Healthy)')}>
            <span style={{ color: 'var(--emerald-primary)' }}>🌿</span> Tomato (Healthy)
          </button>
          <button className="sample-chip" onClick={() => onSelectSample('tomato_early_blight.jpg', 'Tomato (Early Blight)')}>
            <span style={{ color: 'var(--accent-amber)' }}>🍂</span> Tomato (Early Blight)
          </button>
          <button className="sample-chip" onClick={() => onSelectSample('apple_cedar_rust.jpg', 'Apple (Cedar Rust)')}>
            <span style={{ color: '#f97316' }}>🍎</span> Apple (Cedar Rust)
          </button>
          <button className="sample-chip" onClick={() => onSelectSample('potato_late_blight.jpg', 'Potato (Late Blight)')}>
            <span style={{ color: 'var(--accent-red)' }}>🥔</span> Potato (Late Blight)
          </button>
        </div>
      </div>

      <button 
        className="btn-diagnose" 
        onClick={onDiagnose} 
        disabled={!selectedImage || loading}
      >
        {loading ? (
          <><span>Analyzing Leaf with CNN...</span></>
        ) : (
          <>
            <svg style={{ width: 18, height: 18, fill: 'currentColor' }} viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
            </svg>
            Execute Real-Time Diagnosis
          </>
        )}
      </button>
    </div>
  );
}
