# Testing Guide for AI Wiki Quiz Generator

This guide covers testing both the backend and frontend components.

## Backend Testing

### Setup Testing Environment

```bash
cd backend

# Activate virtual environment
source venv/bin/activate  # macOS/Linux
venv\Scripts\activate      # Windows

# Install test dependencies (if not already in requirements.txt)
pip install pytest pytest-asyncio pytest-cov httpx
```

### Run Tests

```bash
# Run all tests
pytest

# Run tests with coverage report
pytest --cov=app

# Run specific test file
pytest tests/test_quiz_api.py

# Run tests with verbose output
pytest -v

# Run only integration tests (marked with @pytest.mark.slow)
pytest -m slow

# Run tests excluding slow integration tests
pytest -m "not slow"
```

### Test Structure

```
backend/tests/
├── __init__.py
├── conftest.py           # Pytest configuration and fixtures
├── test_quiz_api.py      # API endpoint tests
├── test_services.py      # Service layer tests
└── test_models.py        # (Optional) Model tests
```

### Test Files Overview

#### `tests/conftest.py`
Contains pytest fixtures:
- `db`: Test database connection
- `sample_quiz_data`: Sample quiz object for testing

#### `tests/test_quiz_api.py`
Tests for API endpoints:
- Health check endpoint
- Quiz generation endpoint (success and error cases)
- Quiz history endpoint (pagination)
- Quiz retrieval endpoint

#### `tests/test_services.py`
Tests for business logic:
- Wikipedia service HTML parsing
- URL validation
- Image URL conversion
- LLM response parsing

### Manual Testing with cURL

#### Test Health Check
```bash
curl http://localhost:8000/health
```

#### Test Quiz Generation (Valid URL)
```bash
curl -X POST http://localhost:8000/api/quiz/generate \
  -H "Content-Type: application/json" \
  -d '{"url": "https://en.wikipedia.org/wiki/Alan_Turing"}'
```

#### Test Quiz Generation (Invalid URL)
```bash
curl -X POST http://localhost:8000/api/quiz/generate \
  -H "Content-Type: application/json" \
  -d '{"url": "https://www.google.com"}'
```

#### Test Quiz History
```bash
curl "http://localhost:8000/api/quiz/history?limit=10&offset=0"
```

#### Test Quiz Retrieval (replace with real UUID)
```bash
curl http://localhost:8000/api/quiz/12345-uuid-here
```

### Interactive Testing with Swagger UI

1. Start backend: `python main.py`
2. Open browser: `http://localhost:8000/docs`
3. Try each endpoint with the interactive interface

## Frontend Testing

### Setup Testing Environment

```bash
# At project root
npm install
```

### Run Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

### Manual Testing

#### Test Quiz Generation

1. Start frontend: `npm run dev`
2. Open `http://localhost:3000`
3. Enter a Wikipedia URL (e.g., `https://en.wikipedia.org/wiki/Albert_Einstein`)
4. Click "Generate Quiz"
5. Verify:
   - Article overview displays
   - Quiz questions appear
   - Questions can be expanded/collapsed
   - Answer selection works
   - Explanation displays after answering

#### Test Quiz History

1. After generating a quiz, click "Quiz History" tab
2. Verify the quiz appears in the table
3. Click "View Details" button
4. Verify full quiz displays in modal

#### Test Dark Mode

1. Check system dark mode setting
2. Verify dark theme applies to UI
3. Check all colors are readable in both themes

#### Test Responsive Design

1. Open DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Test at different breakpoints:
   - Mobile (375px)
   - Tablet (768px)
   - Desktop (1920px)

#### Test Error Handling

1. **Invalid URL**:
   - Enter invalid URL: `not-a-url`
   - Should show error message

2. **Non-Wikipedia URL**:
   - Enter `https://www.google.com`
   - Should show error message

3. **Backend Down**:
   - Stop backend: `Ctrl+C`
   - Try generating quiz
   - Should show connection error

## Integration Testing

### Full Stack Test

1. Start backend: `cd backend && python main.py`
2. In another terminal, start frontend: `npm run dev`
3. Generate a quiz from Wikipedia
4. Verify data flows from frontend → backend → database → frontend
5. Check quiz appears in history
6. View quiz details

### Performance Testing

#### Backend Performance
```bash
# Time a quiz generation (rough estimate)
time curl -X POST http://localhost:8000/api/quiz/generate \
  -H "Content-Type: application/json" \
  -d '{"url": "https://en.wikipedia.org/wiki/Python_(programming_language)"}'
```

Expected: 10-30 seconds (mostly waiting for Gemini API)

#### Frontend Performance
1. Open DevTools → Performance tab
2. Generate quiz
3. Monitor:
   - Time to First Contentful Paint (FCP)
   - Largest Contentful Paint (LCP)
   - Cumulative Layout Shift (CLS)

## Error Scenario Testing

### Backend Errors

#### 1. Missing GEMINI_API_KEY
```bash
# Remove or unset API key in .env
GEMINI_API_KEY=""

# Try generating quiz
# Should return: 503 Service Unavailable
```

#### 2. Database Connection Error
```bash
# Stop PostgreSQL
# Try generating quiz
# Should return: 500 Internal Server Error
```

#### 3. Wikipedia Timeout
```bash
# Manually modify timeout to very small value (for testing)
# Request to slow Wikipedia article
# Should return: 502 Bad Gateway with timeout message
```

#### 4. Invalid JSON Response from LLM
```bash
# Modify LLM prompt to cause invalid JSON response
# Should catch and return helpful error
```

### Frontend Errors

#### 1. Backend URL Misconfiguration
```bash
# Set wrong .env.local:
NEXT_PUBLIC_API_URL=http://localhost:9999

# Try generating quiz
# Should show connection error
```

#### 2. Invalid Wikipedia URL
- Enter: `https://en.wikipedia.org/wiki/Invalid_Article_12345`
- Should show user-friendly error

#### 3. Network Timeout
- Use DevTools to throttle network (Very slow 3G)
- Generate quiz
- Should show loading spinner, then timeout error

## Code Quality Testing

### Backend Linting

```bash
cd backend

# Install linting tools (optional)
pip install pylint flake8

# Run linter
pylint app/
flake8 app/

# Check code style
python -m py_compile app/
```

### Frontend Linting

```bash
npm run lint
```

## Database Testing

### Test Database Schema

```bash
# Connect to PostgreSQL
psql postgresql://user:password@localhost/ai_wiki_quiz

# List tables
\dt

# Check quizzes table structure
\d quizzes

# Query sample data
SELECT id, article_title, created_at FROM quizzes LIMIT 5;

# Count total quizzes
SELECT COUNT(*) FROM quizzes;
```

### Test Data Persistence

1. Generate 3 quizzes via API
2. Restart backend
3. Query `/api/quiz/history`
4. Verify all 3 quizzes still exist

## Test Checklist

### Before Deployment

- [ ] All backend tests pass: `pytest`
- [ ] All frontend tests pass: `npm test`
- [ ] No console errors in DevTools
- [ ] Quiz generation works end-to-end
- [ ] Quiz history displays correctly
- [ ] Dark mode works
- [ ] Mobile responsive design works
- [ ] Error messages display properly
- [ ] Database persists data correctly
- [ ] API documentation loads: `/docs`

### Smoke Tests (Quick Sanity Check)

```bash
# Backend health
curl http://localhost:8000/health

# Frontend loads
curl http://localhost:3000 | head -20

# API works
curl http://localhost:8000/api/quiz/history

# Generate quiz
curl -X POST http://localhost:8000/api/quiz/generate \
  -H "Content-Type: application/json" \
  -d '{"url": "https://en.wikipedia.org/wiki/Python_(programming_language)"}'
```

## Troubleshooting Tests

### Test Fails with "Database locked"

**Solution**: Clear old test databases
```bash
rm test.db  # if using SQLite
```

### Test Fails with "Module not found"

**Solution**: Ensure working directory is correct
```bash
cd backend
pytest
```

### Tests Hang (Timeout)

**Reason**: Integration tests marked with `@pytest.mark.slow` may be slow

**Solution**: Skip slow tests
```bash
pytest -m "not slow"
```

### Flaky Tests (Intermittent Failures)

**Reason**: May depend on external services (Wikipedia, Gemini)

**Solution**: Skip integration tests in CI/CD
```bash
pytest -m "not slow" -v
```

## Continuous Integration

### GitHub Actions Example

Create `.github/workflows/test.yml`:

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: password
          POSTGRES_DB: ai_wiki_quiz
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Set up Python
      uses: actions/setup-python@v4
      with:
        python-version: '3.11'
    
    - name: Install backend dependencies
      run: |
        cd backend
        pip install -r requirements.txt
    
    - name: Run backend tests
      env:
        DATABASE_URL: postgresql://postgres:password@localhost/ai_wiki_quiz
        GEMINI_API_KEY: ${{ secrets.GEMINI_API_KEY }}
      run: |
        cd backend
        pytest -v -m "not slow"
    
    - name: Set up Node
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    
    - name: Install frontend dependencies
      run: npm install
    
    - name: Run frontend tests
      run: npm test
```

## Performance Benchmarks

### Expected Performance

| Operation | Time | Status |
|-----------|------|--------|
| Health check | <100ms | ✅ |
| Get history (50 items) | <200ms | ✅ |
| Get quiz by ID | <100ms | ✅ |
| Generate quiz | 10-30s | ✅ |
| Frontend page load | <2s | ✅ |

### Profiling

```bash
# Backend: Enable DEBUG mode for query logging
DEBUG=True python main.py
# Check logs for slow queries

# Frontend: Use React DevTools Profiler
# Open React DevTools → Profiler tab
```

---

**Happy testing! 🧪**
