# AI Wiki Quiz Generator - Complete Setup Guide

This is a full-stack application with a **Python FastAPI backend** and **Next.js frontend**. This guide walks you through setting up both parts.

## Quick Overview

- **Backend**: Python FastAPI with PostgreSQL database
- **Frontend**: Next.js 16 with React 19
- **AI**: Google Gemini API for quiz generation
- **Scraping**: BeautifulSoup for Wikipedia articles

## Prerequisites

### System Requirements
- Python 3.10+ (for backend)
- Node.js 18+ (for frontend)
- PostgreSQL 12+ (database)
- Git

### API Keys
- **Google Gemini API**: Get free tier key from [Google AI Studio](https://makersuite.google.com/app/apikey)

## Part 1: Backend Setup

### 1.1 Navigate to Backend Directory

```bash
cd backend
```

### 1.2 Create Python Virtual Environment

```bash
# Create virtual environment
python -m venv venv

# Activate it
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate
```

### 1.3 Install Dependencies

```bash
pip install -r requirements.txt
```

### 1.4 Setup Database

#### Option A: PostgreSQL Local Installation

```bash
# Create database
createdb ai_wiki_quiz

# Create database user (optional, for production)
createuser quiz_user
```

Update `.env`:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/ai_wiki_quiz
```

#### Option B: Docker PostgreSQL (Recommended for Development)

```bash
# Run PostgreSQL container
docker run --name postgres-quiz \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=ai_wiki_quiz \
  -p 5432:5432 \
  -d postgres:15

# Update .env
DATABASE_URL=postgresql://postgres:password@localhost:5432/ai_wiki_quiz
```

### 1.5 Configure Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Fill in the values:

```env
# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/ai_wiki_quiz

# Google Gemini API (get from https://makersuite.google.com/app/apikey)
GEMINI_API_KEY=your_gemini_api_key_here

# Application settings
DEBUG=True
APP_NAME=AI Wiki Quiz Generator
NUM_QUESTIONS=8
```

### 1.6 Create Database Tables

```bash
python create_db.py
```

You should see: `Database tables created successfully!`

### 1.7 Start Backend Server

```bash
# Make sure virtual environment is activated
python main.py
```

Expected output:
```
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
```

**Test it**: Visit `http://localhost:8000/docs` - you should see interactive API documentation

## Part 2: Frontend Setup

### 2.1 Navigate to Project Root

```bash
# From backend directory
cd ..
```

### 2.2 Install Frontend Dependencies

```bash
npm install
# or if using pnpm:
pnpm install
```

### 2.3 Configure Environment Variables

Create `.env.local` in the project root:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

This tells the frontend where your backend API is located.

### 2.4 Start Frontend Development Server

```bash
npm run dev
```

Expected output:
```
  ▲ Next.js 16.1.6
  - Local:        http://localhost:3000
```

### 2.5 Open in Browser

Visit `http://localhost:3000` - you should see the AI Wiki Quiz Generator app!

## Testing the Full Stack

### 1. Verify Backend is Running

```bash
curl http://localhost:8000/health
```

Should return: `{"status":"healthy"}`

### 2. Verify Frontend Connection

- Frontend should load without errors
- You should see the "Generate Quiz" tab

### 3. Test Quiz Generation

1. Go to `http://localhost:3000`
2. Enter a Wikipedia URL: `https://en.wikipedia.org/wiki/Alan_Turing`
3. Click "Generate Quiz"
4. Wait 10-30 seconds (first API call may be slower)
5. You should see a quiz with questions, sections, and related topics

### 4. Test Quiz History

1. After generating a quiz, click the "Quiz History" tab
2. You should see the quiz in the table
3. Click "View Details" to see the full quiz again

## Troubleshooting

### "Connection refused" error when frontend tries to reach backend

**Problem**: Frontend can't connect to `http://localhost:8000`

**Solution**:
1. Verify backend is running: `curl http://localhost:8000/health`
2. Check `.env.local` has correct `NEXT_PUBLIC_API_URL`
3. Restart frontend: `npm run dev`

### "GEMINI_API_KEY not set" error

**Problem**: Backend can't call Gemini API

**Solution**:
1. Get free API key: https://makersuite.google.com/app/apikey
2. Add to `.env`: `GEMINI_API_KEY=your_key_here`
3. Restart backend: `python main.py`

### "Could not connect to database" error

**Problem**: Backend can't reach PostgreSQL

**Solution**:
1. Check PostgreSQL is running
2. Verify DATABASE_URL in `.env` is correct
3. If using Docker: `docker ps` should show postgres container running
4. Try connecting manually: `psql postgresql://postgres:password@localhost/ai_wiki_quiz`

### "Wikipedia scraping failed" error

**Problem**: Backend can't scrape Wikipedia

**Solution**:
1. Verify Wikipedia URL is valid
2. Check internet connection
3. Wikipedia may have rate limiting - try again later
4. Ensure BeautifulSoup is installed: `pip install beautifulsoup4`

### Database tables don't exist

**Problem**: "relation 'quizzes' does not exist"

**Solution**:
1. Run: `python create_db.py`
2. Restart backend

## Production Deployment

### Deploy Backend to Vercel (Not Recommended - Use Railway, Render, or Heroku)

Since Vercel specializes in Node.js apps, deploy the FastAPI backend elsewhere:

- **Railway**: `railway deploy`
- **Render**: Connect GitHub repo to Render
- **Heroku**: `git push heroku main`

### Deploy Frontend to Vercel

```bash
# Push to GitHub
git push origin main

# Connect to Vercel dashboard at vercel.com
# Select this repository and deploy
```

Set environment variable in Vercel:
```
NEXT_PUBLIC_API_URL=https://your-api.railway.app
```

## File Structure

```
project-root/
├── backend/                    # Python FastAPI backend
│   ├── main.py                 # Entry point
│   ├── create_db.py            # Database setup
│   ├── requirements.txt        # Python dependencies
│   ├── .env.example            # Example env file
│   └── app/
│       ├── config.py           # Configuration
│       ├── database.py         # Database setup
│       ├── models.py           # SQLAlchemy models
│       ├── schemas.py          # Pydantic schemas
│       ├── services/           # Business logic
│       │   ├── wikipedia_service.py
│       │   ├── llm_service.py
│       │   └── quiz_service.py
│       └── routes/
│           └── quiz.py         # API endpoints
│
├── app/                        # Next.js frontend
│   ├── page.tsx                # Main page
│   ├── layout.tsx              # Root layout
│   ├── globals.css             # Global styles
│   └── api/                    # API routes (if needed)
│
├── components/                 # React components
│   ├── tabs/
│   ├── sections/
│   └── modals/
│
├── lib/                        # Utilities
│   └── api-client.ts           # API client
│
├── package.json               # Node dependencies
├── .env.local                 # Frontend env (create this)
├── SETUP_GUIDE.md            # This file
└── README.md                 # Project overview
```

## Common Commands

### Backend

```bash
# Activate virtual environment
source venv/bin/activate          # macOS/Linux
venv\Scripts\activate              # Windows

# Start server
python main.py

# Run database setup
python create_db.py

# Install new package
pip install package_name

# Freeze dependencies
pip freeze > requirements.txt
```

### Frontend

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Lint code
npm run lint
```

## Next Steps

1. ✅ Setup backend with database
2. ✅ Start backend server
3. ✅ Setup frontend
4. ✅ Test quiz generation
5. Deploy to production (see Production Deployment section)

## Support

For issues:

1. Check troubleshooting section above
2. Review backend logs: `python main.py` output
3. Check frontend console: F12 → Console tab
4. Check database: Connect with `psql` command

## API Documentation

Once backend is running, visit: **`http://localhost:8000/docs`**

This shows interactive documentation for all API endpoints with examples.

---

**Happy quizzing! 🎓**
