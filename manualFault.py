from generator import generateSensorData
from logger import log_to_csv
from config import BACKEND_URL
import requests

def trigger_manual_fault(machine_id="M001"):
    data = generateSensorData(machine_id)

    data["temperature"] = 98.5
    data["vibration"] = 8.7
    data["rpm"] = 1780
    data["current"] = 14.2
    data["pressure"] = 2.1
    data["powerConsumption"] = round(data["current"] * 230 / 1000, 2)
    data["health"] = 25
    data["status"] = "FAULT"
    data["faultType"] = "MANUAL_DEMO_FAULT"

    log_to_csv(data)

    try:
        response = requests.post(BACKEND_URL, json=data)
        print("Manual fault sent:", data)
        print("API Response:", response.status_code)

    except requests.exceptions.ConnectionError:
        print("Backend not running. Manual fault generated:")
        print(data)

if __name__ == "__main__":
    machine = input("Enter machine ID, example M001: ")
    trigger_manual_fault(machine)
