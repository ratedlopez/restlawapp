# RestaurantLaw.net

A minimal webapp to help restaurant owners and managers find legal and compliance answers tailored to their state.

## Features
- Minimal, stylish UI
- Rotating example questions
- Chat interface powered by OpenAI
- Responsive (desktop & mobile)
- Disclaimer and developer credit in footer

## Project Structure
- `/frontend` — React app (UI)
- `/backend` — Node.js + Express (API proxy to OpenAI)

## Setup

### 1. Clone the repo
```bash
git clone <your-repo-url>
cd RestaurantLaw.net
```

### 2. Frontend
```bash
cd frontend
npm install
npm run dev # or npm run build && npm run preview
```

### 3. Backend
```bash
cd backend
npm install
npm run dev
```

### 4. Environment Variables
- Backend: Create a `.env` file in `/backend` with `OPENAI_API_KEY=your-key`

### 5. Deployment
- Deploy both `/frontend` and `/backend` on Render.

---
Developed by Lopez Ventures 