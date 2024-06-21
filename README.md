# Inkchat

Inkchat is a self hosted social hub for your friends, collegues, and/or fellow hackers. It is currently in very early development.

This repository contains the backend api for inkchat.

# Technical Overview

Inkchat runs on a self-hosted `server` (located in the `/server` directory). The `client` website (or app) makes a websocket connection to the server as well as API calls that communicate JSON back and forth.

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



