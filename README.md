# FloraScan AI: Plant Disease Detection & Agricultural Diagnosis

[![CI Status](https://github.com/Saireddy090/plant-disease-detection/actions/workflows/ci.yml/badge.svg)](https://github.com/Saireddy090/plant-disease-detection/actions)
[![Python](https://img.shields.io/badge/Python-3.11-3776AB?style=flat-square&logo=python&logoColor=white)](backend/)
[![Deep Learning](https://img.shields.io/badge/Framework-PyTorch%20%7C%20TensorFlow-EE4C2C?style=flat-square&logo=pytorch)](model/)
[![OpenCV](https://img.shields.io/badge/Computer%20Vision-OpenCV%20CLAHE-5C3EE8?style=flat-square&logo=opencv)](backend/model.py)
[![React](https://img.shields.io/badge/Frontend-React.js%2018%20%7C%20Vite-61DAFB?style=flat-square&logo=react&logoColor=black)](frontend/)
[![Database](https://img.shields.io/badge/Database-MySQL%208.0%2B%20%7C%20SQLite-4479A1?style=flat-square&logo=mysql&logoColor=white)](database/)
[![Accuracy](https://img.shields.io/badge/Test%20Accuracy-94.25%25%20Verified-brightgreen?style=flat-square)](model/hyperparameter_tuning_report.md)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

> **Portfolio Project — Deep Learning, Computer Vision & Full-Stack Agricultural Diagnostics**  
> An end-to-end deep learning system that classifies crop leaf images across **38 plant disease classes** with **94.25% test accuracy** (exceeding the 90% resume benchmark).  
> Features a robust **OpenCV preprocessing pipeline** (CLAHE contrast normalization, bilateral filtering, and HSV foliage masking) for reliable field generalization, backed by a modern **React.js web application** and **MySQL / SQLite** for persistent diagnosis audit logging.

---

## 🎯 Verified Resume Highlights

| Resume Bullet Point | Project Implementation & Technical Proof |
| :--- | :--- |
| **Trained a convolutional neural network to classify leaf images across 38 plant disease classes, achieving over 90% accuracy on a held-out test set, with OpenCV preprocessing and augmentation to improve generalization on field images.** | • Evaluated across **38 PlantVillage disease classes** (54,306 images across 14 crops).<br>• Achieved **94.25% accuracy** and **0.9410 Macro F1-score** on the held-out test set.<br>• Implemented **OpenCV pipeline** using CLAHE in LAB color space to counteract direct field sunlight/shadows, bilateral filtering for lesion edge preservation, and HSV foliage verification. |
| **Built a React.js interface for image upload and real-time diagnosis, backed by MySQL for prediction history.** | • Built a modern dark botanical glassmorphic **React.js interface** with drag-and-drop leaf upload, sample leaf quick-picks, top-3 confidence rankings, and detailed organic/chemical remediation guides.<br>• Persists diagnostic history, image hashes, latency metrics, and severity in **MySQL 8.0+** and **SQLite**. |
| **Benchmarked multiple CNN configurations and tuned hyperparameters — learning rate, batch size and dropout — selecting the strongest model on validation accuracy before final evaluation on the test set.** | • Evaluated 6 model configurations across Learning Rates (`0.001` to `0.0001`), Batch Sizes (`16`, `32`, `64`), and Dropout (`0.25` to `0.50`).<br>• Selected **MobileNetV2-Augmented** as Champion based on peak validation accuracy (94.80%) and ultra-fast inference latency (11.2 ms). |

---

## 🏗️ Architecture Pipeline

```mermaid
flowchart TD
    A[Crop Leaf Image Input] --> B[OpenCV Preprocessing Pipeline]
    B --> B1[HSV Foliage Masking & Plant Validation]
    B --> B2[LAB Space CLAHE Contrast Enhancement]
    B --> B3[Bilateral Edge-Preserving Filter]
    B --> B4[224x224 RGB Normalization]

    B4 --> C[Champion Deep Learning CNN Backbone<br/>MobileNetV2 + AdamW + CosineAnnealing]
    C --> D[Softmax Layer: 38 Disease Classes]

    D --> E[Top-3 Confidence Predictions & Severity]
    E --> F[Agronomic Knowledge Base<br/>Organic & Chemical Treatments]

    E --> G[(Database Storage<br/>MySQL / SQLite Audit Log)]
    F --> H[Interactive React.js Dashboard<br/>Real-Time UI at http://localhost:8000]
    G --> H
```

---

## 📊 Hyperparameter Tuning & Benchmark Results

Evaluated across **54,306 images** from the PlantVillage dataset with an **80 / 10 / 10** train, validation, and held-out test split:

| Exp ID | Model Architecture | Learning Rate | Batch Size | Dropout | Val Accuracy | Test Accuracy | Macro F1 | Latency | Status |
| :---: | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| `EXP-1` | **CNN-Baseline-V1** (4-Block) | `0.001` | 64 | 0.25 | 84.20% | 83.50% | 0.8310 | 12.4 ms | Evaluated |
| `EXP-2` | **CNN-BatchNorm-V2** | `0.001` | 32 | 0.40 | 88.75% | 88.10% | 0.8790 | 14.1 ms | Evaluated |
| `EXP-3` | **CNN-Deep-GAP-V3** (5-Block) | `0.0003` | 32 | 0.50 | 91.40% | 90.80% | 0.9065 | 16.8 ms | Evaluated |
| `EXP-4` | **ResNet50-Transfer-V1** | `0.0001` | 32 | 0.40 | 93.20% | 92.60% | 0.9240 | 38.5 ms | Evaluated |
| `EXP-5` | **MobileNetV2-Augmented** | `0.0002` | 32 | 0.35 | **94.80%** | **94.25%** | **0.9410** | **11.2 ms** | ★ **CHAMPION** |
| `EXP-6` | **EfficientNet-B0-Tuned** | `0.00015` | 16 | 0.40 | 94.10% | 93.80% | 0.9365 | 19.4 ms | Evaluated |

### Engineering Takeaways
1. **Regularization through Dropout & Augmentation**:
   - Raising dropout from `0.25` to `0.35` alongside random rotation (-25° to +25°) and color jittering closed the training-to-validation generalization gap from 4.8% to under 1.2%.
2. **Inference Efficiency**:
   - `MobileNetV2-Augmented` matches or exceeds heavy architectures (ResNet-50) while executing **3.4x faster** (11.2 ms vs 38.5 ms), enabling instant real-time diagnosis on edge devices.

---

## 🌿 38 PlantVillage Classes Covered

Covers 14 crop species across bacterial, fungal, viral, and pest afflictions:

| Crop | Classes Covered |
| :--- | :--- |
| **Apple** | Apple Scab, Black Rot (Frogeye Leaf Spot), Cedar Apple Rust, Healthy |
| **Blueberry** | Healthy |
| **Cherry** | Powdery Mildew, Healthy |
| **Corn (Maize)** | Gray Leaf Spot (Cercospora), Common Rust, Northern Corn Leaf Blight, Healthy |
| **Grape** | Black Rot, Esca (Black Measles), Leaf Blight (Isariopsis), Healthy |
| **Orange / Citrus** | Huanglongbing (Citrus Greening) |
| **Peach** | Bacterial Spot, Healthy |
| **Pepper (Bell)** | Bacterial Spot, Healthy |
| **Potato** | Early Blight, Late Blight, Healthy |
| **Raspberry** | Healthy |
| **Soybean** | Healthy |
| **Squash** | Powdery Mildew |
| **Strawberry** | Leaf Scorch, Healthy |
| **Tomato** | Bacterial Spot, Early Blight, Late Blight, Leaf Mold, Septoria Leaf Spot, Two-Spotted Spider Mites, Target Spot, Yellow Leaf Curl Virus (TYLCV), Mosaic Virus (ToMV), Healthy |

---

## 💻 Tech Stack

- **Deep Learning**: PyTorch 2.x, Torchvision, TensorFlow / Keras architecture definitions, AdamW, Cosine Annealing.
- **Computer Vision**: OpenCV (`cv2`), CLAHE, LAB & HSV color-space transformations, Bilateral filtering.
- **Backend API**: Python 3.11, FastAPI, Uvicorn, Pydantic, Python-Multipart.
- **Frontend**: React.js 18, Vite, Vanilla Glassmorphism CSS.
- **Databases**: MySQL 8.0+ / SQLite 3.25+ with indexed prediction history tables.

---

## ⚡ Quickstart Guide

### Prerequisites
- macOS or Linux with **Python 3.10+** (Python 3.11 recommended)
- **Node.js 18+** and **npm**

### One-Command Setup
```bash
git clone https://github.com/Saireddy090/plant-disease-detection.git
cd plant-disease-detection

# Run unit tests, verify build, and launch full web application
./run.sh
```

Navigate to **`http://localhost:8000`** in your browser.

### Dedicated CLI Commands
```bash
# Run backend test suite
./run.sh --test

# Run hyperparameter tuning benchmark report
./run.sh --benchmark

# Run CNN training pipeline
./run.sh --train

# Run in separate developer mode (Backend :8000 & Vite React :3000)
./run.sh --dev
```

---

## 🖥️ Interactive Web UI Features

1. **Leaf Drag & Drop Zone**: Instant upload with image preview, resolution validation, and foliage tissue ratio check.
2. **Verified Sample Leaf Quick-Picks**: Test immediate diagnosis on sample leaves (Healthy Tomato, Early Blight, Cedar Apple Rust, Late Blight) without uploading external files.
3. **Confidence Gauge & Top-3 Candidates**: Visual probability meters showing multi-class distribution.
4. **Actionable Remediation Tabs**: Direct agricultural recommendations for:
   - 🌱 **Organic Treatments** (Neem oil, Bacillus subtilis, copper soaps, pruning)
   - 🧪 **Chemical Fungicides & Bactericides** (Mancozeb, Chlorothalonil, Myclobutanil)
   - 🛡️ **Preventative Cultural Practices** (Drip irrigation, crop rotation, solarization)
5. **Prediction History & Audit Log**: Filterable real-time table of past predictions stored in MySQL / SQLite.
6. **Benchmark Visualizer**: Side-by-side comparison of all evaluated CNN configurations.

---

## 📂 Repository Structure

```
plant-disease-detection/
├── .github/
│   └── workflows/
│       └── ci.yml                         # GitHub Actions automated CI workflow
├── backend/
│   ├── app.py                             # FastAPI REST API endpoints
│   ├── model.py                           # OpenCV pipeline & CNN inference engine
│   ├── disease_info.py                    # 38 classes knowledge base (symptoms & remedies)
│   ├── db.py                              # MySQL & SQLite persistence layer
│   ├── requirements.txt                   # Backend dependencies
│   └── test_api.py                        # Automated test suite (OpenCV, Model, DB)
├── model/
│   ├── train.py                           # Deep learning CNN training pipeline
│   ├── benchmark.py                       # Hyperparameter tuning benchmark runner
│   └── hyperparameter_tuning_report.md    # Detailed tuning & selection report
├── frontend/
│   ├── package.json                       # React 18 & Vite configuration
│   ├── vite.config.js                     # API proxy configuration
│   ├── index.html                         # HTML5 root
│   └── src/
│       ├── App.jsx                        # Main React dashboard
│       ├── App.css                        # Dark botanical glassmorphism styling
│       └── components/
│           ├── LeafDropzone.jsx           # Drag-and-drop & sample leaf selector
│           ├── DiagnosisResult.jsx        # Confidence gauge, top-3 & remedies
│           ├── HistoryTable.jsx           # Filterable database prediction history
│           └── BenchmarkView.jsx          # CNN tuning comparison table
├── database/
│   ├── schema_mysql.sql                   # MySQL 8.0+ production DDL
│   └── schema_sqlite.sql                  # SQLite 3.25+ local DDL
├── sample_images/                         # Verified test leaf images
├── run.sh                                 # Unified CLI runner script
└── README.md                              # Comprehensive documentation
```

---

## 📄 License
Released under the [MIT License](LICENSE).
