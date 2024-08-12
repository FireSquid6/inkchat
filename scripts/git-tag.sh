#!/usr/bin/env bash

cd "$(dirname "$0")/.."
VERSION=$1

if [ -z "$VERSION" ]; then
  echo "Usage: $0 <version>"
  echo "Example: $0 1.0.0"
  exit 1
fi

git tag -a "v$VERSION" -m "Version $VERSION"
git push origin "v$VERSION"

gh release create --generate-notes "v$VERSION"
./scripts/build-all.sh "v$VERSION"
