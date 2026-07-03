import json
import time
import requests
from generator import generateSensorData
from logger import log_to_csv
from config import BACKEND_URL, MACHINES, INTERVAL_SECONDS

def sendData():
    print("Industry 4.0 Sensor Simulator Started")
    print("Press CTRL + C to stop")

    while True:
        for machine in MACHINES:
            data = generateSensorData(machine)
            log_to_csv(data)

            try:
                response = requests.post(BACKEND_URL, json=data)
                data["apiStatus"] = response.status_code

            except requests.exceptions.ConnectionError:
                data["apiStatus"] = "Backend OFF"

            print(json.dumps(data, indent=4))

        time.sleep(INTERVAL_SECONDS)

if __name__ == "__main__":
    sendData()