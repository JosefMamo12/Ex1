# KidVid - Toddler Content Machine

An AI-powered content generation platform for creating engaging video content targeted at toddlers (0-6 years old). Features automated video generation, optimal upload timing recommendations, and comprehensive analytics.

## Features

### Core Features

- **AI Video Generation**: Create animated videos across 12+ toddler-friendly categories
  - Nursery Rhymes
  - Counting & Numbers
  - Alphabet & Letters
  - Colors & Shapes
  - Animals & Nature
  - Bedtime & Lullabies
  - Educational content
  - And more...

- **Optimal Upload Timing**: Data-driven recommendations for the best times to upload
  - Platform-specific insights (YouTube, TikTok)
  - Category-based optimization
  - Real-time analytics integration

- **Multi-Platform Publishing**: Schedule and publish to multiple platforms
  - YouTube Kids ready
  - TikTok integration
  - Instagram Reels support
  - Facebook Video support

- **Comprehensive Analytics**
  - Views, likes, comments tracking
  - Revenue projection and tracking
  - Engagement rate analysis
  - Growth recommendations

## Tech Stack

### Backend
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with bcrypt
- **AI Services**: OpenAI (GPT-4, DALL-E, TTS), Replicate
- **Scheduling**: node-cron

### Frontend
- **Framework**: Next.js 14 (App Router)
- **State Management**: Zustand
- **Data Fetching**: TanStack Query
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd content-machine/backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. Run database migrations:
   ```bash
   npx prisma migrate dev
   ```

5. Generate Prisma client:
   ```bash
   npx prisma generate
   ```

6. Start the development server:
   ```bash
   npm run dev
   ```

The backend will be running at `http://localhost:3001`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd content-machine/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will be running at `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PATCH /api/auth/profile` - Update profile
- `POST /api/auth/change-password` - Change password

### Content
- `GET /api/content/categories` - Get content categories
- `GET /api/content/styles` - Get animation styles
- `GET /api/content/templates` - Get content templates
- `POST /api/content/generate` - Generate new content
- `GET /api/content` - Get user's content
- `GET /api/content/:id` - Get content by ID
- `PATCH /api/content/:id` - Update content
- `DELETE /api/content/:id` - Delete content

### Scheduling
- `GET /api/schedule/optimal-times` - Get optimal upload times
- `GET /api/schedule/next-optimal` - Get next optimal window
- `POST /api/schedule` - Schedule content
- `GET /api/schedule` - Get scheduled content
- `PATCH /api/schedule/:id` - Reschedule content
- `DELETE /api/schedule/:id` - Cancel schedule
- `GET /api/schedule/queue-status` - Get queue status

### Analytics
- `GET /api/analytics/summary` - Get analytics summary
- `GET /api/analytics/revenue` - Get revenue projections
- `GET /api/analytics/recommendations` - Get recommendations
- `POST /api/analytics/record` - Record analytics data

## Best Upload Times for Toddler Content

Based on research and platform data, here are general guidelines:

### YouTube
- **Best Days**: Friday, Saturday, Sunday
- **Best Times**: 
  - Morning (7-10 AM): Parents use during morning routines
  - Evening (5-8 PM): Post-work family time
- **Category-Specific**:
  - Bedtime content: 6-9 PM
  - Educational: 9 AM - 4 PM
  - Nursery Rhymes: Morning and evening peaks

### TikTok
- **Best Days**: Tuesday, Thursday, Friday
- **Best Times**: 
  - Morning (6-9 AM): Commute time
  - Lunch (12-1 PM): Break time
  - Evening (7-10 PM): Wind-down time

## Content Categories

| Category | Best For | Suggested Duration |
|----------|----------|-------------------|
| Nursery Rhymes | Sing-along, engagement | 2 minutes |
| Counting | Educational, interactive | 1.5 minutes |
| Alphabet | Learning, phonics | 1.5 minutes |
| Colors | Visual learning | 1 minute |
| Shapes | Cognitive development | 1 minute |
| Animals | Discovery, sounds | 1.5 minutes |
| Vehicles | Engagement, sounds | 1.5 minutes |
| Nature | Exploration | 1.5 minutes |
| Bedtime | Calming, lullabies | 3 minutes |
| Educational | General learning | 2 minutes |
| Music & Dance | Movement, interaction | 1.5 minutes |
| Stories | Imagination | 3 minutes |

## Monetization Tips

### YouTube Partner Program Requirements
- 1,000 subscribers
- 4,000 watch hours in the past 12 months
- Content must be marked as "made for kids"

### Revenue Streams
1. **Ad Revenue**: YouTube Kids monetization
2. **Brand Partnerships**: Toy companies, educational apps
3. **Merchandise**: Character licensing
4. **Cross-Platform**: Leverage content across platforms

### Content Guidelines for Kids
- COPPA compliant
- No personal data collection
- Age-appropriate content only
- Safe and educational themes

## Project Structure

```
content-machine/
├── backend/
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Express middleware
│   │   ├── models/         # Data models (Prisma)
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── types/          # TypeScript types
│   │   └── utils/          # Utility functions
│   ├── prisma/             # Database schema
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── app/            # Next.js pages
│   │   ├── components/     # React components
│   │   ├── hooks/          # Custom hooks
│   │   ├── lib/            # Utilities & API
│   │   └── types/          # TypeScript types
│   └── package.json
└── README.md
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

MIT License - See LICENSE file for details.

## Support

For questions or issues, please open a GitHub issue or contact support.

---

Built with ❤️ for creators making a difference in children's education.
