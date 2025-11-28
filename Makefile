.PHONY: install dev dev-front dev-back build lint test format help

PNPM ?= pnpm
PNPM_DEV ?= $(PNPM)
DOCKER_COMPOSE ?= docker compose -f infra/docker-compose.yml

ifdef USE_DOCKER
PNPM = $(DOCKER_COMPOSE) run --rm toolbox pnpm
PNPM_DEV = $(DOCKER_COMPOSE) run --rm --service-ports toolbox pnpm
endif

install:
	$(PNPM) install

dev:
	$(PNPM_DEV) dev

dev-front:
	$(PNPM_DEV) dev:front

dev-back:
	$(PNPM_DEV) dev:back

build:
	$(PNPM) build

lint:
	$(PNPM) lint

test:
	$(PNPM) test

format:
	$(PNPM) format

help:
	@echo "Cibles disponibles :"
	@echo "  install     Installe les dépendances via pnpm"
	@echo "  dev         Lance Turbo en mode dev (front + back)"
	@echo "  dev-front   Lance uniquement le front en dev"
	@echo "  dev-back    Lance uniquement le back en dev"
	@echo "  build       Construit tous les packages"
	@echo "  lint        Exécute les linters"
	@echo "  test        Exécute la suite de tests"
	@echo "  format      Formate le code avec Prettier"
