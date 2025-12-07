#!/bin/bash

# Quick Start Script for Modern-Day De Britto
# This script will help you get the project running quickly

set -e  # Exit on error

echo "🚀 Modern-Day De Britto - Quick Start"
echo "====================================="
echo ""

# Check Node version
echo "📦 Checking Node.js version..."
if ! command -v nvm &> /dev/null; then
    echo "⚠️  NVM not found. Please install nvm first."
    exit 1
fi

nvm use 22 || {
    echo "⚠️  Node.js 22 not found. Installing..."
    nvm install 22
    nvm use 22
}

echo "✅ Using Node.js $(node -v)"
echo ""

# Install dependencies
echo "📥 Installing dependencies..."
npm install
echo "✅ Dependencies installed"
echo ""

# Check if embeddings are generated
echo "🔍 Checking embeddings status..."
EMPTY_EMBEDDINGS=$(grep -c '\"embedding\": \[\]' src/persona_vectors.json || true)

if [ "$EMPTY_EMBEDDINGS" -gt 0 ]; then
    echo "⚠️  WARNING: $EMPTY_EMBEDDINGS memory items have empty embeddings"
    echo "   RAG retrieval won't work until embeddings are generated."
    echo ""
    echo "   To generate embeddings:"
    echo "   1. cd scripts"
    echo "   2. wrangler dev"
    echo "   3. In another terminal: curl -X POST http://localhost:8787 > persona_vectors_updated.json"
    echo "   4. Replace src/persona_vectors.json with the generated file"
    echo ""
else
    echo "✅ All embeddings are populated"
fi

# Start dev server
echo "🌟 Starting development server..."
echo "   Press Ctrl+C to stop"
echo ""
echo "📍 Endpoints:"
echo "   Health check: http://localhost:8787"
echo "   Chat API:     POST http://localhost:8787 with JSON body"
echo ""

npm run dev
