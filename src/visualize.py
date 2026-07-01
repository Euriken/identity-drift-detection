import numpy as np
import matplotlib.pyplot as plt

DATASETS = ['agedb_30', 'calfw', 'cplfw', 'lfw']
LABELS   = ['AgeDB-30\n(age gaps)', 'CALFW\n(age+lighting)', 'CPLFW\n(cross-pose)', 'LFW\n(lighting/pose)']
COLORS   = ['#E24B4A', '#EF9F27', '#534AB7', '#1D9E75']
THRESHOLD = 0.65

fig, axes = plt.subplots(1, 3, figsize=(16, 5))
fig.suptitle('Identity Drift Detection — Results Across Datasets', fontsize=14, fontweight='bold')

same_drifts = []
diff_drifts = []

for name in DATASETS:
    path    = f'/Users/devanshgoel/identity_drift_project/embeddings/{name}_results.npy'
    results = np.load(path, allow_pickle=True)
    same_drifts.append(np.mean([r['drift'] for r in results if r['label'] == 1]))
    diff_drifts.append(np.mean([r['drift'] for r in results if r['label'] == 0]))

x = np.arange(len(DATASETS))
w = 0.35
axes[0].bar(x - w/2, same_drifts, w, label='Same person', color='#534AB7', alpha=0.85)
axes[0].bar(x + w/2, diff_drifts, w, label='Different person', color='#E24B4A', alpha=0.85)
axes[0].axhline(y=THRESHOLD, color='gray', linestyle='--', linewidth=1.5, label=f'Threshold ({THRESHOLD})')
axes[0].set_xticks(x)
axes[0].set_xticklabels(LABELS, fontsize=9)
axes[0].set_ylabel('Avg drift score')
axes[0].set_title('Same vs Different Person Drift')
axes[0].legend()

path    = f'/Users/devanshgoel/identity_drift_project/embeddings/agedb_30_results.npy'
results = np.load(path, allow_pickle=True)
same_d  = [r['drift'] for r in results if r['label'] == 1]
diff_d  = [r['drift'] for r in results if r['label'] == 0]
axes[1].hist(same_d, bins=40, alpha=0.7, color='#534AB7', label='Same person')
axes[1].hist(diff_d, bins=40, alpha=0.7, color='#E24B4A', label='Different person')
axes[1].axvline(x=THRESHOLD, color='gray', linestyle='--', linewidth=1.5, label=f'Threshold ({THRESHOLD})')
axes[1].set_xlabel('Drift score')
axes[1].set_ylabel('Count')
axes[1].set_title('AgeDB-30: Drift Distribution')
axes[1].legend()

flagged_pct = []
for name in DATASETS:
    path    = f'/Users/devanshgoel/identity_drift_project/embeddings/{name}_results.npy'
    results = np.load(path, allow_pickle=True)
    same    = [r for r in results if r['label'] == 1]
    flagged = sum(1 for r in same if r['drift'] > THRESHOLD)
    flagged_pct.append(round(flagged / len(same) * 100, 1))

bars = axes[2].bar(LABELS, flagged_pct, color=COLORS, alpha=0.85)
axes[2].set_ylabel('% same-person pairs flagged')
axes[2].set_title('Re-enrollment Rate per Dataset')
axes[2].set_ylim(0, 100)
for bar, val in zip(bars, flagged_pct):
    axes[2].text(bar.get_x() + bar.get_width()/2, bar.get_height() + 1,
                 f'{val}%', ha='center', fontsize=10, fontweight='bold')

plt.tight_layout()
plt.savefig('/Users/devanshgoel/identity_drift_project/embeddings/drift_results.png',
            dpi=150, bbox_inches='tight')
print("Plot saved!")
plt.show()
