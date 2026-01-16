# WeatherFit

## Overview

WeatherFit is a weather application that displays current weather conditions, forecasts, and provides outfit recommendations based on weather data. Users can search for cities, save favorite locations, and view weather information fetched from the Open-Meteo API. The backend stores saved locations in a PostgreSQL database.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack React Query for server state and API data caching
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming (light/dark mode support)
- **Fonts**: DM Sans (body) and Outfit (display) via Google Fonts

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **API Structure**: RESTful API with routes defined in `shared/routes.ts` using Zod schemas for validation
- **Database ORM**: Drizzle ORM with PostgreSQL
- **Development Server**: Vite dev server with HMR proxied through Express

### Data Flow
- Weather data is fetched directly from Open-Meteo API on the client side (no backend proxy)
- Saved locations (favorite cities) are stored in PostgreSQL via the backend API
- Location state persists in localStorage for the last viewed location

### Key Design Patterns
- **Shared Schema**: Database schema and API route definitions in `shared/` directory are used by both frontend and backend
- **Type Safety**: Zod schemas validate API inputs/outputs with TypeScript type inference
- **Storage Interface**: `IStorage` interface in `server/storage.ts` abstracts database operations

### Project Structure
```
client/           # React frontend application
  src/
    components/   # React components including shadcn/ui
    hooks/        # Custom React hooks (weather, locations, toast)
    pages/        # Page components (Home, not-found)
    lib/          # Utilities (queryClient, utils)
server/           # Express backend
  index.ts        # Server entry point
  routes.ts       # API route handlers
  storage.ts      # Database storage layer
  db.ts           # Database connection
shared/           # Shared code between frontend and backend
  schema.ts       # Drizzle database schema
  routes.ts       # API route definitions with Zod validation
```

## External Dependencies

### Database
- **PostgreSQL**: Primary database for storing saved locations
- **Drizzle ORM**: Database queries and schema management
- **drizzle-kit**: Database migrations via `npm run db:push`

### External APIs
- **Open-Meteo API**: Weather data and city geocoding (client-side, no API key required)
  - Weather endpoint: `https://api.open-meteo.com/v1/forecast`
  - Geocoding endpoint: `https://geocoding-api.open-meteo.com/v1/search`

### Key Libraries
- **@tanstack/react-query**: Data fetching and caching
- **Radix UI**: Accessible UI primitives
- **date-fns**: Date formatting
- **Zod**: Schema validation
- **wouter**: Client-side routing