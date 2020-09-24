#!/bin/bash

BRANCH=$(git rev-parse --abbrev-ref HEAD)

npm run bundle
npm run compress

git add -u .
git add .
git status
git commit -m "$1"
git push origin $BRANCH