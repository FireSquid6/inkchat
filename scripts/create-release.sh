#!/usr/bin/env bash

cd "$(dirname "$0")/.."
VERSION=$1

if [ -z "$VERSION" ]; then
  echo "Usage: $0 <tag>"
  exit 1
fi

gh release
