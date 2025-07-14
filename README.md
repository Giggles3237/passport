# BMW Digital Passport Platform

A scalable, BMW-branded digital passport experience for customer engagement and lead generation at events and stores.

## Features
- Scan QR codes at locations to collect digital "stamps"
- Register with name and email (stored in Azure MySQL)
- "My Passport" page shows collected stamps and user info
- Multi-store support for different BMW locations/events
- BMW branding: logo, colors, fonts
- Cookie consent banner with option to opt out

## Tech Stack
- **Frontend:** React (Vite)
- **Backend:** Node.js (Express)
- **Database:** Azure MySQL

## Setup

### 1. Backend
- Configure your Azure MySQL connection in `backend/.env`
- Run `npm install` in `backend/`
- Start server: `npm run dev`

### 2. Frontend
- Run `npm install` in `frontend/`
- Start dev server: `npm run dev`

### 3. Database
- Use the provided `schema.sql` to set up your Azure MySQL database

## BMW Branding
- Colors: BMW Blue (#1c69d4), Black, White, Silver
- Logo: Official BMW roundel (in `/frontend/src/assets`)
- Fonts: BMW Type Next (fallback: Arial, Helvetica)

---

For questions or to add new stores, see the documentation in `/docs`. 
