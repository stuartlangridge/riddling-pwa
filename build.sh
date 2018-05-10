#!/bin/bash

BASE="$(dirname $0)"
RESOURCES="$BASE"/resources

echo Remove and create the dist folder
DIST="$BASE"/dist
rm -rf "$DIST"

echo Duplicate core HTML
INHTML="$BASE"/html
cp -r "$INHTML" "$DIST"

echo Copy utils
cp "$RESOURCES"/utils.js $DIST

echo Hash riddles
node "$RESOURCES"/hash-riddles.js > $DIST/riddles.js

echo Create icons
python3 resources/make_icons_web_version.py