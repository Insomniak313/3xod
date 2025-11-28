.PHONY: install dev dev-front dev-back build lint test format help

PNPM ?= pnpm

install:
	$(PNPM) install

dev:
	$(PNPM) dev

dev-front:
	$(PNPM) dev:front

dev-back:
	$(PNPM) dev:back

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
