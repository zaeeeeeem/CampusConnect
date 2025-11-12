#!/bin/bash

echo "====================================="
echo "CampusConnect Frontend Setup Script"
echo "====================================="
echo ""

# Check if node is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✅ Node.js version: $(node -v)"
echo "✅ NPM version: $(npm -v)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
echo ""

npm install axios react-hook-form zod @hookform/resolvers lucide-react date-fns recharts

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Dependencies installed successfully!"
else
    echo ""
    echo "❌ Failed to install dependencies. Please check your network connection."
    exit 1
fi

# Check if .env exists, if not create from .env.example
if [ ! -f .env ]; then
    echo ""
    echo "📝 Creating .env file from .env.example..."
    cp .env.example .env
    echo "✅ .env file created. Please update it with your backend URL."
else
    echo ""
    echo "✅ .env file already exists."
fi

echo ""
echo "====================================="
echo "✅ Setup Complete!"
echo "====================================="
echo ""
echo "Next steps:"
echo "1. Update .env file with your backend URL"
echo "2. Run 'npm run dev' to start development server"
echo "3. Read DEVELOPMENT_GUIDE.md for detailed information"
echo ""
