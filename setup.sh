#!/bin/bash

# Angular Boons Project Setup Script
echo "🦈 Setting up Angular Boons project..."

# Source nvm if it exists
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

# Check if nvm is available after sourcing
if ! type nvm &> /dev/null; then
    echo "❌ nvm is not installed or not properly configured. Please install nvm first:"
    echo "   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash"
    echo "   Then restart your terminal or run: source ~/.bashrc (or ~/.zshrc)"
    exit 1
fi

# Use the correct Node.js version
echo "🔄 Switching to Node.js version specified in .nvmrc..."
nvm use 22

# Check if correct version is active
NODE_VERSION=$(node --version)
EXPECTED_VERSION=$(cat .nvmrc)
if [[ $NODE_VERSION == v${EXPECTED_VERSION}* ]]; then
    echo "✅ Node.js $NODE_VERSION is active"
else
    echo "⚠️  Warning: Expected Node.js v${EXPECTED_VERSION}.x, but got $NODE_VERSION"
fi

# Check if Angular CLI is installed
if ! command -v ng &> /dev/null; then
    echo "📦 Installing Angular CLI globally..."
    npm install -g @angular/cli@latest
else
    NG_VERSION=$(ng version 2>/dev/null | grep "Angular CLI" | cut -d: -f2 | tr -d ' ')
    echo "✅ Angular CLI is already installed ($NG_VERSION)"
fi

# Install project dependencies
echo "📦 Installing project dependencies..."
npm install

echo "🎉 Setup complete! You can now run:"
echo "   npm start    - Start development server"
echo "   npm run build - Build for production"
echo "   ng serve --open - Start dev server and open browser"
echo ""
echo "💡 Pro tip: The .nvmrc file will automatically use Node.js $(cat .nvmrc)"
echo "   Just run 'nvm use' in this directory anytime!"