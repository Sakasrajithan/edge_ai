# SentinelEdge AI

Edge AI for Connected, Secure & Intelligent Industrial Systems.

SentinelEdge AI is a full-stack Minimum Viable Product (MVP) built to monitor industrial machinery. The platform ingests telemetry data from machine sensors, runs a predictive AI engine to detect abnormalities (such as bearing degradation, rotor imbalance, thermal overheating, or electrical overload), displays live health indices, and provides automated maintenance recommendations.

---

## Project Architecture & Data Flow

```
Mock Sensor Service (Telemetry)
          │
          ▼
    REST API (POST /api/sensor)
          │
          ▼
    Express.js Backend (MVC)
          │
          ├─────────────────────┐
          ▼                     ▼
  MongoDB (Machines)    Mock AI Prediction Service
                                │
                                ▼
                       MongoDB (Predictions)
                                │
                                ▼
                       React.js Dashboard
```

1. **Mock Sensor Service** generates realistic normal and fault telemetry data (Temperature, Vibration, RPM, Current) and sends it to the backend.
2. **Backend Services** ingest the sensor logs and invoke the **Mock AI Service**.
3. **Mock AI Service** performs classification checks to identify anomalies and assigns a machine health index.
4. **MongoDB Collections** save the historical readings and prediction details.
5. **React Frontend** pulls this data in real-time to render interactive diagnostic pages and Recharts timelines.

---

## Features

- **Dynamic KPI Summaries:** Displays overall system health, connected nodes, active incidents, and calculated power efficiency.
- **Machinery Status Cards:** Shows real-time metrics (Temp, Vibration, RPM, Current) with dynamic warning and critical status indicators.
- **AI Health Gauges:** Renders interactive SVG circular progress bars measuring machine health (0-100%).
- **Diagnostics Timeline Charts:** Plots historical trend lines using Recharts for quick trend analysis.
- **Real-Time Polling:** Synchronizes telemetry streams every 4-5 seconds automatically.
- **Incident Logs Feed:** Features searchable, filterable histories of warnings and critical alerts.

---

## Folder Structure

```
SentinelEdge-AI/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection using Mongoose
│   ├── controllers/
│   │   ├── machineController.js   # Machinery API endpoints
│   │   ├── predictionController.js# AI prediction endpoints
│   │   └── sensorController.js    # Ingests telemetry logs
│   ├── models/
│   │   ├── Machine.js            # Machine Schema & history
│   │   └── Prediction.js         # Predictions & recommendations logs
│   ├── routes/
│   │   └── api.js                # Express router
│   ├── services/
│   │   ├── mockPredictionService.js# Rule-based AI predictor mock
│   │   └── mockSensorService.js  # Telemetry stream simulator
│   ├── .env                      # Environment configurations
│   ├── app.js                    # Express app configuration
│   ├── package.json              # Server dependencies
│   └── server.js                 # Server entry point
│
├── frontend/
│   ├── src/
│   │   ├── assets/               # Branding assets
│   │   ├── components/
│   │   │   ├── AlertCard.jsx     # Alert incident list feed
│   │   │   ├── ChartCard.jsx     # Recharts area graph
│   │   │   ├── HealthCard.jsx    # SVG progress ring gauge
│   │   │   ├── MachineCard.jsx   # Grid cards showing current telemetry
│   │   │   ├── Navbar.jsx        # Branding and global alerts count
│   │   │   ├── RecommendationCard.jsx # Action items cards
│   │   │   ├── Sidebar.jsx       # Layout navigation menu
│   │   │   └── StatusBadge.jsx   # Status indicator pill
│   │   ├── pages/
│   │   │   ├── Alerts.jsx        # Incident tables list
│   │   │   ├── Dashboard.jsx     # Network and machines summaries
│   │   │   └── MachineDetails.jsx# Detailed diagnostic timeline views
│   │   ├── api.js                # Axios HTTP client config
│   │   ├── App.jsx               # Routing and main layouts
│   │   └── index.css             # Tailwind imports & dark theme variables
│   ├── index.html                # Entry HTML page
│   ├── postcss.config.js         # PostCSS configuration
│   ├── tailwind.config.js        # Tailwind layout configuration
│   └── package.json              # Frontend client dependencies
│
└── README.md                     # Documentation
```

---

## Installation & Setup Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (v16+)
- [MongoDB Community Server](https://www.mongodb.com/try/download/community) (running locally on port `27017`)

### 1. Backend Setup
1. Open a terminal and navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure the environment variables in a `.env` file (one has been pre-created for you):
   ```env
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/sentineledge-ai
   NODE_ENV=development
   ```
4. Run the server (starts the background simulator immediately):
   ```bash
   npm start
   ```
   *(Alternatively, run `npm run dev` to start in hot-reload mode).*

### 2. Frontend Setup
1. Open a new terminal and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the Vite development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to `http://localhost:5173/` to view the platform.

---

## REST API Documentation

### 1. Ingest Telemetry Logs
- **Endpoint:** `POST /api/sensor`
- **Description:** Receives live sensor values from edge nodes. Calculates AI health prediction, saves data, and updates status.
- **Request Body Example:**
  ```json
  {
    "machineId": "MAC-001",
    "machineName": "CNC Milling Machine",
    "temperature": 52.4,
    "vibration": 1.2,
    "rpm": 1500,
    "current": 8.1
  }
  ```
- **Response:** `201 Created`

### 2. List All Machinery Nodes
- **Endpoint:** `GET /api/machine`
- **Description:** Returns the latest telemetry details and historical readings for all machines.
- **Response Example:**
  ```json
  {
    "success": true,
    "count": 4,
    "data": [
      {
        "machineId": "MAC-001",
        "machineName": "CNC Milling Machine",
        "temperature": 52.4,
        "vibration": 1.2,
        "rpm": 1500,
        "current": 8.1,
        "status": "Healthy",
        "history": [...]
      }
    ]
  }
  ```

### 3. Get Single Machine Details
- **Endpoint:** `GET /api/machine/:machineId`
- **Description:** Returns current metrics and full timeline history (capped at 30 items) for a single node.
- **Response:** `200 OK`

### 4. Query AI Predictions
- **Endpoint:** `GET /api/prediction`
- **Description:** Query historical predictive logs, support filtering by `machineId` and `limit`.
- **Query Params:**
  - `machineId` (String, optional)
  - `limit` (Number, optional, default: 50)
- **Response:** `200 OK`

### 5. Manually Create Anomaly Prediction
- **Endpoint:** `POST /api/predict`
- **Description:** Directly run the prediction engine on custom metrics without updating the machine history log.
- **Request Body Example:**
  ```json
  {
    "machineId": "MAC-001",
    "temperature": 92.5,
    "vibration": 7.4,
    "rpm": 1780,
    "current": 12.1
  }
  ```
- **Response:** `200 OK`
