# protocol

Inkchat servers and clients communicate through json over websocket. Client send `clientMessages` and the server then responds with `serverMessages`. For the most part, this package just contains types and helper classes for parsing and serializing this JSON.
