#!/bin/sh
echo ---------------------------------------
echo Deployment Start - Development
echo ---------------------------------------
echo Building and Deploying Heimdall Frontend
echo ---------------------------------------
docker-compose -p heimdall-frontend-dev -f docker-compose.dev.yml up -d --build --remove-orphans
echo
echo ---------------------------------------
echo Conntainer Status:
echo ---------------------------------------
docker ps | grep 'heimdall-frontend'