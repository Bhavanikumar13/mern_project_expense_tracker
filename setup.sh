#!/bin/bash

echo "========================================"
echo "  Expense Tracker - Quick Setup"
echo "========================================"
echo ""

echo "[1/4] Installing backend dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "Error installing backend dependencies!"
    exit 1
fi

echo ""
echo "[2/4] Installing frontend dependencies..."
cd client
npm install
if [ $? -ne 0 ]; then
    echo "Error installing frontend dependencies!"
    exit 1
fi
cd ..

echo ""
echo "[3/4] Creating environment file..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo ".env file created! Please update it with your settings."
else
    echo ".env file already exists."
fi

echo ""
echo "[4/4] Setup complete!"
echo ""
echo "========================================"
echo "  Setup Instructions:"
echo "========================================"
echo "1. Update .env file with your MongoDB URI and other settings"
echo "2. Make sure MongoDB is running"
echo "3. Run 'npm run dev' to start backend"
echo "4. Run 'npm run client' to start frontend"
echo "5. Or run 'npm run dev-all' to start both"
echo ""
echo "========================================"
echo "  Useful Commands:"
echo "========================================"
echo "- npm run dev       : Start backend only"
echo "- npm run client    : Start frontend only"
echo "- npm run dev-all   : Start both"
echo "========================================"
echo ""
