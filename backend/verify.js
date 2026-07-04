require('dotenv').config();
const mongoose = require('mongoose');
const Machine = require('./models/Machine');
const Prediction = require('./models/Prediction');

const checkDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/sentineledge-ai');
    console.log('Connected to MongoDB.');

    const machines = await Machine.find({});
    console.log(`\nFound ${machines.length} machines:`);
    machines.forEach(m => {
      console.log(`- ${m.machineId} (${m.machineName}): Status=${m.status}, Temp=${m.temperature}°C, Vib=${m.vibration}mm/s, RPM=${m.rpm}, Current=${m.current}A, HistoryLen=${m.history.length}`);
    });

    const predictions = await Prediction.find({}).sort({ timestamp: -1 }).limit(5);
    console.log(`\nLatest ${predictions.length} Predictions:`);
    predictions.forEach(p => {
      console.log(`- Machine: ${p.machineId}, Health: ${p.health}%, Prediction: ${p.prediction}, Rec: ${p.recommendation}`);
    });

    await mongoose.connection.close();
  } catch (err) {
    console.error('Error:', err);
  }
};

checkDB();
