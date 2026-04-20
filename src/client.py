"""Shared Anthropic client instance."""

import anthropic
from src.config import ANTHROPIC_API_KEY

client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY.strip() if ANTHROPIC_API_KEY else None)
