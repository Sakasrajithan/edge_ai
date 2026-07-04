require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');
const mockSensorService = require('./services/mockSensorService');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  // 1. Connect to Database
  await connectDB();

  // 2. Start HTTP Server
  const server = app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    
    // 3. Start Mock Sensor Simulation (e.g. update machine readings every 5 seconds)
    mockSensorService.startSimulation(5000);
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (err, promise) => {
    console.error(`Error: ${err.message}`);
    // Close server & exit process
    server.close(() => process.exit(1));
  });

  // Handle exit signals to gracefully stop the simulation
  const shutDown = () => {
    console.log('Shutting down server...');
    mockSensorService.stopSimulation();
    server.close(() => {
      console.log('Server closed.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', shutDown);
  process.on('SIGINT', shutDown);
};

startServer();
