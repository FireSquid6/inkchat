#!/bin/sh

# sets up the proper links and runs all if the install scripts
cd $(dirname $0)

cd ../server
bun link
bun install

cd ../client
bun link
bun install

