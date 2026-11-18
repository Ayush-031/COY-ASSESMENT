# Coy Discover

A standalone, mobile-first swipe discovery demo built with React, Express and MongoDB.

## Features
- Home placeholder and Discover tab
- 30 seeded mock profiles
- Swipe right to like, left to pass (drag or buttons)
- Previously swiped profiles are excluded from the feed
- Mutual likes create matches
- Matches list only shows mutual matches
- MongoDB persistence across reloads
- No endpoint exposes one-sided incoming likes

## Requirements
- Node.js 18+
- MongoDB local instance or MongoDB Atlas connection string

## Setup

```bash
npm run install:all
```

Create `server/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/coy_discover
CLIENT_ORIGIN=http://localhost:5173
```

Start MongoDB, then run:

```bash
npm run dev
```

Open http://localhost:5173

The backend runs at http://localhost:5000.

## Demo behaviour
The demo uses a fixed single-user ID: `demo-user`. A few seeded profiles have already liked this user. Like one of those profiles to trigger a mutual match. This is a demo assumption, not production authentication.

## API

- `GET /feed` — profiles not yet swiped on by `demo-user`
- `POST /swipe` — body: `{ "profileId": "...", "action": "like" | "pass" }`
- `GET /matches` — mutual matches for `demo-user`

## Data model
- `Profile`: mock profile details and `likedBy` IDs
- `Swipe`: unique `(userId, profileId)` record
- `Match`: unique pair of users, created only after reciprocal likes

## Privacy
`GET /feed` deliberately omits `likedBy` and any `likedYou` property. The client cannot discover incoming one-sided likes. `GET /matches` returns only records created after mutual likes.

## Notes
- Seed data is inserted automatically when the profile collection is empty.
- To reset the demo, clear the `profiles`, `swipes`, and `matches` collections in the `coy_discover` database, then restart the server.
