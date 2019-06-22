#!/bin/sh
now="npx now --debug --token=$NOW_TOKEN"

echo "$ now rm --safe --yes weekly-digest"
$now rm --safe --yes weekly-digest

echo "$ now --public"
$now --public

echo "$ now alias"
$now alias
