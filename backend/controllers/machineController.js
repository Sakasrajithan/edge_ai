const Machine = require('../models/Machine');

// Get all machines
const getMachines = async (req, res) => {
  try {
    const machines = await Machine.find({}).sort({ updatedAt: -1 });
    res.status(200).json({
      success: true,
      count: machines.length,
      data: machines
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error fetching machines',
      error: error.message
    });
  }
};

// Get single machine by ID
const getMachineById = async (req, res) => {
  try {
    const machine = await Machine.findOne({ machineId: req.params.machineId });
    
    if (!machine) {
      return res.status(404).json({
        success: false,
        message: `Machine with ID ${req.params.machineId} not found`
      });
    }

    res.status(200).json({
      success: true,
      data: machine
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error fetching machine details',
      error: error.message
    });
  }
};

module.exports = {
  getMachines,
  getMachineById
};
