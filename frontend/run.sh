#!/bin/bash

# Create .env.local if it doesn't exist
if [ ! -f .env.local ]; then
    cp .env.local.example .env.local
    echo "Created .env.local file"
fi

# Run the Next.js development server
npm run dev
