#!/usr/bin/env bash
set -euo pipefail

ROOT=/Users/bloodz/Documents/macmini/service/bloodzSpace
BIN_DIR=/Users/bloodz/.local/bin
AGENT_DIR=/Users/bloodz/Library/LaunchAgents
LOG_DIR=/Users/bloodz/Library/Logs/bloodzSpace

mkdir -p "$BIN_DIR" "$AGENT_DIR" "$LOG_DIR"

cat > "$BIN_DIR/bloodzspace-deploy.sh" <<'SH'
#!/usr/bin/env bash
set -euo pipefail

ROOT=/Users/bloodz/Documents/macmini/service/bloodzSpace
LOCK=/tmp/bloodzspace-deploy.lock
LOG_DIR=/Users/bloodz/Library/Logs/bloodzSpace
TIMEOUT_SECONDS=1500
NPM=/opt/homebrew/bin/npm

export PATH=/opt/homebrew/bin:/opt/homebrew/sbin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin
export HOME=/Users/bloodz
export USER=bloodz
export LANG=C.UTF-8

mkdir -p "$LOG_DIR"
if ! mkdir "$LOCK" 2>/dev/null; then
  printf '%s deploy skipped: previous run still active\n' "$(date '+%F %T')" >> "$LOG_DIR/deploy.log"
  exit 0
fi
trap 'rmdir "$LOCK"' EXIT

cd "$ROOT"
printf '\n[%s] deploy start\n' "$(date '+%F %T')" >> "$LOG_DIR/deploy.log"
perl -e 'alarm shift; exec @ARGV' "$TIMEOUT_SECONDS" "$NPM" run build >> "$LOG_DIR/deploy.log" 2>> "$LOG_DIR/deploy.err.log"
perl -e 'alarm shift; exec @ARGV' "$TIMEOUT_SECONDS" "$NPM" run deploy >> "$LOG_DIR/deploy.log" 2>> "$LOG_DIR/deploy.err.log"
printf '[%s] deploy done\n' "$(date '+%F %T')" >> "$LOG_DIR/deploy.log"
SH

chmod +x "$BIN_DIR/bloodzspace-deploy.sh"
cp "$ROOT/launchd/ai.bloodz.bloodzspace-deploy.plist" "$AGENT_DIR/"

launchctl bootout "gui/$(id -u)" "$AGENT_DIR/ai.bloodz.bloodzspace-deploy.plist" 2>/dev/null || true
launchctl bootstrap "gui/$(id -u)" "$AGENT_DIR/ai.bloodz.bloodzspace-deploy.plist"
launchctl print "gui/$(id -u)/ai.bloodz.bloodzspace-deploy" | grep -E "state =|run interval|last exit code" || true
