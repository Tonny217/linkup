# LinkUp - Local Dating Web App

A production-ready, Telegram-based dating web application built for local communities. Features swipe-based discovery, community circles, local events, AI compatibility scoring, and M-Pesa integration.

## Features

### Core
- **Telegram One-Tap Login** - Seamless authentication via Telegram WebApp
- **Smart Profile Creation** - Photos, bio, profession, education, interests, voice/video intros
- **Local Discovery** - Filter by city, age, interests, profession, community
- **Swipe Interface** - Tinder-like swipe with like/nope/super-like actions
- **Compatibility Scoring** - AI-based match percentage

### Safety
- **Identity Verification** - Basic (phone) and Premium (selfie + ID) verification badges
- **AI Scam Detection** - Monitors for copy-paste messages, money requests, fake profiles
- **Report & Block System** - Instant reporting from profile and chat
- **Safety Center** - Meeting tips and emergency guidance
- **Ice Breakers** - Auto-generated conversation starters

### Community
- **Community Circles** - Join groups: IT Professionals, Entrepreneurs, Teachers, Healthcare, Students, etc.
- **Local Events** - Discover and join speed dating, hiking, networking events
- **Daily Match** - One highly compatible match per day

### Monetization
- **Freemium Model** - Free browsing, premium unlocks unlimited messages
- **Profile Boosts** - Appear first in searches
- **M-Pesa Integration** - Vodacom, Airtel, Tigo payment support
- **Virtual Gifts** - Send flowers, coffee, hearts
- **Event Tickets** - Paid local events

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| Styling | Tailwind CSS |
| Animation | Framer Motion |
| Icons | Lucide React |
| State | LocalStorage (simulated API) |
| Backend | PocketBase (schema ready) |
| Payments | Node.js STK Push (M-Pesa) |
| Bot | Telegram Bot API |

## Project Structure

```
tg-dating/
├── index.html              # Entry HTML with Inter font
├── package.json            # Dependencies
├── vite.config.js          # Vite configuration
├── tailwind.config.js      # Custom colors & animations
├── postcss.config.js       # PostCSS setup
├── src/
│   ├── main.jsx            # App entry point
│   ├── App.jsx             # Main router & auth logic
│   ├── index.css           # Global styles & utilities
│   ├── pages/
│   │   ├── Home.jsx        # Discovery/swipe screen
│   │   ├── Matches.jsx     # Match list & message threads
│   │   ├── Chat.jsx        # Real-time messaging UI
│   │   ├── Profile.jsx     # User profile & edit
│   │   ├── Settings.jsx    # App preferences & safety
│   │   ├── Premium.jsx     # Subscription & M-Pesa payments
│   │   ├── Community.jsx   # Community circles
│   │   └── Events.jsx      # Local events & ticketing
│   ├── components/
│   │   ├── BottomNav.jsx   # Tab navigation
│   │   ├── TopBar.jsx      # Page headers
│   │   ├── SwipeCard.jsx   # Tinder-style card
│   │   ├── ChatBubble.jsx  # Message bubble
│   │   ├── Modal.jsx       # Bottom sheet modal
│   │   ├── FilterDrawer.jsx # Filter panel
│   │   ├── EmptyState.jsx  # Empty state UI
│   │   ├── VerificationBadge.jsx
│   │   └── CompatibilityScore.jsx
│   ├── services/
│   │   ├── api.js          # LocalStorage API + mock data
│   │   └── telegram.js     # Telegram WebApp auth
│   ├── hooks/
│   │   └── useLocalStorage.js
│   └── utils/
│       └── helpers.js      # Formatters & utilities
```

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
cd tg-dating

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Environment Variables
Create a `.env` file in the root:

```env
VITE_TELEGRAM_BOT_TOKEN=your_bot_token
VITE_POCKETBASE_URL=your_pocketbase_url
VITE_MPESA_CONSUMER_KEY=your_key
VITE_MPESA_CONSUMER_SECRET=your_secret
```

## Deployment

### Frontend (Netlify/Vercel)
```bash
npm run build
# Deploy the `dist` folder
```

### Backend (Railway/Render)
The `payment-service/` and `bot/` directories contain the Node.js backend services.

## Design System

### Colors
- **Primary**: Pink/Rose gradient (`#db2777` to `#be185d`)
- **Accent**: Orange (`#f97316`)
- **Success**: Emerald (`#10b981`)
- **Surface**: White with subtle shadows

### Typography
- **Font**: Inter (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700, 800

### Components
- Cards with soft shadows (`card-shadow`)
- Rounded corners (2xl for cards, xl for buttons)
- Glass morphism for overlays (`glass`)
- Spring animations for navigation

## Mobile-First

The app is designed for mobile use:
- 375px - 428px viewport optimization
- Safe area insets for notched devices
- Touch-friendly tap targets (min 44px)
- Bottom navigation for thumb reachability
- Swipe gestures for card interactions

## License

MIT License - Built for the Tanzanian community.
