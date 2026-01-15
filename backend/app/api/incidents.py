"""Incident (Crisis) API endpoints."""
from fastapi import APIRouter, HTTPException, File, UploadFile, Form
from typing import List, Optional
from datetime import datetime
from app.database import get_service_client
from app.schemas.incident import IncidentResponse
from app.agents import CoordinationAgent
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/crisis", tags=["incidents"])


@router.get("/active", response_model=dict)
async def get_active_incidents():
    """Get all active incidents/crises."""
    try:
        supabase = get_service_client()
        
        result = supabase.table('incidents')\
            .select('*')\
            .in_('status', ['active', 'responding'])\
            .order('created_at', desc=True)\
            .execute()
        
        return {
            'crises': result.data if result.data else [],
            'count': len(result.data) if result.data else 0
        }
        
    except Exception as e:
        logger.error(f"Failed to fetch incidents: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/alert")
async def report_incident(
    title: str = Form(...),
    description: str = Form(...),
    crisis_type: str = Form(...),
    severity: str = Form(...),
    latitude: float = Form(...),
    longitude: float = Form(...),
    reporter_id: str = Form(...),
    image: Optional[UploadFile] = File(None)
):
    """
    Report a new incident/crisis.
    
    This endpoint:
    1. Validates the incident report
    2. Stores it in database
    3. Triggers AI analysis
    4. Generates coordination plan
    5. Returns incident ID
    """
    try:
        logger.info(f"New incident reported: {title}")
        
        supabase = get_service_client()
        
        # Handle image upload if provided
        image_url = None
        if image:
            # In production, upload to Supabase Storage
            # For now, store filename
            image_url = f"uploads/{image.filename}"
        
        # Create incident record
        incident_data = {
            'title': title,
            'description': description,
            'type': crisis_type,
            'severity': severity,
            'status': 'active',
            'latitude': latitude,
            'longitude': longitude,
            'reporter_id': reporter_id,
            'image_url': image_url,
            'created_at': datetime.utcnow().isoformat(),
            'updated_at': datetime.utcnow().isoformat()
        }
        
        result = supabase.table('incidents').insert(incident_data).execute()
        
        if not result.data:
            raise HTTPException(status_code=500, detail="Failed to create incident")
        
        incident_id = result.data[0]['id']
        logger.info(f"Incident created with ID: {incident_id}")
        
        # Run AI analysis and coordination (async in background)
        # For demo, run synchronously
        try:
            coordination_agent = CoordinationAgent()
            
            # Get available resources
            resources_result = supabase.table('resources')\
                .select('*')\
                .eq('status', 'available')\
                .limit(10)\
                .execute()
            
            coordination_context = {
                'incident': result.data[0],
                'available_resources': resources_result.data if resources_result.data else [],
                'agencies': ['Fire Department', 'Police', 'Medical Services', 'NGOs']
            }
            
            coordination_plan = await coordination_agent.execute(coordination_context)
            
            # Update incident with AI analysis
            supabase.table('incidents')\
                .update({'ai_analysis': coordination_plan})\
                .eq('id', incident_id)\
                .execute()
            
            logger.info(f"AI analysis completed for incident {incident_id}")
            
        except Exception as ai_error:
            logger.error(f"AI analysis failed: {str(ai_error)}")
            # Continue even if AI fails
        
        return {
            'success': True,
            'incident_id': incident_id,
            'message': 'Incident reported successfully'
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to report incident: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{incident_id}", response_model=dict)
async def get_incident(incident_id: int):
    """Get specific incident by ID."""
    try:
        supabase = get_service_client()
        
        result = supabase.table('incidents')\
            .select('*')\
            .eq('id', incident_id)\
            .execute()
        
        if not result.data:
            raise HTTPException(status_code=404, detail="Incident not found")
        
        return result.data[0]
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to fetch incident: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.patch("/{incident_id}/status")
async def update_incident_status(
    incident_id: int,
    status: str,
    notes: Optional[str] = None
):
    """Update incident status."""
    try:
        supabase = get_service_client()
        
        update_data = {
            'status': status,
            'updated_at': datetime.utcnow().isoformat()
        }
        
        if notes:
            update_data['notes'] = notes
        
        result = supabase.table('incidents')\
            .update(update_data)\
            .eq('id', incident_id)\
            .execute()
        
        if not result.data:
            raise HTTPException(status_code=404, detail="Incident not found")
        
        return {
            'success': True,
            'incident': result.data[0]
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to update incident: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
