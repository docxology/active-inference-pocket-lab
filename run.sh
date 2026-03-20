#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────
# run.sh — Thin Orchestrator for Spin: The Active Inference Pocket Lab
# ─────────────────────────────────────────────────────────────
# One-command entry point to install, test, and launch the app.
#
# Usage:
#   ./run.sh          # Install deps, run tests, start dev server
#   ./run.sh dev      # Start dev server only (skip tests)
#   ./run.sh test     # Run tests only
#   ./run.sh build    # Production build
#   ./run.sh preview  # Build + preview production bundle
#   ./run.sh lint     # Run linter + formatter
#   ./run.sh clean    # Remove node_modules and dist
#   ./run.sh help     # Show this help
# ─────────────────────────────────────────────────────────────
set -euo pipefail

# ── Paths ───────────────────────────────────────────────────
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# ── Colors ──────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m' # No Color

# ── Helpers ─────────────────────────────────────────────────
log()   { echo -e "${CYAN}[Spin]${NC} $*"; }
ok()    { echo -e "${GREEN}  ✓${NC} $*"; }
warn()  { echo -e "${YELLOW}  ⚠${NC} $*"; }
fail()  { echo -e "${RED}  ✗${NC} $*" >&2; exit 1; }

banner() {
  echo ""
  echo -e "${BOLD}${BLUE}  🌀 Spin — The Active Inference Pocket Lab${NC}"
  echo -e "  ──────────────────────────────────────────"
  echo ""
}

# ── Prerequisite Checks ────────────────────────────────────
check_node() {
  if ! command -v node &> /dev/null; then
    fail "Node.js is required but not found. Install from https://nodejs.org"
  fi
  local node_major
  node_major=$(node -v | sed 's/v//' | cut -d. -f1)
  if (( node_major < 18 )); then
    fail "Node.js >= 18 required (found $(node -v))"
  fi
  ok "Node.js $(node -v)"
}

check_npm() {
  if ! command -v npm &> /dev/null; then
    fail "npm is required but not found."
  fi
  ok "npm $(npm -v)"
}

# ── Commands ────────────────────────────────────────────────
cmd_install() {
  if [ ! -d "node_modules" ]; then
    log "Installing dependencies..."
    npm install
    ok "Dependencies installed"
  else
    ok "Dependencies already installed"
  fi
}

cmd_test() {
  log "Running test suite..."
  npm test
  ok "All tests passed"
}

cmd_lint() {
  log "Running linter..."
  npm run lint 2>/dev/null || warn "Linter reported issues (non-blocking)"
  log "Running formatter..."
  npm run format 2>/dev/null || warn "Formatter reported issues (non-blocking)"
  ok "Lint + format complete"
}

cmd_dev() {
  log "Starting development server..."
  echo ""
  echo -e "  ${BOLD}Open in your browser:${NC} ${CYAN}http://localhost:5173${NC}"
  echo -e "  ${BOLD}Recommended:${NC} Use mobile viewport (390×844)"
  echo ""
  npm run dev
}

cmd_build() {
  log "Building for production..."
  npm run build
  ok "Production build complete → dist/"
}

cmd_preview() {
  cmd_build
  log "Starting preview server..."
  npm run preview
}

cmd_clean() {
  log "Cleaning build artifacts..."
  rm -rf node_modules dist
  ok "Cleaned node_modules/ and dist/"
}

cmd_help() {
  echo "Usage: ./run.sh [command]"
  echo ""
  echo "Commands:"
  echo "  (default)   Install deps, run tests, start dev server"
  echo "  dev         Start dev server only (skip tests)"
  echo "  test        Run tests only"
  echo "  build       Production build"
  echo "  preview     Build + preview production bundle"
  echo "  lint        Run linter + formatter"
  echo "  clean       Remove node_modules and dist"
  echo "  help        Show this help"
  echo ""
}

# ── Main ────────────────────────────────────────────────────
main() {
  local cmd="${1:-}"

  banner

  case "$cmd" in
    dev)
      check_node && check_npm
      cmd_install
      cmd_dev
      ;;
    test)
      check_node && check_npm
      cmd_install
      cmd_test
      ;;
    build)
      check_node && check_npm
      cmd_install
      cmd_build
      ;;
    preview)
      check_node && check_npm
      cmd_install
      cmd_preview
      ;;
    lint)
      check_node && check_npm
      cmd_install
      cmd_lint
      ;;
    clean)
      cmd_clean
      ;;
    help|--help|-h)
      cmd_help
      ;;
    "")
      # Default: full pipeline
      check_node && check_npm
      cmd_install
      cmd_test
      cmd_dev
      ;;
    *)
      fail "Unknown command: $cmd. Run './run.sh help' for usage."
      ;;
  esac
}

main "$@"
