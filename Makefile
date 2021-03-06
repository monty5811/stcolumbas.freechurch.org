VENV_NAME?=venv
VENV_ACTIVATE=. $(VENV_NAME)/bin/activate
PYTHON=${VENV_NAME}/bin/python3
PORT?=4001

.PHONY: deps-compile deps-sync watch serve deploy dev-setup pay_deploy ci ci-setup js-build js-watch css-build py-format

venv: $(VENV_NAME)/bin/activate
$(VENV_NAME)/bin/activate: requirements*.in
	# curl https://bootstrap.pypa.io/get-pip.py | python3
	test -d $(VENV_NAME) || python3 -m venv $(VENV_NAME)
	${PYTHON} -m pip install -U pip
	${PYTHON} -m pip install -U pip-tools
	make deps-sync
	touch $(VENV_NAME)/bin/activate

deps-sync:
	${VENV_NAME}/bin/pip-sync requirements.txt

deps-compile:
	${VENV_NAME}/bin/pip-compile requirements.in
	${VENV_NAME}/bin/pip-compile requirements_dev.in

build: venv
	time ${PYTHON} build.py

watch: dev-setup
	find src templates static static_gen/*.py *.py | entr make build

serve: dev-setup
	${PYTHON} server.py $(PORT)

dev-setup: venv
	${VENV_NAME}/bin/pip-sync requirements*.txt
	cd assets && yarn

deploy:
	netlify deploy

ci:
	make js-build
	make css-build
	python build.py
	make netlify-functions

ci-setup:
	npm install -g yarn
	cd assets && yarn && cd ..

js-build: assets/node_modules
	cd assets && yarn build

js-watch: assets/node_modules
	cd assets && yarn watch

css-build: assets/node_modules
	cd assets && yarn css:build

css-watch: assets/node_modules
	cd assets && find css tailwind.config.js | entr yarn css:build

py-format:
	black **/*.py

netlify-functions: assets/node_modules
	./assets/node_modules/netlify-lambda/bin/cmd.js build assets/src/netlify_functions/

local-netlify-functions: assets/node_modules
	./assets/node_modules/netlify-lambda/bin/cmd.js serve assets/src/netlify_functions/

assets/node_modules: assets/yarn.lock assets/package.json
	cd assets && yarn

percy:
	npx percy snapshot dist/
