#!/usr/bin/env bash

cd "$(dirname "$0")/.."
VERSION=$1


if [ -z "$VERSION" ]; then
    echo "Usage: $0 <version>"
    exit 1
fi


docker build -t firesquid/inkchat:$VERSION --no-cache ./apps/inkchat
docker build -t firesquid/inkchat:latest --no-cache ./apps/inkchat
docker push firesquid/inkchat:$VERSION
docker push firesquid/inkchat:latest
