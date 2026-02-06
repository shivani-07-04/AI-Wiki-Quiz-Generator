from pydantic import BaseModel, HttpUrl
from typing import List, Optional
from datetime import datetime

class QuestionOption(BaseModel):
    """Single option in a multiple choice question"""
    label: str
    text: str

class QuizQuestion(BaseModel):
    """Single quiz question"""
    id: int
    question: str
    topic: str
    difficulty: str  # easy, medium, hard
    options: List[QuestionOption]
    correct_answer: str
    explanation: str

class ArticleSection(BaseModel):
    """Section from the article"""
    title: str
    content: str
    image_url: Optional[str] = None

class RelatedTopic(BaseModel):
    """Related Wikipedia topic"""
    title: str
    url: str
    summary: Optional[str] = None
    image_url: Optional[str] = None

class QuizGenerationRequest(BaseModel):
    """Request to generate a quiz from Wikipedia URL"""
    url: HttpUrl

class QuizResponse(BaseModel):
    """Full quiz response data"""
    id: str
    wikipedia_url: str
    article_title: str
    article_summary: str
    article_image_url: Optional[str] = None
    sections: List[ArticleSection]
    quiz_data: List[QuizQuestion]
    related_topics: List[RelatedTopic]
    created_at: datetime

class QuizHistoryItem(BaseModel):
    """Quiz item for history view"""
    id: str
    article_title: str
    wikipedia_url: str
    created_at: datetime

class QuizHistoryResponse(BaseModel):
    """Response for quiz history endpoint"""
    total: int
    quizzes: List[QuizHistoryItem]

    class Config:
        from_attributes = True
