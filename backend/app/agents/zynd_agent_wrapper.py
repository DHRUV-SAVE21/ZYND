"""Wrapper for ZYND AI Agent (P3 AI Network) integration."""
from typing import Dict, Any, Optional, List
from app.config import settings
import logging
import os

logger = logging.getLogger(__name__)

try:
    from p3ai_agent.agent import AgentConfig, P3AIAgent
    import google.generativeai as genai
    ZYND_AI_AVAILABLE = True
except ImportError:
    ZYND_AI_AVAILABLE = False
    logger.warning("zyndai-agent (p3ai_agent) not installed. Using fallback mode.")


class ZyndAgentWrapper:
    """Wrapper for P3 AI Network Agent functionality."""
    
    def __init__(self, agent_name: str = "FloodAnalysisAgent"):
        self.agent_name = agent_name
        self.agent = None
        self.llm = None
        
        if ZYND_AI_AVAILABLE and settings.ZYND_AI_SEED:
            try:
                # Configure P3AI Agent
                agent_config = AgentConfig(
                    auto_reconnect=True,
                    message_history_limit=100,
                    registry_url=settings.ZYND_REGISTRY_URL,
                    mqtt_broker_url=settings.ZYND_MQTT_BROKER,
                    identity_credential_path=settings.ZYND_IDENTITY_CREDENTIAL_PATH,
                    secret_seed=settings.ZYND_AI_SEED
                )
                
                # Initialize P3AI Agent
                self.agent = P3AIAgent(agent_config=agent_config)
                
                # Setup Gemini LLM for the agent
                genai.configure(api_key=settings.GEMINI_API_KEY)
                self.llm = genai.GenerativeModel('gemini-pro')
                self.agent.set_agent_executor(self.llm)
                
                logger.info(f"P3AI ZYND Agent initialized: {agent_name}")
            except Exception as e:
                logger.error(f"Failed to initialize P3AI ZYND Agent: {str(e)}")
                self.agent = None
        else:
            logger.warning("ZYND AI not configured or available, using fallback mode")
    
    async def analyze_flood_risk(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Analyze flood risk using P3 AI Network Agent with Gemini.
        
        Args:
            data: Input data including weather, geography, etc.
            
        Returns:
            Risk analysis result
        """
        if self.agent and self.llm:
            try:
                # Search for flood analysis agents on P3 network
                agents = self.agent.search_agents_by_capabilities(
                    capabilities=["flood_analysis", "weather_prediction", "risk_assessment"],
                    match_score_gte=0.6,
                    top_k=3
                )
                
                # If other agents found, use collaborative analysis
                if agents:
                    logger.info(f"Found {len(agents)} collaborative agents on P3 network")
                    # Connect to top agent
                    self.agent.connect_agent(agents[0])
                    query = f"Analyze flood risk for: {data}"
                    self.agent.send_message(query, message_type="query")
                    
                    # Wait for response
                    response = self.agent.read_messages()
                    if "No new messages" not in response:
                        return {"source": "p3ai_network", "analysis": response}
                
                # Use local Gemini if no network agents available
                prompt = f"""Analyze flood risk based on the following data:
                {self._format_data(data)}
                
                Provide:
                1. Risk level (low/medium/high/critical)
                2. Confidence score (0-1)
                3. Key factors
                4. Recommendations
                """
                result = await self.llm.generate_content_async(prompt)
                return {"source": "local_gemini", "analysis": result.text}
                
            except Exception as e:
                logger.error(f"ZYND Agent analysis failed: {str(e)}")
                return self._fallback_analysis(data)
        else:
            return self._fallback_analysis(data)
    
    async def predict_flood_timeline(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Predict flood timeline using P3 AI Network.
        
        Args:
            data: Input data for prediction
            
        Returns:
            Timeline prediction
        """
        if self.agent and self.llm:
            try:
                prompt = f"""Predict flood timeline based on:
                {self._format_data(data)}
                
                Provide:
                1. Expected flood start time
                2. Peak flood time
                3. Expected duration
                4. Affected areas over time
                """
                result = await self.llm.generate_content_async(prompt)
                return {"source": "zynd_ai", "prediction": result.text}
            except Exception as e:
                logger.error(f"ZYND Agent prediction failed: {str(e)}")
                return self._fallback_timeline(data)
        else:
            return self._fallback_timeline(data)
    
    async def recommend_actions(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """
        Get action recommendations using P3 AI Network.
        
        Args:
            context: Current situation context
            
        Returns:
            Recommended actions
        """
        if self.agent and self.llm:
            try:
                prompt = f"""Recommend emergency actions for flood situation:
                {self._format_data(context)}
                
                Provide:
                1. Immediate actions (0-2 hours)
                2. Short-term actions (2-24 hours)
                3. Medium-term actions (1-7 days)
                4. Resource requirements
                5. Priority levels
                """
                result = await self.llm.generate_content_async(prompt)
                return {"source": "zynd_ai", "recommendations": result.text}
            except Exception as e:
                logger.error(f"ZYND Agent recommendation failed: {str(e)}")
                return self._fallback_recommendations(context)
        else:
            return self._fallback_recommendations(context)
    
    def _format_data(self, data: Dict[str, Any]) -> str:
        """Format data dictionary for LLM prompt."""
        lines = []
        for key, value in data.items():
            lines.append(f"- {key}: {value}")
        return "\n".join(lines)
    
    def _fallback_analysis(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Fallback analysis when ZYND AI is unavailable."""
        rainfall = data.get('rainfall', 0)
        saturation = data.get('soil_saturation', 0)
        river_level = data.get('river_level', 0)
        
        # Simple risk calculation
        risk_score = (
            (rainfall / 100) * 0.4 +
            saturation * 0.3 +
            (river_level / 10) * 0.3
        )
        
        risk_level = 'low'
        if risk_score >= 0.85:
            risk_level = 'critical'
        elif risk_score >= 0.65:
            risk_level = 'high'
        elif risk_score >= 0.35:
            risk_level = 'medium'
        
        return {
            'risk_level': risk_level,
            'risk_score': risk_score,
            'confidence': 0.75,
            'method': 'fallback',
            'factors': {
                'rainfall_impact': rainfall / 100,
                'saturation_impact': saturation,
                'river_impact': river_level / 10
            }
        }
    
    def _fallback_timeline(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Fallback timeline prediction."""
        return {
            'time_to_flood': '4 hours',
            'peak_water_level_time': '6 hours',
            'duration': '12-24 hours',
            'confidence': 0.70,
            'method': 'fallback'
        }
    
    def _fallback_recommendations(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """Fallback action recommendations."""
        severity = context.get('severity', 'medium')
        
        actions = []
        if severity in ['high', 'critical']:
            actions = [
                'Activate emergency response teams immediately',
                'Issue evacuation orders for low-lying areas',
                'Open emergency shelters',
                'Deploy rescue boats and equipment',
                'Broadcast emergency alerts via all channels'
            ]
        else:
            actions = [
                'Monitor situation closely',
                'Prepare emergency response teams',
                'Issue flood watch advisory',
                'Check drainage systems',
                'Alert citizens to prepare emergency kits'
            ]
        
        return {
            'priority': severity,
            'actions': actions,
            'resources_needed': ['ambulances', 'rescue_boats', 'shelters'],
            'estimated_responders': 50 if severity in ['high', 'critical'] else 20,
            'method': 'fallback'
        }
