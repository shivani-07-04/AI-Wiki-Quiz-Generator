import json
import logging
import google.generativeai as genai
from typing import List, Dict
from app.config import settings
from app.utils.errors import LLMGenerationError

logger = logging.getLogger(__name__)

class LLMService:
    """Service for generating quiz content using LLM"""
    
    def __init__(self):
        if not settings.GEMINI_API_KEY:
            logger.error("GEMINI_API_KEY not configured")
            raise LLMGenerationError(
                "GEMINI_API_KEY environment variable not set. "
                "Please configure your API key."
            )
        genai.configure(api_key=settings.GEMINI_API_KEY)
        self.model = genai.GenerativeModel(settings.LLM_MODEL)
        logger.info(f"LLM Service initialized with model: {settings.LLM_MODEL}")
    
    def generate_quiz_questions(
        self,
        article_content: str,
        article_title: str,
        num_questions: int = 8
    ) -> List[Dict]:
        """
        Generate quiz questions from article content using LLM
        Returns: List of question objects with options, correct answer, and explanation
        """
        
        prompt = self._build_quiz_prompt(article_content, article_title, num_questions)
        
        try:
            logger.info(f"Generating quiz questions for article: {article_title}")
            response = self.model.generate_content(prompt)
            questions = self._parse_quiz_response(response.text)
            logger.info(f"Successfully generated {len(questions)} questions")
            return questions
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse LLM response: {str(e)}")
            raise LLMGenerationError(
                f"LLM response format error: {str(e)}"
            )
        except Exception as e:
            logger.error(f"Failed to generate quiz questions: {str(e)}")
            raise LLMGenerationError(
                f"Failed to generate quiz questions: {str(e)}"
            )
    
    def _build_quiz_prompt(self, content: str, title: str, num_questions: int) -> str:
        """Build prompt for quiz generation"""
        
        return f"""You are an expert educator. Generate exactly {num_questions} high-quality multiple-choice quiz questions based on the following Wikipedia article about "{title}".

Article Content:
{content[:5000]}

Requirements:
1. Generate exactly {num_questions} questions
2. Each question should have 4 options labeled A, B, C, D
3. Mix difficulty levels: Easy (40%), Medium (40%), Hard (20%)
4. Ground all questions in the article content
5. Provide a brief explanation for each correct answer
6. Ensure questions are educational and comprehensive

Return the response as a JSON array with this exact structure:
[
  {{
    "id": 1,
    "question": "Question text here?",
    "topic": "Topic name",
    "difficulty": "easy|medium|hard",
    "options": [
      {{"label": "A", "text": "Option A"}},
      {{"label": "B", "text": "Option B"}},
      {{"label": "C", "text": "Option C"}},
      {{"label": "D", "text": "Option D"}}
    ],
    "correct_answer": "A",
    "explanation": "Explanation grounded in the article"
  }}
]

IMPORTANT: Return ONLY valid JSON, no other text."""
    
    def _parse_quiz_response(self, response_text: str) -> List[Dict]:
        """Parse LLM response into quiz questions"""
        
        try:
            logger.debug(f"Parsing LLM response: {response_text[:200]}...")
            
            # Extract JSON from response (handle markdown code blocks)
            json_str = response_text
            
            if '```json' in json_str:
                json_str = json_str.split('```json')[1].split('```')[0]
            elif '```' in json_str:
                json_str = json_str.split('```')[1].split('```')[0]
            
            json_str = json_str.strip()
            questions = json.loads(json_str)
            
            if not isinstance(questions, list):
                raise ValueError("Response must be a JSON array of questions")
            
            if len(questions) == 0:
                raise ValueError("Response contains no questions")
            
            # Validate structure
            for idx, q in enumerate(questions):
                required_keys = ['question', 'options', 'correct_answer', 'explanation']
                missing = [k for k in required_keys if k not in q]
                if missing:
                    raise ValueError(
                        f"Question {idx+1} missing keys: {', '.join(missing)}"
                    )
                
                if len(q['options']) != 4:
                    raise ValueError(
                        f"Question {idx+1} has {len(q['options'])} options, expected 4"
                    )
            
            logger.info(f"Successfully parsed {len(questions)} questions from LLM response")
            return questions
        
        except json.JSONDecodeError as e:
            logger.error(f"JSON parse error: {str(e)}")
            raise LLMGenerationError(
                f"Failed to parse LLM response as JSON: {str(e)}"
            )
        except ValueError as e:
            logger.error(f"Validation error: {str(e)}")
            raise LLMGenerationError(f"Invalid question format: {str(e)}")
    
    def generate_article_summary(self, content: str, title: str) -> str:
        """Generate a concise summary of the article"""
        
        prompt = f"""Write a brief, educational summary (2-3 sentences) of this Wikipedia article about "{title}":

{content[:2000]}

Summary:"""
        
        try:
            response = self.model.generate_content(prompt)
            return response.text.strip()
        except Exception as e:
            raise Exception(f"Failed to generate summary: {str(e)}")
