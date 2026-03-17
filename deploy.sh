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

# Create backend .env from environment variables
# Set these on your server before deploying:
# export DB_PASSWORD="your_db_password"
# export SMTP_PASS="your_smtp_password"
# export JWT_SECRET="your_jwt_secret"
# export CLOUDINARY_API_SECRET="your_cloudinary_secret"

cat > "$BACKEND_DIR/.env" << EOF
PORT=5000
JWT_SECRET=${JWT_SECRET:-change_this_to_secure_secret}
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=${DB_PASSWORD:-root}
MYSQL_DATABASE=north_star_markets
ADMIN_EMAIL=admin@northstarmarkets.com
ADMIN_PASSWORD=Admin@12345
CLOUDINARY_CLOUD_NAME=dchjy0hvk
CLOUDINARY_API_KEY=373115673631775
CLOUDINARY_API_SECRET=${CLOUDINARY_API_SECRET:-change_this}
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_USER=mailer@northstarmarketsint.com
SMTP_PASS=${SMTP_PASS:-change_this}
SMTP_FROM=North Star Markets <mailer@northstarmarketsint.com>
FRONTEND_URL=https://northstarmarketsint.com
EMAIL_LOGO_URL=https://northstarmarketsint.com/nortstar.png
EOF

# Install backend dependencies (always update to get latest packages)
echo "📥 Installing backend dependencies..."
cd "$BACKEND_DIR"
npm install

# Install frontend dependencies
echo "📥 Installing frontend dependencies..."
cd "$FRONTEND_DIR"
npm install

# Build frontend
echo "🔨 Building frontend..."
cd "$FRONTEND_DIR"
rm -rf dist
npm run build
chown -R www-data:www-data dist

# Restart backend with PM2 (zero downtime)
echo "🔄 Restarting backend with PM2..."
cd "$BACKEND_DIR"

# Stop existing PM2 process
pm2 stop "$PM2_NAME" 2>/dev/null || true
pm2 delete "$PM2_NAME" 2>/dev/null || true

# Start fresh
pm2 start src/index.js --name "$PM2_NAME" --watch
pm2 save

# Wait a moment and check status
sleep 2
pm2 status

echo "=========================================="
echo "✅ Deployment completed at $(date)"
echo "=========================================="
