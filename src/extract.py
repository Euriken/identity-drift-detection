import os
import cv2
import numpy as np
import onnxruntime as ort

MODEL_PATH = os.path.expanduser('~/.insightface/models/buffalo_l/w600k_r50.onnx')
session = ort.InferenceSession(MODEL_PATH, providers=['CPUExecutionProvider'])
input_name = session.get_inputs()[0].name

BASE = '/Users/devanshgoel/Desktop/major project/val'
DATASETS = {
    'agedb_30': 'agedb_30_ann.txt',
    'calfw':    'calfw_ann.txt',
    'cplfw':    'cplfw_ann.txt',
    'lfw':      'lfw_ann.txt',
}

def get_embedding(img_path):
    img = cv2.imread(img_path)
    img = cv2.resize(img, (112, 112))
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    img = (img.astype(np.float32) - 127.5) / 128.0
    img = img.transpose(2, 0, 1)
    img = np.expand_dims(img, axis=0)
    feat = session.run(None, {input_name: img})[0].flatten()
    feat = feat / np.linalg.norm(feat)
    return feat

def cosine_sim(a, b):
    return float(np.dot(a, b))

for name, ann_file in DATASETS.items():
    print(f"\n{'='*40}")
    print(f"Processing {name}...")

    ann_path = os.path.join(BASE, ann_file)
    results  = []
    skipped  = 0

    with open(ann_path) as f:
        lines = f.readlines()

    for i, line in enumerate(lines):
        parts = line.strip().split()
        if len(parts) < 3:
            continue

        label     = int(parts[0])
        img1_path = os.path.join(BASE, parts[1])
        img2_path = os.path.join(BASE, parts[2])

        try:
            emb1 = get_embedding(img1_path)
            emb2 = get_embedding(img2_path)
        except Exception as e:
            skipped += 1
            continue

        sim   = cosine_sim(emb1, emb2)
        drift = 1 - sim
        flag  = drift > 0.3

        results.append({
            'img1': parts[1], 'img2': parts[2],
            'label': label,
            'similarity': round(sim, 4),
            'drift': round(drift, 4),
            'flagged': flag
        })

        if (i + 1) % 500 == 0:
            print(f"  {i+1}/{len(lines)} pairs done...")

    out_path = f'/Users/devanshgoel/identity_drift_project/embeddings/{name}_results.npy'
    np.save(out_path, results)

    total          = len(results)
    flagged        = sum(r['flagged'] for r in results)
    avg_drift      = round(np.mean([r['drift'] for r in results]), 4)
    same_pairs     = [r for r in results if r['label'] == 1]
    avg_drift_same = round(np.mean([r['drift'] for r in same_pairs]), 4)

    print(f"  Done! {total} pairs processed, {skipped} skipped")
    print(f"  Avg drift (all pairs):     {avg_drift}")
    print(f"  Avg drift (same person):   {avg_drift_same}")
    print(f"  Flagged for re-enrollment: {flagged} ({round(flagged/total*100,1)}%)")

print("\nAll datasets done! Results saved to embeddings/")
