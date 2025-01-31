#!/bin/sh

# Run Node script
node ./scripts/write-config-from-env.js build

# Run CMD args
exec "$@"
