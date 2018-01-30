format:
	yapf -ir **/*.py

build:
	python build.py

watch:
	find src templates *.py | entr make build

serve:
	cd dist && python -m http.server 4001

deploy:
	netlify deploy

pay_build_form:
	cd payments/elm/ && yarn build

pay_deploy_backend:
	cd payments && ./build.sh

ci: pay_build_form build deploy
