"""API routes."""
from app.api.predictions import router as predictions_router
from app.api.incidents import router as incidents_router
from app.api.alerts import router as alerts_router
from app.api.websocket import router as websocket_router

__all__ = [
    "predictions_router",
    "incidents_router",
    "alerts_router",
    "websocket_router",
]
