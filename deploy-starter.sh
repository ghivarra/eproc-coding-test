#!/bin/bash

source ~/.bashrc
composer install
npm install
cp .env.example .env
laravel artisan key:generate