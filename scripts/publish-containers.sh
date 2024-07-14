#!/usr/bin/env bash

VERSION=$1

if [ -z "$VERSION" ]; then
    echo "Usage: $0 <version>"
    exit 1
fi

docker build -t firesquid/inkchat:$VERSION ./apps/inkchat
docker push firesquid/inkchat:$VERSION
