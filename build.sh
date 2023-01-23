#!/bin/sh

sudo docker compose cp frontend:/usr/src/app/node_modules ./frontend
sudo docker compose cp backend:/var/www/backend/vendor/ ./backend

#docker compose exec backend php bin/console do:mi:mi -n
#docker compose exec backend php bin/console league:oauth2-server:create-client --grant-type=password --grant-type=refresh_token app
