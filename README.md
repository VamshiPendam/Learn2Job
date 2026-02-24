
# Learn2Job - Career Development Platform

A comprehensive career development platform that helps professionals discover job opportunities, create personalized learning roadmaps, and advance their careers.

## Features

- **Personalized Learning Roadmaps**: AI-powered career path generation
- **Job Board**: Discover relevant job opportunities
- **Tool Discovery**: Explore trending tools and technologies
- **Market Insights**: Stay updated with industry trends
- **Profile Management**: Track your career progress

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Backend**: Node.js + Express + MongoDB
- **AI**: Google Gemini API for content generation


## Run Locally

**Prerequisites:** Node.js, MongoDB

1. Install dependencies:
   ```bash
   npm install
   cd server && npm install
   ```

2. Set up environment variables:
   - Copy `.env.local` and add your `VITE_GEMINI_API_KEY`
   - Configure MongoDB connection in `server/.env`

3. Start the backend server:
   ```bash
   cd server && npm start
   ```

4. Start the frontend (in a new terminal):
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser


