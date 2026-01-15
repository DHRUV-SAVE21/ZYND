"""Base agent class for all AI agents using Google Gemini."""
from abc import ABC, abstractmethod
from typing import Dict, Any, Optional
import google.generativeai as genai
from app.config import settings
import logging

logger = logging.getLogger(__name__)


class BaseAgent(ABC):
    """Base class for all AI agents using Gemini."""
    
    def __init__(self, name: str, model: str = "gemini-pro"):
        self.name = name
        self.model = model
        # Configure Gemini
        genai.configure(api_key=settings.GEMINI_API_KEY)
        self.client = genai.GenerativeModel(model)
        logger.info(f"Initialized agent: {name} with Gemini {model}")
    
    @abstractmethod
    async def execute(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """
        Execute the agent's task.
        
        Args:
            context: Input context for the agent
            
        Returns:
            Result dictionary
        """
        pass
    
    async def _call_llm(
        self, 
        system_prompt: str, 
        user_message: str,
        temperature: float = 0.2
    ) -> str:
        """
        Call Gemini LLM with a system prompt and user message.
        
        Args:
            system_prompt: System instructions
            user_message: User message/context
            temperature: Sampling temperature (0.0 - 1.0)
            
        Returns:
            LLM response text
        """
        try:
            # Combine system prompt and user message for Gemini
            full_prompt = f"{system_prompt}\n\n{user_message}"
            
            # Generate content with Gemini
            response = await self.client.generate_content_async(
                full_prompt,
                generation_config=genai.types.GenerationConfig(
                    temperature=temperature,
                    max_output_tokens=2000,
                )
            )
            return response.text
        except Exception as e:
            logger.error(f"Gemini LLM call failed for {self.name}: {str(e)}")
            raise
    
    def _format_context(self, context: Dict[str, Any]) -> str:
        """Format context dictionary into a readable string."""
        lines = []
        for key, value in context.items():
            lines.append(f"{key}: {value}")
        return "\n".join(lines)
