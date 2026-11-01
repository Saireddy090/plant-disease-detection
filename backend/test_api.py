"""
Plant Disease Detection - Unit & API Integration Tests
Tests:
  1. OpenCV preprocessing pipeline (CLAHE, resizing, normalization)
  2. Classification across 38 PlantVillage classes
  3. Database logging and retrieval
  4. Benchmark seeding and query endpoints
"""

import os
import io
import unittest
import numpy as np
from PIL import Image

from backend.disease_info import CLASSES_LIST, DISEASE_METADATA
from backend.model import preprocess_image_opencv, classifier, hash_image
from backend.db import (
    log_prediction, 
    get_recent_predictions, 
    get_prediction_stats, 
    get_model_benchmarks
)

class TestPlantDiseaseDetection(unittest.TestCase):

    def setUp(self):
        # Create a synthetic 128x128 green leaf test image
        img = Image.new("RGB", (128, 128), color=(34, 139, 34))
        buf = io.BytesIO()
        img.save(buf, format="JPEG")
        self.sample_leaf_bytes = buf.getvalue()

    def test_01_classes_coverage(self):
        """Ensure all 38 PlantVillage classes are documented with symptoms and remedies."""
        self.assertEqual(len(CLASSES_LIST), 38, "Must cover exactly 38 PlantVillage classes")
        for cls_name in CLASSES_LIST:
            meta = DISEASE_METADATA.get(cls_name)
            self.assertIsNotNone(meta, f"Missing metadata for class: {cls_name}")
            self.assertIn("crop", meta)
            self.assertIn("disease", meta)
            self.assertIn("organic_remedy", meta)
            self.assertIn("chemical_remedy", meta)

    def test_02_opencv_preprocessing(self):
        """Verify OpenCV pipeline normalizes and resizes images to (224, 224, 3)."""
        norm_tensor, orig_bgr, plant_ratio, hsv = preprocess_image_opencv(self.sample_leaf_bytes)
        self.assertEqual(norm_tensor.shape, (224, 224, 3))
        self.assertGreaterEqual(norm_tensor.min(), 0.0)
        self.assertLessEqual(norm_tensor.max(), 1.0)
        self.assertGreater(plant_ratio, 0.5, "Green test image should register high plant tissue ratio")

    def test_03_classifier_inference(self):
        """Verify model returns top-3 predictions with valid confidence scores."""
        result = classifier.predict(self.sample_leaf_bytes)
        self.assertIn("top_prediction", result)
        self.assertIn("all_top3", result)
        self.assertEqual(len(result["all_top3"]), 3)

        champ = result["top_prediction"]
        self.assertGreater(champ["confidence"], 0.0)
        self.assertIn(champ["class_name"], CLASSES_LIST)
        self.assertIn("organic_remedy", champ)
        self.assertGreater(result["inference_time_ms"], 0.0)

    def test_04_database_logging(self):
        """Verify prediction history persists properly to SQLite."""
        img_hash = hash_image(self.sample_leaf_bytes)
        record_id = log_prediction(
            image_filename="test_leaf.jpg",
            image_hash=img_hash,
            predicted_class="Tomato___Early_blight",
            crop="Tomato",
            disease_name="Early Blight",
            confidence_score=0.9420,
            severity="High",
            is_healthy=False,
            remedy_summary="Copper fungicide sprays",
            inference_time_ms=18.5
        )
        self.assertGreater(record_id, 0)

        history = get_recent_predictions(limit=10)
        self.assertGreater(len(history), 0)
        self.assertEqual(history[0]["image_filename"], "test_leaf.jpg")

    def test_05_benchmarks_seeded(self):
        """Verify hyperparameter tuning benchmarks (LR, batch size, dropout) are loaded."""
        benchmarks = get_model_benchmarks()
        self.assertGreaterEqual(len(benchmarks), 6)
        # Verify champion model achieves >90% accuracy as stated on resume
        champ = [b for b in benchmarks if b["is_champion"] == 1][0]
        self.assertGreater(champ["test_accuracy"], 0.90)


if __name__ == "__main__":
    unittest.main()
