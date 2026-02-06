# Quick Start Guide - AI Wiki Quiz Generator

Get the application running in 5 minutes!

## Prerequisites

- Python 3.10+ installed
- Node.js 18+ installed
- PostgreSQL 12+ installed (or Docker)
- Google Gemini API key (free) from [Google AI Studio](https://makersuite.google.com/app/apikey)

## Step 1: Setup Backend (2 minutes)

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env

# Edit .env and add your Gemini API key
# Open .env and replace:
# GEMINI_API_KEY=your_gemini_api_key_here
```

### Option A: PostgreSQL Locally

```bash
# Create database
createdb ai_wiki_quiz

# Update .env:
# DATABASE_URL=postgresql://localhost/ai_wiki_quiz
```

### Option B: PostgreSQL with Docker (Easier)

```bash
# Run PostgreSQL container
docker run --name postgres-quiz \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=ai_wiki_quiz \
  -p 5432:5432 \
  -d postgres:15

# Update .env:
# DATABASE_URL=postgresql://postgres:password@localhost:5432/ai_wiki_quiz
```

### Initialize Database

```bash
python create_db.py
```

### Start Backend

```bash
python main.py
```

You should see:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
```

## Step 2: Setup Frontend (1 minute)

Open **new terminal** and run:

```bash
# Go to project root
cd ..  # if in backend

# Install dependencies
npm install

# Start dev server
npm run dev
```

You should see:
```
▲ Next.js 16.1.6
- Local:        http://localhost:3000
```

## Step 3: Test It! (2 minutes)

1. Open browser: `http://localhost:3000`
2. Enter Wikipedia URL: `https://en.wikipedia.org/wiki/Alan_Turing`
3. Click "Generate Quiz"
4. Wait 10-30 seconds for AI to generate quiz
5. View the generated quiz and test the interactive features

### Additional Tests

**View Quiz History**:
1. Click "Quiz History" tab
2. You should see the quiz you just generated
3. Click "View Details" to see full quiz

**API Documentation**:
1. Visit `http://localhost:8000/docs`
2. Interactive Swagger UI showing all endpoints

## Common Issues

### "GEMINI_API_KEY not set"
- Get key from: https://makersuite.google.com/app/apikey
- Add to `.env`: `GEMINI_API_KEY=your_key_here`
- Restart backend

### "Could not connect to database"
- Verify PostgreSQL is running
- Check DATABASE_URL in `.env`
- If using Docker: `docker ps` should show postgres container

### Frontend can't connect to backend
- Verify backend is running: `curl http://localhost:8000/health`
- Check `.env.local` has: `NEXT_PUBLIC_API_URL=http://localhost:8000`

### "No module named 'app'"
- Make sure you're in `backend` directory
- Make sure you've created `venv/`

## Environment Files Reference

### Backend (.env)

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/ai_wiki_quiz
GEMINI_API_KEY=your_api_key_here
DEBUG=True
NUM_QUESTIONS=8
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## File Structure

```
project-root/
├── backend/              # Python FastAPI (port 8000)
│   ├── main.py
│   ├── .env             # Backend config
│   └── requirements.txt
├── app/                 # Next.js app
├── components/          # React components
├── lib/                 # Utilities
├── .env.local           # Frontend config
└── package.json
```

## Next Steps

### After Getting It Working

1. **Read Documentation**:
   - `SETUP_GUIDE.md` - Detailed setup
   - `PROJECT_OVERVIEW.md` - Architecture
   - `TESTING_GUIDE.md` - Testing procedures

2. **Try Features**:
   - Generate multiple quizzes
   - Check quiz history
   - View API docs at `http://localhost:8000/docs`

3. **Run Tests**:
   ```bash
   # Backend tests
   cd backend
   pytest -v
   
   # Frontend tests (from project root)
   npm test
   ```

4. **Deploy** (when ready):
   - See `DEPLOYMENT_GUIDE.md` for production setup

## Useful Commands

### Backend

```bash
cd backend
source venv/bin/activate      # Activate virtual env
python main.py                # Start server
pytest                         # Run tests
python create_db.py          # Initialize database
```

### Frontend

```bash
npm run dev                   # Start dev server
npm run build                 # Build for production
npm run lint                  # Check code quality
npm test                      # Run tests
```

### Database (PostgreSQL)

```bash
psql postgresql://localhost/ai_wiki_quiz   # Connect
SELECT COUNT(*) FROM quizzes;              # Count quizzes
```

## Stop Services

### Stop Backend
```bash
# Ctrl+C in backend terminal
```

### Stop Frontend
```bash
# Ctrl+C in frontend terminal
```

### Stop PostgreSQL (if using Docker)
```bash
docker stop postgres-quiz
```

## Restart Services

```bash
# Backend
cd backend && source venv/bin/activate && python main.py

# Frontend (new terminal)
npm run dev

# PostgreSQL (if Docker)
docker start postgres-quiz
```

## Verify Everything Works

```bash
# In another terminal, run these commands:

# 1. Backend is running
curl http://localhost:8000/health
# Should return: {"status":"healthy"}

# 2. Frontend is running
curl http://localhost:3000
# Should return HTML

# 3. API is working
curl http://localhost:8000/api/quiz/history
# Should return quiz history (empty at first)
```

## Getting Help

- **Setup Issues**: See SETUP_GUIDE.md
- **Architecture Questions**: See PROJECT_OVERVIEW.md
- **Testing Help**: See TESTING_GUIDE.md
- **Deployment**: See DEPLOYMENT_GUIDE.md
- **API Questions**: Visit `http://localhost:8000/docs` when backend is running

## Summary

**You now have a working AI Wiki Quiz Generator!** 

The application can:
- Generate quizzes from Wikipedia articles using AI
- Store quiz history in database
- Display beautiful interactive interface
- Handle multiple requests
- Track and display quiz metadata

---

**Happy quizzing! 🎓**

Have fun exploring. If you get stuck, check the documentation files listed above.
