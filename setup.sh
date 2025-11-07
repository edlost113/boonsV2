#!/bin/bash

# Angular Boons Project Setup Script
echo "🦈 Setting up Angular Boons project..."

# Check if nvm is installed
if ! command -v nvm &> /dev/null; then
    echo "❌ nvm is not installed. Please install nvm first:"
    echo "   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash"
    exit 1
fi

# Use the correct Node.js version
echo "🔄 Switching to Node.js version 22..."
nvm use

# Check if correct version is active
NODE_VERSION=$(node --version)
if [[ $NODE_VERSION == v22* ]]; then
    echo "✅ Node.js $NODE_VERSION is active"
else
    echo "⚠️  Warning: Expected Node.js v22.x, but got $NODE_VERSION"
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

echo "🎉 Setup complete! You can now run:"
echo "   npm start    - Start development server"
echo "   npm run build - Build for production"
echo ""
echo "💡 Pro tip: The .nvmrc file will automatically use Node.js 22"
echo "   Just run 'nvm use' in this directory anytime!"