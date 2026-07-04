const Machine = require('../models/Machine');
const sensorController = require('../controllers/sensorController');

// Predefined machines to monitor
const INITIAL_MACHINES = [
  { machineId: 'MAC-001', machineName: 'CNC Milling Machine' },
  { machineId: 'MAC-002', machineName: 'Hydraulic Press' },
  { machineId: 'MAC-003', machineName: 'Industrial Robot Arm' },
  { machineId: 'MAC-004', machineName: 'Conveyor Drive Motor' }
];

// Keep track of which machines are currently in a fault state
const machineStates = {};

// Helper to get random number in range
const getRandomInRange = (min, max) => {
  return parseFloat((Math.random() * (max - min) + min).toFixed(2));
};

// Generate telemetry values for a single machine
const generateTelemetry = (machineId, machineName) => {
  // Initialize state if not present
  if (!machineStates[machineId]) {
    machineStates[machineId] = {
      isFault: false,
      faultCooldown: 0,
      normalCount: getRandomInRange(5, 15) // run normal for a bit
    };
  }

  const state = machineStates[machineId];

  // Decide if we should trigger a fault
  // If we are not in a fault state, decrement normalCount
  if (!state.isFault) {
    state.normalCount--;
    if (state.normalCount <= 0) {
      // 20% chance of fault when normal count is done
      if (Math.random() < 0.3) {
        state.isFault = true;
        state.faultDuration = getRandomInRange(4, 8); // fault lasts 4-8 readings
      } else {
        state.normalCount = getRandomInRange(5, 15); // reset normal run
      }
    }
  } else {
    // If in fault state, decrement duration
    state.faultDuration--;
    if (state.faultDuration <= 0) {
      state.isFault = false;
      state.normalCount = getRandomInRange(10, 20); // recover to normal
    }
  }

  let temperature, vibration, rpm, current;

  if (state.isFault) {
    // Fault Ranges: Temp: 80-100, Vib: 5-8, RPM: 1650-1800, Current: 10-13
    temperature = getRandomInRange(80, 100);
    vibration = getRandomInRange(5, 8);
    rpm = getRandomInRange(1650, 1800);
    current = getRandomInRange(10, 13);
  } else {
    // Normal Ranges: Temp: 40-60, Vib: 1-2, RPM: 1450-1550, Current: 7-9
    temperature = getRandomInRange(40, 60);
    vibration = getRandomInRange(1, 2);
    rpm = getRandomInRange(1450, 1550);
    current = getRandomInRange(7, 9);
  }

  return {
    machineId,
    machineName,
    temperature,
    vibration,
    rpm,
    current
  };
};

// Start background simulation loop
let simulationInterval = null;

const startSimulation = (intervalMs = 5000) => {
  if (simulationInterval) return;

  console.log(`Starting Mock Sensor Service (Interval: ${intervalMs}ms)...`);

  simulationInterval = setInterval(async () => {
    for (const item of INITIAL_MACHINES) {
      try {
        const sensorData = generateTelemetry(item.machineId, item.machineName);
        
        // Directly invoke sensor controller's processing function to ingest
        await sensorController.processSensorData(sensorData);
      } catch (err) {
        console.error(`Error in mock sensor simulation for ${item.machineId}:`, err.message);
      }
    }
  }, intervalMs);
};

const stopSimulation = () => {
  if (simulationInterval) {
    clearInterval(simulationInterval);
    simulationInterval = null;
    console.log('Mock Sensor Service stopped.');
  }
};

module.exports = {
  generateTelemetry,
  startSimulation,
  stopSimulation,
  INITIAL_MACHINES
};
