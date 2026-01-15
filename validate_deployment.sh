#!/bin/bash

# ZYND Pre-Deployment Validator
# Run this script before deploying to check everything is ready

echo "🔍 ZYND Pre-Deployment Validator"
echo "=================================="
echo ""

# Check if in ZYND directory
if [ ! -f "DEPLOYMENT_GUIDE.md" ]; then
    echo "❌ Error: Run this script from ZYND root directory"
    exit 1
fi

echo "✅ Running from ZYND directory"
echo ""

# Check backend files
echo "📦 Checking Backend Files..."
if [ -f "backend/requirements.txt" ]; then
    echo "  ✅ requirements.txt found"
else
    echo "  ❌ requirements.txt missing"
    exit 1
fi

if [ -f "backend/railway.json" ]; then
    echo "  ✅ railway.json found"
else
    echo "  ❌ railway.json missing"
    exit 1
fi

if [ -f "backend/Procfile" ]; then
    echo "  ✅ Procfile found"
else
    echo "  ❌ Procfile missing"
    exit 1
fi

if [ -f "backend/.env.railway.template" ]; then
    echo "  ✅ .env.railway.template found"
else
    echo "  ❌ .env.railway.template missing"
    exit 1
fi

echo ""

# Check frontend files
echo "🎨 Checking Frontend Files..."
if [ -f "frontend/package.json" ]; then
    echo "  ✅ package.json found"
else
    echo "  ❌ package.json missing"
    exit 1
fi

if [ -f "frontend/vercel.json" ]; then
    echo "  ✅ vercel.json found"
else
    echo "  ❌ vercel.json missing"
    exit 1
fi

if [ -f "frontend/.env.vercel.template" ]; then
    echo "  ✅ .env.vercel.template found"
else
    echo "  ❌ .env.vercel.template missing"
    exit 1
fi

echo ""

# Check documentation
echo "📚 Checking Documentation..."
if [ -f "DEPLOYMENT_GUIDE.md" ]; then
    echo "  ✅ DEPLOYMENT_GUIDE.md found"
else
    echo "  ❌ DEPLOYMENT_GUIDE.md missing"
fi

if [ -f "DEPLOY_NOW.md" ]; then
    echo "  ✅ DEPLOY_NOW.md found"
else
    echo "  ❌ DEPLOY_NOW.md missing"
fi

echo ""

# Check git status
echo "🔄 Checking Git Status..."
if [ -d ".git" ]; then
    echo "  ✅ Git repository initialized"
    
    # Check if there are uncommitted changes
    if [ -n "$(git status --porcelain)" ]; then
        echo "  ⚠️  Warning: You have uncommitted changes"
        echo "     Commit and push before deploying!"
    else
        echo "  ✅ No uncommitted changes"
    fi
else
    echo "  ❌ Not a git repository"
    echo "     Run: git init && git add . && git commit -m 'Initial commit'"
    exit 1
fi

echo ""

# Check for sensitive files
echo "🔒 Checking for Sensitive Files..."
if [ -f "backend/.env" ]; then
    echo "  ⚠️  Warning: backend/.env found"
    echo "     Make sure it's in .gitignore!"
fi

if [ -f "frontend/.env" ]; then
    echo "  ⚠️  Warning: frontend/.env found"
    echo "     Make sure it's in .gitignore!"
fi

if [ -f "backend/identity_credential.json" ]; then
    echo "  ⚠️  Warning: identity_credential.json found"
    echo "     Make sure it's in .gitignore!"
fi

echo ""

# Summary
echo "=================================="
echo "✅ Pre-Deployment Check Complete!"
echo "=================================="
echo ""
echo "📋 Next Steps:"
echo "   1. Commit and push to GitHub (if not done)"
echo "   2. Deploy backend to Railway"
echo "   3. Deploy frontend to Vercel"
echo "   4. Update CORS_ORIGINS in Railway"
echo ""
echo "📚 See DEPLOY_NOW.md for detailed instructions"
echo ""
