# 🎯 Jobbi

Your AI-powered job search companion. Jobbi finds and curates job listings based on your preferences, presenting them in a beautiful social media-style feed.

## Features

- **📰 Smart Feed** - AI-curated job listings in a scrollable feed
- **📊 Job Tracker** - Track applications with a dynamic spreadsheet view
- **⚙️ Personalized Settings** - Guide the AI with your preferences
- **🤖 Gemini AI** - Powered by Google's Gemini for intelligent job matching

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Database:** PostgreSQL (Railway)
- **ORM:** Prisma
- **Styling:** Tailwind CSS
- **AI:** Google Gemini API
- **Animations:** Framer Motion

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database (or Railway account)
- Google Gemini API key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/jobbi.git
   cd jobbi
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` with your database URL and Gemini API key.

4. Push the database schema:
   ```bash
   npm run db:push
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000)

## Railway Deployment

1. Create a new project on [Railway](https://railway.app)
2. Add a PostgreSQL database
3. Connect your GitHub repository
4. Add environment variables:
   - `DATABASE_URL` (auto-configured from Railway PostgreSQL)
   - `GEMINI_API_KEY` (your Google API key)
5. Deploy!

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Feed (home)
│   ├── tracker/           # Job tracker
│   ├── settings/          # User preferences
│   └── api/               # API routes
├── components/            # React components
├── lib/                   # Utilities & configurations
└── types/                 # TypeScript types
```

## Color Palette

- **Primary:** Slate Blue (`#1e293b`)
- **Secondary:** Cool Gray (`#64748b`)
- **Background:** White (`#ffffff`)
- **Accent:** Vibrant Orange (`#f97316`)

## License

MIT

