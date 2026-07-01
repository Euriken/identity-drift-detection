import numpy as np
from PIL import Image
import insightface
from insightface.app import FaceAnalysis

print("numpy:", np.__version__)
print("insightface:", insightface.__version__)

print("\nLoading ArcFace model... (downloads ~500MB first time)")
app = FaceAnalysis(name='buffalo_l')
app.prepare(ctx_id=-1)
print("\nModel loaded successfully! You are ready to go.")
