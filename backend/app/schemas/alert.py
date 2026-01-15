"""Public alert data schemas."""
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class AlertBase(BaseModel):
    """Base alert schema."""
    title: str = Field(..., min_length=3, max_length=255)
    message: str = Field(..., min_length=10)
    severity: str = Field(..., pattern="^(safe|warning|critical)$")
    location_name: str


class AlertCreate(AlertBase):
    """Schema for creating an alert."""
    center_lat: float = Field(..., ge=-90, le=90)
    center_lon: float = Field(..., ge=-180, le=180)
    radius_km: float = Field(default=10, ge=0.1, le=500)
    evacuation_required: bool = False
    shelter_locations: Optional[str] = None
    evacuation_routes: Optional[str] = None
    expires_in_hours: int = Field(default=24, ge=1, le=168)


class AlertResponse(AlertBase):
    """Schema for alert response."""
    id: int
    center_lat: float
    center_lon: float
    radius_km: float
    evacuation_required: bool
    shelter_locations: Optional[str]
    evacuation_routes: Optional[str]
    issued_at: datetime
    expires_at: datetime
    is_active: bool
    
    class Config:
        from_attributes = True
