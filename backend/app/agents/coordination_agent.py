"""Emergency coordination AI agent."""
from app.agents.base_agent import BaseAgent
from app.agents.zynd_agent_wrapper import ZyndAgentWrapper
from typing import Dict, Any, List
from datetime import datetime
import logging

logger = logging.getLogger(__name__)


class CoordinationAgent(BaseAgent):
    """AI Agent for coordinating emergency response operations."""
    
    def __init__(self):
        super().__init__(name="CoordinationAgent", model="gpt-4-turbo-preview")
        self.zynd_agent = ZyndAgentWrapper(agent_type="coordination")
        
        self.system_prompt = """You are an emergency coordination AI agent specialized in disaster response management.

Your mission:
1. Create comprehensive action plans for flood emergencies
2. Coordinate multiple agencies (fire, police, medical, NGOs)
3. Optimize resource allocation and deployment
4. Establish clear communication protocols
5. Set priorities based on severity and urgency
6. Create timeline for response actions
7. Assign responsibilities to appropriate teams

Consider:
- Life safety is the highest priority
- Resource constraints and availability
- Geographic factors and accessibility
- Communication infrastructure status
- Weather conditions and prediction timeline
- Population density and vulnerable groups

Output Format (JSON):
{
    "action_plan": "comprehensive plan description",
    "priority_tasks": [
        {
            "task": "task description",
            "priority": "CRITICAL|HIGH|MEDIUM|LOW",
            "assigned_to": "agency/team",
            "deadline": "timeframe",
            "resources_needed": []
        }
    ],
    "resource_allocation": [],
    "communication_protocol": {},
    "timeline": {},
    "special_considerations": []
}

Be decisive, clear, and actionable."""
    
    async def execute(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """
        Execute coordination planning.
        
        Args:
            context: {
                'incident': Dict,
                'available_resources': List[Dict],
                'agencies': List[str],
                'prediction': Optional[Dict]
            }
            
        Returns:
            Coordination plan
        """
        logger.info("Executing emergency coordination")
        
        try:
            incident = context.get('incident', {})
            severity = incident.get('severity', 'medium')
            
            # Get ZYND AI recommendations
            zynd_recommendations = await self.zynd_agent.recommend_actions(context)
            
            # Create comprehensive action plan using LLM
            llm_context = self._format_context({
                **context,
                'zynd_recommendations': zynd_recommendations
            })
            
            action_plan = await self._call_llm(
                self.system_prompt,
                f"Create emergency response plan for:\n\n{llm_context}"
            )
            
            # Generate structured tasks
            tasks = self._create_priority_tasks(context, severity)
            
            # Allocate resources
            resource_allocation = self._allocate_resources(context)
            
            # Create communication protocol
            comm_protocol = self._create_communication_protocol(severity)
            
            # Build response timeline
            timeline = self._create_response_timeline(severity)
            
            result = {
                'action_plan': action_plan,
                'priority_tasks': tasks,
                'resource_allocation': resource_allocation,
                'communication_protocol': comm_protocol,
                'response_timeline': timeline,
                'estimated_responders': self._estimate_required_responders(severity),
                'special_considerations': self._identify_special_considerations(context),
                'zynd_recommendations': zynd_recommendations,
                'created_at': datetime.utcnow().isoformat()
            }
            
            logger.info(f"Coordination plan created: {len(tasks)} tasks")
            return result
            
        except Exception as e:
            logger.error(f"Coordination failed: {str(e)}")
            raise
    
    def _create_priority_tasks(
        self, 
        context: Dict[str, Any],
        severity: str
    ) -> List[Dict[str, Any]]:
        """Create prioritized task list."""
        incident = context.get('incident', {})
        incident_type = incident.get('type', 'flood')
        
        base_tasks = []
        
        # Critical tasks for all severity levels
        if severity in ['critical', 'high']:
            base_tasks.extend([
                {
                    'id': 1,
                    'task': 'Deploy First Response Team to incident location',
                    'priority': 'CRITICAL',
                    'assigned_to': 'Fire Department & Rescue Services',
                    'deadline': '15 minutes',
                    'resources_needed': ['ambulances', 'rescue_boats', 'first_aid_kits'],
                    'status': 'pending'
                },
                {
                    'id': 2,
                    'task': 'Activate Emergency Operations Center (EOC)',
                    'priority': 'CRITICAL',
                    'assigned_to': 'Command Center',
                    'deadline': 'IMMEDIATE',
                    'resources_needed': ['communication_equipment'],
                    'status': 'pending'
                },
                {
                    'id': 3,
                    'task': 'Issue Emergency Alert to affected population',
                    'priority': 'CRITICAL',
                    'assigned_to': 'Alert System / Public Affairs',
                    'deadline': '10 minutes',
                    'resources_needed': ['sms_system', 'sirens', 'radio'],
                    'status': 'pending'
                },
                {
                    'id': 4,
                    'task': 'Begin evacuation of high-risk areas',
                    'priority': 'CRITICAL',
                    'assigned_to': 'Police & Fire Department',
                    'deadline': '30 minutes',
                    'resources_needed': ['transport_vehicles', 'personnel'],
                    'status': 'pending'
                },
                {
                    'id': 5,
                    'task': 'Open and prepare emergency shelters',
                    'priority': 'HIGH',
                    'assigned_to': 'NGOs & Municipal Services',
                    'deadline': '1 hour',
                    'resources_needed': ['shelters', 'supplies', 'volunteers'],
                    'status': 'pending'
                },
                {
                    'id': 6,
                    'task': 'Setup field medical stations',
                    'priority': 'HIGH',
                    'assigned_to': 'Medical Services',
                    'deadline': '45 minutes',
                    'resources_needed': ['medical_supplies', 'tents', 'doctors'],
                    'status': 'pending'
                },
                {
                    'id': 7,
                    'task': 'Secure critical infrastructure (power, water)',
                    'priority': 'HIGH',
                    'assigned_to': 'Utilities & Engineering',
                    'deadline': '2 hours',
                    'resources_needed': ['engineering_teams', 'equipment'],
                    'status': 'pending'
                }
            ])
        else:
            # Lower severity tasks
            base_tasks.extend([
                {
                    'id': 1,
                    'task': 'Alert emergency services to standby status',
                    'priority': 'HIGH',
                    'assigned_to': 'Command Center',
                    'deadline': '30 minutes',
                    'resources_needed': [],
                    'status': 'pending'
                },
                {
                    'id': 2,
                    'task': 'Issue flood watch advisory to public',
                    'priority': 'MEDIUM',
                    'assigned_to': 'Public Affairs',
                    'deadline': '1 hour',
                    'resources_needed': ['communication_channels'],
                    'status': 'pending'
                },
                {
                    'id': 3,
                    'task': 'Inspect and clear drainage systems',
                    'priority': 'MEDIUM',
                    'assigned_to': 'Municipal Services',
                    'deadline': '4 hours',
                    'resources_needed': ['maintenance_crews'],
                    'status': 'pending'
                },
                {
                    'id': 4,
                    'task': 'Prepare emergency shelters for potential activation',
                    'priority': 'MEDIUM',
                    'assigned_to': 'NGOs',
                    'deadline': '6 hours',
                    'resources_needed': ['shelter_staff'],
                    'status': 'pending'
                }
            ])
        
        return base_tasks
    
    def _allocate_resources(self, context: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Allocate available resources to incident."""
        available = context.get('available_resources', [])
        incident = context.get('incident', {})
        
        allocations = []
        
        # Sort resources by proximity to incident (simplified)
        # In production, use actual GIS distance calculation
        
        for resource in available[:5]:  # Allocate top 5 nearest
            allocation = {
                'resource_id': resource.get('id'),
                'unit_name': resource.get('unit_name', 'Unknown'),
                'type': resource.get('type', 'general'),
                'action': 'DEPLOY' if resource.get('status') == 'available' else 'STANDBY',
                'destination': {
                    'latitude': incident.get('latitude'),
                    'longitude': incident.get('longitude')
                },
                'eta': self._calculate_eta(resource, incident),
                'task': self._assign_task_to_resource(resource)
            }
            allocations.append(allocation)
        
        return allocations
    
    def _create_communication_protocol(self, severity: str) -> Dict[str, Any]:
        """Create communication protocol for response."""
        if severity in ['critical', 'high']:
            return {
                'primary_channel': 'Radio Channel 7 (Emergency)',
                'backup_channel': 'Satellite Phone Network',
                'update_frequency': '15 minutes',
                'reporting_chain': [
                    'Field Teams → Incident Commander → EOC Director',
                    'Public Updates via Press Officer'
                ],
                'escalation_contact': 'State Emergency Command Center',
                'public_hotline': '1-800-FLOOD-HELP',
                'social_media': 'Active monitoring and updates',
                'encryption': 'Required for sensitive communications'
            }
        else:
            return {
                'primary_channel': 'Radio Channel 5 (Operations)',
                'backup_channel': 'Mobile phones',
                'update_frequency': '30 minutes',
                'reporting_chain': [
                    'Field Supervisors → Operations Coordinator'
                ],
                'public_hotline': '311 (Non-emergency)',
                'social_media': 'Standard updates',
                'encryption': 'Optional'
            }
    
    def _create_response_timeline(self, severity: str) -> Dict[str, List[str]]:
        """Create response timeline."""
        if severity in ['critical', 'high']:
            return {
                '0-15 min': [
                    'Activate EOC',
                    'Deploy first responders',
                    'Issue emergency alerts'
                ],
                '15-30 min': [
                    'Begin evacuations',
                    'Establish command post',
                    'Open communication channels'
                ],
                '30-60 min': [
                    'Setup field medical stations',
                    'Coordinate with hospitals',
                    'Deploy additional resources'
                ],
                '1-2 hours': [
                    'Complete priority evacuations',
                    'Open emergency shelters',
                    'Secure critical infrastructure'
                ],
                '2-4 hours': [
                    'Continuous monitoring',
                    'Resource rotation',
                    'Situation assessment'
                ],
                '4+ hours': [
                    'Long-term response planning',
                    'Recovery preparation',
                    'Sustained operations'
                ]
            }
        else:
            return {
                '0-1 hour': [
                    'Alert standby teams',
                    'Issue public advisory'
                ],
                '1-4 hours': [
                    'Monitor situation',
                    'Prepare resources'
                ],
                '4+ hours': [
                    'Continue monitoring',
                    'Regular updates'
                ]
            }
    
    def _estimate_required_responders(self, severity: str) -> Dict[str, int]:
        """Estimate number of responders needed."""
        if severity == 'critical':
            return {
                'fire_rescue': 50,
                'police': 40,
                'medical': 30,
                'volunteers': 100,
                'total': 220
            }
        elif severity == 'high':
            return {
                'fire_rescue': 30,
                'police': 25,
                'medical': 20,
                'volunteers': 50,
                'total': 125
            }
        elif severity == 'medium':
            return {
                'fire_rescue': 15,
                'police': 10,
                'medical': 10,
                'volunteers': 25,
                'total': 60
            }
        else:
            return {
                'fire_rescue': 5,
                'police': 5,
                'medical': 5,
                'volunteers': 10,
                'total': 25
            }
    
    def _identify_special_considerations(self, context: Dict[str, Any]) -> List[str]:
        """Identify special considerations for the response."""
        considerations = []
        
        incident = context.get('incident', {})
        prediction = context.get('prediction', {})
        
        # Time-based considerations
        if prediction and prediction.get('predicted_time'):
            time_to_impact = prediction.get('predicted_time')
            considerations.append(f"Time to impact: {time_to_impact}")
        
        # Population considerations
        if prediction and prediction.get('affected_population', 0) > 100000:
            considerations.append("Large population at risk - mobilize maximum resources")
        
        # Severity considerations
        if incident.get('severity') == 'critical':
            considerations.append("Critical severity - request state/national assistance")
        
        # Infrastructure considerations
        considerations.append("Prioritize hospitals, schools, and care facilities")
        considerations.append("Establish redundant communication systems")
        
        return considerations
    
    def _calculate_eta(self, resource: Dict[str, Any], incident: Dict[str, Any]) -> str:
        """Calculate ETA for resource to reach incident (simplified)."""
        # Simplified - in production, use actual routing API
        return "15-20 minutes"
    
    def _assign_task_to_resource(self, resource: Dict[str, Any]) -> str:
        """Assign specific task based on resource type."""
        resource_type = resource.get('type', 'general')
        
        task_map = {
            'ambulance': 'Medical evacuation and triage',
            'fire_truck': 'Water rescue and fire suppression',
            'boat': 'Water rescue operations',
            'helicopter': 'Aerial reconnaissance and rescue',
            'police': 'Evacuation coordination and security',
            'general': 'Support operations as assigned'
        }
        
        return task_map.get(resource_type, 'General emergency response')
