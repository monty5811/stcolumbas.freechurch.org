build:
	python build.py

watch:
	find src templates *.py | entr make build

serve:
	cd dist && python -m http.server 4001

deploy:
	netlify deploy

pay_deploy:
	cd payments && ./build.sh

ci: js-build css-build build css-opt-index

ci-setup:
	pip install -r requirements.txt
	cd assets && yarn && cd ..
	wget https://storage.googleapis.com/downloads.webmproject.org/releases/webp/libwebp-0.6.1-linux-x86-32.tar.gz
	tar -xzf libwebp-0.6.1-linux-x86-32.tar.gz
	mv libwebp-0.6.1-linux-x86-32/bin/cwebp .
	export PATH="$PATH:$(pwd)"

js-build:
	cd assets && yarn build

js-watch:
	cd assets && yarn watch

css-build:
	cd assets && yarn css:build

css-opt-index:
	cd assets && yarn css:opt-index

py-format:
	yapf -ir **/*.py
