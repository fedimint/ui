default:
  @just --list

nix-guardian:
  ./scripts/mprocs-nix-guardian.sh

nix-gateway:
  ./scripts/mprocs-nix-gateway.sh

docker:
  mprocs -c mprocs.yml