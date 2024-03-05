{
  inputs = {
    flake-utils.url = "github:numtide/flake-utils";
    fedimint = {
      url =
        "github:fedimint/fedimint?rev=af123aafd333198cfefa0ce1ed154d3bd7961e07";
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
            shellHook = ''
              yarn install
            '';
          });
        };
      });
}
