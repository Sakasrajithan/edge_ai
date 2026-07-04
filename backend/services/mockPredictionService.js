const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getPrediction = (sensorData) => {
  const { temperature, vibration, rpm, current } = sensorData;

  // Define thresholds for anomaly detection
  const isTempAbnormal = temperature > 75;
  const isVibAbnormal = vibration > 3;
  const isRpmAbnormal = rpm > 1600;
  const isCurrentAbnormal = current > 9.5;

  const isAbnormal = isTempAbnormal || isVibAbnormal || isRpmAbnormal || isCurrentAbnormal;

  if (!isAbnormal) {
    return {
      health: getRandomInt(90, 98),
      status: 'Healthy',
      prediction: 'Normal',
      recommendation: 'Continue Monitoring'
    };
  }

  // Determine specific anomaly details based on the offending sensor(s)
  let health = getRandomInt(45, 68);
  let status = 'Critical';
  let prediction = 'General Machine Fault';
  let recommendation = 'Immediate Maintenance Required';

  if (isVibAbnormal && isRpmAbnormal) {
    health = getRandomInt(35, 50);
    prediction = 'Bearing Failure & Shaft Misalignment';
    recommendation = 'Shut down machine immediately. Schedule bearing replacement and mechanical alignment.';
  } else if (isVibAbnormal) {
    health = getRandomInt(48, 58);
    prediction = 'Bearing Degradation';
    recommendation = 'Lubricate bearings within 48 hours. Schedule bearing vibration diagnostics.';
  } else if (isTempAbnormal && isCurrentAbnormal) {
    health = getRandomInt(40, 52);
    prediction = 'Winding Insulation Overheating';
    recommendation = 'Reduce current load immediately. Inspect cooling system and measure winding resistance.';
  } else if (isTempAbnormal) {
    health = getRandomInt(50, 62);
    prediction = 'Thermal Overheating';
    recommendation = 'Check air intakes for blockage. Clean dust from cooling fins. Verify fluid coolant level.';
  } else if (isCurrentAbnormal) {
    health = getRandomInt(55, 65);
    prediction = 'Electrical Overload';
    recommendation = 'Check phase voltage balance. Audit machine current draw limiters.';
  } else if (isRpmAbnormal) {
    health = getRandomInt(60, 70);
    prediction = 'Rotor Imbalance';
    recommendation = 'Perform speed regulation check. Schedule balancing calibration.';
  }

  return {
    health,
    status,
    prediction,
    recommendation
  };
};

module.exports = {
  getPrediction
};
