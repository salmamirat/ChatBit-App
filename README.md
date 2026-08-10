# ChatBit App 💬

A real-time chat application built with **React Native (Expo)** + **Node.js** backend.

## Project Structure

```
ChatBit-App/
├── backend/        # Node.js + Express + PostgreSQL + Socket.IO
└── mobile/         # React Native (Expo) mobile app
```

## Team

| Member | Branch | Responsibilities |
|--------|--------|-----------------|
| Salma | `feature/salma` | Auth (backend + mobile), Users |
| Binome | `feature/binome` | Conversations, Messages, Socket.IO |

## Quick Start

### Backend
```bash
cd backend
npm install
cp .env.example .env   # fill in your DB credentials
npm run dev
```

### Mobile
```bash
cd mobile
npm install
npx expo start
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Mobile | React Native, Expo Router, TypeScript |
| Backend | Node.js, Express v5 |
| Database | PostgreSQL |
| Real-time | Socket.IO |
| Auth | JWT + bcrypt |

## Branches

- `main` — stable, production-ready code
- `feature/salma` — Salma's feature branch
- `feature/binome` — Binome's feature branch