"""
Pytest configuration and fixtures
"""

import os
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.database import Base
from app.models import Quiz

# Use in-memory SQLite for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

@pytest.fixture(scope="session")
def db():
    """Create test database and tables"""
    engine = create_engine(
        SQLALCHEMY_DATABASE_URL,
        connect_args={"check_same_thread": False}
    )
    Base.metadata.create_all(bind=engine)
    
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    
    yield TestingSessionLocal()
    
    Base.metadata.drop_all(bind=engine)

@pytest.fixture
def sample_quiz_data():
    """Sample quiz data for testing"""
    return {
        'id': 'test-uuid-123',
        'wikipedia_url': 'https://en.wikipedia.org/wiki/Alan_Turing',
        'article_title': 'Alan Turing',
        'article_summary': 'Alan Turing was a British mathematician...',
        'article_image_url': 'https://example.com/image.jpg',
        'sections': [
            {
                'title': 'Early Life',
                'content': 'Alan Mathison Turing was born in London...',
                'image_url': None
            }
        ],
        'quiz_data': [
            {
                'id': 1,
                'question': 'What was Alan Turing famous for?',
                'topic': 'Biography',
                'difficulty': 'easy',
                'options': [
                    {'label': 'A', 'text': 'Computer Science'},
                    {'label': 'B', 'text': 'Physics'},
                    {'label': 'C', 'text': 'Chemistry'},
                    {'label': 'D', 'text': 'Biology'}
                ],
                'correct_answer': 'A',
                'explanation': 'Alan Turing was a pioneer in computer science.'
            }
        ],
        'related_topics': [
            {
                'title': 'Turing Machine',
                'url': 'https://en.wikipedia.org/wiki/Turing_machine',
                'summary': None,
                'image_url': None
            }
        ]
    }
