# Inkchat

Inkchat is a self hosted social hub for your friends, collegues, and/or fellow hackers. It is currently in very early development.

This repository contains the backend api for inkchat.


# Usage

Inkchat's backend uses several database types:

- Ephemeral - this database is started up and then instantly destroyed. Useful for testing
- Dev - this database serves as a "workbench." You can reset it whenever.
- Prod - this is the main production database. You shouldn't delete it.

If you just want a dev db, run:
```
bun run new-dev
```

To then contibue from that database later:
```
bun run dev
```

You can then reset it with another `bun run new-dev`

# Why is there Frontend Here
I've been working on a basic frontend in vite. You can run it with `bun run vite`. It will be moved to another repository at some point.
