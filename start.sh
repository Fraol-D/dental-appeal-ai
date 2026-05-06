#!/usr/bin/env bash
set -euo pipefail

echo "== railpack start.sh: starting backend =="

# Start backend
if [ -d backend ]; then
  pushd backend >/dev/null

  if command -v python3 >/dev/null 2>&1; then
    PYTHON_BIN="python3"
  elif command -v python >/dev/null 2>&1; then
    PYTHON_BIN="python"
  else
    echo "No Python interpreter found on PATH"
    exit 1
  fi

  PORT="${PORT:-8000}"
  echo "Starting backend on port $PORT"
  exec "$PYTHON_BIN" -m uvicorn main:app --host 0.0.0.0 --port "$PORT"
  popd >/dev/null
else
  echo "No backend directory found; nothing to start"
  exit 1
fi
