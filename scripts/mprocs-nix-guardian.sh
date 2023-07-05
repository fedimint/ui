#!/usr/bin/env bash

export FM_TEST_DIR="${2-$TMP}/fm-$(LC_ALL=C tr -dc A-Za-z0-9 </dev/urandom | head -c 4 || true)"
export FM_FED_SIZE=4
export FM_PID_FILE="$FM_TEST_DIR/.pid"
export FM_LOGS_DIR="$FM_TEST_DIR/logs"

devimint run-ui 2>/dev/null &

mkdir $FM_TEST_DIR
mkdir $FM_LOGS_DIR
touch $FM_PID_FILE
echo $! >> $FM_PID_FILE
eval "$(devimint env)"

# Function for killing processes stored in FM_PID_FILE in reverse-order they were created in
function kill_fedimint_processes {
  echo "Killing fedimint processes"
  PIDS=$(cat $FM_PID_FILE | sed '1!G;h;$!d') # sed reverses order
  if [ -n "$PIDS" ]
  then
    kill $PIDS 2>/dev/null
  fi
  rm -f $FM_PID_FILE
}

trap kill_fedimint_processes EXIT

mprocs -c mprocs-nix-guardian.yml