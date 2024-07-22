# shellcheck shell=bash
set -eo pipefail

# Prompt user for config port with a default value
read -p "Enter the config port for the fedimintd to point at or hit enter for default of 18186: " CONFIG_PORT
CONFIG_PORT=${CONFIG_PORT:-18186}

if ! [[ "$CONFIG_PORT" =~ ^[0-9]+$ ]] || [ "$CONFIG_PORT" -lt 1 ] || [ "$CONFIG_PORT" -gt 65535 ]; then
  echo "Invalid port number."
  exit 1
fi

# Export the environment variable
export REACT_APP_FM_CONFIG_API="ws://127.0.0.1:$CONFIG_PORT"

# Start the guardian UI
yarn dev:guardian-ui
