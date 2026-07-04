const Machine = require('../models/Machine');
const Prediction = require('../models/Prediction');
const mockPredictionService = require('../services/mockPredictionService');

// Core logic for processing sensor data (shared between API endpoint and simulator)
const processSensorData = async (data) => {
  const { machineId, machineName, temperature, vibration, rpm, current } = data;

  if (!machineId || !machineName) {
    throw new Error('machineId and machineName are required fields');
  }

  // Get prediction from AI service
  const predResult = mockPredictionService.getPrediction({
    temperature,
    vibration,
    rpm,
    current
  });

  // Update Machine (or create if it doesn't exist)
  // Push the current readings into history
  const machine = await Machine.findOneAndUpdate(
    { machineId },
    {
      machineName,
      temperature,
      vibration,
      rpm,
      current,
      status: predResult.status,
      updatedAt: new Date(),
      $push: {
        history: {
          temperature,
          vibration,
          rpm,
          current,
          timestamp: new Date()
        }
      }
    },
    { new: true, upsert: true }
  );

  // Save the prediction log
  const newPrediction = new Prediction({
    machineId,
    health: predResult.health,
    prediction: predResult.prediction,
    recommendation: predResult.recommendation,
    timestamp: new Date()
  });
  await newPrediction.save();

  return { machine, prediction: newPrediction };
};

// HTTP Controller Method
const postSensorData = async (req, res) => {
  try {
    const result = await processSensorData(req.body);
    res.status(201).json({
      success: true,
      message: 'Sensor data and prediction processed successfully',
      data: result
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  processSensorData,
  postSensorData
};
