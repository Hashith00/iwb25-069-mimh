# Green Proxy Dashboard

A modern React-based frontend for the Green Proxy carbon-aware load balancing system.

## Features

🌍 **Real-time Dashboard** - Monitor carbon intensity and request routing
🔍 **Region Explorer** - Explore regions and test IP geolocation
💾 **Cache Manager** - Monitor and manage Redis cache performance  
📊 **Analytics** - View environmental impact and performance metrics

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- Green Proxy backend running on port 8080
- Redis running (for full functionality)

### Installation

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The dashboard will be available at `http://localhost:3001`

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## Architecture

### Technology Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling framework
- **Recharts** - Data visualization
- **Lucide React** - Icon library
- **Axios** - HTTP client

### Project Structure

```
src/
├── components/
│   ├── Layout/
│   │   ├── Navbar.jsx
│   │   └── Sidebar.jsx
│   └── UI/
│       ├── CarbonIntensityBadge.jsx
│       ├── MetricCard.jsx
│       └── StatusIndicator.jsx
├── pages/
│   ├── Dashboard.jsx
│   ├── RegionExplorer.jsx
│   ├── CacheManager.jsx
│   └── Analytics.jsx
├── services/
│   └── api.js
└── App.jsx
```

## API Integration

The frontend connects to the Green Proxy backend via the following endpoints:

- `GET /debug/regions` - Get optimal regions for current request
- `GET /cache/stats` - Get cache statistics
- `DELETE /cache` - Clear cache
- `GET /health` - Health check

### Development vs Production

In development mode, the app uses mock data when the backend is not available. In production, it connects directly to the Green Proxy API.

## Features Overview

### 🏠 Dashboard

- Real-time system status monitoring
- Current routing information display
- Available regions overview
- Cache performance metrics

### 🌍 Region Explorer

- IP address lookup tool
- All available regions display
- Carbon intensity comparison
- Country-to-region mapping

### 💾 Cache Manager

- Redis connection status
- Cache statistics (geolocation, carbon intensity)
- Cache management (clear cache)
- Performance insights

### 📊 Analytics

- Carbon intensity trends over time
- Request distribution by region
- Carbon savings tracking
- Environmental impact metrics

## Environment Variables

Create a `.env` file in the frontend directory:

```env
VITE_API_BASE_URL=http://localhost:8080
VITE_REFRESH_INTERVAL=30000
```

## Styling

The app uses Tailwind CSS with custom environmental themes:

- `eco-green`: Primary green color (#059669)
- `eco-dark`: Dark green color (#064e3b)
- `carbon-low`: Low carbon intensity (#22c55e)
- `carbon-medium`: Medium carbon intensity (#eab308)
- `carbon-high`: High carbon intensity (#ef4444)

## Development

### Mock Data

For development purposes, the app includes comprehensive mock data that simulates:

- Region information and carbon intensity
- Cache statistics
- Health status
- Analytics data

### Hot Reload

Vite provides instant hot reload during development. Changes to components are reflected immediately in the browser.

### Linting

```bash
npm run lint
```

## Deployment

The frontend is designed to be deployed as a static site and can be hosted on:

- Vercel
- Netlify
- AWS S3 + CloudFront
- Any static hosting service

Configure the API base URL for your production environment.

## Browser Support

- Chrome/Edge 88+
- Firefox 85+
- Safari 14+

## Contributing

1. Follow the existing code structure
2. Use TypeScript for new components
3. Follow Tailwind CSS conventions
4. Add appropriate error handling
5. Include loading states for async operations

## License

This project is part of the Green Proxy system for educational and research purposes.
