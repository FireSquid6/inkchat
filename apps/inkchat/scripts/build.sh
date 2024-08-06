#!/usr/bin/env bash

cd "$(dirname "$0")/.."

bun build ./entrypoints/prod.ts \
  --target="bun-linux-x64"\
  --compile \
  --outfile ./bins/inkchat-linux-x64

