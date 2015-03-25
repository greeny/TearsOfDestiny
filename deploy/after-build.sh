#!/bin/bash
cd $1
grunt build
cd server
composer install
php kill-server.php
cd ../deploy
php maintenance-complete.php $2
