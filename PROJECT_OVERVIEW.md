# AI Wiki Quiz Generator - Project Overview

A full-stack web application that transforms Wikipedia articles into interactive quizzes using AI.

## What It Does

1. **Input**: User provides a Wikipedia article URL
2. **Processing**: 
   - Backend scrapes the Wikipedia article using BeautifulSoup
   - Extracts key sections, summary, and images
   - Uses Google Gemini to generate 5-10 multiple-choice questions
   - Stores everything in PostgreSQL database
3. **Output**: Beautiful UI showing:
   - Article overview with image
   - Topic sections
   - Interactive quiz with instant feedback
   - Related topics for further learning
4. **History**: View previously generated quizzes

## Tech Stack

### Backend
- **Framework**: FastAPI (Python)
- **Database**: PostgreSQL with SQLAlchemy ORM
- **Web Scraping**: BeautifulSoup + requests
- **AI**: Google Gemini via generativeai SDK
- **Server**: Uvicorn (ASGI)

### Frontend
- **Framework**: Next.js 16 with App Router
- **UI Library**: shadcn/ui with Radix UI
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Validation**: Zod + React Hook Form

### Infrastructure
- **Language**: TypeScript (full stack)
- **Database**: PostgreSQL 12+
- **API**: RESTful with OpenAPI/Swagger docs
- **Package Managers**: npm/pnpm (frontend), pip (backend)

## Project Structure

### Backend Architecture

```
Backend (Python FastAPI)
│
├── HTTP Layer (FastAPI)
│   └── routes/quiz.py → /api/quiz/generate, /api/quiz/history, /api/quiz/{id}
│
├── Services Layer
│   ├── WikipediaService: HTML scraping & content extraction
│   ├── LLMService: AI quiz generation using Gemini
│   └── QuizService: Orchestrates pipeline
│
├── Data Layer
│   ├── Models: Quiz (SQLAlchemy)
│   ├── Database: PostgreSQL connection
│   └── Schemas: Pydantic validation
│
└── Config: Settings, environment variables
```

### Frontend Architecture

```
Frontend (Next.js + React)
│
├── Pages
│   └── app/page.tsx → Main quiz application
│
├── Tabs
│   ├── GenerateTab → Input URL, generate quiz
│   └── HistoryTab → View past quizzes
│
├── Components
│   ├── ArticleOverview → Article header with image
│   ├── TopicSections → Article sections display
│   ├── QuizSection → Interactive questions
│   ├── RelatedTopics → Linked Wikipedia topics
│   └── QuizDetailModal → Full quiz view
│
├── API Client (lib/api-client.ts)
│   └── Connects to Python backend
│
└── UI Components
    └── shadcn/ui + Tailwind CSS
```

## Data Flow

### Quiz Generation Flow

```
User Input (Wikipedia URL)
        ↓
[Frontend] Generate Button Click
        ↓
POST /api/quiz/generate with URL
        ↓
[Backend] WikipediaService
├─ Fetch HTML from Wikipedia
├─ Parse with BeautifulSoup
├─ Extract: title, summary, sections, image, related topics
        ↓
[Backend] LLMService
├─ Combine content into prompt
├─ Call Google Gemini API
├─ Generate 8 questions with options & explanations
        ↓
[Backend] QuizService
├─ Save everything to PostgreSQL
├─ Generate UUID for quiz ID
├─ Return complete quiz data
        ↓
[Frontend] Display Results
├─ Article overview
├─ Sections
├─ Interactive quiz
├─ Related topics
```

### Database Schema

```sql
-- quizzes table
CREATE TABLE quizzes (
  id UUID PRIMARY KEY,
  wikipedia_url VARCHAR(500),
  article_title VARCHAR(300),
  article_summary TEXT,
  article_image_url VARCHAR(500),
  sections JSON,              -- Array of {title, content, image_url}
  quiz_data JSON,             -- Array of questions with options
  related_topics JSON,        -- Array of related Wikipedia articles
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

## Key Features

### 1. Wikipedia Integration
- Scrapes any Wikipedia article using BeautifulSoup
- Extracts structured content (sections, images, metadata)
- Graceful error handling for invalid URLs

### 2. AI Quiz Generation
- Uses Google Gemini API to create quiz questions
- Generates 5-10 questions per article
- Automatically determines difficulty levels (easy/medium/hard)
- Provides detailed explanations grounded in article content

### 3. Beautiful User Interface
- Responsive design (mobile, tablet, desktop)
- Dark/light mode support
- Smooth animations and transitions
- Accessibility features (WCAG compliant)

### 4. Quiz Interaction
- Expandable question cards
- Instant feedback on answer selection
- Color-coded difficulty levels
- Detailed explanations for each answer

### 5. Quiz History
- Persists all generated quizzes in database
- View quiz details anytime
- Pagination support for large histories

## API Endpoints

### POST /api/quiz/generate
Generate a quiz from a Wikipedia URL.

```bash
curl -X POST http://localhost:8000/api/quiz/generate \
  -H "Content-Type: application/json" \
  -d '{"url": "https://en.wikipedia.org/wiki/Alan_Turing"}'
```

**Response**: Full quiz data with all questions, sections, and related topics

### GET /api/quiz/history
Get paginated list of generated quizzes.

```bash
curl http://localhost:8000/api/quiz/history?limit=50&offset=0
```

**Response**: List of quiz metadata with timestamps

### GET /api/quiz/{quiz_id}
Retrieve a specific quiz by ID.

```bash
curl http://localhost:8000/api/quiz/uuid-here
```

**Response**: Full quiz data

## Environment Configuration

### Backend (.env)

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/ai_wiki_quiz

# AI
GEMINI_API_KEY=your_gemini_api_key_here

# App
DEBUG=False
NUM_QUESTIONS=8
REQUEST_TIMEOUT=30
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Performance Considerations

### Latency
- Quiz generation: 10-30 seconds (mostly Gemini API latency)
- Quiz retrieval: <100ms (database query)
- History fetch: <200ms (paginated)

### Optimizations
- Database indexing on URL and created_at
- API response caching headers
- Frontend memoization for components
- Lazy loading for images

## Security Features

- ✅ CORS configured for frontend/backend communication
- ✅ Input validation on all endpoints (Pydantic)
- ✅ SQL injection prevention (SQLAlchemy parameterized queries)
- ✅ HTTP-only cookies ready for future auth
- ✅ Rate limiting ready (can be added with middleware)

## Future Enhancements

- [ ] User authentication and personalization
- [ ] Quiz scoring and progress tracking
- [ ] Export quizzes as PDF
- [ ] Custom quiz parameters (num questions, difficulty)
- [ ] Caching with Redis for faster generation
- [ ] Async task queue for large-scale quiz generation
- [ ] Multi-language support
- [ ] Quiz sharing and collaboration
- [ ] Analytics and insights dashboard

## Development Workflow

### Making Changes

**Backend** (Python):
1. Edit files in `backend/app/`
2. Changes auto-reload with Uvicorn (if running with `--reload`)
3. Test via `http://localhost:8000/docs`

**Frontend** (React):
1. Edit files in `app/` or `components/`
2. Changes auto-reload with Next.js
3. Test via `http://localhost:3000`

### Adding Features

**New Backend Feature**:
1. Add database model in `app/models.py`
2. Create Pydantic schema in `app/schemas.py`
3. Add business logic in `app/services/`
4. Add API endpoint in `app/routes/`

**New Frontend Component**:
1. Create component in `components/`
2. Import in appropriate parent component
3. Update API client if needed in `lib/api-client.ts`
4. Add tests if applicable

## Deployment

### Backend Deployment (Railway/Render/Heroku)
1. Set DATABASE_URL environment variable
2. Set GEMINI_API_KEY environment variable
3. Deploy Python app with `requirements.txt`

### Frontend Deployment (Vercel)
1. Connect GitHub repository
2. Set NEXT_PUBLIC_API_URL to your backend URL
3. Deploy automatically on push

## Monitoring & Logging

### Backend Logging
- All API requests logged
- Error stack traces captured
- Database query logs (debug mode)

### Frontend Debugging
- Network requests in browser DevTools
- React DevTools for component state
- Console logs for development

## Testing

### Backend
```bash
pip install pytest
pytest tests/
```

### Frontend
```bash
npm test
```

## Contributing

1. Create feature branch: `git checkout -b feature/my-feature`
2. Make changes
3. Test thoroughly
4. Create pull request
5. Code review and merge

## License

MIT License - see LICENSE file for details

## Support & Documentation

- **API Docs**: `http://localhost:8000/docs` (Swagger UI)
- **Setup Guide**: See `SETUP_GUIDE.md`
- **Backend README**: See `backend/README.md`
- **Frontend Components**: See component files for JSDoc comments

---

**Built with ❤️ for educational purposes**
