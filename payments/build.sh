#!/usr/bin/env bash
set -e
# build the binary
cargo build --release
# move to dist folder
mkdir -p heroku_dist
cp target/release/payments heroku_dist/payments
cp Procfile heroku_dist/Procfile
# upload
cd heroku_dist
heroku builds:create

cd ../
