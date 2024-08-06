#!/usr/bin/env bash

cd "$(dirname "$0")/.."
APP=$1
SCRIPT=$2

if [ -z "$APP" ]; then
  echo "Usage: $0 <app> <script>"
  exit 1
fi

cd ./apps/$APP
echo "Running $SCRIPT in $APP"

if [ -f "entrypoints/$SCRIPT.ts" ]; then
  bun run entrypoints/$SCRIPT.ts
else
  bun run $SCRIPT
fi
