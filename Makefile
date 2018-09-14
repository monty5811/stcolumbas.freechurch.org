build:
	time python build.py

watch:
	find src templates static_gen/*.py *.py | entr make build

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
	cd assets && time yarn && cd ..

js-build:
	cd assets && time yarn build

js-watch:
	cd assets && yarn watch

css-build:
	cd assets && time yarn css:build

css-opt-index:
	cd assets && time yarn css:opt-index

py-format:
	black **/*.py
