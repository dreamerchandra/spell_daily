#!/bin/bash
# manage-images.sh
# Runs manageImages.js with interactive prompts if arguments are missing
# Handles paths with drag-and-drop quotes automatically

set -e

# --- Parse args ---
for arg in "$@"; do
  case $arg in
    --source=*)
      SOURCE="${arg#*=}"
      ;;
    --target=*)
      TARGET="${arg#*=}"
      ;;
    --json=*)
      JSON="${arg#*=}"
      ;;
    *)
      echo "⚠️  Unknown argument: $arg"
      ;;
  esac
done

# --- Prompt user if missing ---
if [ -z "$SOURCE" ]; then
  read -p "Enter source directory path (default: ./emoji): " SOURCE
  SOURCE=${SOURCE:-"./emoji"}
fi

if [ -z "$TARGET" ]; then
  read -p "Enter target directory path (default: ./public/emoji): " TARGET
  TARGET=${TARGET:-"./public/emoji"}
fi

if [ -z "$JSON" ]; then
  read -p "Enter JSON output file path (default: ./emoji_manifest.json): " JSON
  JSON=${JSON:-"./emoji_manifest.json"}
fi

# --- Clean up quotes and whitespace ---
clean_path() {
  local path="$1"
  # Remove leading/trailing single or double quotes, and trim spaces
  path="${path%\"}"
  path="${path#\"}"
  path="${path%\'}"
  path="${path#\'}"
  path="$(echo -e "$path" | sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//')"
  echo "$path"
}

SOURCE=$(clean_path "$SOURCE")
TARGET=$(clean_path "$TARGET")
JSON=$(clean_path "$JSON")

# --- Run the Node script ---
echo ""
echo "🚀 Running image manager with:"
echo "📂 Source: $SOURCE"
echo "📦 Target: $TARGET"
echo "🧾 JSON:   $JSON"
echo ""

node script/manageImages.js \
  --source="$SOURCE" \
  --target="$TARGET" \
  --json="$JSON"

echo ""
echo "✅ Image processing completed successfully!"
