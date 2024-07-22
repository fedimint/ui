default:
  @just --list
mprocs:
    mprocs -c mprocs.yml
rotate:
    mprocs -c mprocs-rotate.yml
restart:
    docker compose down && echo 'Removing fm dirs' && sudo rm -rf fm_* && echo 'Done' && mprocs -c mprocs.yml
gateway:
    yarn nix-gateway
guardian:
    yarn nix-guardian
reset dc:
    cp original-docker-compose.yml docker-compose.yml
