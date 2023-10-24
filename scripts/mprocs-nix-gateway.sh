# shellcheck shell=bash

eval "$(devimint env)"

echo Waiting for devimint to start up fedimint and gateway

STATUS="$(devimint wait)"
if [ "$STATUS" = "ERROR" ]
then
    echo "fedimint didn't start correctly"
    echo "See other panes for errors"
    exit 1
fi

# Conigure UI env from devimint env
export REACT_APP_FM_GATEWAY_API=$FM_GATEWAY_API_ADDR
export REACT_APP_FM_GATEWAY_PASSWORD=$FM_GATEWAY_PASSWORD

yarn dev:gateway-ui
