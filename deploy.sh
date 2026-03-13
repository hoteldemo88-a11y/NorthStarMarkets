#!/bin/bash

# =============================================
# NorthStarMarkets Deployment Script
# =============================================

set -e

PROJECT_DIR="/var/www/NorthStarMarkets"
BACKEND_DIR="$PROJECT_DIR/backend"
FRONTEND_DIR="$PROJECT_DIR/frontend"
PM2_NAME="northstar-backend"

echo "=========================================="
echo "🚀 Starting deployment at $(date)"
echo "=========================================="

# Navigate to project directory
cd "$PROJECT_DIR"

# Pull latest code from GitHub
echo "📦 Pulling latest code from GitHub..."
git fetch origin main
git reset --hard origin/main

# Recreate frontend .env (not tracked in git)
echo "VITE_API_URL=/api" > "$FRONTEND_DIR/.env"

# Install backend dependencies if node_modules doesn't exist
if [ ! -d "$BACKEND_DIR/node_modules" ]; then
    echo "📥 Installing backend dependencies..."
    cd "$BACKEND_DIR"
    npm install
fi

# Install frontend dependencies if node_modules doesn't exist
if [ ! -d "$FRONTEND_DIR/node_modules" ]; then
    echo "📥 Installing frontend dependencies..."
    cd "$FRONTEND_DIR"
    npm install
fi

# Build frontend
echo "🔨 Building frontend..."
cd "$FRONTEND_DIR"
npm run build
chown -R www-data:www-data dist

# Restart backend with PM2 (zero downtime)
echo "🔄 Restarting backend with PM2..."
pm2 delete "$PM2_NAME" 2>/dev/null || true
cd "$BACKEND_DIR"
pm2 start src/index.js --name "$PM2_NAME"
pm2 save

# Wait a moment and check status
sleep 2
pm2 status

echo "=========================================="
echo "✅ Deployment completed at $(date)"
echo "=========================================="
