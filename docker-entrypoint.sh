#!/bin/bash

echo "==> Vider le cache Symfony (prod)"
php bin/console cache:clear --env=prod --no-warmup --no-interaction || true

echo "==> Migrations base de données"
php bin/console doctrine:migrations:migrate --no-interaction --env=prod || echo "[WARN] Migrations failed, continuing"

echo "==> Démarrage du serveur PHP sur le port 80"
exec php -S 0.0.0.0:80 -t public/
