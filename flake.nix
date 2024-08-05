{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  };
  outputs = { self, nixpkgs }: 
  let 
    pkgs = nixpkgs.legacyPackages.x86_64-linux; 
  in { 
    devShell.x86_64-linux.default = pkgs.mkShell {
      DOCKER_BUILDKIT = "1";
      buildInputs = with self.pkgs [
        bun
        nodejs_20
        flyctl
        libgcc
      ];
      shellHook = ''
        SCRIPTS_DIR=$(pwd)/scripts
        export PATH=$SCRIPTS_DIR:$PATH
      '';
    };
  };
}
