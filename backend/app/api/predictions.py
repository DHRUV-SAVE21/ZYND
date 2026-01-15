"""Prediction API endpoints."""
from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional
from datetime import datetime, timedelta
from app.database import get_service_client
from app.schemas.prediction import (
    PredictionResponse,
    GeneratePredictionRequest
)
from app.agents import PredictionAgent, VerificationAgent
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/predictions", tags=["predictions"])


@router.get("/", response_model=List[dict])
async def get_predictions(
    active_only: bool = True,
    limit: int = 50
):
    """Get all flood predictions."""
    try:
        supabase = get_service_client()
        
        query = supabase.table('flood_predictions').select('*')
        
        if active_only:
            query = query.gte('expires_at', datetime.utcnow().isoformat())
        
        query = query.order('created_at', desc=True).limit(limit)
        
        result = query.execute()
        
        return result.data if result.data else []
        
    except Exception as e:
        logger.error(f"Failed to fetch predictions: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{prediction_id}", response_model=dict)
async def get_prediction(prediction_id: int):
    """Get specific prediction by ID."""
    try:
        supabase = get_service_client()
        
        result = supabase.table('flood_predictions')\
            .select('*')\
            .eq('id', prediction_id)\
            .execute()
        
        if not result.data:
            raise HTTPException(status_code=404, detail="Prediction not found")
        
        return result.data[0]
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to fetch prediction: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/generate", response_model=dict)
async def generate_prediction(request: GeneratePredictionRequest):
    """
    Generate new flood prediction using AI agents.
    
    This endpoint:
    1. Gathers weather data for the region
    2. Runs prediction through AI agent
    3. Verifies prediction with verification agent
    4. Stores verified prediction in database
    """
    try:
        logger.info(f"Generating prediction for region: {request.region}")
        
        # Prepare context for prediction agent
        # In production, fetch real weather data from APIs
        weather_context = {
            'region': request.region,
            'latitude': request.latitude,
            'longitude': request.longitude,
            'rainfall': await _fetch_rainfall_data(request.latitude, request.longitude),
            'soil_saturation': await _fetch_soil_saturation(request.latitude, request.longitude),
            'river_level': await _fetch_river_level(request.latitude, request.longitude),
            'historical_data': []  # Would fetch from database
        }
        
        # Step 1: Run Prediction Agent
        prediction_agent = PredictionAgent()
        prediction_result = await prediction_agent.execute(weather_context)
        
        logger.info(f"Prediction generated: {prediction_result['risk_level']} risk")
        
        # Step 2: Verify with Verification Agent
        verification_agent = VerificationAgent()
        verification_result = await verification_agent.execute({
            'prediction': prediction_result,
            'sensor_data': {},  # Would include real sensor data
            'historical_patterns': []
        })
        
        logger.info(f"Verification: {verification_result['recommendation']}")
        
        # Step 3: Save if verified
        if verification_result['is_verified'] and verification_result['recommendation'] == 'PROCEED':
            supabase = get_service_client()
            
            # Prepare data for database
            prediction_data = {
                'region_name': prediction_result['region'],
                'risk_level': prediction_result['risk_level'],
                'probability': prediction_result['probability'],
                'confidence': verification_result['confidence'],
                'center_lat': prediction_result['center_lat'],
                'center_lon': prediction_result['center_lon'],
                'predicted_time': prediction_result['predicted_time'].isoformat(),
                'affected_population': prediction_result['affected_population'],
                'water_level_forecast': prediction_result['water_level_forecast'],
                'rainfall_intensity': prediction_result['rainfall_intensity'],
                'soil_saturation': prediction_result['soil_saturation'],
                'river_level': prediction_result.get('river_level'),
                'ai_reasoning': prediction_result['ai_reasoning'],
                'created_at': datetime.utcnow().isoformat(),
                'expires_at': (datetime.utcnow() + timedelta(days=1)).isoformat()
            }
            
            result = supabase.table('flood_predictions').insert(prediction_data).execute()
            
            if result.data:
                logger.info(f"Prediction saved with ID: {result.data[0]['id']}")
                return {
                    **result.data[0],
                    'verification': verification_result
                }
            else:
                raise HTTPException(status_code=500, detail="Failed to save prediction")
        else:
            raise HTTPException(
                status_code=400,
                detail=f"Prediction failed verification: {verification_result['reasoning']}"
            )
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Prediction generation failed: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/region/{region_name}", response_model=List[dict])
async def get_predictions_by_region(region_name: str):
    """Get predictions for a specific region."""
    try:
        supabase = get_service_client()
        
        result = supabase.table('flood_predictions')\
            .select('*')\
            .ilike('region_name', f'%{region_name}%')\
            .gte('expires_at', datetime.utcnow().isoformat())\
            .order('created_at', desc=True)\
            .execute()
        
        return result.data if result.data else []
        
    except Exception as e:
        logger.error(f"Failed to fetch region predictions: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


# Helper functions for fetching weather data
async def _fetch_rainfall_data(lat: float, lon: float) -> float:
    """Fetch rainfall data from weather API (mock for now)."""
    # In production, integrate with OpenWeatherMap, NOAA, etc.
    # For demo, return realistic mock data
    import random
    return round(random.uniform(10, 80), 1)


async def _fetch_soil_saturation(lat: float, lon: float) -> float:
    """Fetch soil saturation data (mock for now)."""
    import random
    return round(random.uniform(0.4, 0.95), 2)


async def _fetch_river_level(lat: float, lon: float) -> float:
    """Fetch river level data (mock for now)."""
    import random
    return round(random.uniform(3.0, 9.0), 1)
