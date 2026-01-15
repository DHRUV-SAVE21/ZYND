"""
Generate secure random keys for ZYND deployment.
Run this script to generate SECRET_KEY and JWT_SECRET_KEY.
"""

import secrets

print("=" * 60)
print("🔐 ZYND Secure Key Generator")
print("=" * 60)
print()
print("Copy these values to your Railway environment variables:")
print()
print("-" * 60)
print(f"SECRET_KEY={secrets.token_urlsafe(32)}")
print(f"JWT_SECRET_KEY={secrets.token_urlsafe(32)}")
print("-" * 60)
print()
print("⚠️  IMPORTANT:")
print("   - Never commit these keys to git")
print("   - Use different keys for production and development")
print("   - Store securely in Railway/Vercel dashboard")
print()
print("=" * 60)
