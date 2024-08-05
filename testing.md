### Testing Instructions

#### Fedimint Guardian & Gateway UI End-to-End Testing Instructions

In your nix dev-shell

1. Run `just guardian` to spin up 4x guardians and UIs on ports :3000, :3001, :3002, :3003
2. Walk through the setup process

- PLEASE open issues for anything you run into here, this is the most important part to get right and seamless, and we're always looking to streamline this setup process

3. After setup, connect the gateway with UI running on port :3004
4. Set up a meta for the federation

- From 1 guardian, propose a new meta with some key/values
- Confirm on the other guardians, once a threshold is met it will set it as the new meta
- Modify the meta from another guardian and propose the modifications
- Confirm the meta modifications on the other guardians, once a threshold is met, it will set it as the new meta

6. Peg in some bitcoin to the federation.

- Pull a deposit address through the gateway UI
- Send to it with `bitcoin-cli sendtoaddress 1 replace-this-with-address`
- Mine some coins with `bitcoin-cli generatetoaddress 100 $(bitcoin-cli getnewaddress)`
- Confirm the coins show up in the gateway-ui wallet
- Confirm the coins show up in the guardian-ui balance sheet

7. Peg out some bitcoin from the federation

- get a new address with `bitcoin-cli getnewaddress`
- From the gateway, start a withdraw to that address
- Mine some coins with `bitcoin-cli generatetoaddress 100 $(bitcoin-cli getnewaddress)`
- Confirm the coins are out of the gateway-ui wallet
- Confirm the coins are off the guardian-ui balance sheet

8. Coordinate a shutdown

- From each of the guardian UIs, go to Danger Zone and use the Coordinate Shutdown button to set a session height to shutdown at. Give it ~10 sessions from the current session height
- just send some coins back and forth on the gateway to keep the sessions coming until they shut down
- confirm in the logs that the guardians all shut down at the same session height

#### Test Guardian API Rotation

We test this with docker so we can restart services on different ports, simulating changing DNS.

1. Start the guardians up with `just rotate`, which will pull docker images for the latest fedimint and start an mprocs with some special sauce
2. On each `guardian-ui` process, hit `Enter` to start on the default ports
3. Go through the end to end setup process for the federation
4. Restart the docker container: Once you're on the dashboard for all of them

- hit `r` on the `restart-guardian` process to start the docker container restart logic.
- Select which container you want to restart (e.g. 1 for fedimint_1)
- Select which port to restart on (e.g. 13333)
- Wait for the container to restart

5. Confirm that the corresponding UI (e.g. :3000 for fedimint_1) can't connect when you refresh the page (since the port changed)
6. On the corresponding UI process, hit `r` and enter the port you restarted the guardian's docker service on (e.g. 13333)
7. Go back to the corresponding UI in your browser:

- A modal should pop up saying you've changed the API_URL and you need to sign a new api announcement
  - Modify the `127.0.0.1` to the container name (e.g. `ws://fedimint_1:13333` instead of `ws://127.0.0.1:13333`)
- Click to sign the API announcement

8. Confirm the updated API announcement reflects on the other guardians
9. Refresh the gateway UI and confirm that it updates to open a ws with the guardian on its new port from the new api announcement
10. Before committing anything, run `just reset dc` to reset the docker-compose that was modified during the api rotation testing by the scripts
