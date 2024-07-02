# Inkchat Server

This directory contains the server for inkchat. It is deisgned to be self hosted through a docker container. Info on all of the routes can be found in the /api directory or in the brief summary below. All communication is done through JSON

# Starting the Container
WIP


# Authentication
Authentication uses bearer session tokens with a username and password system. 2FA is still a WIP. It will probably be done with the authy app.

# API
@ = route requires an authentication bearer token as an http header. Should look like:
`Authorization: Bearer {token}`

## `auth.ts`

### POST `/auth/signup`
Signs up a new user to the server. Requires a username and a password in the body as JSON. Automatically creates a new session and returns the token

### POST `/auth/signin`
Gets a new sessino token 

### @ POST `/auth/signout`
Deletes all session tokens for the user that provided a session token


## `channels.ts`

### @ POST `/channels/:id`
Gets information about a text channel. See the `schema.ts` file for what information a channel response contains.

### @ POST `/channels`
Returns information on every text channel on the server

### @ GET `/channels/{id}/messages`
Gets the last `n` messages before the specified date. Requires two query parameters in the URL:

`before`: the date to retrieve the messages before. In unix time
`last`: the amount of messages to retrieve. Maximum of 400 by default, but can be configured.

## `index.ts`

### GET `/`
Returns basic information on the server.


## `users.ts`

### @ GET `/users/{id}
Gets information on a specified user

### @ GET `/users`
Returns information on all users in the server

# Websocket Communication
The types for websocket communication are fairly self documenting so I won't repeat them here. But briefly:

## Client Messages
The client can send the following messages to the server:
`CONNECT` - subscribes to all server messages. Requires a session token
`CHAT` - sends a new message in a specified channel

The server will respond to all clients with the following messages:
`NEW_MESSAGE` - someone has posted a new message. This will be sent to the client who sent the message. If you're developing a client application, wait until this is recieved to actually display the message
`USER_JOINED` - new user has connected online
`USER_LEFT` - user has left


If the server can't parse the message it recieves, it will just return an error to the client that sent the message.
