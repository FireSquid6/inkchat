#!/usr/bin/env bash

VERSION=$1

if [ -z "$VERSION" ]; then
  echo "Usage: $0 <tag>"
  exit 1
fi

git tag -a "v$VERSION" -m "Version $VERSION"
git push origin "v$VERSION"
