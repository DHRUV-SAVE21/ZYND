"""Risk verification AI agent."""
from app.agents.base_agent import BaseAgent
from typing import Dict, Any
import logging

logger = logging.getLogger(__name__)


class VerificationAgent(BaseAgent):
    """AI Agent for verifying flood predictions and reducing false positives."""
    
    def __init__(self):
        super().__init__(name="VerificationAgent", model="gpt-4-turbo-preview")
        
        self.system_prompt = """You are a risk verification AI agent specializing in cross-validation of flood predictions.

Your critical role:
1. Verify prediction accuracy by cross-checking multiple data sources
2. Identify potential false positives or false negatives
3. Assess confidence levels based on data quality
4. Flag anomalies or inconsistencies in the data
5. Validate against historical patterns
6. Ensure predictions meet reliability thresholds

Verification Criteria:
- Sensor data consistency (multiple sources agree)
- Historical pattern correlation
- Physical plausibility (realistic scenarios)
- Data quality assessment
- Anomaly detection
- Conservative bias (prevent panic from false alarms)

Output Format (JSON):
{
    "is_verified": true|false,
    "confidence": 0.0-1.0,
    "validation_checks": {
        "sensor_consistency": pass|fail,
        "historical_correlation": pass|fail,
        "physical_plausibility": pass|fail,
        "anomaly_check": pass|fail
    },
    "concerns": ["concern1", "concern2"],
    "recommendation": "PROCEED|INVESTIGATE|REJECT",
    "reasoning": "detailed explanation"
}

Be rigorous - false alarms erode public trust."""
    
    async def execute(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """
        Verify a flood prediction.
        
        Args:
            context: {
                'prediction': Dict (from PredictionAgent),
                'sensor_data': Optional[Dict],
                'satellite_data': Optional[Dict],
                'historical_patterns': Optional[List]
            }
            
        Returns:
            Verification result
        """
        logger.info("Executing prediction verification")
        
        try:
            prediction = context.get('prediction', {})
            
            # Perform validation checks
            validation_checks = {
                'sensor_consistency': self._check_sensor_consistency(context),
                'historical_correlation': self._check_historical_correlation(context),
                'physical_plausibility': self._check_physical_plausibility(prediction),
                'anomaly_check': self._check_for_anomalies(prediction),
                'data_quality': self._assess_data_quality(context)
            }
            
            # Calculate confidence score
            confidence = self._calculate_confidence(validation_checks)
            
            # Get LLM verification reasoning
            llm_context = self._format_context({
                'prediction': prediction,
                'validation_checks': validation_checks,
                'calculated_confidence': confidence
            })
            
            llm_reasoning = await self._call_llm(
                self.system_prompt,
                f"Verify this flood prediction:\n\n{llm_context}"
            )
            
            # Determine if verified
            is_verified = confidence >= 0.70 and all(
                v in ['pass', True] for v in [
                    validation_checks['sensor_consistency'],
                    validation_checks['physical_plausibility'],
                    validation_checks['anomaly_check']
                ]
            )
            
            # Identify concerns
            concerns = self._identify_concerns(validation_checks, prediction)
            
            recommendation = self._make_recommendation(is_verified, confidence, concerns)
            
            result = {
                'is_verified': is_verified,
                'confidence': confidence,
                'validation_checks': validation_checks,
                'concerns': concerns,
                'recommendation': recommendation,
                'reasoning': llm_reasoning,
                'adjustments': self._suggest_adjustments(prediction, validation_checks)
            }
            
            logger.info(f"Verification completed: {recommendation} (confidence: {confidence:.2f})")
            return result
            
        except Exception as e:
            logger.error(f"Verification failed: {str(e)}")
            raise
    
    def _check_sensor_consistency(self, context: Dict[str, Any]) -> str:
        """Check if multiple sensors provide consistent readings."""
        sensor_data = context.get('sensor_data', {})
        
        if not sensor_data:
            return 'insufficient_data'
        
        # Check rainfall sensors
        rainfall_readings = sensor_data.get('rainfall_sensors', [])
        if len(rainfall_readings) >= 2:
            variance = self._calculate_variance(rainfall_readings)
            if variance > 0.3:  # 30% variance threshold
                return 'fail'
        
        # Check river level sensors
        river_readings = sensor_data.get('river_sensors', [])
        if len(river_readings) >= 2:
            variance = self._calculate_variance(river_readings)
            if variance > 0.25:
                return 'fail'
        
        return 'pass'
    
    def _check_historical_correlation(self, context: Dict[str, Any]) -> str:
        """Check if prediction correlates with historical patterns."""
        historical = context.get('historical_patterns', [])
        prediction = context.get('prediction', {})
        
        if not historical:
            return 'no_data'
        
        # Compare current conditions with past flood events
        risk_level = prediction.get('risk_level', 'low')
        probability = prediction.get('probability', 0)
        
        # Find similar historical events
        similar_events = [
            h for h in historical 
            if abs(h.get('probability', 0) - probability) < 0.2
        ]
        
        if not similar_events:
            return 'no_correlation'
        
        # Check if risk assessment matches historical outcomes
        historical_outcomes = [h.get('actual_severity', 'low') for h in similar_events]
        expected_severity = max(set(historical_outcomes), key=historical_outcomes.count)
        
        if expected_severity == risk_level:
            return 'pass'
        else:
            return 'partial'
    
    def _check_physical_plausibility(self, prediction: Dict[str, Any]) -> str:
        """Check if prediction is physically plausible."""
        rainfall = prediction.get('rainfall_intensity', 0)
        river_level = prediction.get('river_level', 0)
        probability = prediction.get('probability', 0)
        
        # Implausibility checks
        if rainfall > 200:  # Unrealistic rainfall
            return 'fail'
        
        if river_level < 0 or river_level > 20:  # Unrealistic river level
            return 'fail'
        
        # Check if risk matches conditions
        if probability > 0.8 and rainfall < 10:  # High risk with low rainfall
            return 'fail'
        
        if probability < 0.2 and rainfall > 100:  # Low risk with extreme rainfall
            return 'fail'
        
        return 'pass'
    
    def _check_for_anomalies(self, prediction: Dict[str, Any]) -> str:
        """Detect anomalies in prediction data."""
        # Check for sudden, unexplained changes
        risk_level = prediction.get('risk_level', 'low')
        probability = prediction.get('probability', 0)
        
        # Risk level should match probability
        expected_risk = 'low'
        if probability >= 0.85:
            expected_risk = 'critical'
        elif probability >= 0.65:
            expected_risk = 'high'
        elif probability >= 0.35:
            expected_risk = 'medium'
        
        if risk_level != expected_risk:
            return 'fail'
        
        return 'pass'
    
    def _assess_data_quality(self, context: Dict[str, Any]) -> str:
        """Assess overall data quality."""
        prediction = context.get('prediction', {})
        
        # Check for missing critical data
        required_fields = ['rainfall_intensity', 'soil_saturation', 'probability']
        missing_fields = [f for f in required_fields if f not in prediction]
        
        if missing_fields:
            return 'poor'
        
        # Check for zero/null values that indicate sensor failure
        if prediction.get('rainfall_intensity') == 0 and prediction.get('probability') > 0.5:
            return 'questionable'
        
        return 'good'
    
    def _calculate_confidence(self, validation_checks: Dict[str, str]) -> float:
        """Calculate overall confidence score."""
        score_map = {
            'pass': 1.0,
            'partial': 0.7,
            'no_correlation': 0.6,
            'no_data': 0.5,
            'insufficient_data': 0.5,
            'questionable': 0.4,
            'fail': 0.0,
            'poor': 0.3,
            'good': 1.0
        }
        
        scores = [
            score_map.get(check, 0.5) 
            for check in validation_checks.values()
        ]
        
        # Weighted average
        weights = [0.25, 0.20, 0.30, 0.15, 0.10]  # Adjust based on importance
        confidence = sum(s * w for s, w in zip(scores, weights))
        
        return round(confidence, 2)
    
    def _identify_concerns(
        self, 
        validation_checks: Dict[str, str],
        prediction: Dict[str, Any]
    ) -> list:
        """Identify specific concerns that need attention."""
        concerns = []
        
        if validation_checks.get('sensor_consistency') == 'fail':
            concerns.append("Inconsistent sensor readings detected")
        
        if validation_checks.get('physical_plausibility') == 'fail':
            concerns.append("Prediction contains physically implausible values")
        
        if validation_checks.get('anomaly_check') == 'fail':
            concerns.append("Risk level does not match probability score")
        
        if validation_checks.get('data_quality') in ['poor', 'questionable']:
            concerns.append("Data quality issues detected")
        
        if validation_checks.get('historical_correlation') == 'no_correlation':
            concerns.append("No historical precedent for these conditions")
        
        # Check prediction-specific concerns
        if prediction.get('probability', 0) > 0.8 and prediction.get('confidence', 1.0) < 0.7:
            concerns.append("High risk prediction has low confidence")
        
        return concerns if concerns else ["No significant concerns identified"]
    
    def _make_recommendation(
        self, 
        is_verified: bool,
        confidence: float,
        concerns: list
    ) -> str:
        """Make final recommendation."""
        if not is_verified:
            return "REJECT"
        
        if confidence >= 0.85:
            return "PROCEED"
        elif confidence >= 0.70:
            if len([c for c in concerns if "significant" not in c.lower()]) > 2:
                return "INVESTIGATE"
            return "PROCEED"
        else:
            return "INVESTIGATE"
    
    def _suggest_adjustments(
        self, 
        prediction: Dict[str, Any],
        validation_checks: Dict[str, str]
    ) -> Dict[str, Any]:
        """Suggest adjustments to improve prediction accuracy."""
        adjustments = {}
        
        # Adjust confidence if data quality is poor
        if validation_checks.get('data_quality') == 'poor':
            adjustments['confidence'] = max(0.5, prediction.get('confidence', 0.8) * 0.7)
        
        # Adjust probability if sensors are inconsistent
        if validation_checks.get('sensor_consistency') == 'fail':
            adjustments['probability'] = prediction.get('probability', 0.5) * 0.8
            adjustments['note'] = "Probability reduced due to sensor inconsistency"
        
        return adjustments if adjustments else {'note': 'No adjustments needed'}
    
    def _calculate_variance(self, readings: list) -> float:
        """Calculate variance in sensor readings."""
        if len(readings) < 2:
            return 0.0
        
        mean = sum(readings) / len(readings)
        variance = sum((x - mean) ** 2 for x in readings) / len(readings)
        std_dev = variance ** 0.5
        
        # Return coefficient of variation (normalized variance)
        return (std_dev / mean) if mean != 0 else 0.0
