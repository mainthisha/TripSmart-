# 🌍 TripSmart

### Plan Smarter. Travel Better.

🚀 An intelligent travel planning platform designed to bring destination discovery, personalized planning, budgeting, travel information, and trip management together in one place.

---

## 🌟 Overview

**TripSmart** is a smart travel companion that simplifies the complete trip-planning process.

Instead of switching between multiple platforms for destinations, itineraries, budgets, weather, currency, visa information, packing, and expenses, TripSmart brings these essential travel tools together into a unified experience.

---

## 🎯 Problem Statement

Planning a trip often involves:

- ❌ Using multiple platforms for different travel needs
- ❌ Manually creating and managing itineraries
- ❌ Difficulty keeping track of budgets and expenses
- ❌ Searching separately for weather, currency, and visa information
- ❌ Lack of personalized travel recommendations
- ❌ Poor organization of pre-trip preparation

---

## 💡 Our Solution

TripSmart provides a **unified and personalized travel planning experience** that helps users:

✔ Discover destinations and attractions  
✔ Build personalized day-by-day itineraries  
✔ Plan and manage travel budgets  
✔ Track trip expenses  
✔ Get weather and currency information  
✔ Explore visa and travel requirements  
✔ Discover hidden gems and travel tips  
✔ Manage packing and pre-departure checklists  
✔ Save and share trips  

---

## 🔥 Key Features

### 🗺️ Destination Explorer

- Explore destinations and attractions
- Discover hidden gems and local recommendations
- View destination-specific travel information
- Explore food, events, and photo spots

### 🤖 Smart Travel Suggestions

- Personalized travel recommendations
- Suggestions based on destination, trip details, budget, and interests
- Activity-based travel planning

### 📅 Itinerary Planner

- Create day-by-day itineraries
- Organize activities by morning, afternoon, and evening
- Customize planned activities
- Plan attraction routes

### 💰 Budget & Expense Management

- Set an overall trip budget
- Distribute budget across categories
- Track accommodation, food, transport, and activity expenses
- Monitor spending and remaining budget

### 🌦️ Weather & Currency

- Current weather information
- Multi-day weather forecasts
- Currency conversion
- Exchange-rate information

### 🛂 Travel Information

- Destination visa information
- Entry requirements
- Processing and document information
- Destination-specific travel tips

### 🎒 Travel Preparation

- Smart packing checklist
- Pre-departure checklist
- Track preparation progress
- Add and manage custom checklist items

### 🔗 Trip Sharing & Management

- Save planned trips
- Retrieve saved trips
- Generate shareable trip links
- Share trip information with others

### 📄 Trip Summary

- Generate complete trip summaries
- Export trip information
- Download trip reports as PDF

### 🌐 Multilingual Support

- Multilingual user interface
- Language switching support
- Designed for a wider range of travelers

---

## 🧠 Tech Stack

### Frontend

- React
- Vite
- Tailwind CSS
- Framer Motion
- React Leaflet
- Axios
- i18next

### Backend

- Python
- FastAPI
- Pydantic
- Uvicorn

### Database

- MongoDB

### External APIs

- Open-Meteo
- Exchange Rate API

---

## ⚙️ Installation

### 1️⃣ Clone the Repository

```bash
git clone <your-repository-url>
cd TripSmart
```

---

### 2️⃣ Setup the Backend

```bash
cd backend
python -m venv venv
```

Activate the virtual environment:

**Windows**

```bash
venv\Scripts\activate
```

**macOS / Linux**

```bash
source venv/bin/activate
```

Install the required dependencies:

```bash
pip install -r requirements.txt
```

---

### 3️⃣ Run the Backend

```bash
uvicorn main:app --reload
```

Backend will run at:

```text
http://127.0.0.1:8000
```

API documentation:

```text
http://127.0.0.1:8000/docs
```

---

### 4️⃣ Setup the Frontend

Open a new terminal:

```bash
cd frontend
npm install
```

Start the development server:

```bash
npm run dev
```

Frontend will run at:

```text
http://localhost:5173
```

---

## 📁 Project Structure

```text
TripSmart/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── data/
│   │   ├── i18n/
│   │   └── services/
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── routers/
│   ├── main.py
│   ├── models.py
│   ├── database.py
│   └── requirements.txt
│
└── README.md
```

---

## 🏆 Project Highlights

✔ Unified travel planning experience  
✔ Personalized trip recommendations  
✔ End-to-end itinerary and budget management  
✔ Real-time weather integration  
✔ Currency conversion  
✔ Travel preparation tools  
✔ Trip sharing and export  
✔ Multilingual support  
✔ Modern responsive user interface  

---

## 📌 Conclusion

**TripSmart** is a unified travel planning platform that brings destination discovery, personalized recommendations, itinerary planning, budget management, travel information, and trip preparation into one seamless experience.

By combining intelligent travel assistance with practical planning and management tools, TripSmart aims to make the entire journey — from planning to preparation — simpler, more organized, and more enjoyable.

### 🌍 Plan Smarter. Travel Better.
