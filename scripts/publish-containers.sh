#!/usr/bin/env bash

VERSION=$1


if [ -z "$VERSION" ]; then
    echo "Usage: $0 <version>"
    exit 1
fi

docker build -t firesquid/inkchat:$VERSION ./apps/inkchat
docker build -t firesquid/inkchat:latest ./apps/inkchat
docker push firesquid/inkchat:$VERSION
docker push firesquid/inkchat:latest
