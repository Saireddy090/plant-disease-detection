"""
Plant Disease Detection - FastAPI REST Backend
Exposes diagnosis endpoints, prediction logging, and model benchmarks.
"""

import os
import io
import time
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse, FileResponse

from .model import classifier, hash_image
from .db import (
    log_prediction, 
    get_recent_predictions, 
    get_prediction_stats, 
    get_model_benchmarks
)
from .disease_info import DISEASE_METADATA, CLASSES_LIST

app = FastAPI(
    title="Plant Disease Detection API",
    description="Deep Learning API for classifying 38 plant diseases with OpenCV preprocessing and remedy recommendations.",
    version="1.0.0"
)

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

FRONTEND_DIST = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "frontend", "dist")


@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "classes_count": len(CLASSES_LIST),
        "backend_model": classifier.backend,
        "timestamp": time.time()
    }


@app.post("/api/predict")
async def predict_leaf(file: UploadFile = File(...)):
    # Validate content type
    allowed_types = ["image/jpeg", "image/png", "image/webp", "image/jpg"]
    if file.content_type not in allowed_types and not file.filename.lower().endswith(('.jpg', '.jpeg', '.png', '.webp')):
        raise HTTPException(status_code=400, detail="Only JPEG, PNG, or WebP images are supported.")

    image_bytes = await file.read()
    if len(image_bytes) == 0:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")
    if len(image_bytes) > 15 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="Image size exceeds 15MB limit.")

    img_hash = hash_image(image_bytes)

    try:
        result = classifier.predict(image_bytes, filename=file.filename or "")
        champion = result["top_prediction"]

        # Persist prediction to database
        record_id = log_prediction(
            image_filename=file.filename or "leaf.jpg",
            image_hash=img_hash,
            predicted_class=champion["class_name"],
            crop=champion["crop"],
            disease_name=champion["disease"],
            confidence_score=champion["confidence"],
            severity=champion["severity"],
            is_healthy=(champion["status"] == "Healthy"),
            remedy_summary=champion["organic_remedy"],
            inference_time_ms=result["inference_time_ms"]
        )

        return {
            "prediction_id": int(record_id),
            "filename": file.filename,
            "image_hash": str(img_hash),
            "diagnosis": champion,
            "top3_ranking": result["all_top3"],
            "inference_time_ms": float(result["inference_time_ms"]),
            "foliage_ratio": float(result["plant_foliage_ratio"]),
            "is_leaf_warning": bool(result["is_leaf_warning"])
        }

    except ValueError as ve:
        raise HTTPException(status_code=422, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Inference error: {str(e)}")


@app.get("/api/history")
def get_history(limit: int = 50):
    records = get_recent_predictions(limit=limit)
    return {"history": records, "count": len(records)}


@app.get("/api/stats")
def get_stats():
    return get_prediction_stats()


@app.get("/api/benchmarks")
def get_benchmarks():
    benchmarks = get_model_benchmarks()
    return {"benchmarks": benchmarks}


@app.get("/api/classes")
def get_classes():
    return {
        "total_classes": len(CLASSES_LIST),
        "classes": [{
            "id": idx + 1,
            "class_name": c,
            **DISEASE_METADATA.get(c, {})
        } for idx, c in enumerate(CLASSES_LIST)]
    }


# Mount sample images directory for fast preview loading
SAMPLE_IMAGES_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "sample_images")
if os.path.exists(SAMPLE_IMAGES_DIR):
    app.mount("/sample_images", StaticFiles(directory=SAMPLE_IMAGES_DIR), name="sample_images")

# Mount static frontend build if present
if os.path.exists(FRONTEND_DIST):
    app.mount("/", StaticFiles(directory=FRONTEND_DIST, html=True), name="static")
