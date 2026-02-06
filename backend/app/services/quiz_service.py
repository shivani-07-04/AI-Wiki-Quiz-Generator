import uuid
from datetime import datetime
from sqlalchemy.orm import Session
from app.models import Quiz
from app.services.wikipedia_service import WikipediaService
from app.services.llm_service import LLMService
from app.config import settings

class QuizService:
    """Service for managing quiz generation and retrieval"""
    
    def __init__(self):
        self.wikipedia_service = WikipediaService()
        self.llm_service = LLMService()
    
    def generate_quiz_from_url(self, url: str, db: Session) -> dict:
        """
        Complete pipeline to generate quiz from Wikipedia URL
        1. Scrape Wikipedia article
        2. Generate quiz questions using LLM
        3. Save to database
        4. Return complete quiz data
        """
        
        # Step 1: Scrape Wikipedia
        article_data = self.wikipedia_service.get_article_content(str(url))
        
        # Step 2: Generate quiz questions
        combined_content = f"{article_data['summary']}\n\n" + "\n\n".join([
            f"{section['title']}: {section['content']}"
            for section in article_data['sections']
        ])
        
        quiz_questions = self.llm_service.generate_quiz_questions(
            combined_content,
            article_data['title'],
            settings.NUM_QUESTIONS
        )
        
        # Extract related topics
        from bs4 import BeautifulSoup
        soup = BeautifulSoup(article_data['raw_html'], 'html.parser')
        related_topics = self.wikipedia_service.extract_related_topics(soup)
        
        # Step 3: Save to database
        quiz_id = str(uuid.uuid4())
        
        quiz = Quiz(
            id=quiz_id,
            wikipedia_url=str(url),
            article_title=article_data['title'],
            article_summary=article_data['summary'],
            article_image_url=article_data['image_url'],
            sections=[
                {
                    'title': section['title'],
                    'content': section['content'][:500],  # Limit content
                    'image_url': None
                }
                for section in article_data['sections']
            ],
            quiz_data=quiz_questions,
            related_topics=related_topics
        )
        
        db.add(quiz)
        db.commit()
        db.refresh(quiz)
        
        # Step 4: Return formatted response
        return self._format_quiz_response(quiz)
    
    def get_quiz_by_id(self, quiz_id: str, db: Session) -> dict:
        """Retrieve a quiz by ID"""
        
        quiz = db.query(Quiz).filter(Quiz.id == quiz_id).first()
        
        if not quiz:
            raise Exception(f"Quiz with ID {quiz_id} not found")
        
        return self._format_quiz_response(quiz)
    
    def get_quiz_history(self, db: Session, limit: int = 50, offset: int = 0):
        """Get list of all generated quizzes"""
        
        total = db.query(Quiz).count()
        quizzes = db.query(Quiz).order_by(Quiz.created_at.desc()).offset(offset).limit(limit).all()
        
        return {
            'total': total,
            'quizzes': [
                {
                    'id': quiz.id,
                    'article_title': quiz.article_title,
                    'wikipedia_url': quiz.wikipedia_url,
                    'created_at': quiz.created_at
                }
                for quiz in quizzes
            ]
        }
    
    def _format_quiz_response(self, quiz: Quiz) -> dict:
        """Format quiz database object to response format"""
        
        return {
            'id': quiz.id,
            'wikipedia_url': quiz.wikipedia_url,
            'article_title': quiz.article_title,
            'article_summary': quiz.article_summary,
            'article_image_url': quiz.article_image_url,
            'sections': quiz.sections or [],
            'quiz_data': quiz.quiz_data or [],
            'related_topics': quiz.related_topics or [],
            'created_at': quiz.created_at
        }
