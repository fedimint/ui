{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-22.11";
    flake-utils.url = "github:numtide/flake-utils";
    fedimint = {
      url = "github:fedimint/fedimint?rev=39a6763c6ad755bf8cbc38cf010da71d193f9696";
    };
  };
  outputs = { self, nixpkgs, flake-utils, fedimint }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs {
          inherit system;
        };
        fmLib = fedimint.lib.${system};
      in
      {
        devShells = fmLib.devShells // {
          default = fmLib.devShells.default.overrideAttrs (prev: {
            nativeBuildInputs = [
              pkgs.mprocs
              pkgs.nodejs
              pkgs.yarn
              fedimint.packages.${system}.devimint
              fedimint.packages.${system}.gateway-pkgs
              fedimint.packages.${system}.fedimint-pkgs
            ] ++ prev.nativeBuildInputs;
          });
        };
      });
}