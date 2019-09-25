This is the public repo for [St Columba's Free
Church](https://stcolumbas.freechurch.org).

* Hosting: Netlify (the giving form makes use of Netlify Functions to talk to the Stripe API)
* Site builder: Custom static site generator written in python
* CSS: Tailwind
* CMS: NetlifyCMS

## setup

* Install `python3.7`, `make`, `entr`, `node` and `yarn`
* Run `make dev-setup` to setup your environment

## building the site

* `make serve` will launch a webserver that rebuld the site & reloads your
  browser on change
* `make build` does a fresh build
* `make ci-setup ci` is run by Netlify at build time
* see the `Makefile` for other tasks
