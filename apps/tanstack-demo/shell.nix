# Help! I'm a nix user and it isn't working!
#
# try running these commands:
# sudo nix-channel --add https://nixos.org/channels/nixos-unstable nixos-unstable
# sudo nix-channel --update
# then run nix-shell again

let
  unstable = import <nixos-unstable> { config = { allowUnfree = true; }; };
in
{ nixpkgs ? import <nixpkgs> { } }:
with nixpkgs; mkShell {
  DOCKER_BUILDKIT = "1";
  buildInputs = [
    unstable.bun
    nodejs_20
    flyctl
    libgcc
  ];
}
