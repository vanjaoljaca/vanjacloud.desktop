#! /bin/sh
yarn make --arch=arm64 --platform=darwin
pkill vanjacloudtop
rm -rf ~/Applications/vanjacloudtop.app
cp -r out/vanjacloudtop-darwin-arm64/vanjacloudtop.app ~/Applications
open ~/Applications/vanjacloudtop.app