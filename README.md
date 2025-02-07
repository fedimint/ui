# Fedimint UI Projects

<p align="center">
<img width="42%" alt="268047037-d648b83d-b676-44fe-98be-07f84f4d7465" src="https://github.com/fedimint/ui/assets/101964499/2d85544d-e1d0-4e06-a610-e2bc618f463b">
<img width="47%" alt="268046987-3b480175-7f5e-4235-bed3-cab5c092c2e5" src="https://github.com/fedimint/ui/assets/101964499/ce0fe039-9260-4443-9d84-9359bdfa901f">
</p>

## What's Inside

This project includes the following apps / packages:

### App

We've refactored the Fedimint UI into a single client side app that can run on the browser or on desktop using Electron.

- `router`: This creates a homescreen that shows all your connected services: guardians or gateways. You can connect to other guardians or gateways by entering their baseUrl. You have to authenticate each service separately because the auth for each one is done differently.

### Packages

- `ui`: Shared React UI component library for building Fedimint UI experiences
- `utils`: Shared utility functions like the current translation framework on Fedimint UI apps
- `eslint-config`: Shared `eslint` configurations (includes `eslint-plugin-react` and `eslint-config-prettier`)
- `tsconfig`: Shared `tsconfig.json`s used throughout Fedimint UI apps

## Testing

For detailed testing instructions, please refer to the [testing.md](./testing.md) file in this repository. It contains comprehensive information on how to set up and run local tests for the Fedimint UI projects.

## Version Policy

Fedimint UI releases use semantic versioning (`major.minor.patch`)

- Major and minor versions of `fedimint/ui` are made to be compatible major and minor versions of `fedimint/fedimint`
  - For instance, any `1.1.x` release of the UI should work with any `1.1.x` release of Fedimint
- Patch versions of `fedimint/ui` are made independent of `fedimint/fedimint`
  - For instance, you could run `fedimint/ui@1.0.1` against `fedimint/fedimint@1.0.0` and vice versa
  - It is always recommended to run the latest patch release of any version as they may contain important fixes
- The `master` branch of `fedimint/ui` attempts to track `master` of `fedimint/fedimint`
  - This tracking is a best effort, and sometimes the two will fall out of sync. Feel free to open an issue if you notice an incompatibility.
  - It is not recommended to run `master` in production as breaking changes may occur without warning

## Running a Release

### Build and Run from Source

#### Guardian UI

```bash
git clone git@github.com:fedimint/ui.git fedimint-ui
cd fedimint-ui/apps/guardian-ui
yarn install
PORT=3000 VITE_FM_CONFIG_API="[app-address-here]" yarn build && yarn start
```

Replace `PORT` with a port of your choice, and `VITE_FM_CONFIG_API` with the socket address of your deployed fedimintd server.

#### Gateway UI

```bash
git clone git@github.com:fedimint/ui.git fedimint-ui
cd fedimint-ui/apps/gateway-ui
yarn install
PORT=3000 VITE_FM_GATEWAY_API="[app-address-here]" VITE_FM_GATEWAY_PASSWORD="[password-here]" yarn build && yarn start
```

Replace `PORT` with a port of your choice, `VITE_FM_GATEWAY_API` with the http address, and `VITE_FM_GATEWAY_PASSWORD` with the password of your deployed gatewayd server.

### Run with Docker

**Note:** Docker images are only built for `linux/amd64`. Your docker will need to support virtualization to run on other platforms.

#### Guardian UI

The guardian UI container is available at [`fedimintui/guardian-ui`](https://hub.docker.com/r/fedimintui/guardian-ui)

```sh
docker pull fedimintui/guardian-ui:0.1.0
docker run \
  --platform linux/amd64 \
  --env "VITE_FM_CONFIG_API='[app-address-here]'" \
  -p 3000:3000 \
  fedimintui/guardian-ui:0.1.0
```

Replace `-p 3000:3000` with a port of your choice, and `VITE_FM_CONFIG_API` with the socket address of your deployed fedimintd server.

#### Gateway UI

The gateway UI container is available at [`fedimintui/gateway-ui`](https://hub.docker.com/r/fedimintui/gateway-ui)

```sh
docker pull fedimintui/gateway-ui:0.1.0
docker run \
  --platform linux/amd64 \
  --env "VITE_FM_GATEWAY_API='[app-address-here]'" \
  --env "VITE_FM_GATEWAY_PASSWORD='[password-here]'" \
  -p 3000:3000 \
  fedimintui/gateway-ui:0.1.0
```

Replace `-p 3000:3000` with a port of your choice, `VITE_FM_GATEWAY_API` with the http address, and `VITE_FM_GATEWAY_PASSWORD` with the password of your deployed gatewayd server.

## Development

The development password for the gateway is `theresnosecondbest`.
The development password for the guardians when using the `nix-gateway` or `docker` development environments is `pass`.

### Option 1 - Running with Nix (preferred)

1. Install Nix
   ```bash
   curl --proto '=https' --tlsv1.2 -sSf -L https://install.determinate.systems/nix | sh -s -- install
   ```
1. Add `experimental-features = nix-command flakes` to your `/etc/nix/nix.conf` file
1. In terminal `cd` to the fedimint-ui repo root directory
1. Enter the following command to start Nix development environment
   ```bash
   nix develop
   ```
1. Run `yarn nix-gateway` or `yarn nix-guardian` Note: **nix-gateway** preconfigures the federation so you don't have to go through federation setup. **nix-guardian** starts separate guardian nodes that are connected into the federation when you run through the federation setup process.

#### **Gateway UI**

```bash
yarn nix-gateway
```

nix-gateway spins up these instances
| instance | url |
| ---------- | --- |
| gateway-ui-cln | http://127.0.0.1:3004/ |
| gateway-ui-lnd | http://127.0.0.1:3005/ |
| gateway-ui-ldk | http://127.0.0.1:3006/ |
| guardian-ui | http://127.0.0.1:3000/ |

#### **Guardian UI**

```bash
yarn nix-guardian
```

nix-guardian spins up these instances
| instance | url |
| ------------- | --- |
| guardian-ui-1 | http://127.0.0.1:3000/ |
| guardian-ui-2 | http://127.0.0.1:3001/ |
| guardian-ui-3 | http://127.0.0.1:3002/ |
| guardian-ui-4 | http://127.0.0.1:3003/ |

### Option 2 - Running with docker

1. Install [mprocs](https://github.com/pvolok/mprocs)
1. In terminal `cd` to the fedimint-ui repo root directory and run `yarn install`
1. Run `yarn docker`

After running this command, you'll be present with the mprocs display. Along the left side are the list of processes currently available by mprocs. Along the bottom are hotkeys for navigating/interacting with mprocs. The main pane shows the shell output for the currently selected process.

The `start-servers` process shows combined logging for `fedimintd`, `bitcoind`, `gatewayd`, and `lnd`.

The `stop-servers` process can be used to stop all docker containers by hitting the `s` key to start the process. After doing so, you can return to the `start-servers` process and hit `r` to restart things.

The `guardian-ui-1`, `guardian-ui-2`, `guardian-ui-3`, `guardian-ui-4` are instances of `guardian-ui` apps, each running on different ports and connected to a unique `fedimintd` server instance (running in the `start-servers` process).

The `gateway-ui` is an instance of `gateway-ui` app, connected to a `gatewayd` server instance (running in the `start-servers` process).

You can see more details by viewing the `mprocs.yml` file.

yarn mprocs spins up these instances
| instance | url |
| ------------- | --- |
| guardian-ui-1 | http://127.0.0.1:3000/ |
| guardian-ui-2 | http://127.0.0.1:3001/ |
| guardian-ui-3 | http://127.0.0.1:3002/ |
| guardian-ui-4 | http://127.0.0.1:3003/ |
| gateway-ui | http://127.0.0.1:3004/ |

<!-- TODO: Fix this section... these instructions are outdated
### Option 3 - Running with Docker Compose and Yarn manually

From root repo directory:

1. Ensure Docker and yarn/nodejs are installed.
1. Run `docker compose up` - runs 4 fedimintd servers and a gatewayd server, plus associated services. See [compose file for details](./docker-compose.yml)
1. `yarn install` (first time only)
1. Run guardian-ui in development environment

   ```bash
     # first guardian
     PORT=3000 VITE_FM_CONFIG_API="ws://127.0.0.1:18174" yarn dev:guardian-ui
     # second guardian
     PORT=3001 VITE_FM_CONFIG_API="ws://127.0.0.1:18184" yarn dev:guardian-ui
     # third guardian
     PORT=3002 VITE_FM_CONFIG_API="ws://127.0.0.1:18185" yarn dev:guardian-ui
     # fourth guardian
     PORT=3003 VITE_FM_CONFIG_API="ws://127.0.0.1:18186" yarn dev:guardian-ui
   ```

1. Run gateway-ui in development environment

   ```bash
      yarn dev:gateway-ui
   ```

1. Run `docker compose down` when done. It might be worth deleting `fm_*`, directory from the repo. These are data directories mounted to Docker containers running fedmintd and are listed in `.gitignore` so are safe to remove. -->

## Referencing Fedimint

The docker containers and devimint are for specific releases or commits of `fedimint/fedimint`. At present, the reference commit-hash is `6da8ff595d1373e24f365d750872bd588fda17c9`

### Running with local Fedimint

If you would like to run the UIs against a particular version of fedimint, or using changes you have made locally to fedimint itself:

1. Run `cargo build` in fedimint
2. Run `env DEVIMINT_BIN=$(realpath ../fedimint/target-nix/debug) yarn nix-guardian` (assuming that you have `ui` and `fedimint` repos checked out in the same directory)

This will put binaries in `fedimint/target-nix/debug` at the front of your `$PATH`. Devimint will use these binaries instead of the ones installed via Nix.

### Bumping referenced Fedimint

You can officially bump the referenced version of Fedimint using the following steps:

1. Locate a desired hash from [Fedimint](https://github.com/fedimint/fedimint/commits/master)
2. Find and replace all instances of the current reference commit hash: `6da8ff595d1373e24f365d750872bd588fda17c9`

3. Run `nix flake update` at the root of the repo
4. Restart your nix shell and validate the reference, then commit to complete bump

## Developer Certificate of Origin

By contributing to the project you agree to the following:

```
Developer Certificate of Origin
Version 1.1

Copyright (C) 2004, 2006 The Linux Foundation and its contributors.

Everyone is permitted to copy and distribute verbatim copies of this
license document, but changing it is not allowed.


Developer's Certificate of Origin 1.1

By making a contribution to this project, I certify that:

(a) The contribution was created in whole or in part by me and I
    have the right to submit it under the open source license
    indicated in the file; or

(b) The contribution is based upon previous work that, to the best
    of my knowledge, is covered under an appropriate open source
    license and I have the right under that license to submit that
    work with modifications, whether created in whole or in part
    by me, under the same open source license (unless I am
    permitted to submit under a different license), as indicated
    in the file; or

(c) The contribution was provided directly to me by some other
    person who certified (a), (b) or (c) and I have not modified
    it.

(d) I understand and agree that this project and the contribution
    are public and that a record of the contribution (including all
    personal information I submit with it, including my sign-off) is
    maintained indefinitely and may be redistributed consistent with
    this project or the open source license(s) involved.
```
