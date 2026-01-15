"""Incident data schemas."""
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
from datetime import datetime
from enum import Enum


class SeverityEnum(str, Enum):
    """Incident severity levels."""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class IncidentTypeEnum(str, Enum):
    """Incident types."""
    FLOOD = "flood"
    FIRE = "fire"
    MEDICAL = "medical"
    ACCIDENT = "accident"
    NATURAL_DISASTER = "natural_disaster"
    CRIME = "crime"


class StatusEnum(str, Enum):
    """Incident status."""
    ACTIVE = "active"
    RESPONDING = "responding"
    RESOLVED = "resolved"
    CLOSED = "closed"


class IncidentBase(BaseModel):
    """Base incident schema."""
    title: str = Field(..., min_length=3, max_length=255)
    description: str = Field(..., min_length=10)
    type: IncidentTypeEnum
    severity: SeverityEnum
    latitude: float = Field(..., ge=-90, le=90)
    longitude: float = Field(..., ge=-180, le=180)


class IncidentCreate(IncidentBase):
    """Schema for creating an incident."""
    reporter_id: str
    image_url: Optional[str] = None


class IncidentUpdate(BaseModel):
    """Schema for updating an incident."""
    status: Optional[StatusEnum] = None
    severity: Optional[SeverityEnum] = None
    description: Optional[str] = None
    ai_analysis: Optional[Dict[str, Any]] = None


class IncidentResponse(IncidentBase):
    """Schema for incident response."""
    id: int
    status: StatusEnum
    reporter_id: str
    ai_analysis: Optional[Dict[str, Any]] = None
    image_url: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True
