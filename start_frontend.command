#!/bin/bash
# ── Start React/Vite Frontend ────────────────────────────────────────────────
# Double-click this file in Finder to launch the frontend dev server.

cd "$(dirname "$0")/frontend"

echo "============================================"
echo "  Identity Drift Detection — Frontend"
echo "============================================"
echo ""

# Check node_modules
if [ ! -d "node_modules" ]; then
  echo "📦 Installing dependencies (first run)..."
  npm install
fi

echo "🚀 Starting Vite on http://localhost:5173 ..."
echo ""
echo "👉 Open this URL in your browser: http://localhost:5173"
echo ""
npm run dev

read -p "Frontend stopped. Press Enter to close..."
