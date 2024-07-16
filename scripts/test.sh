#!/usr/bin/env bash

cd ./apps/inkchat
bun run generate
bun test
