import os
import io
import numpy as np
import cv2
import onnxruntime as ort
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from PIL import Image

# ── App setup ────────────────────────────────────────────────────────────────
app = Flask(__name__, static_folder="frontend/dist", static_url_path="")
CORS(app, origins=["http://localhost:5173", "http://127.0.0.1:5173"])

# ── Paths ─────────────────────────────────────────────────────────────────────
MODEL_PATH    = os.path.expanduser("~/.insightface/models/buffalo_l/w600k_r50.onnx")
DETECTOR_PATH = os.path.expanduser("~/.insightface/models/buffalo_l/det_10g.onnx")
EMBEDDINGS_DIR = os.path.join(os.path.dirname(__file__), "embeddings")
DRIFT_THRESHOLD = 0.65

# ── Load recognition model ────────────────────────────────────────────────────
print(f"[startup] Loading ArcFace model: {MODEL_PATH}")
rec_session  = ort.InferenceSession(MODEL_PATH, providers=["CPUExecutionProvider"])
REC_INPUT    = rec_session.get_inputs()[0].name
print(f"[startup] ArcFace loaded. Input: {REC_INPUT}")

# ── Load face detector (SCRFD det_10g) ───────────────────────────────────────
print(f"[startup] Loading SCRFD detector: {DETECTOR_PATH}")
det_session  = ort.InferenceSession(DETECTOR_PATH, providers=["CPUExecutionProvider"])
DET_INPUT    = det_session.get_inputs()[0].name
# Inspect output names for score tensors (last dim == 1, values in [0,1])
_det_outputs = [o.name for o in det_session.get_outputs()]
print(f"[startup] SCRFD loaded. Outputs: {_det_outputs}")


# ── Helpers ───────────────────────────────────────────────────────────────────

def pil_from_bytes(file_bytes: bytes) -> np.ndarray:
    """Return RGB uint8 numpy array from raw image bytes."""
    return np.array(Image.open(io.BytesIO(file_bytes)).convert("RGB"))


def has_face(img_rgb: np.ndarray) -> bool:
    """
    Quick face-presence check using SCRFD det_10g.onnx.
    Resize image to 640×640, run inference, check if any score tensor
    (last dim == 1) has a max value > 0.5.
    """
    img = cv2.resize(img_rgb, (640, 640)).astype(np.float32)
    img = (img - 127.5) / 128.0          # normalise to [-1, 1]
    img = np.expand_dims(img.transpose(2, 0, 1), axis=0)   # NCHW

    outputs = det_session.run(None, {DET_INPUT: img})

    for out in outputs:
        # Score tensors: last dim == 1, all values should be in [0, 1]
        if out.ndim >= 2 and out.shape[-1] == 1:
            if float(np.max(out)) > 0.5:
                return True
    return False


def preprocess_for_arcface(img_rgb: np.ndarray) -> np.ndarray:
    """RGB numpy array → ArcFace input tensor (1, 3, 112, 112)."""
    img = cv2.resize(img_rgb, (112, 112)).astype(np.float32)
    img = (img - 127.5) / 128.0
    img = np.expand_dims(img.transpose(2, 0, 1), axis=0)
    return img


def get_embedding(img_rgb: np.ndarray) -> np.ndarray:
    """Run ArcFace and return L2-normalised 512-dim embedding."""
    tensor = preprocess_for_arcface(img_rgb)
    feat   = rec_session.run(None, {REC_INPUT: tensor})[0].flatten()
    return feat / (np.linalg.norm(feat) + 1e-8)


def verdict_text(drift: float) -> str:
    if drift > DRIFT_THRESHOLD:
        return "Re-enrollment Recommended"
    if drift > 0.3:
        return "Moderate Drift Detected"
    return "Identity Stable"


def drift_zone(drift: float) -> str:
    if drift > DRIFT_THRESHOLD:
        return "critical"
    if drift > 0.3:
        return "moderate"
    return "stable"


# ── Routes ────────────────────────────────────────────────────────────────────

@app.route("/")
def index():
    try:
        return send_from_directory(app.static_folder, "index.html")
    except Exception:
        return jsonify({"message": "Backend running. Start React dev server on port 5173."})


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "model": "w600k_r50 (ArcFace)", "threshold": DRIFT_THRESHOLD})


@app.route("/compare", methods=["POST"])
def compare():
    """
    POST /compare
    Body: multipart/form-data with 'image1' and 'image2'
    Returns: JSON { similarity, drift, flagged, verdict, drift_zone, threshold }
    """
    if "image1" not in request.files or "image2" not in request.files:
        return jsonify({"error": "Both 'image1' and 'image2' are required."}), 400

    try:
        bytes1 = request.files["image1"].read()
        bytes2 = request.files["image2"].read()

        img1 = pil_from_bytes(bytes1)
        img2 = pil_from_bytes(bytes2)

        # ── Face detection validation ────────────────────────────────────────
        if not has_face(img1):
            return jsonify({"error": "No face detected in image 1. Please upload a clear frontal face photo."}), 422
        if not has_face(img2):
            return jsonify({"error": "No face detected in image 2. Please upload a clear frontal face photo."}), 422

        # ── ArcFace inference ────────────────────────────────────────────────
        emb1 = get_embedding(img1)
        emb2 = get_embedding(img2)

        similarity = float(np.dot(emb1, emb2))
        similarity = max(-1.0, min(1.0, similarity))  # clamp
        drift      = round(1.0 - similarity, 4)
        similarity = round(similarity, 4)

        return jsonify(
            {
                "similarity":  similarity,
                "drift":       drift,
                "flagged":     drift > DRIFT_THRESHOLD,
                "verdict":     verdict_text(drift),
                "drift_zone":  drift_zone(drift),
                "threshold":   DRIFT_THRESHOLD,
            }
        )
    except Exception as e:
        return jsonify({"error": f"Inference failed: {str(e)}"}), 500


@app.route("/results", methods=["GET"])
def results():
    """
    GET /results
    Returns benchmark summary + AgeDB-30 drift histogram data.
    """
    DATASET_META = {
        "lfw":      {"label": "LFW",      "accuracy": 99.67},
        "calfw":    {"label": "CALFW",     "accuracy": 94.02},
        "agedb_30": {"label": "AgeDB-30",  "accuracy": 92.68},
        "cplfw":    {"label": "CPLFW",     "accuracy": 88.73},
    }

    output = []
    for name, meta in DATASET_META.items():
        npy_path = os.path.join(EMBEDDINGS_DIR, f"{name}_results.npy")
        if not os.path.exists(npy_path):
            output.append({"dataset": meta["label"], "accuracy": meta["accuracy"],
                            "stability_index": None, "avg_drift": None,
                            "reenrollment_pct": None, "total_pairs": None})
            continue

        data     = np.load(npy_path, allow_pickle=True)
        correct  = sum(1 for r in data if (r["drift"] < DRIFT_THRESHOLD) == (r["label"] == 1))
        accuracy = round(correct / len(data) * 100, 2)

        same   = [r for r in data if r["label"] == 1]
        avg_sim = float(np.mean([r["similarity"] for r in same])) if same else 0.0
        stability_index = round(avg_sim, 4)
        avg_drift       = round(float(np.mean([r["drift"] for r in data])), 4)
        flagged_same    = sum(1 for r in same if r["drift"] > DRIFT_THRESHOLD)
        reenrollment_pct = round(flagged_same / len(same) * 100, 1) if same else 0.0

        output.append({
            "dataset":          meta["label"],
            "accuracy":         accuracy,
            "stability_index":  stability_index,
            "avg_drift":        avg_drift,
            "reenrollment_pct": reenrollment_pct,
            "total_pairs":      len(data),
        })

    # ── AgeDB-30 drift histogram ─────────────────────────────────────────────
    histogram = None
    agedb_path = os.path.join(EMBEDDINGS_DIR, "agedb_30_results.npy")
    if os.path.exists(agedb_path):
        data      = np.load(agedb_path, allow_pickle=True)
        bins      = np.arange(0, 1.525, 0.025)           # 0 to 1.5, step 0.025
        bin_ctrs  = ((bins[:-1] + bins[1:]) / 2).round(4)

        same_drifts = [float(r["drift"]) for r in data if r["label"] == 1]
        diff_drifts = [float(r["drift"]) for r in data if r["label"] == 0]

        same_counts, _ = np.histogram(same_drifts, bins=bins)
        diff_counts, _ = np.histogram(diff_drifts, bins=bins)

        histogram = {
            "bin_centers": bin_ctrs.tolist(),
            "same_counts": same_counts.tolist(),
            "diff_counts": diff_counts.tolist(),
        }

    return jsonify({"results": output, "threshold": DRIFT_THRESHOLD, "histogram": histogram})


# ── Entry point ───────────────────────────────────────────────────────────────
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)
