default:
  @just --list
docker:
    mprocs -c mprocs-docker.yml
rotate:
    mprocs -c mprocs-rotate.yml
restart:
    docker compose down && echo 'Removing fm dirs' && sudo rm -rf fm_* && echo 'Done' && mprocs -c mprocs.yml
gateway:
    yarn nix-gateway
guardian:
    yarn nix-guardian
reset dc:
    cp original-docker-compose.yml docker-compose.yml && docker compose down -v && echo 'Removing fm dirs' && sudo rm -rf fm_* && echo 'Done'
translate:
    node scripts/translate.js
translate-key ui key:
    node scripts/translate.js {{ui}} {{key}}
