import random
from datetime import datetime
from config import FAULT_PERCENTAGE

FAULT_TYPES = [
    "OVERHEATING",
    "BEARING_FAILURE",
    "MOTOR_OVERLOAD",
    "HIGH_VIBRATION",
    "PRESSURE_DROP"
]

machine_state = {}

def initialize_machine(machine_id):
    if machine_id not in machine_state:
        machine_state[machine_id] = {
            "temperature": random.uniform(42, 50),
            "vibration": random.uniform(1.1, 1.8),
            "rpm": random.randint(1470, 1520),
            "current": random.uniform(7.5, 8.5),
            "pressure": random.uniform(4.5, 5.5),
            "uptime": 0
        }

def smooth_change(value, minimum, maximum, change):
    value += random.uniform(-change, change)
    return round(max(minimum, min(maximum, value)), 2)

def generateSensorData(machine_id):
    initialize_machine(machine_id)
    state = machine_state[machine_id]

    state["uptime"] += 1
    is_fault = random.randint(1, 100) <= FAULT_PERCENTAGE

    if is_fault:
        fault_type = random.choice(FAULT_TYPES)

        if fault_type == "OVERHEATING":
            temperature = random.uniform(85, 105)
            vibration = random.uniform(2.5, 4.0)
            rpm = random.randint(1500, 1650)
            current = random.uniform(9, 11)
            pressure = random.uniform(4.0, 5.0)

        elif fault_type == "BEARING_FAILURE":
            temperature = random.uniform(65, 80)
            vibration = random.uniform(6, 9)
            rpm = random.randint(1400, 1500)
            current = random.uniform(9, 12)
            pressure = random.uniform(4.2, 5.2)

        elif fault_type == "MOTOR_OVERLOAD":
            temperature = random.uniform(75, 95)
            vibration = random.uniform(3, 5)
            rpm = random.randint(1600, 1800)
            current = random.uniform(12, 15)
            pressure = random.uniform(4.5, 5.5)

        elif fault_type == "HIGH_VIBRATION":
            temperature = random.uniform(60, 75)
            vibration = random.uniform(7, 10)
            rpm = random.randint(1550, 1700)
            current = random.uniform(9, 11)
            pressure = random.uniform(4.5, 5.5)

        else:
            temperature = random.uniform(45, 60)
            vibration = random.uniform(1.5, 3.0)
            rpm = random.randint(1450, 1550)
            current = random.uniform(7, 9)
            pressure = random.uniform(1.5, 3.0)

        health = random.randint(20, 55)
        status = "FAULT"

    else:
        fault_type = "NONE"
        temperature = smooth_change(state["temperature"], 40, 60, 1.5)
        vibration = smooth_change(state["vibration"], 1.0, 2.5, 0.2)
        rpm = int(smooth_change(state["rpm"], 1450, 1550, 10))
        current = smooth_change(state["current"], 7, 9, 0.3)
        pressure = smooth_change(state["pressure"], 4, 6, 0.2)
        health = random.randint(80, 100)
        status = "NORMAL"

    state["temperature"] = temperature
    state["vibration"] = vibration
    state["rpm"] = rpm
    state["current"] = current
    state["pressure"] = pressure

    power_consumption = round(current * 230 / 1000, 2)

    return {
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "machineId": machine_id,
        "temperature": round(temperature, 2),
        "vibration": round(vibration, 2),
        "rpm": rpm,
        "current": round(current, 2),
        "pressure": round(pressure, 2),
        "powerConsumption": power_consumption,
        "health": health,
        "uptimeSeconds": state["uptime"],
        "status": status,
        "faultType": fault_type
    }
