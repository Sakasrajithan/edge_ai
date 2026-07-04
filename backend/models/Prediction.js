const mongoose = require('mongoose');

const PredictionSchema = new mongoose.Schema({
  machineId: {
    type: String,
    required: true,
    index: true
  },
  health: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  prediction: {
    type: String,
    required: true
  },
  recommendation: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Prediction', PredictionSchema);
