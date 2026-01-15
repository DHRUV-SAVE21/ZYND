# ZYND Pre-Deployment Validator (PowerShell)
# Run this script before deploying to check everything is ready

Write-Host "🔍 ZYND Pre-Deployment Validator" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Check if in ZYND directory
if (-Not (Test-Path "DEPLOYMENT_GUIDE.md")) {
    Write-Host "❌ Error: Run this script from ZYND root directory" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Running from ZYND directory" -ForegroundColor Green
Write-Host ""

# Check backend files
Write-Host "📦 Checking Backend Files..." -ForegroundColor Yellow

$backendFiles = @{
    "backend/requirements.txt" = "requirements.txt"
    "backend/railway.json" = "railway.json"
    "backend/Procfile" = "Procfile"
    "backend/.env.railway.template" = ".env.railway.template"
}

foreach ($file in $backendFiles.Keys) {
    if (Test-Path $file) {
        Write-Host "  ✅ $($backendFiles[$file]) found" -ForegroundColor Green
    } else {
        Write-Host "  ❌ $($backendFiles[$file]) missing" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""

# Check frontend files
Write-Host "🎨 Checking Frontend Files..." -ForegroundColor Yellow

$frontendFiles = @{
    "frontend/package.json" = "package.json"
    "frontend/vercel.json" = "vercel.json"
    "frontend/.env.vercel.template" = ".env.vercel.template"
}

foreach ($file in $frontendFiles.Keys) {
    if (Test-Path $file) {
        Write-Host "  ✅ $($frontendFiles[$file]) found" -ForegroundColor Green
    } else {
        Write-Host "  ❌ $($frontendFiles[$file]) missing" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""

# Check documentation
Write-Host "📚 Checking Documentation..." -ForegroundColor Yellow

$docFiles = @("DEPLOYMENT_GUIDE.md", "DEPLOY_NOW.md", "ARCHITECTURE.md")

foreach ($file in $docFiles) {
    if (Test-Path $file) {
        Write-Host "  ✅ $file found" -ForegroundColor Green
    } else {
        Write-Host "  ❌ $file missing" -ForegroundColor Yellow
    }
}

Write-Host ""

# Check git status
Write-Host "🔄 Checking Git Status..." -ForegroundColor Yellow

if (Test-Path ".git") {
    Write-Host "  ✅ Git repository initialized" -ForegroundColor Green
    
    # Check if there are uncommitted changes
    $gitStatus = git status --porcelain
    if ($gitStatus) {
        Write-Host "  ⚠️  Warning: You have uncommitted changes" -ForegroundColor Yellow
        Write-Host "     Commit and push before deploying!" -ForegroundColor Yellow
    } else {
        Write-Host "  ✅ No uncommitted changes" -ForegroundColor Green
    }
} else {
    Write-Host "  ❌ Not a git repository" -ForegroundColor Red
    Write-Host "     Run: git init && git add . && git commit -m 'Initial commit'" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Check for sensitive files
Write-Host "🔒 Checking for Sensitive Files..." -ForegroundColor Yellow

$sensitiveFiles = @(
    "backend/.env",
    "frontend/.env",
    "backend/identity_credential.json"
)

$foundSensitive = $false
foreach ($file in $sensitiveFiles) {
    if (Test-Path $file) {
        Write-Host "  ⚠️  Warning: $file found" -ForegroundColor Yellow
        Write-Host "     Make sure it's in .gitignore!" -ForegroundColor Yellow
        $foundSensitive = $true
    }
}

if (-Not $foundSensitive) {
    Write-Host "  ✅ No sensitive files in repository" -ForegroundColor Green
}

Write-Host ""

# Generate secure keys
Write-Host "🔐 Generate Secure Keys..." -ForegroundColor Yellow
Write-Host "  Run: python generate_keys.py" -ForegroundColor White
Write-Host ""

# Summary
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "✅ Pre-Deployment Check Complete!" -ForegroundColor Green
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor Yellow
Write-Host "   1. Generate secure keys: python generate_keys.py" -ForegroundColor White
Write-Host "   2. Commit and push to GitHub (if not done)" -ForegroundColor White
Write-Host "   3. Deploy backend to Railway" -ForegroundColor White
Write-Host "   4. Deploy frontend to Vercel" -ForegroundColor White
Write-Host "   5. Update CORS_ORIGINS in Railway" -ForegroundColor White
Write-Host ""
Write-Host "📚 See DEPLOY_NOW.md for detailed instructions" -ForegroundColor Cyan
Write-Host ""
