# RSS Reader

A modern RSS reader application built with FastAPI (backend) and Next.js (frontend).

## Features

- **User Authentication**: Register and login with JWT-based authentication
- **RSS Feed Management**: Add, edit, delete, and organize RSS feeds
- **Article Reading**: Browse and read articles from your subscribed feeds
- **Article Management**: Mark articles as read/unread, star favorites
- **Auto-Refresh**: Automatic RSS feed fetching at configurable intervals
- **Search**: Search articles by title and content
- **Responsive UI**: Clean, modern interface built with Tailwind CSS

## Tech Stack

### Backend
- **FastAPI**: Modern Python web framework
- **SQLAlchemy**: SQL toolkit and ORM
- **SQLite**: Database (easily switchable to PostgreSQL)
- **feedparser**: RSS/Atom feed parsing
- **APScheduler**: Background task scheduling
- **JWT**: Token-based authentication

### Frontend
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **SWR**: Data fetching and caching
- **Zustand**: State management
- **Axios**: HTTP client

## Project Structure

```
RSSReader/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── endpoints/
│   │   │   │   ├── auth.py       # Authentication endpoints
│   │   │   │   ├── feeds.py      # Feed management endpoints
│   │   │   │   └── articles.py   # Article endpoints
│   │   │   └── deps.py           # Dependencies (auth, db)
│   │   ├── core/
│   │   │   ├── config.py         # Configuration settings
│   │   │   ├── security.py       # Security utilities
│   │   │   ├── database.py       # Database setup
│   │   │   └── scheduler.py      # Background task scheduler
│   │   ├── models/
│   │   │   ├── user.py           # User model
│   │   │   ├── feed.py           # Feed model
│   │   │   └── article.py        # Article models
│   │   ├── schemas/
│   │   │   ├── user.py           # User schemas
│   │   │   ├── feed.py           # Feed schemas
│   │   │   └── article.py        # Article schemas
│   │   ├── services/
│   │   │   └── rss_fetcher.py    # RSS fetching service
│   │   └── main.py               # FastAPI application
│   ├── requirements.txt
│   └── .env.example
│
└── frontend/
    ├── src/
    │   ├── app/
    │   │   ├── login/
    │   │   │   └── page.tsx      # Login/Register page
    │   │   ├── dashboard/
    │   │   │   └── page.tsx      # Main dashboard
    │   │   ├── layout.tsx        # Root layout
    │   │   ├── page.tsx          # Home page
    │   │   └── globals.css       # Global styles
    │   ├── components/
    │   │   ├── FeedList.tsx      # Feed sidebar component
    │   │   ├── ArticleList.tsx   # Article list component
    │   │   └── ArticleReader.tsx # Article reader component
    │   ├── lib/
    │   │   ├── api.ts            # API client
    │   │   └── store.ts          # Zustand store
    │   └── types/
    │       └── index.ts          # TypeScript types
    ├── package.json
    ├── tsconfig.json
    ├── tailwind.config.js
    └── next.config.js
```

## Getting Started

### Prerequisites

- Python 3.8+
- Node.js 18+
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create a `.env` file:
```bash
cp .env.example .env
```

5. Edit `.env` and set your configuration (especially `SECRET_KEY`):
```env
DATABASE_URL=sqlite:///./rss_reader.db
SECRET_KEY=your-secret-key-here-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
RSS_FETCH_INTERVAL_MINUTES=30
```

6. Run the backend server:
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`
API documentation: `http://localhost:8000/docs`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file:
```bash
cp .env.local.example .env.local
```

4. Edit `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

5. Run the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## Usage

1. **Register/Login**: Create an account or login at `http://localhost:3000/login`

2. **Add RSS Feeds**: Click "Add Feed" in the sidebar and enter:
   - Feed title
   - Feed URL (e.g., `https://example.com/feed.xml`)
   - Category (optional)

3. **Browse Articles**: Click on a feed to view its articles, or view all articles

4. **Read Articles**: Click on an article to read it in the reader pane

5. **Manage Articles**:
   - Click the star icon to favorite an article
   - Click "Read/Unread" to toggle read status
   - Articles are automatically marked as read when opened

6. **Refresh Feeds**: Click "Refresh" on any feed to manually fetch new articles

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get access token

### Feeds
- `GET /api/feeds/` - Get all user's feeds
- `POST /api/feeds/` - Create a new feed
- `GET /api/feeds/{id}` - Get a specific feed
- `PUT /api/feeds/{id}` - Update a feed
- `DELETE /api/feeds/{id}` - Delete a feed
- `POST /api/feeds/{id}/refresh` - Manually refresh a feed

### Articles
- `GET /api/articles/` - Get articles (with filters)
- `GET /api/articles/{id}` - Get a specific article
- `POST /api/articles/{id}/read` - Mark article as read/unread
- `POST /api/articles/{id}/star` - Star/unstar an article

## Configuration

### Backend Configuration

Edit `backend/.env`:

- `DATABASE_URL`: Database connection string
- `SECRET_KEY`: Secret key for JWT tokens (change in production!)
- `ACCESS_TOKEN_EXPIRE_MINUTES`: Token expiration time
- `RSS_FETCH_INTERVAL_MINUTES`: How often to fetch RSS feeds

### Frontend Configuration

Edit `frontend/.env.local`:

- `NEXT_PUBLIC_API_URL`: Backend API URL

## Development

### Backend Development

The backend uses FastAPI with hot-reload enabled. Any changes to Python files will automatically restart the server.

To run tests (when implemented):
```bash
pytest
```

### Frontend Development

The frontend uses Next.js with hot-reload. Changes to React components will automatically update in the browser.

To build for production:
```bash
npm run build
npm start
```

## Deployment

### Backend Deployment

1. Set up a production database (PostgreSQL recommended)
2. Update `DATABASE_URL` in production environment
3. Generate a strong `SECRET_KEY`
4. Use a production ASGI server like Gunicorn with Uvicorn workers:

```bash
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker
```

### Frontend Deployment

1. Build the production bundle:
```bash
npm run build
```

2. Deploy to Vercel, Netlify, or any Node.js hosting platform

## Features to Add

- [ ] Article search functionality
- [ ] Feed categories and organization
- [ ] Dark mode
- [ ] Export/import OPML
- [ ] Keyboard shortcuts
- [ ] Mobile responsive design improvements
- [ ] Article filtering (by date, read status, etc.)
- [ ] Feed health monitoring
- [ ] Email notifications for new articles
- [ ] Multi-user support improvements

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
