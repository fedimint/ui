# Guardian UI

Web app experience for setting up and administering fedimints. This is used by the Fedimint guardians

## Development

### Environment setup

From repo root directory:

1. Install dependencies if necessary: `yarn install`
1. Run `docker-compose up` to start two fedimint servers, a gateway, and other dependencies.

You can [learn more about this command here](../../README.md#development)

### Run Federation Setup UIs

Do the following in separate terminals:

- **First Terminal**

1. Confirm you are in `guardian-ui/` directory
1. Run `PORT=3000 REACT_APP_FM_CONFIG_API="ws://127.0.0.1:18174" yarn dev`
   - This will be your "Leader" instance

- **Second Terminal**

1. Confirm you are in `guardian-ui/` directory
1. Run `PORT=3001 REACT_APP_FM_CONFIG_API="ws://127.0.0.1:18184" yarn dev`
   - This will be your "Follower" instance

### Set up your federation

Use these UIs to set up your two-guardian federation
