#!/bin/bash

source ~/.nvm/nvm.sh && nvm use > /dev/null 2>&1

file_path=$(jq -r '.file_path')

if [ -n "$file_path" ] && [ -f "$file_path" ]; then
  pnpx prettier -w -u "$file_path" || true
fi
