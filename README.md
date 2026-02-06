# AI Wiki Quiz Generator - Frontend

A beautiful, production-ready React/Next.js frontend for generating and taking interactive quizzes from Wikipedia articles using AI.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open browser at http://localhost:3000
```

The app comes with sample Alan Turing quiz data - **no backend needed to test the UI!**

## ✨ Features

### Tab 1: Generate Quiz
- Input any Wikipedia article URL
- Beautiful article overview with image and summary
- Topic sections with images and descriptions
- Interactive quiz with expandable questions
- Color-coded difficulty badges (easy, medium, hard)
- Instant feedback showing correct/incorrect answers
- Detailed explanations grounded in article content
- Related topics grid with images
- Loading spinner and error handling

### Tab 2: Quiz History
- Table view of previously generated quizzes
- Columns: Article Title, Wikipedia URL, Created Date, View Details
- Click "View Details" to open full quiz in modal
- Responsive table with horizontal scroll on mobile
- Date formatting based on browser locale
- Empty state message when no history exists

### Interactive Quiz Features
- Expandable question cards (click to reveal options)
- Topic tag for each question
- Difficulty badge (easy=green, medium=yellow, hard=red)
- Four multiple-choice options (A, B, C, D)
- Instant visual feedback on answer selection
- Explanation box with correct answer details
- Letter labels for easy reference

### Additional Features
- 🎨 Beautiful, professional design with academic aesthetic
- 🌓 Dark/light theme support (automatic system detection)
- 📱 Fully responsive (mobile, tablet, desktop)
- ♿ Accessible (WCAG compliant, keyboard navigation)
- ⚡ Smooth animations (fade-in, slide-up, hover effects)
- 🖼️ Image-rich interface (article, topics, related topics)
- 🔄 Instant feedback with explanations

## 📁 Project Structure

```
app/
├── page.tsx                  # Main page with tab navigation
├── layout.tsx               # Root layout
├── globals.css              # Global styles & animations
└── api/quiz/
    ├── generate/route.ts    # Quiz generation endpoint (POST)
    └── history/route.ts     # History endpoint (GET)

components/
├── tabs/
│   ├── generate-tab.tsx     # Quiz generation interface
│   └── history-tab.tsx      # Quiz history table
├── sections/
│   ├── article-overview.tsx # Article header & summary with image
│   ├── topic-sections.tsx   # Topic cards with images
│   ├── quiz-section.tsx     # Interactive quiz questions
│   └── related-topics.tsx   # Related topics image grid
└── modals/
    └── quiz-detail-modal.tsx # Full quiz modal view
```

## 🔧 Technology Stack

- **Framework:** Next.js 16 (App Router)
- **UI Framework:** React 19
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Images:** Next.js Image component

## 📱 Responsive Design

- **Mobile (< 640px)** - Single column, full-width content
- **Tablet (640px - 1024px)** - 2-3 column layout
- **Desktop (> 1024px)** - Full 4-column grid layout

## 🔌 API Routes (Mock Data)

### POST /api/quiz/generate

**Request:**
```json
{ "url": "https://en.wikipedia.org/wiki/Alan_Turing" }
```

**Response:** Quiz data with article overview, sections, questions, and related topics

### GET /api/quiz/history

**Response:** Array of previously generated quizzes

*Both endpoints currently return mock data. Replace with real backend calls in production.*

## 🎯 Backend Integration

To connect to your Python FastAPI/Django backend:

1. **Set environment variable** in `.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

2. **Update API routes** in `app/api/quiz/generate/route.ts` and `app/api/quiz/history/route.ts` to call your backend instead of returning mock data.

3. **Your backend must return** responses matching the `QuizData` interface (see SETUP_GUIDE.md and COMPONENTS_GUIDE.md for details).

See **SETUP_GUIDE.md** for complete backend integration instructions and API contract.

## 🚀 Deployment

### Deploy to Vercel (Recommended)

```bash
# Push to GitHub
git push

# Vercel auto-deploys from your repo
# Set environment variables in Vercel dashboard
```

**Environment Variables in Production:**
```
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

## 🎨 Styling & Customization

### Colors
- **Primary Blue:** `#2563EB` (actions, highlights)
- **Success Green:** `#16A34A` (correct answers)
- **Warning Yellow:** `#EAB308` (medium difficulty)
- **Error Red:** `#DC2626` (incorrect answers)

All colors automatically adjust for dark mode.

### Modifying Components

Edit component files in `components/` to customize:
- Colors: Modify Tailwind classes
- Fonts: Edit `app/layout.tsx`
- Animations: Modify `app/globals.css`
- Layout: Update grid/flex classes

## 📚 Documentation

- **SETUP_GUIDE.md** - Complete setup and integration instructions
- **FEATURES.md** - Detailed feature overview with UI descriptions
- **COMPONENTS_GUIDE.md** - Component API reference with TypeScript types
- **BACKEND_SETUP.md** - Python backend setup guide (if available)

## ♿ Accessibility

- ✅ Semantic HTML structure
- ✅ Proper heading hierarchy
- ✅ ARIA labels for interactive elements
- ✅ Keyboard navigation support
- ✅ Focus indicators on all interactive elements
- ✅ Color contrast ratios (WCAG AA compliant)
- ✅ Image alt text with fallbacks

## 🛠️ Development

### Available Scripts

```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Debugging

1. **Browser DevTools** - Open F12, check Console and Network tabs
2. **API Responses** - Check Network tab to see request/response data
3. **Component State** - Use React DevTools extension

## ❓ FAQ

**Q: Does this work without a backend?**  
A: Yes! Mock data is included. Perfect for UI development.

**Q: How do I connect my backend?**  
A: See SETUP_GUIDE.md for step-by-step integration.

**Q: Can I customize the colors?**  
A: Yes! Edit Tailwind classes in components or CSS variables in globals.css.

**Q: Is it mobile-friendly?**  
A: Completely! Responsive design optimized for all devices.

**Q: How do I add more sample data?**  
A: Edit the API routes in `app/api/quiz/` to return different mock data.

## 🎉 Next Steps

1. Run `npm run dev` to start the development server
2. Explore the UI with the included Alan Turing sample quiz
3. Read SETUP_GUIDE.md to integrate your Python backend
4. Deploy to Vercel when ready

## License

MIT License - Feel free to use in your projects!

---

**Built with ❤️ for educational purposes**
