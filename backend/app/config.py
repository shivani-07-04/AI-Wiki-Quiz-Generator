import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    """Application settings and configuration"""
    
    # Database
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "postgresql://user:password@localhost/ai_wiki_quiz"
    )
    
    # LLM Configuration
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    LLM_MODEL: str = "gemini-pro"
    
    # Application
    APP_NAME: str = "AI Wiki Quiz Generator"
    DEBUG: bool = os.getenv("DEBUG", "False").lower() == "true"
    
    # Scraping
    WIKIPEDIA_BASE_URL: str = "https://en.wikipedia.org/wiki/"
    REQUEST_TIMEOUT: int = 30
    
    # Quiz Generation
    NUM_QUESTIONS: int = 8  # 5-10 questions
    
    class Config:
        env_file = ".env"

settings = Settings()
