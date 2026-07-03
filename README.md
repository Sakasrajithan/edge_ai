# Industry 4.0 Sensor Simulator

This is a professional industrial sensor simulator for a Predictive Maintenance project.

## Features

- 10 simulated industrial machines
- Smooth sensor changes like real machines
- Normal and fault scenarios
- Fault types:
  - OVERHEATING
  - BEARING_FAILURE
  - MOTOR_OVERLOAD
  - HIGH_VIBRATION
  - PRESSURE_DROP
- Health percentage
- Power consumption
- Machine uptime
- CSV logging
- Sends live data to backend every second
- Manual fault trigger for demo

## Folder Structure

```text
Industry4_SensorSimulator/
├── config.py
├── generator.py
├── sendData.py
├── logger.py
├── manualFault.py
├── requirements.txt
└── README.md
```

## Install

```bash
pip install -r requirements.txt
```

## Run Live Simulator

```bash
python sendData.py
```

## Trigger Manual Fault

Open another terminal and run:

```bash
python manualFault.py
```

Then type machine ID:

```text
M001
```

## Backend API

The simulator sends data to:

```text
POST http://localhost:5000/sensor
```

Change this URL in `config.py` if your backend uses another port.

## Sample Data

```json
{
  "timestamp": "2026-07-03 10:30:00",
  "machineId": "M001",
  "temperature": 98.5,
  "vibration": 8.7,
  "rpm": 1780,
  "current": 14.2,
  "pressure": 2.1,
  "powerConsumption": 3.27,
  "health": 25,
  "uptimeSeconds": 120,
  "status": "FAULT",
  "faultType": "MANUAL_DEMO_FAULT"
}
```
