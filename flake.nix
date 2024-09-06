{
  inputs = {
    flake-utils.url = "github:numtide/flake-utils";
    fedimint = {
      # master on 2024-09-06
      url =
        "github:fedimint/fedimint?rev=1697e61c1214e4a68aeabf23bb25e9eaa1fa991d";
    };
  };
  outputs = { self, flake-utils, fedimint }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        nixpkgs = fedimint.inputs.nixpkgs;
        pkgs = import nixpkgs {
          inherit system;
          overlays = fedimint.overlays.fedimint;
        };
        fmLib = fedimint.lib.${system};

        yarnOfflineCache = pkgs.fetchYarnDeps {
          yarnLock = ./yarn.lock;
          hash = "sha256-lJcqjTwC5C+4rvug6RYg8Ees4SzNTD+HazfACz1EaSQ=";
        };
      in {
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
            shellHook = ''
              yarn install
            '';
          });
        };

        packages.guardian-ui = pkgs.stdenv.mkDerivation {
          pname = "guardian-ui";
          version = "0.3.0";
          src = ./.;

          nativeBuildInputs = with pkgs; [
            nodejs
            yarn
            yarn2nix-moretea.fixup_yarn_lock
          ];

          configurePhase = ''
            export HOME=$(mktemp -d)
          '';

          buildPhase = ''
            yarn config --offline set yarn-offline-mirror ${yarnOfflineCache}
            fixup_yarn_lock yarn.lock

            yarn install --offline \
              --frozen-lockfile \
              --ignore-engines --ignore-scripts
            patchShebangs .

            yarn build:guardian-ui
          '';

          installPhase = ''
            mkdir -p $out
            cp -R apps/guardian-ui/build/* $out
          '';
        };
      });
}
