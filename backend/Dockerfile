FROM php:8.1-fpm

RUN apt update \
    && apt install -y zlib1g-dev g++ git libicu-dev zip libzip-dev zip \
    && docker-php-ext-install intl opcache pdo pdo_mysql \
    && pecl install apcu \
    && docker-php-ext-enable apcu \
    && docker-php-ext-configure zip \
    && docker-php-ext-install zip

WORKDIR /var/www/backend

RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

COPY . .

RUN usermod -u 1000 www-data
RUN groupmod -g 1000 www-data

RUN composer install
RUN composer clear-cache

# TODO: create the private and public keys for oauth, chmod on them
# php bin/console league:oauth2-server:create-client --grant-type=password --grant-type=refresh_token app

CMD ["php-fpm"]
