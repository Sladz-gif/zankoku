#!/bin/bash
echo "========================================"
echo "   ZANKOKU - DEV MODE"
echo "========================================"
echo ""

# Navigate to project directory
cd /c/Users/USER/Desktop/zankoku-main

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed!"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "ERROR: npm is not installed!"
    echo "Please install npm from https://nodejs.org/"
    exit 1
fi

echo "✓ Node.js detected: $(node --version)"
echo "✓ npm detected: $(npm --version)"
echo ""

# Install dependencies
echo "Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✓ Dependencies installed successfully!"
else
    echo "ERROR: Failed to install dependencies!"
    exit 1
fi

echo ""
echo "Starting development server..."
echo "Server will be available at: http://localhost:5173"
echo "Press Ctrl+C to stop the server"
echo ""

# Start the dev server
npm run dev
