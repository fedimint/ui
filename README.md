# Fedimint UI Projects

## What's Inside

This project includes the following apps / packages:

### Apps

- `guardian-ui`: Web app experience for setting up and administering fedimints. This is used by the Fedimint guardians
- `gateway-ui`: Web app experience for managing Fedimint gateways. This is used by Gateway administrators

### Packages

- `ui`: Shared React UI component library for building Fedimint UI experiences
- `utils`: Shared utility functions like the current translation framework on Fedimint UI apps
- `eslint-config`: Shared `eslint` configurations (includes `eslint-plugin-react` and `eslint-config-prettier`)
- `tsconfig`: Shared `tsconfig.json`s used throughout Fedimint UI apps

## Development

From root repo directory:

1. Ensure Docker and yarn/nodejs are installed.
1. Run `docker compose up` (brings up a 2 server Fedimint)
1. `yarn install` (First time only)
1. `yarn build` (Needs to be rerun when code in `packages` change)
1. You can run any of the following commands during development

- `yarn dev` - Starts development servers and file watchers for all apps and packages
  - Due to port conflicts, there are dev commands for each app to run individually
    - `yarn dev:gateway-ui`
    - `yarn dev:guardian-ui`
- `yarn test` - Tests all apps and packages in the project
- `yarn build` - Build all apps and packages in the project
- `yarn clean` - Cleans previous build outputs from all apps and packages in the project
- `yarn format` - Fixes formatting in all apps and packages in the project

### Running the Fedimint Config again

After running through the config setup UI flow once, you will need to delete the `fedimintd` data to run through it again. To do this, delete the `fm_1`, `fm_2`, `fm_3`, and `fm_4` folder from the repo. These are data directories mounted to Docker containers running fedmintd and are listed in `.gitignore` so are safe to remove.

### Running with mprocs

1. Install [mprocs](https://github.com/pvolok/mprocs)
1. Run `mprocs -c mprocs.yml`

After running this command, you'll be present with the mprocs display. Along the left side are the list of processes currently available by mprocs. Along the bottom are hotkeys for navigating/interacting with mprocs. The main pane shows the shell output for the currently selected process.

The `start-servers` process shows combined logging for `fedimintd`, `bitcoind`, `gatewayd`, and `lnd`.

The `stop-servers` process can be used to stop all docker containers by hitting the `s` key to start the process. After doing so, you can return to the `start-servers` process and hit `r` to restart things.

The `guardian-ui-1` and `guardian-ui-2` are instances of `guardian-ui` apps, each running on different ports and connected to a unique `fedimintd` server instance (running in the `start-servers` process).

The `gateway-ui` is an instance of `gateway-ui` app, connected to a `gatewayd` server instance (running in the `start-servers` process).

You can see more details by viewing the `mprocs.yml` file.

### Running with local Fedimint

If you would like to run the UIs against changes you have made to fedimint itself:

1. Run `cargo build` in fedimint
2. Run `env DEVIMINT_PATH=$(realpath ../fedimint/target/debug) yarn nix-guardian` (assuming that you have `ui` and `fedimint` repos checked out in the same directory)

This will put binaries in `fedimint/target/debug` at the front of your `$PATH`. Devimint will use these binaries instead of the ones installed via Nix.
