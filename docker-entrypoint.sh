#!/bin/bash

echo "==> Vider le cache Symfony (prod)"
php bin/console cache:clear --env=prod --no-warmup --no-interaction || true

echo "==> Migrations base de données"
php bin/console doctrine:migrations:migrate --no-interaction --env=prod || echo "[WARN] Migrations failed, Apache starting anyway"

echo "==> Démarrage Apache"
exec apache2-foreground
