# WeatherFit

WeatherFit is a clean, modern, and minimalist weather application designed to provide not just the forecast, but practical advice on what to wear based on current and upcoming conditions.

## Project Context & Origin

This project was born during the **GSD AI Hackathon** as an unplanned and unprepared sudden participation. The core experiment was to see if a functional application could be developed using **Replit** as an AI development tool entirely on an **iPhone**.

The initial spark—including the app's concept, the first prompt text, and the decision to target a modern minimalist weather experience—came from **Grok**. Everything from that point forward, including the entire codebase, UI implementation, data logic, and even this documentation, was executed and refined by **Replit**.

The goal was to create an app that automatically detects location, fetches real-time data from the Open-Meteo API (requiring no API keys), and presents it through a responsive, high-contrast interface optimized for mobile experiences.

## How it was Built

The application was developed and brought to life within the **Replit** ecosystem, utilizing its AI-powered development tools. The development process followed these key phases:

1.  **Architecture Setup**: Establishing a full-stack TypeScript environment using Express for the backend and React with Vite for the frontend.
2.  **API Integration**: Implementing client-side fetching from the Open-Meteo API for global weather coverage and geocoding.
3.  **Intelligent Logic**: Building the "Outfit Recommendation Engine" which processes temperature, precipitation, and UV index to suggest appropriate layers, fabrics, and accessories.
4.  **UI/UX Refinement**: Using Tailwind CSS and shadcn/ui components to create a sleek "Glassmorphism" interface. This included custom animations (initially attempted and then simplified for performance), dynamic themes, and a robust timezone management system to ensure local time accuracy across the globe.
5.  **Data Persistence**: Leveraging a PostgreSQL database managed by Drizzle ORM to allow users to save and manage their favorite locations.
6.  **PWA Optimization**: Configuring the app to be installable on mobile devices with a responsive, lightning-fast experience.

## Technical Details

### Frontend
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Component Library**: shadcn/ui (Radix UI primitives)
- **Routing**: Wouter
- **Data Fetching**: TanStack React Query (v5)
- **Icons**: Lucide React

### Backend
- **Framework**: Express.js
- **Database**: PostgreSQL (Neon-backed)
- **ORM**: Drizzle ORM
- **Validation**: Zod (shared schemas)

### External Services
- **Weather Data**: [Open-Meteo API](https://open-meteo.com/)
- **Geocoding**: Open-Meteo Geocoding API

## Features
- **Automatic Location**: Instant weather for your current spot.
- **Outfit Recommendations**: Smart suggestions for clothes, footwear, and sun protection.
- **Accurate Local Time**: Real-time display for any city worldwide using UTC offsets.
- **Favorites**: Save and switch between cities with a single tap.
- **Theme Support**: Seamless transitions between light and dark modes with high-contrast optimization.
- **3-Day Forecast**: Plan ahead with detailed daily summaries.
- **Hourly Details**: 24-hour temperature and rain probability charts.
