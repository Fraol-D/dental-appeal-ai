#!/usr/bin/env bash
set -euo pipefail

echo "== railpack start.sh: building frontend and starting backend =="

# Build frontend if present and npm available
if [ -d frontend ]; then
  echo "Building frontend..."
  pushd frontend >/dev/null
  if command -v npm >/dev/null 2>&1; then
    if [ -f package-lock.json ]; then
      npm ci
    else
      npm install
    fi
    npm run build
    # Try to start Next in background (non-blocking). Uses port 3000 by default.
    nohup npm run start -- -p 3000 > /tmp/next.log 2>&1 &
  else
    echo "npm not found; skipping frontend build/start"
  fi
  popd >/dev/null
fi

# Install backend deps and start uvicorn
if [ -d backend ]; then
  echo "Installing backend dependencies..."
  pushd backend >/dev/null

  if command -v python3 >/dev/null 2>&1; then
    PYTHON_BIN="python3"
  elif command -v python >/dev/null 2>&1; then
    PYTHON_BIN="python"
  else
    echo "No Python interpreter found on PATH"
    exit 1
  fi

  if [ -f requirements.txt ]; then
    "$PYTHON_BIN" -m pip install -r requirements.txt
  else
    echo "requirements.txt missing; skipping pip install"
  fi

  PORT="${PORT:-8000}"
  echo "Starting backend on port $PORT"
  exec "$PYTHON_BIN" -m uvicorn main:app --host 0.0.0.0 --port "$PORT"
  popd >/dev/null
else
  echo "No backend directory found; nothing to start"
  exit 1
fi
