"""Supabase database client and utilities."""
from supabase import create_client, Client
from app.config import settings
from typing import Optional
import logging

logger = logging.getLogger(__name__)


class SupabaseDB:
    """Supabase database wrapper."""
    
    def __init__(self):
        self._client: Optional[Client] = None
        self._service_client: Optional[Client] = None
    
    @property
    def client(self) -> Client:
        """Get Supabase client with anon key (for user operations)."""
        if self._client is None:
            self._client = create_client(
                settings.SUPABASE_URL,
                settings.SUPABASE_KEY
            )
            logger.info("Supabase client initialized")
        return self._client
    
    @property
    def service_client(self) -> Client:
        """Get Supabase client with service role key (for admin operations)."""
        if self._service_client is None:
            self._service_client = create_client(
                settings.SUPABASE_URL,
                settings.SUPABASE_SERVICE_KEY
            )
            logger.info("Supabase service client initialized")
        return self._service_client


# Global database instance
db = SupabaseDB()


# Helper functions
def get_db_client() -> Client:
    """Get database client for dependency injection."""
    return db.client


def get_service_client() -> Client:
    """Get service client for admin operations."""
    return db.service_client
