# Portfolio Web Service For Sam

## Overview

This is a personal portfolio web service that provides RESTful APIs for various features including movie tracking, blog management, expense tracking, todo lists, and more. The application is built as a Node.js/Express backend with MongoDB for data persistence, designed to serve as an API backend for portfolio and personal productivity applications.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Backend Framework
- **Express.js** serves as the web framework, handling HTTP requests and routing
- Routes are organized by feature domain (movies, blogs, todos, transactions, etc.) under `/server/routes/`
- Controllers handle business logic in `/server/controllers/`
- All API endpoints are prefixed with `/api`

### Database Layer
- **MongoDB** with **Mongoose ODM** for data modeling and queries
- Connection is managed through a singleton class in `/server/mongoose.js`
- Database URL is configured via the `MONGODB_URL` environment variable
- Models are defined in `/server/models/` with pre-save hooks for timestamp management
- A `ModelFacade` class provides a consistent interface for common database operations

### Authentication
- **JWT (JSON Web Tokens)** for user authentication
- Token verification middleware in `/server/helpers/verifyToken.js`
- Password hashing with **bcrypt**
- Protected routes use the `verify` middleware

### Real-time Features
- **Socket.IO** integration for real-time todo updates
- WebSocket server runs alongside the HTTP server

### External API Integrations
- **Douban** - Chinese movie database for movie information, ratings, and box office data
- **IMDB** - Movie ratings and box office information via web scraping
- **Maoyan** - Chinese box office data
- **Bilibili** - Video platform integration
- **Google Places API** - Location data and photos
- **Mapbox** - Geocoding services
- **Cineplex** - Canadian theatre movie listings

### Web Scraping
- **Cheerio** for HTML parsing when scraping external sites
- Custom `ParseSelector` helper class wraps Cheerio for cleaner DOM traversal
- Used primarily for Douban, IMDB, and box office data extraction

### Deployment
- Configured for **Vercel** deployment via `vercel.json`
- Single entry point routing all requests to `index.js`
- Environment-based port configuration (defaults to port 5000)

### TypeScript Support
- TypeScript configuration exists (`tsconfig.json`) with type definitions installed
- Currently in transition - some files have `.ts` versions alongside `.js`
- Not fully migrated yet (listed as a TODO item)

## External Dependencies

### Database
- **MongoDB** - Primary data store (requires `MONGODB_URL` environment variable)

### Third-Party APIs
- **Google Places API** - Requires `GOOGLE_API_KEY` environment variable
- **Mapbox Geocoding API** - For address lookups
- **Gemini AI API** - Requires `GEMINI_API_KEY` for AI features (experimental)

### External Data Sources (Scraped)
- Douban (movie.douban.com) - Movie database
- IMDB (imdb.com) - Movie ratings and box office
- Maoyan (piaofang.maoyan.com) - Chinese box office
- Cineplex API - Canadian theatre listings
- Bilibili API - Video platform

### NPM Packages
- `express` - Web framework
- `mongoose` - MongoDB ODM
- `socket.io` - Real-time communication
- `jsonwebtoken` - JWT authentication
- `bcrypt` - Password hashing
- `cheerio` - HTML parsing for web scraping
- `cors` - Cross-origin resource sharing
- `body-parser` - Request body parsing
- `bili-api` - Bilibili API wrapper