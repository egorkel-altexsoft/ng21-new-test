#!/bin/bash

cmd=$(jq -r '.tool_input.command')

if echo "$cmd" | grep -qE '^npm(\s|$)'; then
  echo '{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"deny","permissionDecisionReason":"Use pnpm instead of npm in this project."}}'
fi
