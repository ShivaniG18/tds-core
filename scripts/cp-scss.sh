#!/bin/sh

mkdir -p dist/scss

cp src/scss/settings/_variables.scss dist/scss/
cp src/scss/utility/{_helpers,_mixins}.scss dist/scss/