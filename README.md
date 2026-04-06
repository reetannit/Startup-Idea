# 🚀 AI-Powered Startup Idea Validator

A full-stack MVP application that allows users to submit startup ideas and receive comprehensive AI-generated validation reports. Built with React, Express.js, MongoDB, and OpenAI.

![Tech Stack](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![Tech Stack](https://img.shields.io/badge/Express-4-000?logo=express&logoColor=white)
![Tech Stack](https://img.shields.io/badge/MongoDB-8-47A248?logo=mongodb&logoColor=white)
![Tech Stack](https://img.shields.io/badge/OpenAI-GPT--4o--mini-412991?logo=openai&logoColor=white)

---

## 📋 Features

- **Submit Startup Ideas** — Enter a title and description for AI analysis
- **AI Validation Reports** — Receive structured reports with:
  - Problem summary
  - Customer persona
  - Market overview
  - Competitor analysis (3 competitors)
  - Suggested tech stack (4-6 technologies)
  - Risk level (Low/Medium/High)
  - Profitability score (0-100)
  - Justification & assessment
- **Dashboard** — View all submitted ideas with status indicators
- **Detail View** — Full report with animated score gauge and structured sections
- **Delete Ideas** — Remove ideas with confirmation modal
- **Real-time Updates** — Auto-poll for status changes during analysis
- **Demo Mode** — Works out-of-the-box with in-memory storage and mock AI (no credentials needed)
- **Premium Dark UI** — Glassmorphism design with smooth animations

---

## 🏗️ Project Structure

```
├── client/                 # React Frontend (Vite)
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components (Dashboard, Submit, Detail)
│   │   ├── services/       # API service layer
│   │   ├── App.jsx         # Root component with routing
│   │   ├── App.css         # Application styles
│   │   └── index.css       # Design system & globals
│   ├── index.html
│   └── package.json
│
├── server/                 # Express.js Backend
│   ├── config/
│   │   └── db.js           # MongoDB connection
│   ├── models/
│   │   └── Idea.js         # Mongoose schema
│   ├── routes/
│   │   ├── ideas.js        # API routes (MongoDB)
│   │   └── ideasDemo.js    # API routes (in-memory, demo mode)
│   ├── services/
│   │   ├── aiService.js    # OpenAI integration
│   │   └── mockAiService.js # Mock AI for demo mode
│   ├── index.js            # Server entry point (auto-detects mode)
│   ├── .env.example        # Environment variable template
│   └── package.json
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and npm

**Optional (for production mode):**
- **MongoDB** — [MongoDB Atlas](https://www.mongodb.com/atlas) (free tier) or local MongoDB
- **OpenAI API Key** — [Get one here](https://platform.openai.com/api-keys)

> **💡 Demo Mode:** The app works out-of-the-box without MongoDB or OpenAI credentials. It auto-detects unconfigured credentials and runs with in-memory storage and mock AI responses.

### Installation

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd "Schmooze media"
   ```

2. **Setup the Backend**
   ```bash
   cd server
   npm install
   
   # Create .env file from template
   cp .env.example .env
   # Edit .env and add your credentials:
   # - MONGODB_URI=your_mongodb_connection_string
   # - OPENAI_API_KEY=your_openai_api_key
   ```

3. **Setup the Frontend**
   ```bash
   cd ../client
   npm install
   ```

4. **Start the Backend**
   ```bash
   cd server
   npm run dev
   ```
   You should see:
   ```
   ⚡ Running in DEMO MODE (in-memory storage, mock AI)
   🚀 Server running on port 5001
   ```

5. **Start the Frontend** (in a new terminal)
   ```bash
   cd client
   npm run dev
   ```

6. **Open the app** at [http://localhost:5173](http://localhost:5173)

---

## 🔌 API Endpoints

| Method   | Endpoint         | Description                      | Request Body            |
|----------|-----------------|----------------------------------|-------------------------|
| `POST`   | `/api/ideas`     | Submit idea + trigger AI analysis| `{ title, description }` |
| `GET`    | `/api/ideas`     | List all ideas (paginated)       | —                       |
| `GET`    | `/api/ideas/:id` | Get idea with full report        | —                       |
| `DELETE` | `/api/ideas/:id` | Delete an idea                   | —                       |
| `GET`    | `/api/health`    | Health check                     | —                       |

---

## 🤖 AI Prompt

The AI analysis uses OpenAI's GPT-4o-mini with the following system prompt:

```
You are an expert startup consultant with deep knowledge of technology,
markets, and business strategy. Analyze the given startup idea and return
a structured JSON object.

Rules:
- Keep answers concise, realistic, and data-driven.
- "problem" should be a clear 2-3 sentence summary of the problem being solved.
- "customer" should describe the ideal customer persona in 2-3 sentences.
- "market" should provide a market overview with estimated size and growth.
- "competitor" must contain EXACTLY 3 competitors with one-line differentiation.
- "tech_stack" should list 4-6 practical technologies for MVP.
- "risk_level" must be exactly one of: "Low", "Medium", or "High".
- "profitability_score" must be an integer between 0 and 100.
- "justification" should explain reasoning for risk and profitability assessment.

Return ONLY valid JSON.
```

### Response Structure
```json
{
  "problem": "Summary of the problem being solved",
  "customer": "Target customer persona description",
  "market": "Market overview and size estimation",
  "competitor": [
    { "name": "Competitor 1", "differentiation": "..." },
    { "name": "Competitor 2", "differentiation": "..." },
    { "name": "Competitor 3", "differentiation": "..." }
  ],
  "tech_stack": ["React", "Node.js", "PostgreSQL", "Docker"],
  "risk_level": "Medium",
  "profitability_score": 72,
  "justification": "Reasoning for the assessment"
}
```

---

## 🛠️ Tech Stack

### Frontend
- **React 18** — UI library
- **Vite** — Build tool
- **React Router v6** — Client-side routing
- **React Hot Toast** — Notifications
- **Vanilla CSS** — Custom design system

### Backend
- **Node.js** — Runtime
- **Express.js** — Web framework
- **Mongoose** — MongoDB ODM
- **OpenAI SDK** — AI integration
- **express-rate-limit** — Rate limiting

### Database
- **MongoDB** — Document database (Atlas recommended)

### AI
- **OpenAI GPT-4o-mini** — Startup analysis

---

## 🌐 Deployment

### Frontend → Vercel
```bash
cd client
npx vercel --prod
```
Set environment variable: `VITE_API_URL=https://your-api.onrender.com/api`

### Backend → Render
1. Create a new Web Service on [Render](https://render.com)
2. Point to the `/server` directory
3. Set build command: `npm install`
4. Set start command: `node index.js`
5. Add environment variables: `MONGODB_URI`, `OPENAI_API_KEY`, `CLIENT_URL`

### Database → MongoDB Atlas
1. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Get the connection string
3. Add it to your `.env` as `MONGODB_URI`

---

## 📄 Environment Variables

### Server (`/server/.env`)
| Variable        | Description                  | Example                                  |
|----------------|------------------------------|------------------------------------------|
| `PORT`          | Server port                  | `5001`                                   |
| `MONGODB_URI`   | MongoDB connection string    | `mongodb+srv://user:pass@cluster/db`     |
| `OPENAI_API_KEY` | OpenAI API key              | `sk-...`                                 |
| `CLIENT_URL`    | Frontend URL (CORS)          | `http://localhost:5173`                   |

> **Note:** If `MONGODB_URI` or `OPENAI_API_KEY` contain placeholder values, the app runs in **demo mode** automatically.

### Client (`/client/.env`)
| Variable        | Description                  | Example                                  |
|----------------|------------------------------|------------------------------------------|
| `VITE_API_URL`  | Backend API URL              | `http://localhost:5001/api`               |

---

## 📝 License

MIT
# Startup-Idea
