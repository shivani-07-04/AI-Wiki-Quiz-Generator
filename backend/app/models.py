from sqlalchemy import Column, String, DateTime, Integer, JSON, Text
from sqlalchemy.sql import func
from app.database import Base
from datetime import datetime

class Quiz(Base):
    """Quiz model for storing generated quizzes"""
    
    __tablename__ = "quizzes"
    
    id = Column(String(36), primary_key=True, index=True)
    wikipedia_url = Column(String(500), index=True, nullable=False)
    article_title = Column(String(300), nullable=False)
    article_summary = Column(Text, nullable=True)
    article_image_url = Column(String(500), nullable=True)
    
    # Sections data (JSON)
    sections = Column(JSON, nullable=True)
    
    # Quiz questions data (JSON)
    quiz_data = Column(JSON, nullable=True)
    
    # Related topics (JSON)
    related_topics = Column(JSON, nullable=True)
    
    # Metadata
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), nullable=False)
    
    class Config:
        from_attributes = True
