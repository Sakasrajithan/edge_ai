import joblib
import pandas as pd

# Load trained model
model = joblib.load("final_model.pkl")


# -----------------------------
# Recommendation Engine
# -----------------------------
def generate_recommendation(sample):

    recommendation = []
    component = []

    temp = sample["Process_temperature_K"]
    torque = sample["Torque_Nm"]
    tool_wear = sample["Tool_wear_min"]
    rpm = sample["Rotational_speed_rpm"]

    # Critical conditions
    if temp > 315 or torque > 70 or tool_wear > 200 or rpm < 1100:
        recommendation.append("STOP MACHINE IMMEDIATELY")

    # High Risk
    if temp > 310:
        recommendation.append("Inspect Cooling System urgently")
        component.append("Cooling System")

    if torque > 60:
        recommendation.append("Inspect Motor & Gearbox")
        component.append("Motor/Gearbox")

    if tool_wear > 150:
        recommendation.append("Replace Cutting Tool immediately")
        component.append("Cutting Tool")

    # Medium Risk
    if 305 < temp <= 310:
        recommendation.append("Monitor temperature closely")

    if 50 < torque <= 60:
        recommendation.append("Check motor load balance")

    if 100 < tool_wear <= 150:
        recommendation.append("Plan tool replacement soon")

    # Low Risk
    if not recommendation:
        recommendation.append("Machine operating normally. Continue monitoring.")

    component = list(set(component))
    recommendation = list(set(recommendation))

    return component, recommendation


# -----------------------------
# Main Prediction Function
# -----------------------------
def predict_machine(sensor_data):

    input_df = pd.DataFrame([sensor_data])

    prediction = model.predict(input_df)[0]
    probability = model.predict_proba(input_df)[0]

    failure_probability = float(round(probability[1] * 100, 2))
    health_score = float(round(100 - failure_probability, 2))

    if prediction == 0:
        prediction_text = "Healthy"
    else:
        prediction_text = "Machine Failure"

    if failure_probability < 20:
        risk_level = "Low"
    elif failure_probability < 50:
        risk_level = "Medium"
    elif failure_probability < 80:
        risk_level = "High"
    else:
        risk_level = "Critical"

    likely_components, recommendations = generate_recommendation(sensor_data)
    # 👇 ADD THIS LINE HERE
    digital_twin = generate_digital_twin(likely_components, risk_level)
    maintenance_timeline = generate_maintenance_timeline(recommendations)
    return {
    "machine_id": machine_id,
    "prediction_time": prediction_time,
    "model_version": model_version,

    "prediction": prediction_text,
    "failure_probability": failure_probability,
    "health_score": health_score,
    "risk_level": risk_level,

    "likely_components": likely_components,
    "digital_twin": digital_twin,

    "recommendations": recommendations,
    "maintenance_timeline": maintenance_timeline
}


# -----------------------------
# Test
# -----------------------------
if __name__ == "__main__":

    sample = {
        "Type": 1,
        "Air_temperature_K": 298.2,
        "Process_temperature_K": 308.7,
        "Rotational_speed_rpm": 1500,
        "Torque_Nm": 45,
        "Tool_wear_min": 50
    }

    print(predict_machine(sample))