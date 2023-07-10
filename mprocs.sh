#!/usr/bin/env bash

# export FM_TEST_DIR=$(mktemp --tmpdir -d XXXXX)
export RUST_BACKTRACE=1
# export RUST_LOG=trace
export FM_TEST_DIR="${2-$TMP}/fm-$(LC_ALL=C tr -dc A-Za-z0-9 </dev/urandom | head -c 4 || true)"
echo $FM_TEST_DIR
export FM_FED_SIZE=2
export FM_PID_FILE="$FM_TEST_DIR/.pid"
export FM_LOGS_DIR="$FM_TEST_DIR/logs"
export FM_POLL_INTERVAL=1

devimint run-ui

# devimint dev-fed 2>/dev/null &

# echo $! >> $FM_PID_FILE
# eval "$(devimint env)"

# mprocs -c devimint-mprocs.yml