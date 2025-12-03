#!/bin/bash

# Create .env if it doesn't exist
if [ ! -f .env ]; then
    cp .env.example .env
    echo "Created .env file. Please update SECRET_KEY before running in production!"
fi

# Run the FastAPI server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
