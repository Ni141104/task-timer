const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  elapsed: {
    type: Number,
    default: 0, 
  },
  isRunning: {
    type: Boolean,
    default: false,
  },
  startTime: {
    type: Date,
    default: null, 
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });


const Task=mongoose.models.Task || mongoose.model('Task',TaskSchema);

export default Task;
