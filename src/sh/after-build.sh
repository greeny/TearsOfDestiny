#!/bin/bash
cd $1
grunt build
cd src/php
composer install
php kill-server.php
php maintenance-complete.php $2
