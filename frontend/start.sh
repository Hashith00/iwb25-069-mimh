#!/bin/bash

echo "Starting Green Proxy Frontend Dashboard..."
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
    echo ""
fi

echo "Starting development server on http://localhost:3001"
echo ""
echo "Make sure the Green Proxy backend is running on port 8080"
echo ""

npm run dev
