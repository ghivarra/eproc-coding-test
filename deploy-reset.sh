#!/bin/bash

source ~/.bashrc
php artisan db:wipe
php artisan migrate:fresh
php artisan db:seed DatabaseSeeder