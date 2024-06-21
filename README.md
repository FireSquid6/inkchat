# Inkchat

Inkchat is a self hosted social hub for your friends, collegues, and/or fellow hackers. It is currently in very early development.

This repository contains the backend api for inkchat.

# Technical Overview

Inkchat runs on a self-hosted `server` (located in the `/server` directory). The `client` website (or app) makes a websocket connection to the server as well as API calls that communicate JSON back and forth.

For more details on the API and Websocket protocol, see the README in the server directory or the README in the client directory.


# Quickstart

To start a new database for development purposes:
```
cd server/
bun run new-dev
```

You can then start a client with:
```
cd cient/
bun run dev
```


In the server directory, you can run `bun run dev` to resume that database, or `bun run new-dev` to delete it and start a new one. The database is always seeded with some random data, as well as a user that you can easily log into:

```
username: grock
password: lumberandlogs
```
