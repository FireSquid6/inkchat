#!/usr/bin/env bash

cd "$(dirname "$0")/.."
cd ./apps/inkchat

bun build ./entrypoints/prod.ts --entry-naming [dir]/inkchat.[ext] --outdir ./dist --target bun --sourcemap=linked --minify

declare -a platforms=(
[0]="linux-x64"
[1]="linux-arm64"
[2]="darwin-x64"
[3]="darwin-arm64"
)

VERSION=$1
echo "${platforms[@]}"

for platform in "${platforms[@]}"
do
  echo "Building for $platform"
  bun build ./entrypoints/prod.ts \
    --target="bun-$platform"\
    --compile \
    --outfile ./bins/inkchat-"$platform"
  if [ -z "$VERSION" ]; then
    echo "No version provided, skipping upload"
  else
    echo "Uploading for $platform"
    gh release upload "$VERSION" ./bins/inkchat-"$platform" --clobber
  fi
done
