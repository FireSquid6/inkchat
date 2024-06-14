# Inkchat Server
Contains the logic for the actual server aspect of inkchat

## Setup
1. Run the `setup.sh` script in the scripts directory
2. Start the server any way you please

There are several ways to start the sever:
- `bun run dev` - migrates and resumes a development server in `store/prod`
- `bun run new-dev` - deletes the data for the old development server and re-seeds it
- `bun run ephemeral` - starts a new ephemeral database using sqlite in memory. Useful for testing. Optionally seeded
- `bun run prod` - migrates and starts the app for production. Uses a separate, unseeded database. It is stored in `store/prod` so don't delete it unless you want to kill your production data


Additionally, any time you change the schema you will need to re-run `bun run generate`
