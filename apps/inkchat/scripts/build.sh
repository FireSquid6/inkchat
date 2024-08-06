#!/usr/bin/env bash

cd "$(dirname "$0")/.."
cd ./apps/inkchat

bun build ./entrypoints/prod.ts --entry-naming [dir]/inkchat.[ext] --outdir ./dist --target bun --sourcemap=linked --minify

declare -a platforms=(
[0]="linux-x64"
[1]="linux-arm64"
[2]="windows-x64"
[3]="darwin-x64"
[4]="darwin-arm64"
)

echo "${platforms[@]}"

for platform in "${platforms[@]}"
do
  echo "Building for $platform"
bun build ./entrypoints/prod.ts \
  --target="bun-$platform"\
  --compile \
  --outfile ./bins/inkchat-"$platform"

done
