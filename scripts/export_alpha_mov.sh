#!/usr/bin/env bash
set -euo pipefail

if [[ $# -lt 2 || $# -gt 3 ]]; then
  echo "Usage: $0 <hyperframes-project-dir> <output.mov> [preset]" >&2
  exit 2
fi

if [[ "$(uname -s)" != "Darwin" ]]; then
  echo "HEVC Alpha export requires macOS avconvert." >&2
  exit 2
fi

for command_name in npx avconvert ffprobe swift; do
  if ! command -v "$command_name" >/dev/null 2>&1; then
    echo "Missing required command: $command_name" >&2
    exit 2
  fi
done

caller_dir="$(pwd -P)"
project_dir="$(cd "$1" && pwd -P)"
output_arg="$2"
preset="${3:-PresetHEVC1920x1080WithAlpha}"

case "$preset" in
  PresetHEVC1920x1080WithAlpha|PresetHEVC3840x2160WithAlpha|PresetHEVCHighestQualityWithAlpha)
    ;;
  *)
    echo "Unsupported Alpha preset: $preset" >&2
    exit 2
    ;;
esac

if [[ "$output_arg" = /* ]]; then
  output_path="$output_arg"
else
  output_path="$caller_dir/$output_arg"
fi

if [[ "$output_path" != *.mov ]]; then
  echo "Output path must end in .mov" >&2
  exit 2
fi

output_dir="$(dirname "$output_path")"
mkdir -p "$output_dir"

temp_dir="$(mktemp -d "${TMPDIR:-/tmp}/chapter-progress-alpha.XXXXXX")"
temp_prores="$temp_dir/prores-alpha.mov"
temp_hevc="$temp_dir/hevc-alpha.mov"

cleanup() {
  [[ ! -f "$temp_prores" ]] || rm -- "$temp_prores"
  [[ ! -f "$temp_hevc" ]] || rm -- "$temp_hevc"
  rmdir "$temp_dir" 2>/dev/null || true
}
trap cleanup EXIT

cd "$project_dir"
npx hyperframes render \
  --format mov \
  --quality looks \
  --output "$temp_prores"

avconvert \
  --source "$temp_prores" \
  --preset "$preset" \
  --output "$temp_hevc" \
  --replace \
  --progress

if [[ ! -s "$temp_hevc" ]]; then
  echo "HEVC Alpha output is empty." >&2
  exit 1
fi

alpha_result="$(swift -module-cache-path /private/tmp/swift-module-cache -e '
import AVFoundation
import Foundation
let url = URL(fileURLWithPath: CommandLine.arguments[1])
let asset = AVURLAsset(url: url)
guard let track = asset.tracks(withMediaType: .video).first else {
  print("false")
  exit(0)
}
print(track.hasMediaCharacteristic(.containsAlphaChannel))
' "$temp_hevc" 2>/dev/null)"

if [[ "$alpha_result" != "true" ]]; then
  echo "Alpha verification failed: $alpha_result" >&2
  exit 1
fi

ffprobe -v error \
  -show_entries stream=codec_name,codec_tag_string,width,height,r_frame_rate,duration:format=duration,size,format_name \
  -of json \
  "$temp_hevc"

mv -f -- "$temp_hevc" "$output_path"
echo "Alpha verified: true"
echo "Output: $output_path"
