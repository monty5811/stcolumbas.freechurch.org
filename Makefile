build:
	python build.py

watch:
	find src templates *.py | entr make build

serve:
	cd dist && python -m http.server 4001

dev-setup:
	pipenv install -d

deploy:
	netlify deploy

pay_deploy:
	cd payments && ./build.sh

ci: js-build css-build build css-opt-index

ci-setup:
	npm install -g yarn
	cd assets && yarn && cd ..

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
