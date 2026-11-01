-- ==============================================================================
-- Plant Disease Detection: Database Schema (SQLite 3.25+)
-- Self-contained local schema for prediction history and model benchmarks.
-- ==============================================================================

PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS prediction_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    image_filename TEXT NOT NULL,
    image_hash TEXT NOT NULL,
    predicted_class TEXT NOT NULL,
    crop TEXT NOT NULL,
    disease_name TEXT NOT NULL,
    confidence_score REAL NOT NULL,
    severity TEXT NOT NULL DEFAULT 'Moderate',
    is_healthy INTEGER NOT NULL DEFAULT 0,
    remedy_summary TEXT,
    inference_time_ms REAL NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_ph_class ON prediction_history (predicted_class);
CREATE INDEX IF NOT EXISTS idx_ph_crop ON prediction_history (crop);
CREATE INDEX IF NOT EXISTS idx_ph_created ON prediction_history (created_at DESC);

CREATE TABLE IF NOT EXISTS model_benchmarks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    model_name TEXT NOT NULL,
    backbone TEXT NOT NULL,
    learning_rate REAL NOT NULL,
    batch_size INTEGER NOT NULL,
    dropout_rate REAL NOT NULL,
    val_accuracy REAL NOT NULL,
    test_accuracy REAL NOT NULL,
    f1_score REAL NOT NULL,
    is_champion INTEGER NOT NULL DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
