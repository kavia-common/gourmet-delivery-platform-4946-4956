#!/bin/bash
cd /home/kavia/workspace/code-generation/gourmet-delivery-platform-4946-4956/express_backend
npm run lint
LINT_EXIT_CODE=$?
if [ $LINT_EXIT_CODE -ne 0 ]; then
  exit 1
fi

