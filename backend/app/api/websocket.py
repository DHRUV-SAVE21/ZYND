"""WebSocket endpoints for real-time updates."""
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import List, Dict
import json
import logging

logger = logging.getLogger(__name__)

router = APIRouter()


class ConnectionManager:
    """Manage WebSocket connections."""
    
    def __init__(self):
        self.active_connections: List[WebSocket] = []
    
    async def connect(self, websocket: WebSocket):
        """Accept new WebSocket connection."""
        await websocket.accept()
        self.active_connections.append(websocket)
        logger.info(f"New WebSocket connection. Total: {len(self.active_connections)}")
    
    def disconnect(self, websocket: WebSocket):
        """Remove disconnected WebSocket."""
        self.active_connections.remove(websocket)
        logger.info(f"WebSocket disconnected. Total: {len(self.active_connections)}")
    
    async def send_personal_message(self, message: dict, websocket: WebSocket):
        """Send message to specific connection."""
        await websocket.send_json(message)
    
    async def broadcast(self, message: dict):
        """Broadcast message to all connections."""
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except Exception as e:
                logger.error(f"Failed to send message: {str(e)}")


# Global connection manager
manager = ConnectionManager()


@router.websocket("/ws/dashboard")
async def websocket_dashboard(websocket: WebSocket):
    """
    WebSocket endpoint for real-time crisis dashboard updates.
    
    Messages:
    - INITIAL_STATE: Send all active incidents
    - NEW_INCIDENT: Broadcast new incident
    - INCIDENT_UPDATE: Broadcast incident status change
    - PREDICTION_UPDATE: Broadcast new prediction
    """
    await manager.connect(websocket)
    
    try:
        # Send initial state
        from app.database import get_service_client
        supabase = get_service_client()
        
        # Fetch active incidents
        incidents_result = supabase.table('incidents')\
            .select('*')\
            .in_('status', ['active', 'responding'])\
            .execute()
        
        # Fetch available resources
        resources_result = supabase.table('resources')\
            .select('*')\
            .eq('status', 'available')\
            .limit(20)\
            .execute()
        
        await manager.send_personal_message({
            'type': 'INITIAL_STATE',
            'active_crises': incidents_result.data if incidents_result.data else [],
            'resources': resources_result.data if resources_result.data else []
        }, websocket)
        
        # Listen for messages
        while True:
            data = await websocket.receive_text()
            message = json.loads(data)
            
            # Handle different message types
            if message.get('type') == 'PING':
                await manager.send_personal_message({'type': 'PONG'}, websocket)
            elif message.get('type') == 'REQUEST_UPDATE':
                # Send latest data
                incidents_result = supabase.table('incidents')\
                    .select('*')\
                    .in_('status', ['active', 'responding'])\
                    .execute()
                
                await manager.send_personal_message({
                    'type': 'UPDATE',
                    'active_crises': incidents_result.data if incidents_result.data else []
                }, websocket)
            
    except WebSocketDisconnect:
        manager.disconnect(websocket)
        logger.info("Client disconnected")
    except Exception as e:
        logger.error(f"WebSocket error: {str(e)}")
        manager.disconnect(websocket)


@router.websocket("/ws/alerts")
async def websocket_alerts(websocket: WebSocket):
    """WebSocket endpoint for real-time public alerts."""
    await manager.connect(websocket)
    
    try:
        # Send initial alerts
        from app.database import get_service_client
        from datetime import datetime
        
        supabase = get_service_client()
        
        alerts_result = supabase.table('public_alerts')\
            .select('*')\
            .eq('is_active', True)\
            .gte('expires_at', datetime.utcnow().isoformat())\
            .execute()
        
        await manager.send_personal_message({
            'type': 'INITIAL_ALERTS',
            'alerts': alerts_result.data if alerts_result.data else []
        }, websocket)
        
        while True:
            data = await websocket.receive_text()
            # Handle client messages if needed
            
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception as e:
        logger.error(f"WebSocket error: {str(e)}")
        manager.disconnect(websocket)


# Helper function to broadcast updates from other parts of the application
async def broadcast_incident_update(incident: Dict):
    """Broadcast incident update to all connected clients."""
    await manager.broadcast({
        'type': 'INCIDENT_UPDATE',
        'incident': incident
    })


async def broadcast_new_prediction(prediction: Dict):
    """Broadcast new prediction to all connected clients."""
    await manager.broadcast({
        'type': 'NEW_PREDICTION',
        'prediction': prediction
    })


async def broadcast_new_alert(alert: Dict):
    """Broadcast new alert to all connected clients."""
    await manager.broadcast({
        'type': 'NEW_ALERT',
        'alert': alert
    })
