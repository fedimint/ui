default:
  @just --list
mprocs:
    mprocs -c mprocs.yml
restart:
    docker compose down && echo 'Removing fm dirs' && sudo rm -rf fm_* && echo 'Done' && mprocs -c mprocs.yml
gate:
    yarn nix-gateway
guard:
    yarn nix-guardian
kill:
    npx kill-port 3000 && npx kill-port 3001 && npx kill-port 3002 && npx kill-port 3003 && npx kill-port 3004
