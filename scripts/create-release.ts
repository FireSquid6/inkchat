#!/usr/bin/env bun

const args = process.argv
for (let i = 0; i < args.length; i++) {
  if (args[i].includes('sametime.ts')) {
    args.splice(0, i + 1)
    break
  }
}

