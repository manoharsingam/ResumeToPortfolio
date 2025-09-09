# 📌 Resume to Portfolio (MERN + Gemini API)

This is a **full-stack MERN application** that converts a resume into a portfolio website.  
It extracts data from a **PDF resume**, processes it with **Gemini API**, and generates a structured **portfolio preview** on the frontend.  

---

## 🚀 Features
- 📄 Upload your resume (PDF) → Parse content automatically  
- 🧠 Process resume text using **Google Gemini API**  
- 🎨 Generate a **preview portfolio** (React frontend)  
- 💾 Store and manage data with **MongoDB**  
- 🔐 Secure backend API with **Express + Node.js**  
- 🌐 Deployment ready (Frontend → Vercel, Backend → Render/Heroku)  

---

## 🛠️ Tech Stack
- **Frontend:** React (JSX components), CSS  
- **Backend:** Node.js, Express  
- **Database:** MongoDB (Atlas)  
- **AI API:** Google Gemini API  
- **Other Tools:** Dotenv, PDF parsing libraries  
- **Hosting:** Vercel (Frontend) + Render/Heroku (Backend)  

---

## 📂 Project Structure
    resumePortfolio/
    ├── backend/
    │ ├── models/ # MongoDB models
    │ ├── uploads/ # Uploaded resume files
    │ ├── .env # Environment variables
    │ ├── package.json
    │ └── server.js # Express backend
    │
    ├── frontend/
    │ ├── public/
    │ └── src/
    │ ├── components/ # React components
    │ │ ├── ActionButtons.jsx
    │ │ ├── CodeEditor.jsx
    │ │ ├── DownloadButton.jsx
    │ │ ├── FileUpload.jsx
    │ │ ├── OptionsSelector.jsx
    │ │ └── PortfolioPreview.jsx
    │ ├── App.jsx
    │ ├── App.css
    │ └── index.js
    │ ├── package.json
    │
    ├── README.md
    └── .gitignore


---

## 🔑 Environment Variables
Create a `.env` file inside **backend/**:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
```
---

⚡ Installation & Usage
---
    1. Clone the repo
          git clone https://github.com/<your-username>/ResumeToPortfolio.git
          cd ResumeToPortfolio
---
    2. Install dependencies
        Backend:
          cd backend
          npm install
    
        Frontend:
          cd ../frontend
          npm install
    
    3. Run the project
        Start backend:
          cd backend
          node server.js
    
        Start frontend:
          cd frontend
          npm start



✨ Future Improvements

Improve AI portfolio generation with custom templates

Save multiple portfolio versions per user

Export portfolio as a standalone static site

Add authentication (JWT/OAuth) for user-specific dashboards
