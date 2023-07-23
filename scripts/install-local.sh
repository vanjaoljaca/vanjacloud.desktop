#! /bin/sh
yarn make --arch=arm64 --platform=darwin
pkill vanjacloudtop
set +e
rm -rf ~/Applications/vanjacloud.desktop.app || true
set -
cp -r out/vanjacloud.desktop-darwin-arm64/vanjacloud.desktop.app ~/Applications
open ~/Applications/vanjacloud.desktop.app
