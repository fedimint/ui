# shellcheck shell=bash

set -eo pipefail

eval "$(devimint env)"

echo Waiting for devimint to start up fedimint and gateway

STATUS="$(devimint wait)"
if [ "$STATUS" = "ERROR" ]; then
  echo "fedimint didn't start correctly"
  echo "See other panes for errors"
  exit 1
fi

# Prompt user for config port
read -p "Enter the config port for the fedimintd to point at: " CONFIG_PORT

# Export the environment variable
export REACT_APP_FM_CONFIG_API="ws://127.0.0.1:$CONFIG_PORT"

# Start the guardian UI
yarn dev:guardian-ui
