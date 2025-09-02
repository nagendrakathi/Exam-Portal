## Backend

To create Backend Folder

- First create backend folder and run 
{{npm init -y    }} in cmd in the /backend path
- backend/
    - src/
        - config/ — database connection, env loader, app config (e.g., db.js).
        - controllers/ — request handlers (auth.controller.js, exam.controller.js).
        - middlewares/ — auth, error handler,
        - models/ — Mongoose schemas (User.model.js, Question.model.js, Session.model.js).
        - routes/ — route modules (auth.routes.js, exam.routes.js,) Router
        - utils/ — helpers (asyncHandler.js, jwt.js) (JWT Token generation )
        - seeds/ — seed.js for Question modle
        - index.js — server start entry point
    - package.json — backend dependencies and scripts.
    - Run this script install necessary npms
        
        npm i bcryptjs cookie-parser cors dotenv express jsonwebtoken mongoose morgan
        
        ```json
        "dependencies": {
            "bcryptjs": "^3.0.2",
            "cookie-parser": "^1.4.7",
            "cors": "^2.8.5",
            "dotenv": "^17.2.1",
            "express": "^5.1.0",
            "jsonwebtoken": "^9.0.2",
            "mongoose": "^8.18.0",
            "morgan": "^1.10.1"
          }
        ```
        
    - .env — server-side secrets (Mongo URI, JWT keys).
        
        ```
        PORT=8000
        NODE_ENV=development
        MONGO_URI=mongodb://localhost:27017/exam-portal  (Install MongoDB locaally)
        JWT_SECRET={{Paste your JWT Seccrete Here}}
        EXAM_DURATION_MINUTES=30
        QUESTION_COUNT=30
        FRONTEND_URL=http://localhost:5173 (replace with yuour ur frontend url)
        ```
        

## Frontend

To create this folder

- FIrst create frintend folder and run 
{{npm create vite@latest  .     }} in cmd in /frontend path
- frontend/
    - public/ — static assets and base index.html.
    - src/
        - api/ — axios instance and API wrappers.
        - components/ — shared UI (AuthForm.jsx, Modal.jsx, Header.jsx, QuestionCard.jsx, Timer.jsx)
        - pages/ — route-level views (LandingPage.jsx, Dashboard.jsx, Exam.jsx, ExamResult.jsx)
        - context/ — React Context providers (AuthContext.jsx, ExamContext.jsx).
        - App.jsx — root component
        - main.jsx
    - package.json — frontend dependencies and scripts.
    - Run this to ionstall necesary npms \n
    - 
    npm i tailwindcss @tailwindcss/vite axios lucide-react react-router-dom
        
        ```json
        "dependencies": {
            "@tailwindcss/vite": "^4.1.12",
            "axios": "^1.11.0",
            "lucide-react": "^0.542.0",
            "react": "^19.1.1",
            "react-dom": "^19.1.1",
            "react-hot-toast": "^2.6.0",
            "react-router-dom": "^7.8.2",
            "tailwindcss": "^4.1.12"
          },
          "devDependencies": {
            "@eslint/js": "^9.33.0",
            "@types/react": "^19.1.10",
            "@types/react-dom": "^19.1.7",
            "@vitejs/plugin-react": "^5.0.0",
            "eslint": "^9.33.0",
            "eslint-plugin-react-hooks": "^5.2.0",
            "eslint-plugin-react-refresh": "^0.4.20",
            "globals": "^16.3.0",
            "vite": "^7.1.2"
          }
        ```
        
    - .env — frontend env (public API base like VITE_API_URL).
        
        VITE_BASE_URL=https://localhost:5000
        

# Exam Portal API Testing Guide

This guide explains how to test each API in the **Exam-Portal** Postman collection.

---

## 🔑 Authentication APIs

### 1. Register User

**Method:** `POST`**URL:** `http://localhost:8000/api/auth/register`**Body (JSON):**

Plain Text

```
{
  "name": "test1",
  "email": "test1@gmail.com",
  "password": "123456"
}

```

**Expected Response:**

Plain Text

```
{
  "_id": "68b6973dc598ebb5dad78b10",
  "name": "test1",
  "email": "test1@gmail.com"
}

```

---

### 2. Login User

**Method:** `POST`**URL:** `http://localhost:8000/api/auth/login`**Body (JSON):**

Plain Text

```
{
  "email": "test1@gmail.com",
  "password": "123456"
}

```

**Expected Response:**

Plain Text

```
{
  "_id": "68b6973dc598ebb5dad78b10",
  "name": "test1",
  "email": "test1@gmail.com",
  "token": "jwt-token-here"
}

```

---

### 3. Get Current User

**Method:** `GET`**URL:** `http://localhost:8000/api/auth/user`**Headers:**

Plain Text

```
Authorization: Bearer <token>

```

**Expected Response:**

Plain Text

```
{
  "_id": "68b6973dc598ebb5dad78b10",
  "name": "test1",
  "email": "test1@gmail.com"
}

```

---

### 4. Logout

**Method:** `POST`**URL:** `http://localhost:8000/api/auth/logout`**Headers:**

Plain Text

```
Authorization: Bearer <token>

```

**Expected Response:**

Plain Text

```
{
  "message": "Logged out successfully"
}

```

---

## 📝 Exam Session APIs

### 5. Start Exam

**Method:** `POST`**URL:** `http://localhost:8000/api/exam/start`**Headers:**

Plain Text

```
Authorization: Bearer <token>

```

**Expected Response (Sample):**

Plain Text

```
{
  "sessionId": "68b69867c598ebb5dad78b28",
  "questions": [
    {
      "index": 0,
      "questionId": "68b5d97089a5808c8a58b8c9",
      "prompt": "Which keyword is used to define a constant in Java?",
      "options": ["final", "const", "let", "define"],
      "selectedIndex": null
    }
  ],
  "durationMinutes": 30,
  "startedAt": "2025-09-02T07:10:31.208Z"
}

```

---

### 6. Update Answer

**Method:** `PATCH`**URL:** `http://localhost:8000/api/exam/{{sessionId}}/answer`**Body (JSON):**

Plain Text

```
{
  "index": 12,
  "selectedIndex": 3
}

```

**Expected Response:**

Plain Text

```
{
  "ok": true
}

```

---

### 7. Submit Exam

**Method:** `POST`**URL:** `http://localhost:8000/api/exam/{{sessionId}}/submit`**Expected Response:**

Plain Text

```
{
  "sessionId": "68b69867c598ebb5dad78b28",
  "total": 30,
  "score": 20,
  "submittedAt": "2025-09-02T07:11:16.479Z"
}

```

---

### 8. Get My Sessions

**Method:** `GET`**URL:** `http://localhost:8000/api/exam/my-sessions`**Expected Response:**

Plain Text

```
[
  {
    "sessionId": "68b69867c598ebb5dad78b28",
    "total": 30,
    "score": 20,
    "startedAt": "2025-09-02T07:10:31.208Z",
    "submittedAt": "2025-09-02T07:11:16.479Z",
    "durationMinutes": 30,
    "isOngoing": false
  }
]

```

---

### 9. Get Specific Session

**Method:** `GET`**URL:** `http://localhost:8000/api/exam/{{sessionId}}`**Expected Response (Sample):**

Plain Text

```
{
  "sessionId": "68b69750c598ebb5dad78b16",
  "total": 30,
  "score": 0,
  "startedAt": "2025-09-02T07:05:52.158Z",
  "submittedAt": "2025-09-02T07:06:23.065Z",
  "questions": [
    {
      "index": 0,
      "prompt": "Which memory management technique suffers from external fragmentation?",
      "options": ["Segmentation", "None", "Swapping", "Paging"],
      "selectedIndex": null,
      "correctIndex": 0,
      "isCorrect": false
    }
  ]
}

```

