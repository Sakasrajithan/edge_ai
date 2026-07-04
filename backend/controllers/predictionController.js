const Prediction = require('../models/Prediction');
const Machine = require('../models/Machine');
const mockPredictionService = require('../services/mockPredictionService');

// Execute prediction for provided sensor data manually (ad-hoc prediction)
const createPrediction = async (req, res) => {
  try {
    const { machineId, temperature, vibration, rpm, current } = req.body;

    if (!machineId) {
      return res.status(400).json({
        success: false,
        message: 'machineId is required'
      });
    }

    // Get predictions from mock AI service
    const predResult = mockPredictionService.getPrediction({
      temperature: Number(temperature),
      vibration: Number(vibration),
      rpm: Number(rpm),
      current: Number(current)
    });

    // Save prediction in database
    const newPrediction = new Prediction({
      machineId,
      health: predResult.health,
      prediction: predResult.prediction,
      recommendation: predResult.recommendation,
      timestamp: new Date()
    });
    await newPrediction.save();

    // Also update Machine status if machine exists
    await Machine.findOneAndUpdate(
      { machineId },
      { status: predResult.status, updatedAt: new Date() }
    );

    res.status(200).json({
      success: true,
      data: newPrediction
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating prediction',
      error: error.message
    });
  }
};

// Get predictions (by default returns latest predictions, optional machineId filter)
const getPredictions = async (req, res) => {
  try {
    const { machineId, limit } = req.query;
    const query = {};
    if (machineId) {
      query.machineId = machineId;
    }

    const predictions = await Prediction.find(query)
      .sort({ timestamp: -1 })
      .limit(parseInt(limit) || 50);

    res.status(200).json({
      success: true,
      count: predictions.length,
      data: predictions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error fetching predictions',
      error: error.message
    });
  }
};

module.exports = {
  createPrediction,
  getPredictions
};
