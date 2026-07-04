const express = require('express');
const router = express.Router();

const sensorController = require('../controllers/sensorController');
const machineController = require('../controllers/machineController');
const predictionController = require('../controllers/predictionController');

// Sensor Ingestion Route
router.post('/sensor', sensorController.postSensorData);

// Machine Routes
router.get('/machine', machineController.getMachines);
router.get('/machine/:machineId', machineController.getMachineById);

// Prediction Routes
router.post('/predict', predictionController.createPrediction);
router.get('/prediction', predictionController.getPredictions);

module.exports = router;
