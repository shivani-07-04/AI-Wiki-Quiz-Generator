"""
Custom exception classes and error handling utilities
"""

class WikipediaScrapingError(Exception):
    """Raised when Wikipedia scraping fails"""
    pass

class InvalidWikipediaURLError(Exception):
    """Raised when provided URL is not a valid Wikipedia URL"""
    pass

class LLMGenerationError(Exception):
    """Raised when LLM API call fails"""
    pass

class DatabaseError(Exception):
    """Raised when database operations fail"""
    pass

class ValidationError(Exception):
    """Raised when input validation fails"""
    pass

def format_error_response(status_code: int, message: str, error_type: str = None):
    """Format error response for consistency"""
    return {
        "status_code": status_code,
        "error": error_type or "Error",
        "message": message,
        "detail": message
    }
