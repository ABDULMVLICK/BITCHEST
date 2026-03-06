#!/bin/bash
set -e

echo "==> Vider le cache Symfony (prod)"
php bin/console cache:clear --env=prod --no-interaction

echo "==> Migrations base de données"
php bin/console doctrine:migrations:migrate --no-interaction --env=prod

echo "==> Démarrage Apache"
exec apache2-foreground
