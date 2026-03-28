#!/bin/bash

INPUT=$(cat)
cmd=$(echo "$INPUT" | jq -r '.tool_input.command')

if echo "$cmd" | grep -qE '(^|\s|&&|\|\||;)(pnpm|node|npx)(\s|$)'; then
  escaped_cmd=$(echo "$cmd" | sed "s/'/'\\\\''/g")
  jq -n --arg cmd "source ~/.nvm/nvm.sh && nvm use && ${cmd}" '{
    "hookSpecificOutput": {
      "hookEventName": "PreToolUse",
      "permissionDecision": "allow",
      "updatedInput": {
        "command": $cmd
      }
    }
  }'
fi
