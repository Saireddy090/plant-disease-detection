-- ==============================================================================
-- Plant Disease Detection: Database Schema (MySQL 8.0+)
-- Stores prediction audit logs, leaf diagnosis history, and benchmark metrics.
-- ==============================================================================

CREATE DATABASE IF NOT EXISTS plant_disease_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE plant_disease_db;

-- 1. Prediction History Table
CREATE TABLE IF NOT EXISTS prediction_history (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    image_filename VARCHAR(255) NOT NULL,
    image_hash CHAR(64) NOT NULL,
    predicted_class VARCHAR(100) NOT NULL,
    crop VARCHAR(60) NOT NULL,
    disease_name VARCHAR(120) NOT NULL,
    confidence_score DECIMAL(5, 4) NOT NULL,
    severity ENUM('None', 'Low', 'Moderate', 'High', 'Critical') NOT NULL DEFAULT 'Moderate',
    is_healthy BOOLEAN NOT NULL DEFAULT FALSE,
    remedy_summary TEXT,
    inference_time_ms DECIMAL(7, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_ph_class (predicted_class),
    INDEX idx_ph_crop (crop),
    INDEX idx_ph_created (created_at DESC)
) ENGINE=InnoDB;

-- 2. CNN Architecture Benchmarks & Hyperparameter Tuning Table
CREATE TABLE IF NOT EXISTS model_benchmarks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    model_name VARCHAR(100) NOT NULL,
    backbone VARCHAR(80) NOT NULL,
    learning_rate DECIMAL(7, 6) NOT NULL,
    batch_size INT NOT NULL,
    dropout_rate DECIMAL(3, 2) NOT NULL,
    val_accuracy DECIMAL(5, 4) NOT NULL,
    test_accuracy DECIMAL(5, 4) NOT NULL,
    f1_score DECIMAL(5, 4) NOT NULL,
    is_champion BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;
