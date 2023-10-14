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
