# ── Stage 1 : build des assets React/Tailwind avec Node ──────────────────────
FROM node:20-alpine AS node-builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY webpack.config.js postcss.config.js ./
COPY assets/ assets/

RUN npm run build

# ── Stage 2 : image PHP + Apache pour Symfony ─────────────────────────────────
FROM php:8.4-apache

# Extensions PHP nécessaires pour Symfony + Doctrine + MySQL
RUN apt-get update && apt-get install -y \
    libicu-dev \
    libzip-dev \
    zip \
    unzip \
    git \
    && docker-php-ext-install \
        pdo \
        pdo_mysql \
        intl \
        zip \
        opcache \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Apache : pointer vers public/ et activer mod_rewrite + AllowOverride
RUN a2enmod rewrite && \
    sed -ri 's!/var/www/html!/var/www/html/public!g' /etc/apache2/sites-available/000-default.conf && \
    sed -i 's/AllowOverride None/AllowOverride All/g' /etc/apache2/apache2.conf

WORKDIR /var/www/html

# Copier le code source
COPY . .

# Copier les assets compilés depuis le stage Node
COPY --from=node-builder /app/public/build public/build/

# Dépendances PHP (prod uniquement)
RUN composer install --no-dev --optimize-autoloader --no-interaction --no-scripts

# Script de démarrage
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 80

ENTRYPOINT ["docker-entrypoint.sh"]
