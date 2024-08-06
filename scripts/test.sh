#!/usr/bin/env bash

cd "$(dirname "$0")/.."
cd ./apps/inkchat
bun run generate
bun test
