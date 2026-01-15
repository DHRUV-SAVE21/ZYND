"""Public alerts API endpoints."""
from fastapi import APIRouter, HTTPException
from typing import List, Optional
from datetime import datetime, timedelta
from app.database import get_service_client
from app.schemas.alert import AlertCreate, AlertResponse
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/alerts", tags=["alerts"])


@router.get("/public", response_model=List[dict])
async def get_public_alerts(
    latitude: Optional[float] = None,
    longitude: Optional[float] = None,
    radius_km: float = 50
):
    """
    Get public alerts (no authentication required).
    
    If latitude/longitude provided, returns alerts within radius.
    Otherwise, returns all active alerts.
    """
    try:
        supabase = get_service_client()
        
        query = supabase.table('public_alerts')\
            .select('*')\
            .eq('is_active', True)\
            .gte('expires_at', datetime.utcnow().isoformat())\
            .order('issued_at', desc=True)
        
        result = query.execute()
        alerts = result.data if result.data else []
        
        # Filter by location if coordinates provided
        if latitude is not None and longitude is not None:
            filtered_alerts = []
            for alert in alerts:
                distance = _calculate_distance(
                    latitude, longitude,
                    alert['center_lat'], alert['center_lon']
                )
                if distance <= alert.get('radius_km', 10):
                    alert['distance_km'] = round(distance, 1)
                    filtered_alerts.append(alert)
            
            alerts = sorted(filtered_alerts, key=lambda x: x['distance_km'])
        
        return alerts
        
    except Exception as e:
        logger.error(f"Failed to fetch alerts: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/broadcast", response_model=dict)
async def broadcast_alert(alert_data: AlertCreate):
    """
    Broadcast a new public alert.
    
    This endpoint:
    1. Creates alert in database
    2. Triggers notification service (SMS, push, etc.)
    3. Returns alert details
    """
    try:
        logger.info(f"Broadcasting alert: {alert_data.title}")
        
        supabase = get_service_client()
        
        # Prepare alert data
        alert_dict = {
            'title': alert_data.title,
            'message': alert_data.message,
            'severity': alert_data.severity,
            'location_name': alert_data.location_name,
            'center_lat': alert_data.center_lat,
            'center_lon': alert_data.center_lon,
            'radius_km': alert_data.radius_km,
            'evacuation_required': alert_data.evacuation_required,
            'shelter_locations': alert_data.shelter_locations,
            'evacuation_routes': alert_data.evacuation_routes,
            'issued_at': datetime.utcnow().isoformat(),
            'expires_at': (datetime.utcnow() + timedelta(hours=alert_data.expires_in_hours)).isoformat(),
            'is_active': True
        }
        
        result = supabase.table('public_alerts').insert(alert_dict).execute()
        
        if not result.data:
            raise HTTPException(status_code=500, detail="Failed to create alert")
        
        alert_id = result.data[0]['id']
        logger.info(f"Alert created with ID: {alert_id}")
        
        # Trigger notification service (implement separately)
        # await notification_service.send_mass_alert(result.data[0])
        
        return {
            'success': True,
            'alert': result.data[0],
            'message': 'Alert broadcast successfully'
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to broadcast alert: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.patch("/{alert_id}/deactivate")
async def deactivate_alert(alert_id: int):
    """Deactivate an alert."""
    try:
        supabase = get_service_client()
        
        result = supabase.table('public_alerts')\
            .update({'is_active': False})\
            .eq('id', alert_id)\
            .execute()
        
        if not result.data:
            raise HTTPException(status_code=404, detail="Alert not found")
        
        return {
            'success': True,
            'message': 'Alert deactivated'
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to deactivate alert: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


def _calculate_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """
    Calculate distance between two points using Haversine formula.
    Returns distance in kilometers.
    """
    from math import radians, sin, cos, sqrt, atan2
    
    R = 6371  # Earth's radius in kilometers
    
    lat1, lon1, lat2, lon2 = map(radians, [lat1, lon1, lat2, lon2])
    
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    
    a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
    c = 2 * atan2(sqrt(a), sqrt(1-a))
    
    distance = R * c
    return distance
