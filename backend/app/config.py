"""Application configuration using Pydantic Settings."""
from pydantic_settings import BaseSettings
from typing import List
import os


class Settings(BaseSettings):
    """Application settings."""
    
    # API Settings
    API_HOST: str = "0.0.0.0"
    API_PORT: int = 8000
    API_RELOAD: bool = True
    
    # Supabase Configuration
    SUPABASE_URL: str
    SUPABASE_KEY: str
    SUPABASE_SERVICE_KEY: str
    
    # AI Configuration - Using Google Gemini
    GEMINI_API_KEY: str
    
    # ZYND AI Configuration (P3 AI Network)
    ZYND_AI_SEED: str = ""
    ZYND_IDENTITY_CREDENTIAL_PATH: str = "./identity_credential.json"
    ZYND_REGISTRY_URL: str = "https://registry.p3ai.network"
    ZYND_MQTT_BROKER: str = "mqtt://registry.p3ai.network:1883"
    
    # Weather APIs (Optional)
    OPENWEATHER_API_KEY: str = ""
    
    # Redis (Optional - only if using background tasks)
    REDIS_URL: str = "redis://localhost:6379"
    
    # CORS
    CORS_ORIGINS: str = "http://localhost:5173,http://localhost:3000"
    
    # Environment
    ENVIRONMENT: str = "development"
    
    class Config:
        env_file = ".env"
        case_sensitive = True
    
    @property
    def cors_origins_list(self) -> List[str]:
        """Parse CORS origins into a list."""
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",")]


# Global settings instance
settings = Settings()
