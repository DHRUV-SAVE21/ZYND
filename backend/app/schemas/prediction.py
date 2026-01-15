"""Flood prediction data schemas."""
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
from datetime import datetime


class PredictionBase(BaseModel):
    """Base prediction schema."""
    region_name: str = Field(..., min_length=3, max_length=255)
    risk_level: str = Field(..., pattern="^(low|medium|high|critical)$")
    probability: float = Field(..., ge=0.0, le=1.0)
    confidence: float = Field(..., ge=0.0, le=1.0)
    center_lat: float = Field(..., ge=-90, le=90)
    center_lon: float = Field(..., ge=-180, le=180)


class PredictionCreate(PredictionBase):
    """Schema for creating a prediction."""
    predicted_time: datetime
    affected_population: int = Field(..., ge=0)
    water_level_forecast: List[float]
    rainfall_intensity: float = Field(..., ge=0)
    soil_saturation: float = Field(..., ge=0.0, le=1.0)
    river_level: Optional[float] = None
    ai_reasoning: Dict[str, Any]


class PredictionResponse(PredictionBase):
    """Schema for prediction response."""
    id: int
    predicted_time: datetime
    affected_population: int
    water_level_forecast: List[float]
    rainfall_intensity: float
    soil_saturation: float
    river_level: Optional[float]
    ai_reasoning: Dict[str, Any]
    created_at: datetime
    expires_at: Optional[datetime]
    
    class Config:
        from_attributes = True


class GeneratePredictionRequest(BaseModel):
    """Request to generate a new prediction."""
    region: str = Field(..., min_length=3)
    latitude: float = Field(..., ge=-90, le=90)
    longitude: float = Field(..., ge=-180, le=180)
