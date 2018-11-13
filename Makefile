build:
	python build.py

watch:
	find src templates static_gen/*.py *.py | entr make build

serve:
	python server.py

dev-setup:
	pipenv install -d

deploy:
	netlify deploy

pay_deploy:
	cd payments && ./build.sh

ci: js-build css-build build

ci-setup:
	npm install -g yarn
	cd assets && yarn && cd ..

js-build:
	cd assets && yarn build

js-watch:
	cd assets && yarn watch

css-build:
	cd assets && yarn css:build

py-format:
	black **/*.py
