#!/usr/bin/env bash

npm run build:prod
rsync -avz dist/* train@updis.haomo-studio.com:/home/train/www/updis/
