ARGUMENTS = $(filter-out $@,$(MAKECMDGOALS))
WATCHEXEC_WRITTEN_PATH = true
ISLANDS_ADMIN = $(shell find src/pages/admin -name '*.island.*')
ISLANDS_PUBLIC = $(shell find src/pages -not -path '*/admin/*' -name '*.island.*')

default: help

# Bundle

bundle-admin: ## Bundle admin
	esbuild $(ISLANDS_ADMIN) \
		--bundle \
		--target=es2020 \
		--format=esm \
		--jsx-factory=h \
		--jsx-fragment=Fragment \
		--minify=true \
		--legal-comments=none \
		--sourcemap=inline \
		--splitting \
		--entry-names=admin/[dir]/[name] \
		--chunk-names=admin/cache/[name]-[hash] \
		--public-path=/_/asset/dist/ \
		--outdir=dist \
		--log-level=error

bundle-public: ## Bundle public
	esbuild $(ISLANDS_PUBLIC) \
		--bundle \
		--target=es2020 \
		--format=esm \
		--jsx-factory=h \
		--jsx-fragment=Fragment \
		--minify=true \
		--legal-comments=none \
		--sourcemap=inline \
		--splitting \
		--entry-names=[dir]/[name] \
		--chunk-names=cache/[name]-[hash] \
		--public-path=/_/asset/ \
		--outdir=dist \
		--log-level=error

bundle-styles: ## Bundle styles
	node_modules/.bin/tailwindcss -i ./src/styles.css -o ./dist/styles.css --minify

# Clean

clean: ## Get a fresh start
	@echo "Cleaning..."
	rm -rf .query/.cache & \
	rm -rf dist & \
	sqlite3 .dbs/query_asset.sql "DELETE from asset" & \
	sqlite3 .dbs/query_function.sql "DELETE from function"

# Deploy

_dbundle:
	@start=$$(date +%s%N); \
	make bundle-admin -s & \
	make bundle-public -s; \
	end=$$(date +%s%N); \
	echo "- Bundled: $$(( (end-start)/1000000 ))ms"

_dtailwindcss:
	@start=$$(date +%s%N); \
	make bundle-styles -s; \
	end=$$(date +%s%N); \
	echo "- Styles created: $$(( (end-start)/1000000 ))ms"

_dasset:
	@start=$$(date +%s%N); \
	query asset dist & \
	query asset public; \
	end=$$(date +%s%N); \
	echo "- Assets updated: $$(( (end-start)/1000000 ))ms"

_dfunction:
	@start=$$(date +%s%N); \
	query function ; \
	end=$$(date +%s%N); \
	echo "- Functions updated: $$(( (end-start)/1000000 ))ms"

deploy: ## Deploy to the cloud
	@echo "Deploying..."
	make _dbundle -s
	make _dtailwindcss -s
	make _dasset -s
	make _dfunction -s

# Help

help: echo-bun ## Show this help
	@echo 'usage: make [target]'
	@echo
	@echo 'Targets:'
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

# Hurl

.PHONY: hurl
hurl:
	hurl --verbose --continue-on-error --variables-file hurl/.env $(ARGUMENTS)

hurl-test:
	hurl --test --continue-on-error --variables-file hurl/.env $(ARGUMENTS)

hurl-test-all:
	hurl --test --continue-on-error --variables-file hurl/.env hurl/**/*.hurl hurl/**/**/*.hurl

# Install

install-query-server: ## Install query-server
	curl --proto '=https' --tlsv1.2 -LsSf https://github.com/gc-victor/query/releases/latest/download/query-server-installer.sh | sh

install-query: ## Install query
	curl --proto '=https' --tlsv1.2 -LsSf https://github.com/gc-victor/query/releases/latest/download/query-installer.sh | sh

install-hurl: ## Install hurl (https://hurl.dev)
	@echo "Please, check https://hurl.dev/docs/installation.html"

# More options to install watchexec-cli: https://github.com/watchexec/watchexec/blob/main/doc/packages.md
install-watchexec: ## Install watchexec (https://crates.io/crates/watchexec-cli#installation)
	cargo install watchexec-cli

# Server

server: ## Run query-server
	RUST_LOG=info query-server -q | bunyan

# Watch

_wbundle:
	@start=$$(date +%s%N); \
	make bundle-admin -s & \
	make bundle-public -s; \
	end=$$(date +%s%N); \
	echo "- Bundled: $$(( (end-start)/1000000 ))ms"

_wasset:
	@start=$$(date +%s%N); \
	query asset dist > /dev/null 2>&1 & \
	query asset public > /dev/null 2>&1; \
	end=$$(date +%s%N); \
	echo "- Assets updated: $$(( (end-start)/1000000 ))ms"

_wtailwindcss:
	@start=$$(date +%s%N); \
	node_modules/.bin/tailwindcss -i ./src/pages/styles.css -o ./dist/styles.css > /dev/null 2>&1 && \
	query asset dist/styles.css > /dev/null 2>&1; \
	end=$$(date +%s%N); \
	echo "- Styles updated: $$(( (end-start)/1000000 ))ms"

_wfunction:
	@start=$$(date +%s%N); \
	query function > /dev/null ; \
	end=$$(date +%s%N); \
	echo "- Functions updated: $$(( (end-start)/1000000 ))ms"

watch: ## Watch for changes and bundle
	make clean
	@echo "Watching for changes..."
	watchexec \
		--debounce 500 \
		--restart \
		--stop-timeout 0 \
		-w src/ \
        "echo ; \
		 make _wbundle \
		 & make _wtailwindcss \
		 && make _wasset \
		 && make _wfunction"

# catch anything and do nothing
%:
	@:
