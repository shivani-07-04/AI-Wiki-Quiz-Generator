# AI Wiki Quiz Generator - Backend

Python FastAPI backend for generating interactive quizzes from Wikipedia articles using AI (Gemini).

## Features

- **Wikipedia Scraping**: Extract articles, sections, and images using BeautifulSoup
- **AI Quiz Generation**: Generate 5-10 multiple-choice questions using Google Gemini
- **PostgreSQL Storage**: Store quizzes with full metadata and history
- **RESTful API**: Clean API endpoints for quiz generation and retrieval
- **Error Handling**: Robust error handling and validation

## Setup

### 1. Prerequisites

- Python 3.10+
- PostgreSQL 12+
- Google Gemini API key (free tier available)

### 2. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 3. Environment Configuration

Copy `.env.example` to `.env` and fill in values:

```bash
cp .env.example .env
```

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/ai_wiki_quiz

# LLM
GEMINI_API_KEY=your_api_key_here

# Debug
DEBUG=False
```

### 4. Create Database

#### Option A: PostgreSQL on your machine

```bash
# Create database and user
createdb ai_wiki_quiz
```

#### Option B: Docker PostgreSQL

```bash
docker run --name postgres-quiz -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=ai_wiki_quiz -p 5432:5432 -d postgres:15
```

Then update `DATABASE_URL`:
```
DATABASE_URL=postgresql://postgres:password@localhost:5432/ai_wiki_quiz
```

### 5. Initialize Database Tables

```bash
python create_db.py
```

### 6. Run Backend Server

```bash
# Development with auto-reload
python main.py

# Or with uvicorn
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Server will be available at `http://localhost:8000`

## API Documentation

Once running, visit `http://localhost:8000/docs` for interactive API documentation (Swagger UI).

### Endpoints

#### POST `/api/quiz/generate`
Generate a quiz from a Wikipedia URL.

**Request:**
```json
{
  "url": "https://en.wikipedia.org/wiki/Alan_Turing"
}
```

**Response:**
```json
{
  "id": "uuid",
  "wikipedia_url": "...",
  "article_title": "...",
  "article_summary": "...",
  "article_image_url": "...",
  "sections": [...],
  "quiz_data": [...],
  "related_topics": [...],
  "created_at": "2024-01-01T12:00:00Z"
}
```

#### GET `/api/quiz/history`
Get list of all generated quizzes.

**Query Parameters:**
- `limit`: Maximum results (default: 50)
- `offset`: Pagination offset (default: 0)

**Response:**
```json
{
  "total": 10,
  "quizzes": [
    {
      "id": "uuid",
      "article_title": "...",
      "wikipedia_url": "...",
      "created_at": "2024-01-01T12:00:00Z"
    }
  ]
}
```

#### GET `/api/quiz/{quiz_id}`
Retrieve a specific quiz by ID.

**Response:** Full quiz data

### Testing with cURL

```bash
# Generate quiz
curl -X POST "http://localhost:8000/api/quiz/generate" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://en.wikipedia.org/wiki/Alan_Turing"}'

# Get history
curl "http://localhost:8000/api/quiz/history"

# Get specific quiz
curl "http://localhost:8000/api/quiz/{quiz_id}"
```

## Architecture

### Services

- **WikipediaService**: Scrapes Wikipedia articles using BeautifulSoup
- **LLMService**: Generates quiz questions using Google Gemini API
- **QuizService**: Orchestrates the entire pipeline

### Data Flow

1. User submits Wikipedia URL
2. WikipediaService scrapes article content
3. LLMService generates quiz questions from content
4. QuizService saves to database
5. API returns complete quiz data

### Database Schema

**quizzes** table:
- `id` (UUID) - Primary key
- `wikipedia_url` (String) - Source URL
- `article_title` (String) - Article name
- `article_summary` (Text) - Summary text
- `article_image_url` (String) - Main image URL
- `sections` (JSON) - Article sections
- `quiz_data` (JSON) - Quiz questions
- `related_topics` (JSON) - Related Wikipedia articles
- `created_at` (DateTime) - Creation timestamp
- `updated_at` (DateTime) - Update timestamp

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost/db` |
| `GEMINI_API_KEY` | Google Gemini API key | Get from https://makersuite.google.com/app/apikey |
| `DEBUG` | Debug mode | `False` |
| `NUM_QUESTIONS` | Number of questions to generate | `8` |
| `REQUEST_TIMEOUT` | HTTP request timeout in seconds | `30` |

## Troubleshooting

### "Could not connect to database"

1. Check PostgreSQL is running: `psql --version`
2. Verify DATABASE_URL is correct
3. Ensure database exists: `createdb ai_wiki_quiz`
4. Check database is accessible

### "GEMINI_API_KEY not set"

1. Get free API key: https://makersuite.google.com/app/apikey
2. Add to `.env`: `GEMINI_API_KEY=your_key_here`
3. Restart server

### "Failed to fetch Wikipedia article"

1. Verify Wikipedia URL is valid
2. Check internet connection
3. Wikipedia may have rate limiting - try again later

## Performance Tips

- Quiz generation takes 10-30 seconds (LLM API latency)
- Cache frequently accessed quizzes
- Consider async processing for high volume

## Development

### Running Tests

```bash
# Install test dependencies
pip install pytest pytest-asyncio httpx

# Run tests
pytest
```

### Code Structure

```
backend/
├── main.py                      # FastAPI app entry point
├── app/
│   ├── config.py               # Configuration
│   ├── database.py             # Database setup
│   ├── models.py               # SQLAlchemy models
│   ├── schemas.py              # Pydantic schemas
│   ├── services/
│   │   ├── wikipedia_service.py  # Web scraping
│   │   ├── llm_service.py        # AI generation
│   │   └── quiz_service.py       # Orchestration
│   └── routes/
│       └── quiz.py             # API endpoints
└── requirements.txt            # Dependencies
```

## License

MIT
