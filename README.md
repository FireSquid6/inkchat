# Inkchat

Inkchat is a self hosted chat application. It provides the ability to create multiple channels, write plugins and bots for the server, and customize everything to your liking. Inkchat has an open server/client model, where any type of client can connect to any server. Right now the only functioning client is `fireclient` which is being developed parallel to inkchat.

## Running Inkchat

You can run inkchat by just downloading the binary from github releases. There is currently no system in place to use command line arguments, but that should be coming in 1.0.0.

The `inkchat-store` volume is where all of your data is stored.

# Packages

There are two apps in this repo:
`inkchat` - the core server for inkchat
`fireclient` - the standard client for inkchat - developed in parallel

There are also some packages:
`protocol` - contains the json over websocket protocol that inkchat clients and servers communicate using
`maybe` - a simple maybe type used throughout inkchat
`api` - a package that connects types from the server api to the inkchat client

# Writing plugins

TODO

# Writing clients

TODO
