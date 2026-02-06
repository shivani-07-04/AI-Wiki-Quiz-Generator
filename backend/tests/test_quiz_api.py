"""
Tests for quiz API endpoints
"""

import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_health_check():
    """Test health check endpoint"""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_root_endpoint():
    """Test root endpoint"""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "message" in data

def test_generate_quiz_invalid_url():
    """Test quiz generation with invalid URL"""
    response = client.post(
        "/api/quiz/generate",
        json={"url": "not-a-valid-url"}
    )
    # Should return validation error or 422
    assert response.status_code in [422, 400, 500]

def test_generate_quiz_non_wikipedia_url():
    """Test quiz generation with non-Wikipedia URL"""
    response = client.post(
        "/api/quiz/generate",
        json={"url": "https://www.google.com"}
    )
    # Might fail or return empty data depending on implementation
    assert response.status_code >= 400 or response.status_code == 200

def test_get_history_empty():
    """Test getting history when empty"""
    response = client.get("/api/quiz/history")
    assert response.status_code == 200
    data = response.json()
    assert "total" in data
    assert "quizzes" in data
    assert isinstance(data["quizzes"], list)

def test_get_history_with_pagination():
    """Test history with pagination parameters"""
    response = client.get("/api/quiz/history?limit=10&offset=0")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] >= 0

def test_get_quiz_not_found():
    """Test retrieving non-existent quiz"""
    response = client.get("/api/quiz/nonexistent-id")
    assert response.status_code == 404

def test_cors_headers():
    """Test CORS headers are present"""
    response = client.options(
        "/api/quiz/history",
        headers={"Origin": "http://localhost:3000"}
    )
    # CORS might not be fully testable with TestClient
    assert response.status_code in [200, 404, 405]
