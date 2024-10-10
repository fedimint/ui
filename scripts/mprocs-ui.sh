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

yarn dev
