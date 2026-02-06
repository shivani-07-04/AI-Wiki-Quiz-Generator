import logging
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas import (
    QuizGenerationRequest,
    QuizResponse,
    QuizHistoryResponse
)
from app.services.quiz_service import QuizService
from app.utils.errors import (
    WikipediaScrapingError,
    InvalidWikipediaURLError,
    LLMGenerationError,
    DatabaseError
)

logger = logging.getLogger(__name__)
router = APIRouter()
quiz_service = QuizService()

@router.post("/generate", response_model=QuizResponse)
async def generate_quiz(
    request: QuizGenerationRequest,
    db: Session = Depends(get_db)
):
    """
    Generate a quiz from a Wikipedia article URL
    
    - **url**: Valid Wikipedia article URL (e.g., https://en.wikipedia.org/wiki/Alan_Turing)
    
    Returns complete quiz with article overview, questions, and related topics
    """
    
    try:
        logger.info(f"Quiz generation request for: {request.url}")
        quiz_data = quiz_service.generate_quiz_from_url(str(request.url), db)
        logger.info(f"Successfully generated quiz: {quiz_data.get('id')}")
        return quiz_data
    
    except InvalidWikipediaURLError as e:
        logger.warning(f"Invalid Wikipedia URL: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except WikipediaScrapingError as e:
        logger.error(f"Wikipedia scraping error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=str(e)
        )
    except LLMGenerationError as e:
        logger.error(f"LLM generation error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"AI service error: {str(e)}"
        )
    except ValueError as e:
        logger.warning(f"Validation error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid input: {str(e)}"
        )
    except Exception as e:
        logger.error(f"Unexpected error generating quiz: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred. Please try again later."
        )

@router.get("/history", response_model=QuizHistoryResponse)
async def get_quiz_history(
    limit: int = 50,
    offset: int = 0,
    db: Session = Depends(get_db)
):
    """
    Get quiz generation history
    
    - **limit**: Maximum number of quizzes to return (default: 50)
    - **offset**: Number of quizzes to skip (default: 0)
    
    Returns paginated list of previously generated quizzes
    """
    
    # Validate parameters
    if limit < 1 or limit > 100:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="limit must be between 1 and 100"
        )
    if offset < 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="offset must be >= 0"
        )
    
    try:
        logger.info(f"Fetching history: limit={limit}, offset={offset}")
        history = quiz_service.get_quiz_history(db, limit, offset)
        logger.info(f"Retrieved {len(history['quizzes'])} quizzes")
        return history
    
    except Exception as e:
        logger.error(f"Failed to retrieve history: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve history. Please try again later."
        )

@router.get("/{quiz_id}", response_model=QuizResponse)
async def get_quiz(
    quiz_id: str,
    db: Session = Depends(get_db)
):
    """
    Retrieve a specific quiz by ID
    
    - **quiz_id**: UUID of the quiz to retrieve
    
    Returns full quiz data with all details
    """
    
    try:
        logger.info(f"Fetching quiz: {quiz_id}")
        quiz_data = quiz_service.get_quiz_by_id(quiz_id, db)
        logger.info(f"Successfully retrieved quiz: {quiz_id}")
        return quiz_data
    
    except Exception as e:
        error_msg = str(e)
        if "not found" in error_msg.lower():
            logger.warning(f"Quiz not found: {quiz_id}")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Quiz not found: {quiz_id}"
            )
        logger.error(f"Failed to retrieve quiz {quiz_id}: {error_msg}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve quiz. Please try again later."
        )
