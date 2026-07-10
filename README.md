# ⚽ RivalRec

RivalRec is full-stack web application designed for tracking online football match results between friends. It allows users to log head-to-head friendly matches against specific rivals, track advanced win-rate analytics, and generate automated algorithmic knockout tournaments.

## 🚀 Features

- **Secure Authentication:** Session-based authentication using Better-Auth (Google OAuth 2.0 & Credentials).
- **Head-to-Head Analytics:** Real-time data reduction to calculate user win rates, total matches, and goal differentials against specific rivals.
- **Automated Tournament Engine:** Custom binary tree traversal algorithm that dynamically generates knockout brackets (4, 8, or 16 teams) and auto-advances winners.

## 💻 Tech Stack

**Frontend:**

- React.js
- React Router DOM
- Tailwind CSS
- Vite

**Backend:**

- Node.js & Express.js
- Better-Auth
- Prisma ORM

**Database & Infrastructure:**

- PostgreSQL
- RESTful API design

## 🛠️ Local Development Setup

**1. Clone the repository**
\`\`\`bash
git clone https://github.com/afzytk/rivalrec.git
cd rivalrec
\`\`\`

**2. Install dependencies**
\`\`\`bash
cd backend && npm install
cd ../frontend && npm install
\`\`\`

**3. Configure Environment Variables**
Create a `.env` file in the `/backend` directory:
\`\`\`env
DATABASE_URL="postgresql://..."
BETTER_AUTH_SECRET="secure_random_string"
BETTER_AUTH_URL="import.meta.env.VITE_API_URL"
GOOGLE_CLIENT_ID="google_client_id"
GOOGLE_CLIENT_SECRET="google_client_secret"
\`\`\`

**4. Setup the Database**
\`\`\`bash
cd backend
npx prisma generate
npx prisma db push
\`\`\`

**5. Run the Application**
Open two terminals.
Terminal 1 (Backend):
\`\`\`bash
cd backend && npm run dev
\`\`\`
Terminal 2 (Frontend):
\`\`\`bash
cd frontend && npm run dev
\`\`\`
