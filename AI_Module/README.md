# 🤖 AI Predictive Maintenance System

## 📌 Overview

The AI Predictive Maintenance System is a machine learning-based solution that predicts machine failures using sensor data. It helps industries reduce unexpected downtime by providing early failure prediction, health analysis, maintenance recommendations, and Digital Twin visualization support.

This module is designed to integrate with the project's backend and frontend dashboard through a REST API.

---

## 🚀 Features

- Machine Failure Prediction using XGBoost
- Failure Probability Calculation
- Machine Health Score
- Risk Level Classification (Low, Medium, High, Critical)
- Intelligent Maintenance Recommendations
- Digital Twin Component Status
- Maintenance Timeline Generation
- REST API using Flask
- JSON-based API Responses
- Input Validation and Error Handling

---

## 🛠️ Technologies Used

- Python 3.x
- XGBoost
- Pandas
- NumPy
- Scikit-learn
- SHAP (Explainable AI)
- Flask
- Joblib

---

## 📂 Project Structure

```
AI_Module/
│
├── app.py                     # Flask REST API
├── predict.py                 # Prediction Engine
├── final_model.pkl            # Trained XGBoost Model
├── Predictive_Maintenance_AI.ipynb
├── requirements.txt           # Python Dependencies
├── sample_request.json        # Sample API Request
├── model_comparison.csv       # Model Performance Comparison
├── ai4i2020.csv               # Dataset
└── README.md
```

---

## 📊 Model Output

The AI predicts:

- Machine Status
- Failure Probability
- Health Score
- Risk Level
- Likely Affected Components
- Maintenance Recommendations
- Maintenance Timeline
- Digital Twin Status

Example Response:

```json
{
  "prediction": "Machine Failure",
  "failure_probability": 91.4,
  "health_score": 8.6,
  "risk_level": "Critical",
  "likely_components": [
    "Motor/Gearbox",
    "Cutting Tool"
  ],
  "digital_twin": {
    "motor": "red",
    "cooling_system": "green",
    "cutting_tool": "red",
    "shaft": "green"
  },
  "recommendations": [
    "Inspect Motor & Gearbox",
    "Replace Cutting Tool immediately"
  ]
}
```

---

## ▶️ Installation

Clone the repository:

```bash
git clone <repository-url>
```

Install dependencies:

```bash
pip install -r requirements.txt
```

---

## ▶️ Run the API

Start the Flask server:

```bash
python app.py
```

The API will be available at:

```
http://localhost:5000
```

---

## 📡 API Endpoint

### Home

```
GET /
```

Response:

```json
{
  "message": "Predictive Maintenance AI API is running!"
}
```

---

### Predict Machine Failure

```
POST /predict
```

Sample Request:

```json
{
  "Type": 1,
  "Air_temperature_K": 298.2,
  "Process_temperature_K": 308.7,
  "Rotational_speed_rpm": 1500,
  "Torque_Nm": 45,
  "Tool_wear_min": 50
}
```

---

## 📈 Machine Learning Pipeline

1. Data Collection
2. Data Preprocessing
3. Exploratory Data Analysis (EDA)
4. Feature Engineering
5. Model Training
6. Hyperparameter Tuning
7. Model Evaluation
8. SHAP Explainability
9. Prediction Engine
10. Recommendation Engine
11. Digital Twin Generation
12. Maintenance Timeline
13. Flask API Deployment

---

## 🔮 Future Enhancements

- Real-time IoT Sensor Integration
- Cloud Deployment
- PDF Maintenance Report Generation
- Email/SMS Alerts
- Dashboard Analytics
- Live Digital Twin Visualization

---

## 👨‍💻 Team

**Project:** AI Predictive Maintenance System

AI Module Developed by:
- **Pavan Kumar P**

---

## 📜 License

This project is developed for academic and educational purposes.
