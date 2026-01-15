#!/usr/bin/env python
"""
Quick setup script for Flood Resilience Network Backend
"""
import os
import sys
import subprocess

def check_python_version():
    """Check if Python version is 3.10+"""
    if sys.version_info < (3, 10):
        print("❌ Python 3.10+ is required")
        sys.exit(1)
    print("✅ Python version OK")

def create_env_file():
    """Create .env from template if it doesn't exist"""
    if not os.path.exists('.env'):
        if os.path.exists('.env.example'):
            print("📝 Creating .env from template...")
            subprocess.run(['copy' if os.name == 'nt' else 'cp', '.env.example', '.env'])
            print("⚠️  Please edit .env with your credentials")
        else:
            print("❌ .env.example not found")
            sys.exit(1)
    else:
        print("✅ .env file exists")

def install_dependencies():
    """Install Python dependencies"""
    print("📦 Installing dependencies...")
    subprocess.run([sys.executable, '-m', 'pip', 'install', '-r', 'requirements.txt'])
    print("✅ Dependencies installed")

def main():
    print("=" * 50)
    print("🌊 Flood Resilience Network - Backend Setup")
    print("=" * 50)
    
    check_python_version()
    create_env_file()
    
    install_deps = input("\n📦 Install dependencies? (y/n): ")
    if install_deps.lower() == 'y':
        install_dependencies()
    
    print("\n" + "=" * 50)
    print("✅ Setup Complete!")
    print("=" * 50)
    print("\n📋 Next steps:")
    print("1. Edit .env with your Supabase and OpenAI credentials")
    print("2. Execute supabase_schema.sql in your Supabase SQL Editor")
    print("3. Run: uvicorn app.main:app --reload")
    print("4. Visit: http://localhost:8000/docs")
    print("\n🚀 Happy coding!")

if __name__ == "__main__":
    main()
