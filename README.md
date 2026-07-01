# Identity Drift Detection in Face Recognition Systems

A full-stack web application demonstrating real-time identity drift detection using the ArcFace deep learning model.

**Team:** Harshinder Singh · Gyan Sharma · Devansh Goel · Siddhant Nirwal  
**Institution:** ABES Institute of Technology, Ghaziabad · 2025–26

---

## What Is Identity Drift?

Over time, a person's face can change due to aging, hairstyle, glasses, beard, lighting conditions, or other factors. **Identity drift** refers to the phenomenon where a face recognition system's stored embedding no longer accurately represents the person's current appearance, leading to potential false rejections.

This project uses **ArcFace embeddings** and **cosine dissimilarity** to quantify this drift and flag users who need re-enrollment.

---

## Benchmark Results

| Dataset | Accuracy | Stability Index | Re-enrollment Needed |
|---------|----------|-----------------|----------------------|
| LFW | **99.67%** | 0.6718 | ~0.2% |
| CALFW | 94.02% | 0.5212 | ~3.1% |
| AgeDB-30 | 92.68% | 0.4552 | ~11.4% |
| CPLFW | 88.73% | 0.4463 | ~13.2% |

**Drift Threshold:** 0.65 (calibrated empirically from the AgeDB-30 distribution)  
**Stability Index:** Average cosine similarity of genuine (same-person) pairs (1 = perfectly stable)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Face Model | ArcFace — InsightFace `buffalo_l` (`w600k_r50.onnx`) |
| Backend | Python · Flask · Flask-CORS |
| Inference | ONNX Runtime (CPU) |
| Frontend | React 19 · Vite · Tailwind CSS v4 |
| Charts | Chart.js · react-chartjs-2 |
| Numerics | NumPy · OpenCV · Pillow |

---

## Project Structure

```
identity_drift_project/
├── app.py                  # Flask backend (API server)
├── requirements.txt        # Python dependencies
├── embeddings/             # Precomputed .npy benchmark results
│   ├── lfw_results.npy
│   ├── calfw_results.npy
│   ├── agedb_30_results.npy
│   └── cplfw_results.npy
├── src/                    # Benchmark scripts
│   ├── extract.py          # Embedding extraction from datasets
│   ├── evaluate.py         # Accuracy & stability evaluation
│   └── visualize.py        # Visualization scripts
└── frontend/               # React + Vite + Tailwind frontend
    ├── src/
    │   ├── App.jsx
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── HeroSection.jsx
    │   │   ├── LiveDemo.jsx
    │   │   ├── BenchmarkResults.jsx
    │   │   ├── HowItWorks.jsx
    │   │   └── AboutSection.jsx
    │   └── index.css
    └── vite.config.js
```

---

## How to Run Locally

### Prerequisites

- Python 3.9+
- Node.js 18+
- The ONNX model at `~/.insightface/models/buffalo_l/w600k_r50.onnx`

### 1. Backend (Flask)

```bash
# From the project root
cd ~/Desktop/identity_drift_project

# Activate your venv (or create one)
python -m venv venv
source venv/bin/activate      # macOS/Linux
# venv\Scripts\activate       # Windows

# Install dependencies
pip install -r requirements.txt

# Start the server
python app.py
# → Running on http://localhost:5000
```

### 2. Frontend (React + Vite)

```bash
# In a second terminal
cd ~/Desktop/identity_drift_project/frontend

npm install      # only needed once
npm run dev
# → Running on http://localhost:5173
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

> **Note:** The Vite dev server proxies `/compare` and `/results` to Flask on port 5000 automatically.

---

## API Endpoints

### `POST /compare`

Compare two face images and get a drift score.

**Request:** `multipart/form-data` with fields `image1` and `image2`

**Response:**
```json
{
  "similarity": 0.8234,
  "drift": 0.1766,
  "flagged": false,
  "verdict": "Identity Stable",
  "drift_zone": "stable",
  "threshold": 0.65
}
```

### `GET /results`

Returns precomputed benchmark statistics for all 4 datasets.

### `GET /health`

Health check — confirms the model is loaded.

---

## Methodology

1. **Image Preprocessing:** BGR→RGB conversion, resize to 112×112, normalize to [−1, 1], transpose to CHW format
2. **Embedding Extraction:** ArcFace R50 model outputs a 512-dimensional feature vector
3. **L2 Normalization:** `ê = e / ‖e‖₂`
4. **Cosine Similarity:** `sim = ê₁ · ê₂` (dot product of normalized vectors)
5. **Drift Score:** `drift = 1 − sim`
6. **Decision:** If `drift > 0.65`, flag for re-enrollment

---

## License

This project is for academic purposes only. ArcFace model weights are subject to the [InsightFace license](https://github.com/deepinsight/insightface).
