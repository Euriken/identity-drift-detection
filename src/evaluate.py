import numpy as np

DATASETS = ['agedb_30', 'calfw', 'cplfw', 'lfw']
THRESHOLD = 0.65  # corrected threshold based on distribution

print("="*55)
print(f"{'Dataset':<12} {'Accuracy':>10} {'TAR@FAR=0.1':>13} {'Avg Drift':>10}")
print("="*55)

for name in DATASETS:
    path    = f'/Users/devanshgoel/identity_drift_project/embeddings/{name}_results.npy'
    results = np.load(path, allow_pickle=True)

    correct = 0
    tar_hits = 0
    far_total = 0

    for r in results:
        predicted_same = r['drift'] < THRESHOLD
        actually_same  = r['label'] == 1

        if predicted_same == actually_same:
            correct += 1
        if actually_same and predicted_same:
            tar_hits += 1
        if not actually_same and predicted_same:
            far_total += 1

    total    = len(results)
    accuracy = round(correct / total * 100, 2)
    tar      = round(tar_hits / (total // 2) * 100, 2)
    far      = round(far_total / (total // 2) * 100, 2)
    avg_drift = round(np.mean([r['drift'] for r in results]), 4)

    print(f"{name:<12} {accuracy:>9}%  {tar:>10}%   {avg_drift:>10}")

print("="*55)
print(f"\nThreshold used: {THRESHOLD}")
print("TAR = True Accept Rate (correctly accepted same person)")
print("Accuracy = % of pairs correctly classified")

# Stability index per dataset
print("\n" + "="*55)
print("STABILITY INDEX (1 = perfectly stable, 0 = total drift)")
print("="*55)
for name in DATASETS:
    path    = f'/Users/devanshgoel/identity_drift_project/embeddings/{name}_results.npy'
    results = np.load(path, allow_pickle=True)
    same    = [r for r in results if r['label'] == 1]
    avg_sim = np.mean([r['similarity'] for r in same])
    stability_index = round(float(avg_sim), 4)
    flagged = sum(1 for r in same if r['drift'] > THRESHOLD)
    flag_pct = round(flagged / len(same) * 100, 1)
    print(f"{name:<12}  Stability Index: {stability_index}   Re-enrollment needed: {flag_pct}%")

print("="*55)
