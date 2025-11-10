Digital Business Card Generator (Fullstack Starter)

- Simple fullstack app to design, preview, save, and export business cards
- Authentication-enabled with protected routes and card ownership
- Frontend uses Vite (React) and backend runs on Express with file-backed storage
Overview

- Build and preview business cards with live controls and templates
- Upload a logo, tweak colors and typography, and export as PNG/PDF
- Save designs to your account and manage them on the backend
- Authentication (signup/login) with JWT and context-based auth on the client
Tech Stack

- Backend: Node.js , Express , JWT , NeDB (file-based storage)
- Frontend: React (Vite) , Axios , Context-based auth
- Tooling: nodemon for backend dev, vite for frontend dev
Folder Structure

- Root: DIGITAL BUSINESS CARD GENERATOR/
- Backend: backend/ with controllers/ , routes/ , models/ , middleware/ , config/ , utils/
- Frontend: frontend/ with src/ pages, services, context and global styles
File Highlights

- Backend
  - backend/server.js — Express app, CORS, API route mounting
  - backend/config/db.js — NeDB setup ( users.db , cards.db )
  - backend/routes/authRoutes.js — POST /api/auth/signup , POST /api/auth/login
  - backend/routes/cardRoutes.js — CRUD for cards (protected via authMiddleware )
  - backend/controllers/authController.js — user create, login, token issuance
  - backend/controllers/cardController.js — card create/list/get/update/delete
- Frontend
  - frontend/src/pages/Home.jsx — designer controls, preview canvas, saved designs
  - frontend/src/pages/Login.jsx and Signup.jsx — auth flow screens
  - frontend/src/context/AuthContext.jsx — auth state and token persistence
  - frontend/src/services/api.js — Axios client with token interceptor
  - frontend/src/styles.css and frontend/src/pages/Home.css — site-wide and page styles
API Routes

- Auth
  - POST /api/auth/signup — name , email , password
  - POST /api/auth/login — email , password
- Cards (protected; requires Authorization: Bearer <token> )
  - GET /api/cards — list current user’s cards
  - POST /api/cards — create card { title, fields, style, logoDataUrl }
  - GET /api/cards/:id — get a single card (owned by user)
  - PUT /api/cards/:id — update card
  - DELETE /api/cards/:id — delete card
Setup

- Backend
  
  - cd backend
  - npm install
  - Optional .env (recommended):
    - JWT_SECRET=<your-secret>
    - PORT=5000
  - npm run dev (with nodemon) or npm start
  - Health check: visit http://localhost:5000/api/health
- Frontend
  
  - cd frontend
  - npm install
  - Proxy is already configured to forward '/api' to http://localhost:5000
    - Axios uses baseURL: '/api'
    - Vite dev server runs on http://localhost:5173/
  - npm run dev
- Running Both
  
  - Start backend first: http://localhost:5000
  - Start frontend: http://localhost:5173
  - Login/Signup should work as soon as both servers are running
Features

- Designer
  - Change template ( modern , minimal , classic )
  - Update fields: name, title, company, phone, email, website, address
  - Upload logo image
  - Adjust style: background, text, accent colors, font family
- Export
  - Export preview as PNG or PDF via html2canvas and jsPDF
- Saved Designs
  - Save cards to your account and manage a list of saved designs
  - Ownership enforced on all protected card routes
- Auth
  - Persistent auth via localStorage
  - Automatic token attachment to API calls
Environment Notes

- CORS is configured for http://localhost:5173 (and 5174 ) in the backend
- Storage uses NeDB files under backend/data/ ( users.db , cards.db )
- If you want to point the frontend to a different API URL, you can add VITE_API_BASE support in the Axios client or update the Vite proxy accordingly
Troubleshooting

- Login/Signup failing
  - Ensure backend is running at http://localhost:5000
  - Check that the frontend is on http://localhost:5173
  - Errors like “Invalid credentials” or “Email already registered” come from the backend validations
- API 404 or CORS issues
  - Confirm Vite proxy forwards '/api' to http://localhost:5000
  - Verify routes are mounted under /api/auth and /api/cards
Next Steps / Suggestions

- Add UI library (Tailwind or Material UI) for faster styling
- Introduce more templates and layout options for cards
- Add “duplicate card” and “rename card” actions in Saved Designs
- Improve accessibility and keyboard navigation
- Deploy instructions (Render/Netlify/Vercel) and environment handling for production
