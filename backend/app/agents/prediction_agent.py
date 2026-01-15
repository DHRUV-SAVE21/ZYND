"""Flood prediction AI agent."""
from app.agents.base_agent import BaseAgent
from app.agents.zynd_agent_wrapper import ZyndAgentWrapper
from typing import Dict, Any, List
from datetime import datetime, timedelta
import numpy as np
import logging

logger = logging.getLogger(__name__)


class PredictionAgent(BaseAgent):
    """AI Agent for flood prediction and risk assessment."""
    
    def __init__(self):
        super().__init__(name="FloodPredictionAgent", model="gpt-4-turbo-preview")
        self.zynd_agent = ZyndAgentWrapper(agent_type="flood_analysis")
        
        self.system_prompt = """You are an advanced flood prediction AI agent with expertise in hydrology, meteorology, and disaster management.

Your responsibilities:
1. Analyze weather data (rainfall, temperature, humidity, wind patterns)
2. Assess soil saturation and water absorption capacity
3. Monitor river and water body levels
4. Evaluate topography and drainage infrastructure
5. Review historical flood patterns and seasonal trends
6. Calculate flood probability and severity
7. Estimate affected areas and population at risk
8. Provide actionable insights for emergency response

Output Format (JSON):
{
    "risk_assessment": "detailed analysis",
    "primary_factors": ["factor1", "factor2"],
    "risk_level": "low|medium|high|critical",
    "confidence": 0.0-1.0,
    "recommended_actions": ["action1", "action2"],
    "time_sensitivity": "immediate|hours|days"
}

Be precise, data-driven, and conservative (err on the side of caution)."""
    
    async def execute(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """
        Execute flood prediction analysis.
        
        Args:
            context: {
                'region': str,
                'latitude': float,
                'longitude': float,
                'rainfall': float (mm/h),
                'soil_saturation': float (0-1),
                'river_level': float (meters),
                'historical_data': Optional[List]
            }
            
        Returns:
            Prediction result with risk assessment
        """
        logger.info(f"Executing prediction for region: {context.get('region')}")
        
        try:
            # Step 1: Use ZYND AI for initial analysis
            zynd_analysis = await self.zynd_agent.analyze_flood_risk(context)
            
            # Step 2: Calculate risk score using multiple methods
            risk_score = self._calculate_comprehensive_risk_score(context, zynd_analysis)
            
            # Step 3: Get LLM reasoning
            llm_context = self._format_context({
                **context,
                'zynd_analysis': zynd_analysis,
                'calculated_risk_score': risk_score
            })
            
            llm_reasoning = await self._call_llm(
                self.system_prompt,
                f"Analyze this flood risk scenario:\n\n{llm_context}"
            )
            
            # Step 4: Generate water level forecast
            water_level_forecast = self._forecast_water_levels(context, risk_score)
            
            # Step 5: Estimate impact
            affected_population = self._estimate_affected_population(
                context, 
                risk_score
            )
            
            # Step 6: Calculate time to impact
            predicted_time = self._calculate_time_to_impact(context, risk_score)
            
            result = {
                'region': context['region'],
                'center_lat': context['latitude'],
                'center_lon': context['longitude'],
                'risk_level': self._score_to_risk_level(risk_score),
                'probability': risk_score,
                'confidence': zynd_analysis.get('confidence', 0.85),
                'predicted_time': predicted_time,
                'affected_population': affected_population,
                'water_level_forecast': water_level_forecast,
                'rainfall_intensity': context.get('rainfall', 0),
                'soil_saturation': context.get('soil_saturation', 0),
                'river_level': context.get('river_level', 0),
                'ai_reasoning': {
                    'llm_analysis': llm_reasoning,
                    'zynd_analysis': zynd_analysis,
                    'risk_factors': self._identify_risk_factors(context),
                    'methodology': 'hybrid_ai_ml'
                }
            }
            
            logger.info(f"Prediction completed: {result['risk_level']} risk")
            return result
            
        except Exception as e:
            logger.error(f"Prediction failed: {str(e)}")
            raise
    
    def _calculate_comprehensive_risk_score(
        self, 
        context: Dict[str, Any],
        zynd_analysis: Dict[str, Any]
    ) -> float:
        """Calculate comprehensive risk score from multiple sources."""
        rainfall = context.get('rainfall', 0)
        saturation = context.get('soil_saturation', 0)
        river_level = context.get('river_level', 0)
        
        # Method 1: Basic weighted scoring
        basic_score = (
            min(rainfall / 100, 1.0) * 0.35 +
            saturation * 0.30 +
            min(river_level / 10, 1.0) * 0.35
        )
        
        # Method 2: ZYND AI score
        zynd_score = zynd_analysis.get('risk_score', basic_score)
        
        # Method 3: Historical pattern matching (simplified)
        historical_score = self._calculate_historical_risk(context)
        
        # Ensemble scoring with weights
        final_score = (
            basic_score * 0.3 +
            zynd_score * 0.5 +
            historical_score * 0.2
        )
        
        return min(1.0, max(0.0, final_score))
    
    def _calculate_historical_risk(self, context: Dict[str, Any]) -> float:
        """Calculate risk based on historical patterns."""
        # Simplified - in production, query actual historical data
        historical_data = context.get('historical_data', [])
        
        if not historical_data:
            return 0.5  # Neutral score if no historical data
        
        # Average of past flood occurrences with similar conditions
        return np.mean([d.get('severity', 0.5) for d in historical_data])
    
    def _forecast_water_levels(
        self, 
        context: Dict[str, Any],
        risk_score: float
    ) -> List[float]:
        """Generate 24-hour water level forecast."""
        current_level = context.get('river_level', 5.0)
        rainfall = context.get('rainfall', 0)
        
        forecast = []
        peak_hour = 6  # Peak typically 6 hours after heavy rain starts
        
        for hour in range(24):
            # Gaussian curve for realistic water level rise and fall
            time_factor = np.exp(-((hour - peak_hour) ** 2) / (2 * 3 ** 2))
            increase = (rainfall / 50) * time_factor * risk_score * 2
            forecast_level = current_level + increase
            forecast.append(round(max(0, forecast_level), 2))
        
        return forecast
    
    def _estimate_affected_population(
        self, 
        context: Dict[str, Any],
        risk_score: float
    ) -> int:
        """Estimate population at risk."""
        # Simplified population density model
        # In production, use actual census data and GIS
        
        base_density = {
            'urban': 10000,
            'suburban': 5000,
            'rural': 1000
        }
        
        # Estimate affected radius in km
        affected_radius_km = risk_score * 10  # Max 10km radius
        affected_area_km2 = np.pi * (affected_radius_km ** 2)
        
        # Assume average density (should be derived from actual location)
        avg_density_per_km2 = 3000
        
        estimated_population = int(affected_area_km2 * avg_density_per_km2 * risk_score)
        
        return estimated_population
    
    def _calculate_time_to_impact(
        self, 
        context: Dict[str, Any],
        risk_score: float
    ) -> datetime:
        """Calculate estimated time until flood impact."""
        rainfall = context.get('rainfall', 0)
        saturation = context.get('soil_saturation', 0)
        
        # Higher rainfall and saturation = faster flooding
        base_hours = 24  # Default 24 hours
        
        if rainfall > 80:
            hours = 2  # Very heavy rain - 2 hours
        elif rainfall > 50:
            hours = 4  # Heavy rain - 4 hours
        elif rainfall > 30:
            hours = 8  # Moderate rain - 8 hours
        else:
            hours = base_hours
        
        # Adjust for saturation
        if saturation > 0.9:
            hours = hours * 0.5  # Soil can't absorb - faster flooding
        
        # Adjust for risk score
        hours = hours * (1.5 - risk_score)  # Higher risk = sooner impact
        
        return datetime.utcnow() + timedelta(hours=max(1, hours))
    
    def _score_to_risk_level(self, score: float) -> str:
        """Convert risk score to risk level category."""
        if score >= 0.85:
            return 'critical'
        elif score >= 0.65:
            return 'high'
        elif score >= 0.35:
            return 'medium'
        else:
            return 'low'
    
    def _identify_risk_factors(self, context: Dict[str, Any]) -> List[str]:
        """Identify key risk factors present."""
        factors = []
        
        rainfall = context.get('rainfall', 0)
        saturation = context.get('soil_saturation', 0)
        river_level = context.get('river_level', 0)
        
        if rainfall > 50:
            factors.append(f"Extreme rainfall ({rainfall} mm/h)")
        elif rainfall > 30:
            factors.append(f"Heavy rainfall ({rainfall} mm/h)")
        
        if saturation > 0.85:
            factors.append(f"Critical soil saturation ({saturation * 100:.0f}%)")
        elif saturation > 0.70:
            factors.append(f"High soil saturation ({saturation * 100:.0f}%)")
        
        if river_level > 8:
            factors.append(f"Critical river level ({river_level}m)")
        elif river_level > 6:
            factors.append(f"Elevated river level ({river_level}m)")
        
        if not factors:
            factors.append("Normal conditions")
        
        return factors
