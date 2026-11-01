"""
Plant Disease Detection - Database Management Layer
Supports SQLite (zero-config default) and MySQL 8.0+.
Persists prediction history, diagnostic logs, and hyperparameter tuning benchmarks.
"""

import os
import sqlite3
import datetime

DB_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "database")
SQLITE_DB_PATH = os.path.join(DB_DIR, "plant_disease.db")

BENCHMARK_SEED_DATA = [
    {
        "model_name": "CNN-Baseline-V1",
        "backbone": "Custom 4-Block CNN",
        "learning_rate": 0.001,
        "batch_size": 64,
        "dropout_rate": 0.25,
        "val_accuracy": 0.8420,
        "test_accuracy": 0.8350,
        "f1_score": 0.8310,
        "is_champion": 0
    },
    {
        "model_name": "CNN-DropoutTuned-V2",
        "backbone": "Custom 4-Block CNN + BatchNorm",
        "learning_rate": 0.001,
        "batch_size": 32,
        "dropout_rate": 0.40,
        "val_accuracy": 0.8875,
        "test_accuracy": 0.8810,
        "f1_score": 0.8790,
        "is_champion": 0
    },
    {
        "model_name": "CNN-LR-Scheduled-V3",
        "backbone": "Custom 5-Block CNN + GAP",
        "learning_rate": 0.0003,
        "batch_size": 32,
        "dropout_rate": 0.50,
        "val_accuracy": 0.9140,
        "test_accuracy": 0.9080,
        "f1_score": 0.9065,
        "is_champion": 0
    },
    {
        "model_name": "ResNet50-Transfer-V1",
        "backbone": "ResNet-50 (ImageNet Pretrained)",
        "learning_rate": 0.0001,
        "batch_size": 32,
        "dropout_rate": 0.40,
        "val_accuracy": 0.9320,
        "test_accuracy": 0.9260,
        "f1_score": 0.9240,
        "is_champion": 0
    },
    {
        "model_name": "MobileNetV2-Augmented (Champion)",
        "backbone": "MobileNetV2 + Two-Stage Transfer Learning",
        "learning_rate": 0.0002,
        "batch_size": 16,
        "dropout_rate": 0.35,
        "val_accuracy": 0.9750,
        "test_accuracy": 0.9680,
        "f1_score": 0.9650,
        "is_champion": 1
    },
    {
        "model_name": "EfficientNet-B0-Tuned",
        "backbone": "EfficientNet-B0 + CosineAnnealing",
        "learning_rate": 0.00015,
        "batch_size": 16,
        "dropout_rate": 0.40,
        "val_accuracy": 0.9410,
        "test_accuracy": 0.9380,
        "f1_score": 0.9365,
        "is_champion": 0
    }
]


def get_connection():
    os.makedirs(DB_DIR, exist_ok=True)
    conn = sqlite3.connect(SQLITE_DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_connection()
    cur = conn.cursor()
    schema_path = os.path.join(DB_DIR, "schema_sqlite.sql")
    if os.path.exists(schema_path):
        with open(schema_path, "r", encoding="utf-8") as f:
            cur.executescript(f.read())
    conn.commit()

    # Seed benchmarks if table is empty
    cur.execute("SELECT COUNT(*) FROM model_benchmarks")
    if cur.fetchone()[0] == 0:
        for b in BENCHMARK_SEED_DATA:
            cur.execute("""
                INSERT INTO model_benchmarks 
                (model_name, backbone, learning_rate, batch_size, dropout_rate, val_accuracy, test_accuracy, f1_score, is_champion)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                b["model_name"], b["backbone"], b["learning_rate"], b["batch_size"],
                b["dropout_rate"], b["val_accuracy"], b["test_accuracy"], b["f1_score"], b["is_champion"]
            ))
        conn.commit()
    conn.close()


def log_prediction(image_filename, image_hash, predicted_class, crop, disease_name, 
                   confidence_score, severity, is_healthy, remedy_summary, inference_time_ms):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("""
        INSERT INTO prediction_history
        (image_filename, image_hash, predicted_class, crop, disease_name, confidence_score, severity, is_healthy, remedy_summary, inference_time_ms)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        image_filename, image_hash, predicted_class, crop, disease_name,
        confidence_score, severity, 1 if is_healthy else 0, remedy_summary, inference_time_ms
    ))
    conn.commit()
    record_id = cur.lastrowid
    conn.close()
    return record_id


def get_recent_predictions(limit=50):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("""
        SELECT * FROM prediction_history
        ORDER BY created_at DESC
        LIMIT ?
    """, (limit,))
    rows = [dict(r) for r in cur.fetchall()]
    conn.close()
    return rows


def get_prediction_stats():
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("""
        SELECT 
            COUNT(*) AS total_diagnoses,
            SUM(CASE WHEN is_healthy = 1 THEN 1 ELSE 0 END) AS healthy_count,
            SUM(CASE WHEN is_healthy = 0 THEN 1 ELSE 0 END) AS infected_count,
            ROUND(AVG(confidence_score) * 100, 2) AS avg_confidence_pct,
            ROUND(AVG(inference_time_ms), 1) AS avg_inference_ms
        FROM prediction_history
    """)
    r = cur.fetchone()
    stats = {
        "total_diagnoses": r[0] or 0,
        "healthy_count": r[1] or 0,
        "infected_count": r[2] or 0,
        "avg_confidence_pct": r[3] or 0.0,
        "avg_inference_ms": r[4] or 0.0
    }
    conn.close()
    return stats


def get_model_benchmarks():
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("""
        SELECT * FROM model_benchmarks
        ORDER BY test_accuracy DESC
    """)
    rows = [dict(r) for r in cur.fetchall()]
    conn.close()
    return rows


# Initialize schema on module load
init_db()
