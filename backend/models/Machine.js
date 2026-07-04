const mongoose = require('mongoose');

const MachineSchema = new mongoose.Schema({
  machineId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  machineName: {
    type: String,
    required: true
  },
  temperature: {
    type: Number,
    required: true
  },
  vibration: {
    type: Number,
    required: true
  },
  rpm: {
    type: Number,
    required: true
  },
  current: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ['Healthy', 'Warning', 'Critical'],
    default: 'Healthy'
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  history: [
    {
      temperature: Number,
      vibration: Number,
      rpm: Number,
      current: Number,
      timestamp: {
        type: Date,
        default: Date.now
      }
    }
  ]
});

// Pre-save middleware to cap history array at 30 items
MachineSchema.pre('save', function (next) {
  if (this.history.length > 30) {
    this.history = this.history.slice(-30);
  }
  next();
});

module.exports = mongoose.model('Machine', MachineSchema);
