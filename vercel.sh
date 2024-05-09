#!/bin/bash

pnpm run build

if [[ $VERCEL_ENV == "production"  ]] ; then
  echo "Running database migrations..."
  pnpm run db:migrate
fi
