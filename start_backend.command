#!/bin/bash
# ── Start Flask Backend ──────────────────────────────────────────────────────
# Double-click this file in Finder to launch the backend.
# macOS may ask for Terminal access — allow it.

cd "$(dirname "$0")"

echo "============================================"
echo "  Identity Drift Detection — Flask Backend"
echo "============================================"
echo ""

# Activate virtual environment
if [ -d "venv" ]; then
  source venv/bin/activate
  echo "✅ Virtual environment activated"
else
  echo "❌ No 'venv' folder found!"
  echo "Run this first:  python3 -m venv venv && pip install -r requirements.txt"
  read -p "Press Enter to close..."
  exit 1
fi

echo "🚀 Starting Flask on http://localhost:5001 ..."
echo ""
python app.py

read -p "Backend stopped. Press Enter to close..."
