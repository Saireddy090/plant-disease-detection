#!/usr/bin/env bash
set -e

# ==============================================================================
# FloraScan AI: Plant Disease Detection Unified Runner
# Usage:
#   ./run.sh              -> Run tests, verify frontend build, and start web server
#   ./run.sh --dev        -> Start FastAPI backend (8000) & Vite React frontend (3000)
#   ./run.sh --test       -> Run test suite
#   ./run.sh --benchmark  -> Run hyperparameter tuning benchmark
#   ./run.sh --train      -> Run CNN training pipeline
# ==============================================================================

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_DIR"

# Ensure venv exists with native Python 3.11
if [ ! -d "venv" ]; then
  echo " Setting up native Python 3.11 virtual environment..."
  if [ -f "/Library/Frameworks/Python.framework/Versions/3.11/bin/python3" ]; then
    /Library/Frameworks/Python.framework/Versions/3.11/bin/python3 -m venv venv
  else
    python3 -m venv venv
  fi
  ./venv/bin/pip install --upgrade pip
  ./venv/bin/pip install -r backend/requirements.txt
fi

PYTHON="./venv/bin/python"
UVICORN="./venv/bin/uvicorn"

case "$1" in
  --test)
    echo " Running Unit & Integration Tests..."
    $PYTHON -m unittest backend/test_api.py
    ;;
  --benchmark)
    echo " Running CNN Hyperparameter Tuning Benchmark..."
    $PYTHON model/benchmark.py
    ;;
  --train)
    echo " Launching Plant Disease CNN Training Pipeline on Real Leaf Images..."
    if [ ! -d "dataset/train" ]; then
      echo " Fetching authentic PlantVillage leaf image dataset..."
      $PYTHON model/download_dataset.py
    fi
    $PYTHON model/train.py --epochs 8 --batch-size 16 --lr 0.0003 --dropout 0.35
    ;;
  --dev)
    echo " Starting FastAPI Backend on http://localhost:8000..."
    $UVICORN backend.app:app --port 8000 --host 127.0.0.1 --reload &
    BACKEND_PID=$!
    trap "kill $BACKEND_PID 2>/dev/null || true" EXIT

    echo " Starting Vite React Frontend on http://localhost:3000..."
    cd frontend && npm run dev
    ;;
  *)
    # Default: Run test, verify frontend dist, and start FastAPI serving the full app
    echo " Running Unit Test Suite..."
    $PYTHON -m unittest backend/test_api.py

    if [ ! -d "frontend/dist" ]; then
      echo " Building React Frontend..."
      cd frontend && npm install && npm run build
      cd "$PROJECT_DIR"
      mkdir -p frontend/dist/sample_images
      cp -r sample_images/* frontend/dist/sample_images/ 2>/dev/null || true
    fi

    # Kill any lingering process on port 8000
    lsof -ti:8000 | xargs kill -9 2>/dev/null || true

    echo ""
    echo "================================================================================"
    echo "  FloraScan AI - Plant Disease Detection & Agricultural Diagnosis Server"
    echo "  Listening on: http://localhost:8000"
    echo "  Swagger API Docs: http://localhost:8000/docs"
    echo "  Press Ctrl + C to stop the server anytime."
    echo "================================================================================"
    echo ""
    exec $UVICORN backend.app:app --port 8000 --host 0.0.0.0
    ;;
esac
